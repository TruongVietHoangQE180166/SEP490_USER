



import { LoginCredentials, RegisterCredentials, User, LoginApiResponse, RegisterApiResponse, RegisterUserData, VerifyOtpCredentials, VerifyOtpApiResponse, SendOtpCredentials, SendOtpApiResponse, ResetPasswordCredentials, ResetPasswordApiResponse } from './types';
import { MESSAGES } from '@/constants/messages';
import { ApiConfigService } from '@/services/apiConfig';
import { decodeJWT } from './utils';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; accessToken: string }> {
    try {
      const apiResponse = await ApiConfigService.post<LoginApiResponse>(
        '/api/auth/login',
        credentials
      );
      
      if (!apiResponse || !apiResponse.success || !apiResponse.data) {
        const errorMessage = apiResponse?.message?.messageDetail || MESSAGES.AUTH.LOGIN_FAILED;
        throw new Error(errorMessage);
      }
      
      const { accessToken } = apiResponse.data;
      const user = decodeJWT(accessToken);
      if (!user) {
        throw new Error('Failed to decode token');
      }
      
      return { user, accessToken };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(MESSAGES.AUTH.LOGIN_FAILED);
    }
  },


  async register(credentials: RegisterCredentials): Promise<RegisterUserData> {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = credentials;
      
      const apiResponse = await ApiConfigService.post<RegisterApiResponse>(
        '/api/auth/register',
        registerData
      );
      
      if (!apiResponse || !apiResponse.success || !apiResponse.data) {
        const errorMessage = apiResponse?.message?.messageDetail || MESSAGES.AUTH.REGISTER_FAILED;
        throw new Error(errorMessage);
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(MESSAGES.AUTH.REGISTER_FAILED);
    }
  },


  async verifyOTP(credentials: VerifyOtpCredentials): Promise<string | null> {
    try {
      const apiResponse = await ApiConfigService.post<VerifyOtpApiResponse>(
        '/api/auth/verifyOTP',
        credentials
      );

      if (!apiResponse || !apiResponse.success) {
        const errorMessage = apiResponse?.message?.messageDetail || 'Xác thực OTP thất bại';
        throw new Error(errorMessage);
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Xác thực OTP thất bại');
    }
  },

  async sendOTP(credentials: SendOtpCredentials): Promise<string | null> {
    try {
      const apiResponse = await ApiConfigService.post<SendOtpApiResponse>(
        '/api/auth/sendOTP',
        credentials
      );

      if (!apiResponse || !apiResponse.success) {
        const errorMessage = apiResponse?.message?.messageDetail || 'Gửi OTP thất bại';
        throw new Error(errorMessage);
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Gửi OTP thất bại');
    }
  },


  async logout(): Promise<void> {
    // Simulate logout delay
    // Note: clearAuth is handled by useLogout hook via authActions.clearAuth()
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  async getCurrentUser(token: string): Promise<User | null> {
    // Decode token to get user info
    return decodeJWT(token);
  },

  async resetPassword(credentials: ResetPasswordCredentials): Promise<string | null> {
    try {
      const apiResponse = await ApiConfigService.post<ResetPasswordApiResponse>(
        '/api/user/reset-password',
        credentials
      );

      if (!apiResponse || !apiResponse.success) {
        const errorMessage = apiResponse?.message?.messageDetail || 'Đặt lại mật khẩu thất bại';
        throw new Error(errorMessage);
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đặt lại mật khẩu thất bại');
    }
  },
};