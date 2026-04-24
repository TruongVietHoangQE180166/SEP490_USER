import { observable } from '@legendapp/state';
import { ProfileState, UserProfile, UserProgress } from './types';
import { profileService } from './services';

const initialProfileState: ProfileState = {
  profile: null,
  isLoading: false,
  isEditing: false,
  progress: null,
  isProgressLoading: false,
  claimedLevels: [],
  isClaiming: false,
};

export const profileState$ = observable<ProfileState>(initialProfileState);

// Actions
export const profileActions = {
  // Syncs the store with the latest profile data from the server.
  // We use this for both initial load and after successful updates.
  setProfile: (profile: UserProfile) => {
    profileState$.profile.set(profile);
  },

  setLoading: (isLoading: boolean) => {
    profileState$.isLoading.set(isLoading);
  },

  setEditing: (isEditing: boolean) => {
    profileState$.isEditing.set(isEditing);
  },

  setProgress: (progress: UserProgress) => {
    profileState$.progress.set(progress);
  },

  setProgressLoading: (isLoading: boolean) => {
    profileState$.isProgressLoading.set(isLoading);
  },
  
  // Note: We don't have a partial update action (updateProfile) here because 
  // our strategy is to always replace the full profile state with the 
  // response from the API (via setProfile) to ensure consistency.

  reset: () => {
    profileState$.set(initialProfileState);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      profileState$.isLoading.set(true);
      const success = await profileService.changePassword(currentPassword, newPassword);
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

  fetchClaimedLevels: async (userId: string) => {
    try {
      const claimedLevelIds = await profileService.getClaimedLevelRewards(userId);
      profileState$.claimedLevels.set(claimedLevelIds as any);
    } catch (e) {
      console.error(e);
    }
  },

  claimLevel: async (userId: string, levelId: string, amount: number) => {
    try {
      profileState$.isClaiming.set(true);
      const success = await profileService.claimLevelReward(userId, levelId, amount);
      if (success) {
        // Cập nhật lại state
        const current = profileState$.claimedLevels.get() || [];
        profileState$.claimedLevels.set([...current, levelId as any]);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      profileState$.isClaiming.set(false);
    }
  },

  checkUpgrade: async () => {
    try {
      profileState$.isProgressLoading.set(true);
      const result = await profileService.checkUpgrade();
      // Fetch new progress after successful upgrade
      const progress = await profileService.getUserProgress();
      profileState$.progress.set(progress);
      return { success: true, message: result };
    } catch (e: any) {
      console.error(e);
      return { success: false, message: e.message };
    } finally {
      profileState$.isProgressLoading.set(false);
    }
  }
};