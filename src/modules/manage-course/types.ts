// ─── Admin Course Management Types ───────────────────────────────────────────

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'REJECT';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface AdminCourseAuthor {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoPreview?: string;
  price: number;
  salePrice: number;
  discountPercent: number;
  status: CourseStatus;
  level?: CourseLevel;
  createdDate: string;
  createdBy?: string;           // username of creator from API
  updatedDate?: string;
  averageRate: number;
  totalRate: number;
  totalStudents?: number;
  totalLessons?: number;
  totalDuration?: string;
  isFree?: boolean;
  isEnrolled?: boolean;
  progress?: number;
  assets?: string[];            // tier strings: "GOLD", "SILVER", etc.
  author?: AdminCourseAuthor;
  hasCourseLevel?: string;
  countEnrolledStudents?: number | null;
  courseLevel?: string | null;
  categoryName?: string;
  whatYouWillLearn?: string[];
  targetAudiences?: string[];
  benefits?: string[];
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface ManageCourseState {
  courses: AdminCourse[];
  isLoading: boolean;
  error: string | null;
  selectedCourse: AdminCourse | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
  // Pagination
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  // Filters
  filterStatus: string;
  searchQuery: string;
  // Status update
  isStatusUpdating: boolean;
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface AdminCourseApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: AdminCourse[];
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

export interface AdminCourseSingleResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: AdminCourse;
  success: boolean;
}

export interface CourseStatusUpdateResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: null;
  success: boolean;
}

export interface QuizAnswer {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  orderIndex: number;
  quizId: string;
  answers: QuizAnswer[];
}

export interface QuizQuestionsResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: QuizQuestion[];
  success: boolean;
}
