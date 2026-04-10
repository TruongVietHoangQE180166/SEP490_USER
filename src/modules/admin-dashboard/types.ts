export interface AdminSummaryData {
  totalUsers: number;
  percentageIncreaseUsersOfLastMonth: number;
  totalCourses: number;
  percentageIncreaseCoursesOfLastMonth: number;
  totalRevenue: number;
  percentageIncreaseRevenueOfLastMonth: number;
  totalEnrolledStudents: number;
  percentageIncreaseEnrolledStudentsOfLastMonth: number;
}

export interface AdminSummaryApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: {
    field: string;
    message: string;
  }[] | null;
  data: AdminSummaryData;
  success: boolean;
}

export interface RevenueData {
  date: string;
  amount: number;
}

export interface AdminRevenueApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: {
    field: string;
    message: string;
  }[] | null;
  data: RevenueData[];
  success: boolean;
}

export interface AdminDashboardState {
  summary: AdminSummaryData | null;
  revenueChart: RevenueData[] | null;
  isLoading: boolean;
  error: string | null;
}
