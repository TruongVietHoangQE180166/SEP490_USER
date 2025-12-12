import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Normal User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    role: 'user',
  },
  {
    id: '3',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    role: 'user',
  },
];

// Password mặc định cho tất cả user: "123456"
export const MOCK_PASSWORD = '123456';