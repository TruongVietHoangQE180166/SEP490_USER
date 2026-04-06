'use client';

import { useCallback, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { teacherDashboardState$, teacherDashboardActions } from '../store';
import { teacherDashboardService } from '../services';

export const useTeacherDashboard = () => {
  const summary = useSelector(() => teacherDashboardState$.summary.get());
  const revenueChart = useSelector(() => teacherDashboardState$.revenueChart.get());
  const isLoading = useSelector(() => teacherDashboardState$.isLoading.get());
  const isChartLoading = useSelector(() => teacherDashboardState$.isChartLoading.get());
  const error = useSelector(() => teacherDashboardState$.error.get());

  const fetchSummary = useCallback(async () => {
    teacherDashboardActions.setLoading(true);
    teacherDashboardActions.setError(null);
    try {
      const response = await teacherDashboardService.getSummary();
      teacherDashboardActions.setSummary(response.data);
    } catch (err: any) {
      teacherDashboardActions.setError(err.message || 'Lỗi tải dữ liệu bảng điều khiển');
    } finally {
      teacherDashboardActions.setLoading(false);
    }
  }, []);

  const fetchRevenueChart = useCallback(async () => {
    teacherDashboardActions.setChartLoading(true);
    try {
      const response = await teacherDashboardService.getRevenueChart();
      teacherDashboardActions.setRevenueChart(response.data || []);
    } catch (err: any) {
      console.error('Error fetching revenue chart:', err);
      // We don't set the main error here to avoid blocking the whole dashboard
    } finally {
      teacherDashboardActions.setChartLoading(false);
    }
  }, []);

  const reloadAll = useCallback(async () => {
    await Promise.all([fetchSummary(), fetchRevenueChart()]);
  }, [fetchSummary, fetchRevenueChart]);

  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  return {
    summary,
    revenueChart,
    isLoading,
    isChartLoading,
    error,
    reload: reloadAll
  };
};
