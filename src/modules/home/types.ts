export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

export interface HomeStats {
  totalPosts: number;
  totalUsers: number;
  todayViews: number;
}

export interface HomeState {
  posts: Post[];
  stats: HomeStats | null;
  isLoading: boolean;
}