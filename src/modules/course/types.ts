export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailUrl: string;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  authorId: string;
  averageRate: number;
  totalRate: number;
  courseLevel: string;
  slug: string;
  isFree?: boolean;
  isEnrolled?: boolean;
  progress?: number;
  moocs?: Mooc[];
  whatYouWillLearn?: string[];
  targetAudiences?: string[];
  benefits?: string[];
  assets?: string[];
  videoPreview?: string;
  profileResponse?: any;
  author?: any;
  createdBy?: string;
  countEnrolledStudents?: number;
  totalStudents?: number;
  status?: string;
}

export interface Mooc {
  id: string;
  videos?: LessonVideo[];
  quizzes?: LessonQuiz[];
  documents?: LessonDocument[];
  [key: string]: any;
}

export interface LessonVideo {
  id: string;
  title: string;
  duration?: string;
  isCompleted?: boolean;
}

export interface LessonQuiz {
  id: string;
  title: string;
  timeLimit?: number | string;
  isCompleted?: boolean;
}

export interface LessonDocument {
  id: string;
  title: string;
  isCompleted?: boolean;
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
}

export interface CourseDiscussionMessage {
  id: string;
  course_id: string;
  user_id: string;
  content: string;
  user_name: string;
  user_avatar: string;
  user_role: string;
  user_level: string;
  is_author: boolean;
  is_read: boolean;
  created_at: string;
}

export type UserLevel = 'NHAP_MON' | 'NEN_TANG' | 'TRUNG_CAP' | 'THUC_HANH' | 'NANG_CAO';

export type TrackingType = 'DOCUMENT' | 'VIDEO' | 'QUIZ';

export const USER_LEVEL_ORDER: Record<UserLevel, number> = {
  NHAP_MON: 1,
  NEN_TANG: 2,
  TRUNG_CAP: 3,
  THUC_HANH: 4,
  NANG_CAO: 5,
};

export const USER_LEVEL_LABEL: Record<UserLevel, string> = {
  NHAP_MON: 'Nhập môn',
  NEN_TANG: 'Nền tảng',
  TRUNG_CAP: 'Trung cấp',
  THUC_HANH: 'Thực hành',
  NANG_CAO: 'Nâng cao',
};

export interface CourseState {
  courses: Course[];
  currentCourse: (Course & { isEnrolled?: boolean; progress?: number; isFree?: boolean; profileResponse?: any; author?: any }) | null;
  currentLesson: any | null;
  quizQuestions: Question[];
  isQuizMode: boolean;
  currentQuizId: string | null;
  completedLessons: string[];
  userLevel: UserLevel | null;
  notes: LessonNote[];
  discussionMessages: CourseDiscussionMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface LessonNote {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  created_date: string;
  updated_date: string;
}
