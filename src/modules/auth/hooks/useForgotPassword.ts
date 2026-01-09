'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSendOTP } from './useSendOTP';
import { ROUTES } from '@/constants/routes';

export const useForgotPassword = () => {
  const router = useRouter();
  const { sendOTP, isLoading } = useSendOTP();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const result = await sendOTP({ email });
    
    if (result.success) {
      router.push(`${ROUTES.AUTH.RESET_PASSWORD}?email=${encodeURIComponent(email)}`);
    }
  };

  return {
    email,
    setEmail,
    handleSubmit,
    isLoading,
  };
};
