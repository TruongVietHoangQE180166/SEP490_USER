import { ApiConfigService } from '@/services/apiConfig';
import { BlogPost, BlogCategory, BlogCategoryApiResponse, BlogPaginationResponse, BlogDetailApiResponse } from './types';

export const blogService = {
  // Get all blog categories from API
  async getBlogCategories(): Promise<BlogCategory[]> {
    const response = await ApiConfigService.get<BlogCategoryApiResponse>('/api/blog-categories');
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch blog categories');
    }
    return response.data;
  },

  // Get all blog posts from API
  async getAllPosts(page = 1, size = 1000, field = 'createdDate', direction = 'desc'): Promise<BlogPost[]> {
    const response = await ApiConfigService.get<BlogPaginationResponse>(
      `/api/blogs?page=${page}&size=${size}&field=${field}&direction=${direction}`
    );

    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch blog posts');
    }

    // Map the response data to include readTime if needed by UI
    return (response.data.content || []).map(post => ({
      ...post,
      readTime: Math.max(1, Math.ceil((post.content || '').split(' ').length / 200)) // Simple estimate
    }));
  },

  // Get post by slug from API
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const response = await ApiConfigService.get<BlogDetailApiResponse>(`/api/blogs/${slug}`);
    
    if (!response || !response.success || !response.data) {
      return null;
    }

    const post = response.data;
    return {
      ...post,
      readTime: Math.max(1, Math.ceil((post.content || '').split(' ').length / 200))
    };
  },

  // Get featured posts (Mocking by taking top 3 for now, or use API if available)
  async getFeaturedPosts(): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.slice(0, 3);
  },

  // Get posts by category
  async getPostsByCategory(categoryName: string): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.filter(post => post.categoryName === categoryName);
  },

  // Search posts
  async searchPosts(query: string): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    const lowerQuery = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery)
    );
  },
};
