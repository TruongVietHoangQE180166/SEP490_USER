import { ApiConfigService } from '@/services/apiConfig';
import { AdminSummaryApiResponse, AdminRevenueApiResponse, UserRegChartApiResponse } from './types';


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

  async getUserRegChart(days: 7 | 30): Promise<UserRegChartApiResponse> {
    const url = `/api/user/revenue-chart?days=${days}`;
    const response = await ApiConfigService.get<UserRegChartApiResponse>(url);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải dữ liệu người dùng đăng ký');
    }
    return response;
  },
};

