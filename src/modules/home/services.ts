import { MockApiService } from '@/services/mockApi';
import { MOCK_POSTS, MOCK_HOME_STATS } from './mocks';
import { Post, HomeStats } from './types';

export const homeService = {
  async getPosts(): Promise<Post[]> {
    const response = await MockApiService.execute(() => MOCK_POSTS);
    return response.data || [];
  },

  async getStats(): Promise<HomeStats> {
    const response = await MockApiService.execute(() => MOCK_HOME_STATS);
    return response.data!;
  },

  async likePost(postId: string): Promise<Post> {
    const post = MOCK_POSTS.find((p) => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    post.likes += 1;
    return post;
  },
};