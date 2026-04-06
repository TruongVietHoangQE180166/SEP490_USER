import { ApiConfigService } from '@/services/apiConfig';
import { TeacherSummaryApiResponse, RevenueChartApiResponse } from './types';

export const teacherDashboardService = {
  async getSummary(): Promise<TeacherSummaryApiResponse> {
    const url = `/api/dashboard/teacher/summary`;
    const response = await ApiConfigService.get<TeacherSummaryApiResponse>(url);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải dữ liệu thống kê');
    }
    return response;
  },

  async getRevenueChart(): Promise<RevenueChartApiResponse> {
    const url = `/api/dashboard/teacher/revenue-chart`;
    const response = await ApiConfigService.get<RevenueChartApiResponse>(url);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải dữ liệu biểu đồ doanh thu');
    }
    return response;
  }
};
