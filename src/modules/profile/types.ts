export interface Address {
  id: string;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
  address: string;
  other?: string;
  default: boolean;
}

export interface UserInformation {
  id: string;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  zalo?: string;
  twitter?: string;
}

// Based on the user's provided JSON structure
export interface UserProfile {
  id: string; // The "id" field in data
  userId: string; // The "userId" field in data
  username: string;
  fullName: string;
  nickName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatar: string | null;
  gender: string | null;
  description: string | null;
  // Optional extra fields based on the response structure
  createdDate?: string;
  updatedDate?: string;
  addresses?: Address[];
  information?: UserInformation | null;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isEditing: boolean;
  progress: UserProgress | null;
  isProgressLoading: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// API Response types
export interface ApiMessage {
  messageCode: string;
  messageDetail: string;
}

export interface ProfileApiResponse {
  message: ApiMessage;
  errors: any;
  data: UserProfile;
  success: boolean;
}

export interface ImageUploadResponse {
  message: ApiMessage;
  errors: any;
  data: string; // The image URL
  success: boolean;
}

// ... ImageUploadResponse

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: ApiMessage;
  errors: any;
  data: UserProfile | any; // The user object (partial or full)
  success: boolean;
}

export interface UpdateAddressRequest {
  id?: string;
  address: string;
  other?: string;
  default: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
  nickName?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  avatar?: string | null;
  description?: string | null;
  addresses?: UpdateAddressRequest[];
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  zalo?: string | null;
  twitter?: string | null;
}

// ─── User Level & Progress ───────────────────────────────────────────────────

export type UserLevel =
  | 'NHAP_MON'
  | 'NEN_TANG'
  | 'TRUNG_CAP'
  | 'THUC_HANH'
  | 'NANG_CAO';

export interface UserProgress {
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;

  // Current metrics
  currentAttendance: number;
  currentMooc: number;
  currentSpotOrders: number;
  currentFutureOrders: number;
  currentFuturePnl: number;
  currentWinRate: number;
  currentTpSlRate: number;
  currentHighLevTrades: number;
  currentLiqRate: number;

  // Targets for next level
  targetAttendance: number;
  targetMooc: number;
  targetSpotOrders: number;
  targetFutureOrders: number;
  targetFuturePnl: number;
  targetWinRate: number;
  targetTpSlRate: number;
  limitHighLevTrades: number;
  limitLiqRate: number;

  educatedQualified: boolean;
}

export interface ProgressState {
  progress: UserProgress | null;
  isLoading: boolean;
}

export interface ProgressApiResponse {
  message: ApiMessage;
  errors: any;
  data: UserProgress;
  success: boolean;
}