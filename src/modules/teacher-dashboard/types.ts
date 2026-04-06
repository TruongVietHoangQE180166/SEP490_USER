export interface TeacherSummary {
  teacherId: string;
  teacherName: string;
  numberOfStudents: number;
  percentageOfWeeklyActiveStudents: number;
  numberOfCourses: number;
  percentageOfCoursesWithQuizzes: number;
  rateOfCourseCompletion: number;
  percentageOfRatedCourses: number;
  incomeGeneratedFromCourses: number;
  percentageOfIncomeFromTopPerformingCourses: number;
}

export interface TeacherSummaryApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: TeacherSummary;
  success: boolean;
}

export interface RevenueData {
  amount: number;
  date: string;
}

export interface RevenueChartApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: RevenueData[];
  success: boolean;
}

export interface TeacherDashboardState {
  summary: TeacherSummary | null;
  revenueChart: RevenueData[];
  isLoading: boolean;
  isChartLoading: boolean;
  error: string | null;
}
