'use client';

import { useState } from 'react';
import { authService } from '../services';
import { SendOtpCredentials } from '../types';
import { toast } from '@/components/ui/toast';

export const useSendOTP = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async (credentials: SendOtpCredentials) => {
    setIsLoading(true);
    try {
      await authService.sendOTP(credentials);
      
      toast.success(`Mã OTP đã được gửi đến email ${credentials.email}`);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gửi OTP thất bại';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOTP, isLoading };
};
