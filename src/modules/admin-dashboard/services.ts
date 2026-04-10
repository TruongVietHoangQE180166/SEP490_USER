import { ApiConfigService } from '@/services/apiConfig';
import { AdminSummaryApiResponse, AdminRevenueApiResponse } from './types';

export const adminDashboardService = {
  async getSummary(): Promise<AdminSummaryApiResponse> {
    const url = `/api/dashboard/admin/summary`;
    const response = await ApiConfigService.get<AdminSummaryApiResponse>(url);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải dữ liệu thống kê quản trị');
    }
    return response;
  },

  async getRevenueChart(): Promise<AdminRevenueApiResponse> {
    const url = `/api/dashboard/admin/revenue-chart`;
    const response = await ApiConfigService.get<AdminRevenueApiResponse>(url);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải dữ liệu biểu đồ doanh thu');
    }
    return response;
  },
};
