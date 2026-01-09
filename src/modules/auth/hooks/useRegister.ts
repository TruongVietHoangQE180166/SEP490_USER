'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services';
import { RegisterCredentials } from '../types';
import { ROUTES } from '@/constants/routes';
import { MESSAGES } from '@/constants/messages';
import { toast } from '@/components/ui/toast';


export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    
    // Check if passwords match
    if (credentials.password !== credentials.confirmPassword) {
      const message = 'Mật khẩu không khớp';
      toast.error(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
    
    // Create credentials without confirmPassword for service call
    const { confirmPassword, ...registerCredentials } = credentials;
    
    try {
      await authService.register(registerCredentials);
      
      // API register successful but doesn't return token
      // Redirect to Verify OTP page
      router.push(`${ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(registerCredentials.email)}`);
      toast.success('Đăng ký thành công. Vui lòng xác thực OTP được gửi tới email của bạn.');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN;
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};