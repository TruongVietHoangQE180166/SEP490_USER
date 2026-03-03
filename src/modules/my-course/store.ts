import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { MyCourseState } from './types';

const initialMyCourseState: MyCourseState = {
  enrolledCourses: [],
  isLoading: false,
  error: null,
};

export const myCourseState$ = observable<MyCourseState>(initialMyCourseState);

// Optional: Persist user's courses to local storage for quick access
persistObservable(myCourseState$, {
  local: 'my-course-state',
  pluginLocal: ObservablePersistLocalStorage
});

export const myCourseActions = {
  setEnrolledCourses: (courses: MyCourseState['enrolledCourses']) => {
    myCourseState$.enrolledCourses.set(courses);
  },
  setLoading: (isLoading: boolean) => {
    myCourseState$.isLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    myCourseState$.error.set(error);
  }
};
