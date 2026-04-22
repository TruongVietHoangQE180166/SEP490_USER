import { observable, computed } from '@legendapp/state';
import { AdminDiscussionState } from './types';
import { courseService } from '@/modules/course/services';
import { courseActions } from '@/modules/course/store';
import { supabase } from '@/lib/supabase';
import { courseChatService } from '@/modules/course/courseChatService';

const initialState: AdminDiscussionState = {
  courses: [],
  selectedCourseId: null,
  isLoading: false,
  error: null,
};

export const adminDiscussionState$ = observable<AdminDiscussionState>(initialState);

// Global subscriber for all discussions
let globalDiscussionsChannel: any = null;

export const adminTotalUnreadCount$ = computed(() => {
  const courses = adminDiscussionState$.courses.get();
  return courses?.reduce((acc, c) => acc + (c.unreadCount || 0), 0) || 0;
});

export const adminDiscussionActions = {
  loadCourses: async () => {
    adminDiscussionState$.isLoading.set(true);
    try {
      // Admin fetches ALL courses
      const response = await courseService.getAllCourses(1, 1000);
      const publishedCourses = response.filter(c => c.status === 'PUBLISHED');
      const courseIds = publishedCourses.map(c => c.id);

      // Initial unread counts
      const unreadCountsMap = await courseChatService.getUnreadCounts(courseIds);

      const courses = publishedCourses.map(c => ({ 
        ...c, 
        unreadCount: unreadCountsMap[c.id] || 0 
      }));
      
      adminDiscussionState$.courses.set(courses);
      
      // Subscribe to all updates globally
      adminDiscussionActions.subscribeToAllGlobal(courseIds);

    } catch (error: any) {
      adminDiscussionState$.error.set(error.message || 'Failed to load courses');
    } finally {
      adminDiscussionState$.isLoading.set(false);
    }
  },

  selectCourse: async (courseId: string) => {
    adminDiscussionState$.selectedCourseId.set(courseId);
    
    // Optimistic UI clear
    adminDiscussionActions.clearLocalUnread(courseId);
    
    // DB update
    await courseChatService.markAsRead(courseId);
    
    // Synchronize with global course store for moderation
    const courses = adminDiscussionState$.courses.peek();
    const course = courses.find(c => c.id === courseId);
    if (course) {
      courseActions.setCurrentCourse(course as any);
    }
  },

  subscribeToAllGlobal: (courseIds: string[]) => {
    if (!supabase || globalDiscussionsChannel || courseIds.length === 0) return;

    const channelId = `admin-discussion-global-${Math.random().toString(36).substring(7)}`;
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
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as any;
            const currentCourses = adminDiscussionState$.courses.peek();
            const exists = currentCourses.some(c => c.id === newMsg.course_id);
            
            if (exists) {
              const selectedId = adminDiscussionState$.selectedCourseId.peek();
              if (newMsg.course_id !== selectedId) {
                 adminDiscussionActions.incrementUnreadLocally(newMsg.course_id);
              }
            }
          }
        }
      )
      .subscribe();
  },

  incrementUnreadLocally: (courseId: string) => {
    const courses = adminDiscussionState$.courses.peek();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx > -1) {
      const current = courses[idx].unreadCount || 0;
      adminDiscussionState$.courses[idx].unreadCount.set(current + 1);
    }
  },

  clearLocalUnread: (courseId: string) => {
    const courses = adminDiscussionState$.courses.peek();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx > -1) {
      adminDiscussionState$.courses[idx].unreadCount.set(0);
    }
  },

  reset: () => {
    if (globalDiscussionsChannel && supabase) {
      supabase.removeChannel(globalDiscussionsChannel);
      globalDiscussionsChannel = null;
    }
    adminDiscussionState$.set(initialState);
  }
};
