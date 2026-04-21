import { observable, computed } from '@legendapp/state';
import { TeacherDiscussionState } from './types';
import { teacherCourseService } from '@/modules/teacher-course/services';
import { courseActions } from '@/modules/course/store';
import { supabase } from '@/lib/supabase';
import { courseChatService } from '@/modules/course/courseChatService';

const initialState: TeacherDiscussionState = {
  courses: [],
  selectedCourseId: null,
  isLoading: false,
  error: null,
};

export const teacherDiscussionState$ = observable<TeacherDiscussionState>(initialState);

// Global subscriber for all teacher's courses
let globalDiscussionsChannel: any = null;

export const totalUnreadCount$ = computed(() => {
  const courses = teacherDiscussionState$.courses.get();
  return courses?.reduce((acc, c) => acc + (c.unreadCount || 0), 0) || 0;
});

export const teacherDiscussionActions = {
  loadCourses: async () => {
    teacherDiscussionState$.isLoading.set(true);
    try {
      const response = await teacherCourseService.getCourses(1, 1000);
      const allCourseList = response.data.content || [];
      const publishedCourses = allCourseList.filter(c => c.status === 'PUBLISHED');
      const courseIds = publishedCourses.map(c => c.id);

      // Initial unread counts
      const unreadCountsMap = await courseChatService.getUnreadCounts(courseIds);

      const courses = publishedCourses.map(c => ({ 
        ...c, 
        unreadCount: unreadCountsMap[c.id] || 0 
      }));
      
      teacherDiscussionState$.courses.set(courses);
      
      // Subscribe to all updates globally (random ID to avoid conflicts)
      teacherDiscussionActions.subscribeToAllGlobal(courseIds);

    } catch (error: any) {
      teacherDiscussionState$.error.set(error.message || 'Failed to load courses');
    } finally {
      teacherDiscussionState$.isLoading.set(false);
    }
  },

  selectCourse: async (courseId: string) => {
    // Only set null if we are navigating TO the page (handled in component)
    // Here we just update selection and clear unread
    teacherDiscussionState$.selectedCourseId.set(courseId);
    
    // Optimistic UI clear
    teacherDiscussionActions.clearLocalUnread(courseId);
    
    // DB update
    await courseChatService.markAsRead(courseId);
  },

  subscribeToAllGlobal: (courseIds: string[]) => {
    if (!supabase || globalDiscussionsChannel || courseIds.length === 0) return;

    const channelId = `teacher-global-${Math.random().toString(36).substring(7)}`;
    globalDiscussionsChannel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'course_discussions',
        },
        (payload) => {
          // Process payload synchronously to avoid lag and blocking
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as any;
            // Check if this message belongs to one of the teacher's courses
            // Peek courseIds to handle current context
            const currentCourseIds = teacherDiscussionState$.courses.peek().map(c => c.id);
            if (currentCourseIds.includes(newMsg.course_id)) {
              const selectedId = teacherDiscussionState$.selectedCourseId.peek();
              // Only notify if not currently looking at the course
              if (newMsg.course_id !== selectedId) {
                 teacherDiscussionActions.incrementUnreadLocally(newMsg.course_id);
              }
            }
          }
          // For UPDATE/DELETE, we rely on the component re-fetch or session management
          // Keeping it simple ensures "instant" INSERT notifications
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[TeacherDiscussion] Realtime subscribed successfully');
        }
      });
  },

  incrementUnreadLocally: (courseId: string) => {
    const courses = teacherDiscussionState$.courses.peek();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx > -1) {
      const current = courses[idx].unreadCount || 0;
      teacherDiscussionState$.courses[idx].unreadCount.set(current + 1);
    }
  },

  clearLocalUnread: (courseId: string) => {
    const courses = teacherDiscussionState$.courses.peek();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx > -1) {
      teacherDiscussionState$.courses[idx].unreadCount.set(0);
    }
  },

  reset: () => {
    if (globalDiscussionsChannel && supabase) {
      supabase.removeChannel(globalDiscussionsChannel);
      globalDiscussionsChannel = null;
    }
    teacherDiscussionState$.set(initialState);
  }
};
