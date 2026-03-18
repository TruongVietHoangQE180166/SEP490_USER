import { ApiConfigService } from '@/services/apiConfig';
import { BlogPost, BlogCategoryApiResponse } from '../blog/types';
import {
  BlogApiResponse,
  CreateBlogRequest,
  ImageUploadApiResponse,
  SingleBlogApiResponse,
  ToggleVisibilityRequest,
  UpdateBlogRequest,
} from './types';

export const blogService = {
  // --- Fetch blogs (paginated) ---
  async getBlogs(
    page = 1,
    size = 1000,
    field = 'createdDate',
    direction = 'desc'
  ): Promise<BlogApiResponse> {
    const url = `/api/blogs?page=${page}&size=${size}&field=${field}&direction=${direction}`;
    const response = await ApiConfigService.get<BlogApiResponse>(url);
    // API có thể trả success: false ngay cả khi thành công — chỉ check data
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch blogs');
    }
    return response;
  },

  // --- Fetch categories ---
  async getCategories(): Promise<BlogCategoryApiResponse> {
    const response = await ApiConfigService.get<BlogCategoryApiResponse>('/api/blog-categories');
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch categories');
    }
    return response;
  },

  // --- Upload image ---
  /**
   * POST /api/images/upload
   * Gửi multipart/form-data với key "file".
   * Trả về Cloudinary URL.
   */
  async uploadImage(file: File): Promise<string> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Dùng FormData để gửi multipart/form-data
    // Không set Content-Type thủ công — browser tự thêm boundary chính xác
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `https://vict-beeab2c3akcqgyej.malaysiawest-01.azurewebsites.net/api/images/upload`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    const data: ImageUploadApiResponse = await response.json();

    if (!data || !data.data) {
      throw new Error(data?.message?.messageDetail || 'Failed to upload image');
    }

    return data.data; // Cloudinary URL
  },

  // --- Create blog ---
  /**
   * POST /api/blogs
   * Cần upload ảnh trước để lấy URL, sau đó tạo bài viết.
   */
  async createBlog(payload: CreateBlogRequest): Promise<BlogPost> {
    const response = await ApiConfigService.post<SingleBlogApiResponse>('/api/blogs', payload);
    // Lỗi thật: errors có giá trị hoặc không có data
    if (!response) throw new Error('Không thể kết nối tới máy chủ');
    if (response.errors || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Tạo bài viết thất bại');
    }
    return response.data;
  },

  // --- Update blog ---
  /**
   * PUT /api/blogs/blog-id/{id}
   * Body: { title, content, image, categoryId }
   */
  async updateBlog(id: string, payload: UpdateBlogRequest): Promise<BlogPost> {
    const response = await ApiConfigService.put<SingleBlogApiResponse>(`/api/blogs/blog-id/${id}`, payload);
    // API update trả success: true khi thành công
    if (!response) throw new Error('Không thể kết nối tới máy chủ');
    if (response.errors || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Cập nhật bài viết thất bại');
    }
    return response.data;
  },

  // --- Delete blog ---
  /**
   * DELETE /api/blogs/{id}
   */
  async deleteBlog(id: string): Promise<void> {
    const response = await ApiConfigService.delete<any>(`/api/blogs/${id}`);
    if (!response) throw new Error('Không thể kết nối tới máy chủ');
    if (response.errors) {
      throw new Error(response?.message?.messageDetail || 'Xóa bài viết thất bại');
    }
  },

  // --- Toggle visibility ---
  /**
   * PUT /api/blogs/show/{slugName}
   * Body: { show: boolean }  — true = công khai, false = tạm ẩn
   */
  async toggleBlogVisibility(slugName: string, show: boolean): Promise<void> {
    const payload: ToggleVisibilityRequest = { show };
    const response = await ApiConfigService.put<any>(`/api/blogs/show/${slugName}`, payload);
    if (!response) throw new Error('Không thể kết nối tới máy chủ');
    if (response.errors) {
      throw new Error(response?.message?.messageDetail || 'Cập nhật trạng thái thất bại');
    }
  },
};
