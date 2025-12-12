import { Post, HomeStats } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Chào mừng đến với ứng dụng!',
    content: 'Đây là bài viết đầu tiên trong hệ thống. Chúc bạn có trải nghiệm tuyệt vời!',
    author: 'Admin User',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 42,
  },
  {
    id: '2',
    title: 'Hướng dẫn sử dụng cơ bản',
    content: 'Trong bài viết này, chúng tôi sẽ hướng dẫn bạn cách sử dụng các tính năng cơ bản của ứng dụng.',
    author: 'Normal User',
    createdAt: '2024-01-16T14:20:00Z',
    likes: 28,
  },
  {
    id: '3',
    title: 'Tips & Tricks',
    content: 'Một số mẹo nhỏ giúp bạn sử dụng ứng dụng hiệu quả hơn.',
    author: 'Test User',
    createdAt: '2024-01-17T09:15:00Z',
    likes: 35,
  },
  {
    id: '4',
    title: 'Cập nhật tính năng mới',
    content: 'Chúng tôi vừa ra mắt nhiều tính năng mới thú vị. Hãy khám phá ngay!',
    author: 'Admin User',
    createdAt: '2024-01-18T16:45:00Z',
    likes: 51,
  },
  {
    id: '5',
    title: 'Câu hỏi thường gặp',
    content: 'Tổng hợp các câu hỏi thường gặp từ người dùng và câu trả lời chi tiết.',
    author: 'Normal User',
    createdAt: '2024-01-19T11:00:00Z',
    likes: 19,
  },
];

export const MOCK_HOME_STATS: HomeStats = {
  totalPosts: 125,
  totalUsers: 1547,
  todayViews: 3842,
};