'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authActions } from '../store';
import { decodeJWT } from '../utils';
import { toast } from '@/components/ui/toast';
import { ROUTES } from '@/constants/routes';

export const useGoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const processLogin = async () => {
      processedRef.current = true;
        
      const token = searchParams.get('token');
      
      if (!token) {
        toast.error('Đăng nhập Google thất bại: Không tìm thấy token');
        router.push(ROUTES.AUTH.LOGIN);
        return;
      }

      try {
        const user = decodeJWT(token);
        if (!user) {
          throw new Error('Token không hợp lệ');
        }

        // Store user and token AFTER checking onboarding to avoid flashing UI
        try {
          const { onboardingService } = await import('@/modules/onboarding/services');
          const { hasSeen } = await onboardingService.checkOnboardingStatus(user.userId);
          
          if (!hasSeen) {
            localStorage.setItem('pending_onboarding', 'true');
          } else {
            localStorage.removeItem('pending_onboarding');
          }

          authActions.setUser(user, token);
          toast.success('Đăng nhập Google thành công');
          // RouteGuard will now handle the push based on the pending_onboarding flag.
        } catch (e) {
          console.error('Onboarding check failed, falling back to home', e);
          authActions.setUser(user, token);
          toast.success('Đăng nhập Google thành công');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Đăng nhập Google thất bại');
        router.push(ROUTES.AUTH.LOGIN);
      } finally {
        setIsProcessing(false);
      }
    };

    if (isProcessing) {
      processLogin();
    }
  }, [searchParams, router, isProcessing]);

  return { isProcessing };
};
