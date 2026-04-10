import { observable } from '@legendapp/state';
import { AdminDashboardState, AdminSummaryData, RevenueData } from './types';

const INITIAL_STATE: AdminDashboardState = {
  summary: null,
  revenueChart: null,
  isLoading: true,
  error: null,
};

export const adminDashboardState$ = observable<AdminDashboardState>(INITIAL_STATE);

export const adminDashboardActions = {
  setSummary: (summary: AdminSummaryData | null) => {
    adminDashboardState$.summary.set(summary);
  },
  setRevenueChart: (data: RevenueData[] | null) => {
    adminDashboardState$.revenueChart.set(data);
  },
  setLoading: (isLoading: boolean) => {
    adminDashboardState$.isLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    adminDashboardState$.error.set(error);
  },
};
