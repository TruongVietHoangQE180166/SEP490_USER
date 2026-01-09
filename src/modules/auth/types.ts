// User interface - matches decoded JWT token structure
export interface User {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// API Response types
export interface ApiMessage {
  messageCode: string;
  messageDetail: string;
}

export interface LoginApiResponse {
  message: ApiMessage;
  errors: any;
  data: TokenData | null;
  success: boolean;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

// Register response data
export interface RegisterUserData {
  id: string;
  username: string;
  password: string;
  email: string;
  status: string;
  role: string;
  deleted: boolean;
}

export interface RegisterApiResponse {
  message: ApiMessage;
  errors: any;
  data: RegisterUserData | null;
  success: boolean;
}

export interface VerifyOtpCredentials {
  email: string;
  otp: string;
}

export interface VerifyOtpApiResponse {
  message: ApiMessage;
  errors: any;
  data: string | null; // Assuming success returns some string data or null, based on requirements usually verify returns minimal data
  success: boolean;
}

export interface SendOtpCredentials {
  email: string;
}

export interface SendOtpApiResponse {
  message: ApiMessage;
  errors: any;
  data: string | null;
  success: boolean;
}

export interface ResetPasswordCredentials {
  otp: string;
  email: string;
  newPassword: string;
}

export interface ResetPasswordApiResponse {
  message: ApiMessage;
  errors: any;
  data: string | null;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}