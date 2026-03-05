import { useEffect, useState } from 'react';
import { paymentState$, paymentActions } from '../store';
import { paymentService } from '../services';
import { courseService } from '../../course/services';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export const usePaymentOrder = () => {
  const paymentInfo = paymentState$.paymentInfo.get();
  const currentOrder = paymentState$.currentOrder.get();
  const isLoading = paymentState$.isLoading.get();
  const error = paymentState$.error.get();
  const router = useRouter();

  const handleCreateOrder = async (method: string) => {
    if (!paymentInfo) return;

    paymentActions.setLoading(true);
    try {
      const order = await paymentService.createPayment({
        courseId: paymentInfo.courseId,
        paymentMethod: method
      });
      
      paymentActions.setCurrentOrder(order);
      toast.success('Đã khởi tạo lệnh thanh toán thành công!');
      return order;
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
    isLoading, 
    error, 
    handleCreateOrder,
    resetOrder,
    formatPrice
  };
};
