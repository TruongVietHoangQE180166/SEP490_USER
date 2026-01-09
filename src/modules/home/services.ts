import { ApiConfigService } from '@/services/apiConfig';
import { Post, HomeStats } from './types';

export const homeService = {
  async getPosts(): Promise<Post[]> {
    const response = await ApiConfigService.get<Post[]>(`/api/posts`);
    return response.data || [];
  },

  async getStats(): Promise<HomeStats> {
    const response = await ApiConfigService.get<HomeStats>(`/api/stats`);
    return response.data!;
  },

  async likePost(postId: string): Promise<Post> {
    const response = await ApiConfigService.post<Post>(`/api/posts/${postId}/like`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to like post');
    }
    
    return response.data!;
  },
};