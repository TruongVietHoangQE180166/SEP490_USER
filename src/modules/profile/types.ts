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