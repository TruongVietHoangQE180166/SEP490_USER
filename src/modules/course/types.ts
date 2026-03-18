export interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
  createdDate: string;
  createdBy?: string | null;
}

export interface Question {
  id: string;
  content: string;
  orderIndex: number;
  quizId: string;
  createdDate: string;
  createdBy?: string | null;
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  timeLimit: number;
  passingScore: number;
  moocId: string;
  orderIndex?: number;
  createdDate: string;
  questions: Question[];
  isCompleted?: boolean | null;
}

export interface Video {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  orderIndex: number;
  isPreview: boolean;
  fileName: string;
  videoStatus: string;
  createdDate: string;
  moocId: string;
  isCompleted?: boolean | null;
}

export interface Document {
  id: string;
  title: string;
  viewUrl: string;
  downloadUrl: string;
  fileType: string;
  orderIndex: number;
  moocId: string;
  createdDate: string;
  isCompleted?: boolean | null;
}

export interface MOOC {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isPreview: boolean;
  createdDate: string;
  courseId: string;
  videos: Video[];
  quizzes: Quiz[];
  documents: Document[];
  isCompleted?: boolean;
  isUnlocked?: boolean;
}

export interface CourseAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoPreview?: string;
  price: number;
  salePrice: number;
  discountPercent: number;
  status: string;
  createdDate: string;
  averageRate: number;
  totalRate: number;
  isEnrolled: boolean;
  assets: string[];
  moocs: MOOC[];
  progress?: number;
  isFree?: boolean;
  
  // UI-only compatibility
  thumbnail?: string; 
  rating?: number;
  totalStudents?: number;
  totalLessons?: number;
  totalDuration?: string;
  author?: CourseAuthor;
  
  courseLevel?: string | null;
  countEnrolledStudents?: number | null;
}

export interface CourseApiResponse<T> {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: T;
  success: boolean;
}

export interface CoursePaginationResponse {
  content: Course[];
  request: {
    page: number;
    size: number;
    sortRequest: {
      direction: string;
      field: string;
    };
  };
  totalElement: number;
}

export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: any | null;
  quizQuestions: Question[];
  isQuizMode: boolean;
  currentQuizId: string | null;
  isLoading: boolean;
  error: string | null;
  completedLessons: string[];
}

export type TrackingType = 'DOCUMENT' | 'VIDEO' | 'QUIZ';

export interface TrackingResponse {
  message: string;
  data: {
    id: string;
    isCompleted: boolean;
    type: TrackingType;
  };
  success: boolean;
}

export interface Rating {
  id: string;
  rating: number;
  comment: string;
  courseId: string;
  courseTitle: string;
  fullName: string;
  avatar: string;
  createdDate: string;
}

export interface RatingPaginationResponse {
  content: Rating[];
  request: {
    page: number;
    size: number;
    sortRequest: {
      direction: string;
      field: string;
    };
  };
  totalElement: number;
}
