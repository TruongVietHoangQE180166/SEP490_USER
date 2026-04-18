import { UserProfile } from '@/modules/profile/types';
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
  createdBy?: string;
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
  profileResponse?: UserProfile;
  whatYouWillLearn?: string[];
  targetAudiences?: string[];
  benefits?: string[];
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

// ============================================================================
// USER LEVEL
// ============================================================================

export type UserLevel = 'NHAP_MON' | 'NEN_TANG' | 'TRUNG_CAP' | 'THUC_HANH' | 'NANG_CAO';

export const USER_LEVEL_ORDER: Record<UserLevel, number> = {
  NHAP_MON: 1,
  NEN_TANG: 2,
  TRUNG_CAP: 3,
  THUC_HANH: 4,
  NANG_CAO: 5,
};

export const USER_LEVEL_LABEL: Record<UserLevel, string> = {
  NHAP_MON:  'Nhập môn',
  NEN_TANG:  'Nền tảng',
  TRUNG_CAP: 'Trung cấp',
  THUC_HANH: 'Thực hành',
  NANG_CAO:  'Nâng cao',
};

export interface GetMeResponse {
  id: string;
  username: string;
  email: string;
  status: string;
  level: UserLevel;
  role: string;
  deleted: boolean;
}

export interface GetMeApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: any;
  data: GetMeResponse;
  success: boolean;
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
  userLevel: UserLevel | null;
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

export interface ChartDemoCandle {
  id: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  symbol: string;
  timeframe: string;
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closed: boolean;
}

export interface ChartDemoData {
  id: string;
  videoId: string;
  videoTitle: string;
  createdDate: string;
  provideMoney: number;
  description: string;
  ts: number;
  startTradeTs: number;
  closeTs: number;
  limitTs: number;
  objectDone: number;
  candles: ChartDemoCandle[];
  done: boolean;
}

export interface ChartDemoApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: any;
  data: ChartDemoData;
  success: boolean;
}

// --- Answer Demo Session types ---

export interface AnswerDemoCandle {
  id: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  symbol: string;
  timeframe: string;
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closed: boolean;
}

export interface AnswerDemoResponse {
  id: string;
  sessionId: string;
  walletMoney: number;
  totalPnl: number;
  orderType: 'BUY' | 'SELL';
  quantity: number;
  totalMoney: number;
  entryPrice: number;
  closePrice: number;
  ts: number;
  pnl: number;
  isDoneSession: boolean;
  createdDate: string;
  candles: AnswerDemoCandle[];
}

export interface AnswerDemoRequest {
  orderType: 'BUY' | 'SELL';
  quantity: number | null;
  totalMoney: number;
  ts: number;
  chartId: string;
}

export interface AnswerDemoApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: Array<{ field: string; message: string }> | null;
  data: AnswerDemoResponse;
  success: boolean;
}

// --- Answer Demo by-chart (paginated) types ---

export interface AnswerDemoByChartItem {
  id: string;
  sessionId: string;
  walletMoney: number;
  totalPnl: number;
  orderType: 'BUY' | 'SELL' | null;
  quantity: number;
  totalMoney: number;
  entryPrice: number;
  closePrice: number;
  ts: number;
  pnl: number;
  isDoneSession: boolean | null;
  createdDate: string;
  candles: AnswerDemoCandle[] | null;
}

export interface AnswerDemoPaginatedResponse {
  content: AnswerDemoByChartItem[];
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

export interface AnswerDemoByChartApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: any;
  data: AnswerDemoPaginatedResponse;
  success: boolean;
}

export interface AnswerDemoSession {
  id: string;
  userId: string;
  email: string;
  chartDemoId: string;
  walletMoney: number;
  totalPnl: number;
  answerDemoResponses: AnswerDemoResponse[];
  createdDate: string;
}

export interface AnswerDemoSessionApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: Array<{ field: string; message: string }>;
  data: AnswerDemoSession;
  success: boolean;
}

// --- Reset Answer Demo types ---

export interface ResetAnswerDemoApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: Array<{ field: string; message: string }> | null;
  data: Record<string, unknown>;
  success: boolean;
}

