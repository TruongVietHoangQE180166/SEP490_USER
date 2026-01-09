'use client';

import { useState } from 'react';
import { profileActions } from '../store';
import { ChangePasswordData } from '../types';
import { loadingActions } from '@/stores/loadingStore';
import { authState$ } from '@/modules/auth/store';
import { toast } from '@/components/ui/toast';

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePassword = async (passwordData: ChangePasswordData) => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    // Basic validation
    if (newPassword !== confirmPassword) {
      const errorMsg = 'New password and confirmation do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, message: 'Passwords do not match' };
    }

    if (newPassword.length < 8) {
      const errorMsg = 'New password must be at least 8 characters long';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, message: 'Password too short' };
    }

    const user = authState$.user.get();
    if (!user?.userId) {
      const errorMsg = 'User not authenticated';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, message: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Show loading overlay as per user preference
      loadingActions.showUpdateLoading('Updating password...');
      
      const result = await profileActions.changePassword(
        currentPassword,
        newPassword
      );

      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        toast.error(result.message);
        return result;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while changing password';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      loadingActions.hideLoading();
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
  };
};