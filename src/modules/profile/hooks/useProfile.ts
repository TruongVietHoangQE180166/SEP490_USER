'use client';

import { useEffect } from 'react';
import { profileState$, profileActions } from '../store';
import { profileService } from '../services';
import { authState$ } from '@/modules/auth/store';
import { UpdateProfileRequest } from '../types';
import { loadingActions } from '@/stores/loadingStore';
import { toast } from '@/components/ui/toast';

export const useProfile = () => {
  useEffect(() => {
    const user = authState$.user.get();
    if (user?.userId) {
      loadProfile(user.userId);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    loadingActions.showFetchLoading('Đang tải thông tin hồ sơ...');
    try {
      const data = await profileService.getProfile(userId);
      profileActions.setProfile(data);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải thông tin hồ sơ');
    } finally {
      loadingActions.hideLoading();
    }
  };

  const updateProfile = async (updates: UpdateProfileRequest) => {
    const user = authState$.user.get();
    if (!user?.userId) return;

    loadingActions.showUpdateLoading('Đang cập nhật hồ sơ...');
    try {
      const updated = await profileService.updateProfile(user.userId, updates);
      profileActions.setProfile(updated);
      profileActions.setEditing(false);
      toast.success('Cập nhật hồ sơ thành công');
    } catch (error: any) {
      // Show the exact error message from the API response if available
      const errorMessage = error.message || 'Cập nhật hồ sơ thất bại';
      toast.error(errorMessage);
    } finally {
      loadingActions.hideLoading();
    }
  };

  const toggleEdit = () => {
    profileActions.setEditing(!profileState$.isEditing.get());
  };

  return {
    profile: profileState$.profile.get(),
    isLoading: profileState$.isLoading.get(),
    isEditing: profileState$.isEditing.get(),
    updateProfile,
    toggleEdit,
    refresh: () => {
      const user = authState$.user.get();
      if (user?.userId) loadProfile(user.userId);
    },
  };
};