import { Course } from '../course/types';

export interface EnrolledCourse extends Course {
  progress: number;
  lastAccessed?: string;
}

export interface RateContent {
  id: string;
  rating: number;
  comment: string;
  courseId: string;
  courseTitle: string;
  fullName: string;
  avatar: string;
  createdDate: string;
}

export interface RateResponse {
  content: RateContent[];
  request: {
    page: number;
    size: number;
    sortRequest: {
      direction: string;
      field: string;
    };
  };
  totalElement: number;
}

export interface MyCourseState {
  enrolledCourses: EnrolledCourse[];
  userRatings: Record<string, RateContent | null>;
  isLoading: boolean;
  error: string | null;
}
