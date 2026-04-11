import { observable } from '@legendapp/state';
import { MyCourseState, RateContent } from './types';

const initialMyCourseState: MyCourseState = {
  enrolledCourses: [],
  userRatings: {},
  isLoading: false,
  error: null,
};

export const myCourseState$ = observable<MyCourseState>(initialMyCourseState);



export const myCourseActions = {
  setEnrolledCourses: (courses: MyCourseState['enrolledCourses']) => {
    myCourseState$.enrolledCourses.set(courses);
  },
  setLoading: (isLoading: boolean) => {
    myCourseState$.isLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    myCourseState$.error.set(error);
  },
  setUserRating: (courseId: string, rating: RateContent | null) => {
    myCourseState$.userRatings[courseId].set(rating);
  },
  reset: () => {
    myCourseState$.set(initialMyCourseState);
  }
};
