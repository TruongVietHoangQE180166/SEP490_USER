import { ApiConfigService } from '@/services/apiConfig';
import { CourseApiResponse } from '../course/types';
import { PaymentData, PaymentRequest, PaymentResponse, PointData, PointDetailResponse } from './types';

export const paymentService = {
  async createPayment(request: PaymentRequest): Promise<PaymentData> {
    const response = await ApiConfigService.post<PaymentResponse>('/api/payment', request);
    
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to create payment');
    }

    return response.data;
  },

  async verifyPayment(orderId: string): Promise<{ status: string }> {
    const response = await ApiConfigService.get<CourseApiResponse<{ status: string }>>(`/api/payment/verify/${orderId}`);
    
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to verify payment');
    }

    return response.data;
  },

  async getPaymentDetail(paymentId: string): Promise<PaymentData> {
    const response = await ApiConfigService.get<PaymentResponse>(`/api/payment/detail/${paymentId}`);
    
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể lấy thông tin thanh toán');
    }

    return response.data;
  },

  async getUserPoints(): Promise<PointData> {
    const response = await ApiConfigService.get<PointDetailResponse>('/api/point/detail');
    
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể lấy thông tin điểm thưởng');
    }

    return response.data;
  },

  async payWithPoints(courseId: string): Promise<PaymentData> {
    const response = await ApiConfigService.post<PaymentResponse>('/api/payment', {
      courseId,
      paymentMethod: 'POINT',
    });

    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể thanh toán bằng điểm thưởng');
    }

    return response.data;
  },
};
