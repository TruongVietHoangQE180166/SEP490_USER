'use client';

import { useEffect } from 'react';
import { profileState$, profileActions } from '../store';
import { profileService } from '../services';
import { authState$ } from '@/modules/auth/store';
import { UserProfile } from '../types';
import { loadingActions } from '@/stores/loadingStore';

export const useProfile = () => {
  useEffect(() => {
    const user = authState$.user.get();
    if (user?.id) {
      loadProfile(user.id);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    loadingActions.showFetchLoading('Đang tải thông tin hồ sơ...');
    try {
      const data = await profileService.getProfile(userId);
      profileActions.setProfile(data);
    } finally {
      loadingActions.hideLoading();
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const user = authState$.user.get();
    if (!user?.id) return;

    loadingActions.showUpdateLoading('Đang cập nhật hồ sơ...');
    try {
      const updated = await profileService.updateProfile(user.id, updates);
      profileActions.setProfile(updated);
      profileActions.setEditing(false);
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
      if (user?.id) loadProfile(user.id);
    },
  };
};