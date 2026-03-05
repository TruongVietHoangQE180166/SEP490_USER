import { observable } from '@legendapp/state';
import { MyCourseState } from './types';

const initialMyCourseState: MyCourseState = {
  enrolledCourses: [],
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
  reset: () => {
    myCourseState$.set(initialMyCourseState);
  }
};
