'use client';

import { useEffect, useRef } from 'react';
import { WalletService } from '../services';
import { walletActions } from '../store';
import { toast } from '@/components/ui/toast';

export const usePaymentPolling = (paymentId: string | undefined, onSuccess?: () => void) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!paymentId) return;

    const checkStatus = async () => {
      try {
        const detail = await WalletService.getPaymentDetail(paymentId);
        if (detail) {
          walletActions.setPayment(detail);
          
          if (detail.status === 'COMPLETED') {
            toast.success('Thanh toán thành công!');
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            onSuccess?.();
          } else if (detail.status === 'FAILED' || detail.status === 'CANCELLED') {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }
    };

    // Initial check
    checkStatus();

    // Set interval (5 seconds)
    intervalRef.current = setInterval(checkStatus, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paymentId, onSuccess]);

  return null;
};
