'use client';

import { useState } from 'react';
import { authService } from '../services';
import { loadingActions } from '@/stores/loadingStore';
import { errorActions } from '@/errors/errorStore';
import { ErrorType } from '@/errors/errorTypes';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendResetLink = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    setIsLoading(true);
    loadingActions.showFetchLoading('Đang gửi link đặt lại mật khẩu...');

    try {
      const result = await authService.forgotPassword(email);
      
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gửi link thất bại';
      errorActions.setError(ErrorType.FETCH_ERROR, errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
      loadingActions.hideLoading();
    }
  };

  return {
    sendResetLink,
    isLoading,
  };
};
