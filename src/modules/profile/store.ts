import { observable } from '@legendapp/state';
import { ProfileState, UserProfile } from './types';

const initialProfileState: ProfileState = {
  profile: null,
  isLoading: false,
  isEditing: false,
};

export const profileState$ = observable<ProfileState>(initialProfileState);

// Actions
export const profileActions = {
  setProfile: (profile: UserProfile) => {
    profileState$.profile.set(profile);
  },

  setLoading: (isLoading: boolean) => {
    profileState$.isLoading.set(isLoading);
  },

  setEditing: (isEditing: boolean) => {
    profileState$.isEditing.set(isEditing);
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    const currentProfile = profileState$.profile.peek();
    if (currentProfile) {
      profileState$.profile.set({ ...currentProfile, ...updates });
    }
  },

  reset: () => {
    profileState$.set(initialProfileState);
  },
};