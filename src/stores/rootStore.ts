import { authState$, authActions } from '@/modules/auth/store';
import { homeState$, homeActions } from '@/modules/home/store';
import { profileState$, profileActions } from '@/modules/profile/store';
import { errorState$, errorActions } from '@/errors/errorStore';

// Export all states
export const rootState = {
  auth: authState$,
  home: homeState$,
  profile: profileState$,
  error: errorState$,
};

// Export all actions
export const rootActions = {
  auth: authActions,
  home: homeActions,
  profile: profileActions,
  error: errorActions,
};

// Helper to reset all stores (useful for logout)
export const resetAllStores = () => {
  homeActions.reset();
  profileActions.reset();
  errorActions.clearHistory();
};