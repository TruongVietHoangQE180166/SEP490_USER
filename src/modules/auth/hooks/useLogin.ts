'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services';
import { authActions } from '../store';
import { LoginCredentials } from '../types';
import { ROUTES } from '@/constants/routes';
import { getNormalizedRole } from '../utils';

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
      
      console.log('Login successful. Decoded User:', user);
      
      // Redirect based on role
      const userRoleRaw = user.role || (user.roles && user.roles[0]);
      const userRole = getNormalizedRole(userRoleRaw);
      
      console.log('Detected User Role:', userRole, 'Original:', userRoleRaw);
      
      if (userRole === 'ADMIN') {
        console.log('Redirecting to ADMIN Dashboard:', ROUTES.ADMIN.DASHBOARD);
        router.push(ROUTES.ADMIN.DASHBOARD);
      } else if (userRole === 'TEACHER') {
        console.log('Redirecting to TEACHER Dashboard:', ROUTES.TEACHER.DASHBOARD);
        router.push(ROUTES.TEACHER.DASHBOARD);
      } else {
        console.log('Redirecting to USER Home');
        router.push('/');
      }

      
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