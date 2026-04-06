import { observable } from '@legendapp/state';
import { TeacherDashboardState, TeacherSummary, RevenueData } from './types';

const INITIAL_STATE: TeacherDashboardState = {
  summary: null,
  revenueChart: [],
  isLoading: true,
  isChartLoading: true,
  error: null,
};

export const teacherDashboardState$ = observable<TeacherDashboardState>(INITIAL_STATE);

export const teacherDashboardActions = {
  setSummary: (summary: TeacherSummary | null) => {
    teacherDashboardState$.summary.set(summary);
  },
  setRevenueChart: (data: RevenueData[]) => {
    teacherDashboardState$.revenueChart.set(data);
  },
  setLoading: (isLoading: boolean) => {
    teacherDashboardState$.isLoading.set(isLoading);
  },
  setChartLoading: (isLoading: boolean) => {
    teacherDashboardState$.isChartLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    teacherDashboardState$.error.set(error);
  },
};
