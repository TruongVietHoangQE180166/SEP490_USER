import { MockApiService } from '@/services/mockApi';
import { MOCK_USERS, MOCK_PASSWORD } from './mocks';
import { LoginCredentials, RegisterCredentials, User } from './types';
import { MESSAGES } from '@/constants/messages';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    if (!user || credentials.password !== MOCK_PASSWORD) {
      throw new Error(MESSAGES.AUTH.LOGIN_FAILED);
    }

    return user;
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const existingUser = MOCK_USERS.find((u) => u.email === credentials.email);

    if (existingUser) {
      throw new Error(MESSAGES.AUTH.REGISTER_FAILED);
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email: credentials.email,
      name: credentials.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name}`,
      role: 'user',
    };

    MOCK_USERS.push(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    // Simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  async getCurrentUser(token: string): Promise<User | null> {
    // In real app, decode token and fetch user
    const userId = token;
    return MOCK_USERS.find((u) => u.id === userId) || null;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      // For security, don't reveal if email exists
      return {
        success: true,
        message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.',
      };
    }

    // In real app, send email with reset link
    console.log(`Password reset link sent to: ${email}`);

    return {
      success: true,
      message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn.',
    };
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real app, verify token and update password
    console.log(`Password reset for token: ${token}`);
  },
};