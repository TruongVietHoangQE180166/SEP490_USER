'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services';
import { authActions } from '../store';
import { LoginCredentials } from '../types';
import { ROUTES } from '@/constants/routes';
import { MESSAGES } from '@/constants/messages';
import { toast } from '@/components/ui/toast';



export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user, accessToken } = await authService.login(credentials);
      
      // Save user and token to auth store
      authActions.setUser(user, accessToken);
      
      router.push('/'); // Redirect to root (home page) instead of ROUTES.PRIVATE.HOME
      toast.success('Đăng nhập thành công');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN;
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};

export default useLogin;