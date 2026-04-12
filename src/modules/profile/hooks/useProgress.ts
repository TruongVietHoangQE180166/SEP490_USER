'use client';

import { useEffect } from 'react';
import { profileState$, profileActions } from '../store';
import { profileService } from '../services';
import { authState$ } from '@/modules/auth/store';
import { toast } from '@/components/ui/toast';

export const useProgress = () => {
  useEffect(() => {
    const user = authState$.user.get();
    if (user?.userId) {
      loadProgress();
    }
  }, []);

  const loadProgress = async () => {
    profileActions.setProgressLoading(true);
    try {
      const data = await profileService.getUserProgress();
      profileActions.setProgress(data);
    } catch (error: any) {
      // Don't show toast for initial Load if it's expected to be empty or handeled by UI
      console.error('Failed to load progress:', error);
    } finally {
      profileActions.setProgressLoading(false);
    }
  };

  return {
    progress: profileState$.progress.get(),
    isLoading: profileState$.isProgressLoading.get(),
    refresh: loadProgress,
  };
};
