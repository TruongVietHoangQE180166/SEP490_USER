import { Course } from '../course/types';

export interface EnrolledCourse extends Course {
  progress: number;
  lastAccessed?: string;
}

export interface MyCourseState {
  enrolledCourses: EnrolledCourse[];
  isLoading: boolean;
  error: string | null;
}
