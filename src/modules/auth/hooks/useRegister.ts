'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services';
import { authActions } from '../store';
import { RegisterCredentials } from '../types';
import { ROUTES } from '@/constants/routes';
import { MESSAGES } from '@/constants/messages';
import { errorActions } from '@/errors/errorStore';
import { ErrorType } from '@/errors/errorTypes';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const user = await authService.register(credentials);
      authActions.setUser(user, user.id);
      router.push('/'); // Redirect to root (home page) instead of ROUTES.PRIVATE.HOME
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN;
      errorActions.setError(ErrorType.AUTH, message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};