import { authState$, authActions } from '@/modules/auth/store';
import { homeState$, homeActions } from '@/modules/home/store';
import { profileState$, profileActions } from '@/modules/profile/store';
import { errorState$, errorActions } from '@/errors/errorStore';
import { courseState$, courseActions } from '@/modules/course/store';
import { myCourseState$, myCourseActions } from '@/modules/my-course/store';

// Export all states
export const rootState = {
  auth: authState$,
  home: homeState$,
  profile: profileState$,
  course: courseState$,
  myCourse: myCourseState$,
  error: errorState$,
};

// Export all actions
export const rootActions = {
  auth: authActions,
  home: homeActions,
  profile: profileActions,
  course: courseActions,
  myCourse: myCourseActions,
  error: errorActions,
};

// Helper to reset all stores (useful for logout)
export const resetAllStores = () => {
  homeActions.reset();
  profileActions.reset();
  courseActions.reset();
  myCourseActions.reset();
  errorActions.clearHistory();
};