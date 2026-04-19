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
      console.log('Login successful. Decoded User:', user);
      
      const userRoleRaw = user.role || (user.roles && user.roles[0]);
      const userRole = getNormalizedRole(userRoleRaw);
      
      console.log('Detected User Role:', userRole, 'Original:', userRoleRaw);
      
      if (userRole === 'ADMIN') {
        authActions.setUser(user, accessToken);
        console.log('Redirecting to ADMIN Dashboard:', ROUTES.ADMIN.DASHBOARD);
        router.push(ROUTES.ADMIN.DASHBOARD);
      } else if (userRole === 'TEACHER') {
        console.log('Checking onboarding status for TEACHER');
        try {
          const { onboardingService } = await import('@/modules/onboarding/services');
          const { hasSeen } = await onboardingService.checkOnboardingStatus(user.userId);
          
          if (!hasSeen) {
            localStorage.setItem('pending_onboarding', 'true');
          } else {
            localStorage.removeItem('pending_onboarding');
          }

          authActions.setUser(user, accessToken);
          // RouteGuard will handle redirect to dashboard or onboarding
        } catch (e) {
          console.error('Onboarding check failed for teacher', e);
          authActions.setUser(user, accessToken);
          router.push(ROUTES.TEACHER.DASHBOARD);
        }
      } else {
        console.log('Checking onboarding status before redirecting to USER Home');
        try {
          const { onboardingService } = await import('@/modules/onboarding/services');
          const { hasSeen } = await onboardingService.checkOnboardingStatus(user.userId);
          
          if (!hasSeen) {
            localStorage.setItem('pending_onboarding', 'true');
          } else {
            localStorage.removeItem('pending_onboarding');
          }

          authActions.setUser(user, accessToken);
          // RouteGuard will now handle the push based on the pending_onboarding flag.
        } catch (e) {
          console.error('Onboarding check failed, falling back to home', e);
          authActions.setUser(user, accessToken);
        }
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