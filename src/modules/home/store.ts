import { observable } from '@legendapp/state';
import { HomeState } from './types';
import { Course } from '../course/types';

const initialHomeState: HomeState = {
  freeCourses: [],
  featuredCourses: [],
  isLoading: false,
  error: null,
};

export const homeState$ = observable<HomeState>(initialHomeState);

// Actions
export const homeActions = {
  setFreeCourses: (courses: Course[]) => {
    homeState$.freeCourses.set(courses);
  },

  setFeaturedCourses: (courses: Course[]) => {
    homeState$.featuredCourses.set(courses);
  },

  setLoading: (isLoading: boolean) => {
    homeState$.isLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    homeState$.error.set(error);
  },

  reset: () => {
    homeState$.set(initialHomeState);
  },
};
