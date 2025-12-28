import { UserProfile } from './types';

// Password mặc định cho tất cả user: "123456"
const MOCK_PASSWORD = '123456';

export const MOCK_PROFILES: Record<string, UserProfile & { password: string }> = {
  '1': {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    bio: 'Quản trị viên hệ thống. Yêu thích công nghệ và đam mê code.',
    phone: '+84 901 234 567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    joinedAt: '2023-06-15T00:00:00Z',
    password: MOCK_PASSWORD,
  },
  '2': {
    id: '2',
    name: 'Normal User',
    email: 'user@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    bio: 'Người dùng bình thường, thích khám phá những điều mới mẻ.',
    phone: '+84 902 345 678',
    address: 'Quận 2, TP. Hồ Chí Minh',
    joinedAt: '2023-08-20T00:00:00Z',
    password: MOCK_PASSWORD,
  },
  '3': {
    id: '3',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    bio: 'Tài khoản test cho development.',
    phone: '+84 903 456 789',
    address: 'Quận 3, TP. Hồ Chí Minh',
    joinedAt: '2024-01-10T00:00:00Z',
    password: MOCK_PASSWORD,
  },
};