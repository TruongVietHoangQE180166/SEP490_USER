import { ApiConfigService } from '@/services/apiConfig';
import { PaymentApiResponse } from './types';

export const paymentService = {
  async getPayments(
    page = 1,
    size = 1000,
    field = 'createdDate',
    direction = 'desc'
  ): Promise<PaymentApiResponse> {
    // Đổi từ /api/payments sang /api/payment theo yêu cầu
    const url = `/api/payment?page=${page}&size=${size}&field=${field}&direction=${direction}`;
    const response = await ApiConfigService.get<PaymentApiResponse>(url);
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch payments');
    }
    return response;
  },

  async getPaymentDetail(id: string): Promise<any> {
    const response = await ApiConfigService.get<any>(`/api/payment/${id}`);
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch payment detail');
    }
    return response.data;
  }
};
