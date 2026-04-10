'use client';

import { useCallback, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { adminDashboardState$, adminDashboardActions } from '../store';
import { adminDashboardService } from '../services';

export const useAdminDashboard = () => {
  const summary = useSelector(() => adminDashboardState$.summary.get());
  const revenueChart = useSelector(() => adminDashboardState$.revenueChart.get());
  const isLoading = useSelector(() => adminDashboardState$.isLoading.get());
  const error = useSelector(() => adminDashboardState$.error.get());

  const fetchData = useCallback(async () => {
    adminDashboardActions.setLoading(true);
    adminDashboardActions.setError(null);
    try {
      const [summaryRes, revenueRes] = await Promise.all([
        adminDashboardService.getSummary(),
        adminDashboardService.getRevenueChart()
      ]);
      
      adminDashboardActions.setSummary(summaryRes.data);
      adminDashboardActions.setRevenueChart(revenueRes.data);
    } catch (err: any) {
      adminDashboardActions.setError(err.message || 'Lỗi tải dữ liệu bảng điều khiển quản trị');
    } finally {
      adminDashboardActions.setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    summary,
    revenueChart,
    isLoading,
    error,
    reload: fetchData
  };
};
