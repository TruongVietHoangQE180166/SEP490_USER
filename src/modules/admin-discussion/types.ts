import { Course } from '@/modules/course/types';

export interface AdminDiscussionState {
  courses: (Course & { unreadCount: number })[];
  selectedCourseId: string | null;
  isLoading: boolean;
  error: string | null;
}
