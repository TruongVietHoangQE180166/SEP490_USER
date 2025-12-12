'use client';

import { useRouter } from 'next/navigation';
import { authService } from '../services';
import { authActions } from '../store';
import { ROUTES } from '@/constants/routes';
import { resetAllStores } from '@/stores/rootStore';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state and redirect
      authActions.clearAuth();
      resetAllStores();
      router.push(ROUTES.AUTH.LOGIN);
    }
  };

  return { logout };
};