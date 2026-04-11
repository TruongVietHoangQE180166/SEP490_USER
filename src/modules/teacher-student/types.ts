export interface TeacherStudent {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  deleted: boolean;
  password?: string;
  level?: string;
}

export interface TeacherStudentApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: TeacherStudent[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

export interface CourseListResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  videoPreview: string;
  price: number;
  salePrice: number;
  discountPercent: number;
  status: string;
  createdDate: string;
  createdBy: string;
  assets: string[];
  totalRate: number;
  averageRate: number;
  isEnrolled: boolean;
  isFree: boolean;
  progress: number;
  courseLevel: string;
  countEnrolledStudents: number;
}

export interface RateResponse {
  id: string;
  rating: number;
  comment: string;
  courseId: string;
  courseTitle: string;
  fullName: string;
  avatar: string;
  createdDate: string;
}

export interface StudentCourseDetail {
  courseListResponse: CourseListResponse;
  rateResponses: RateResponse[];
}

export interface TeacherStudentCourseApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: StudentCourseDetail[];
  success: boolean;
}

export interface TeacherStudentState {
  students: TeacherStudent[];
  isLoading: boolean;
  isDetailLoading: boolean;
  selectedStudentCourses: StudentCourseDetail[];
  error: string | null;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  filterStatus: string;
}
