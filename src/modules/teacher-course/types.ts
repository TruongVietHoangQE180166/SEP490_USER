// ─── Teacher Course Management Types ───────────────────────────────────────────

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'REJECT';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface TeacherCourseAuthor {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface TeacherCourse {
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
  createdBy?: string;
  updatedDate?: string;
  averageRate: number;
  totalRate: number;
  totalStudents?: number;
  totalLessons?: number;
  totalDuration?: string;
  isFree?: boolean;
  isEnrolled?: boolean;
  progress?: number;
  assets?: string[];
  author?: TeacherCourseAuthor;
  categoryName?: string;
  categoryId?: string; // used for creating/updating
  moocs?: any[]; // for detailed view
  
  hasCourseLevel?: string;
  countEnrolledStudents?: number | null;
  courseLevel?: string | null;
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface TeacherCourseState {
  courses: TeacherCourse[];
  isLoading: boolean;
  error: string | null;
  selectedCourse: TeacherCourse | null;
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
  // Misc
  isDeleting: boolean;
  isUploadingVideo: boolean;
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface TeacherCourseApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: TeacherCourse[];
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

export interface TeacherCourseSingleResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: TeacherCourse;
  success: boolean;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  discountPercent: number;
  courseStatus: string;
  assets: string[];
  courseLevel: string;
}

export interface ImageUploadResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: string; // The URL of the uploaded image
  success: boolean;
}

export interface VideoUploadResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: Array<{ field: string; message: string }> | null;
  data: Record<string, unknown>;
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

export interface Mooc {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isPreview: boolean;
  videos: any[];
  quizzes: any[];
  documents: any[];
  createdDate: string;
  createdBy: string | null;
  courseId: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface MoocApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: Mooc;
  success: boolean;
}

export interface CreateMoocRequest {
  title: string;
  description: string;
  isPreview: boolean;
}
