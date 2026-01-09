'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../services';
import { useSendOTP } from './useSendOTP';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/components/ui/toast';

export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const { sendOTP, isLoading: isSending } = useSendOTP();
  const [isLoading, setIsLoading] = useState(false);
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error('Thiếu thông tin email. Vui lòng thử lại.');
      router.push(ROUTES.AUTH.FORGOT_PASSWORD);
      return;
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleResendOTP = async () => {
    if (!email || countdown > 0) return;

    const result = await sendOTP({ email });
    if (result.success) {
      setCountdown(30);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp: otpString,
        newPassword
      });
      
      router.push(ROUTES.AUTH.LOGIN);
      toast.success('Đặt lại mật khẩu thành công');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    email,
    otp, 
    newPassword, 
    setNewPassword, 
    confirmPassword, 
    setConfirmPassword, 
    showPassword, 
    setShowPassword, 
    showConfirmPassword, 
    setShowConfirmPassword, 
    countdown, 
    isLoading,
    isSending,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResendOTP,
    resetPassword 
  };
};

export default useResetPassword;
