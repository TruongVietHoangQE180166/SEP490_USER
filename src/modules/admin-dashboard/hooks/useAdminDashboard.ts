'use client';

import { useCallback, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { adminDashboardState$, adminDashboardActions } from '../store';
import { adminDashboardService } from '../services';

export const useAdminDashboard = () => {
  const summary = useSelector(() => adminDashboardState$.summary.get());
  const revenueChart = useSelector(() => adminDashboardState$.revenueChart.get());
  const userRegChart = useSelector(() => adminDashboardState$.userRegChart.get());
  const userRegDays = useSelector(() => adminDashboardState$.userRegDays.get());
  const isLoading = useSelector(() => adminDashboardState$.isLoading.get());
  const error = useSelector(() => adminDashboardState$.error.get());

  const fetchData = useCallback(async () => {
    adminDashboardActions.setLoading(true);
    adminDashboardActions.setError(null);
    try {
      const [summaryRes, revenueRes] = await Promise.all([
        adminDashboardService.getSummary(),
        adminDashboardService.getRevenueChart(),
      ]);
      adminDashboardActions.setSummary(summaryRes.data);
      adminDashboardActions.setRevenueChart(revenueRes.data);
    } catch (err: any) {
      adminDashboardActions.setError(err.message || 'Lỗi tải dữ liệu bảng điều khiển quản trị');
    } finally {
      adminDashboardActions.setLoading(false);
    }
  }, []);

  const fetchUserRegChart = useCallback(async (days: 7 | 30) => {
    try {
      const res = await adminDashboardService.getUserRegChart(days);
      adminDashboardActions.setUserRegChart(res.data);
    } catch {
      adminDashboardActions.setUserRegChart([]);
    }
  }, []);

  const changeUserRegDays = useCallback((days: 7 | 30) => {
    adminDashboardActions.setUserRegDays(days);
    fetchUserRegChart(days);
  }, [fetchUserRegChart]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch user reg chart on mount with default 30 days
  useEffect(() => {
    fetchUserRegChart(30);
  }, [fetchUserRegChart]);

  return {
    summary,
    revenueChart,
    userRegChart,
    userRegDays,
    isLoading,
    error,
    reload: fetchData,
    changeUserRegDays,
  };
};
