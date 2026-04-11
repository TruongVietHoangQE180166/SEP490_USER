'use client';

import { useEffect } from 'react';
import { paymentState$, paymentActions } from '../store';
import { paymentService } from '../services';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export const usePaymentOrder = () => {
  const paymentInfo = paymentState$.paymentInfo.get();
  const currentOrder = paymentState$.currentOrder.get();
  const userPoints = paymentState$.userPoints.get();
  const isLoading = paymentState$.isLoading.get();
  const isPaymentCompleted = paymentState$.isPaymentCompleted.get();
  const error = paymentState$.error.get();
  const router = useRouter();

  const loadUserPoints = async () => {
    try {
      const points = await paymentService.getUserPoints();
      paymentActions.setUserPoints(points);
    } catch (err) {
      console.error('Failed to load user points:', err);
    }
  };

  useEffect(() => {
    loadUserPoints();
  }, []);

  // Polling effect — only for non-POINT payments that need QR
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (currentOrder && currentOrder.id && !isPaymentCompleted && currentOrder.qrCode) {
      interval = setInterval(async () => {
        try {
          const detail = await paymentService.getPaymentDetail(currentOrder.id);
          if (detail.status === 'COMPLETED') {
            paymentActions.setPaymentCompleted(true);
            toast.success('Thanh toán thành công! Bạn đã có thể bắt đầu học.');
            if (interval) clearInterval(interval);
          }
        } catch (err) {
          console.error('Polling payment status failed:', err);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentOrder?.id, isPaymentCompleted]);

  const handleCreateOrder = async (method: string) => {
    if (!paymentInfo) return;

    paymentActions.setLoading(true);
    try {
      if (method === 'POINT') {
        // Point payment: API returns COMPLETED immediately, no QR needed
        const order = await paymentService.payWithPoints(paymentInfo.courseId);
        paymentActions.setCurrentOrder(order);
        if (order.status === 'COMPLETED') {
          paymentActions.setPaymentCompleted(true);
          toast.success('Thanh toán bằng điểm thành công! Bạn đã có thể bắt đầu học.');
          // Refresh points balance
          await loadUserPoints();
        }
        return order;
      } else {
        const order = await paymentService.createPayment({
          courseId: paymentInfo.courseId,
          paymentMethod: method,
        });
        paymentActions.setCurrentOrder(order);
        toast.success('Đã khởi tạo lệnh thanh toán thành công!');
        return order;
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể tạo mã thanh toán');
    } finally {
      paymentActions.setLoading(false);
    }
  };

  const resetOrder = () => {
    paymentActions.resetOrder();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return { 
    paymentInfo, 
    currentOrder,
    userPoints,
    isLoading,
    isPaymentCompleted,
    error, 
    handleCreateOrder,
    resetOrder,
    formatPrice,
    loadUserPoints
  };
};
