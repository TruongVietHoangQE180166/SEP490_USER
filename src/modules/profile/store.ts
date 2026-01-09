import { observable } from '@legendapp/state';
import { ProfileState, UserProfile } from './types';
import { profileService } from './services';

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

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    try {
      profileState$.isLoading.set(true);
      const success = await profileService.changePassword(userId, currentPassword, newPassword);
      if (success) {
        return { success: true, message: 'Password changed successfully' };
      }
      return { success: false, message: 'Failed to change password' };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      profileState$.isLoading.set(false);
    }
  },
};