import { Course } from '../course/types';

export interface HomeState {
  freeCourses: Course[];
  featuredCourses: Course[];
  isLoading: boolean;
  error: string | null;
}