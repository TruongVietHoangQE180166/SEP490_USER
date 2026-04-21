import { TeacherCourse } from '@/modules/teacher-course/types';

export interface TeacherDiscussionState {
  courses: (TeacherCourse & { unreadCount: number })[];
  selectedCourseId: string | null;
  isLoading: boolean;
  error: string | null;
}
