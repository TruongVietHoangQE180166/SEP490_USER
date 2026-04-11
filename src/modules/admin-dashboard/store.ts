import { observable } from '@legendapp/state';
import { AdminDashboardState, AdminSummaryData, RevenueData, UserRegistrationData } from './types';


const INITIAL_STATE: AdminDashboardState = {
  summary: null,
  revenueChart: null,
  userRegChart: null,
  userRegDays: 30,
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
  setUserRegChart: (data: UserRegistrationData[] | null) => {
    adminDashboardState$.userRegChart.set(data);
  },
  setUserRegDays: (days: 7 | 30) => {
    adminDashboardState$.userRegDays.set(days);
  },
  setLoading: (isLoading: boolean) => {
    adminDashboardState$.isLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    adminDashboardState$.error.set(error);
  },
};
