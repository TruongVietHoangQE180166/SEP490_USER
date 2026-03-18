import { ApiConfigService } from '@/services/apiConfig';
import { AdminCourse, AdminCourseApiResponse, AdminCourseSingleResponse, CourseStatusUpdateResponse } from './types';

export const manageCourseService = {
  /**
   * Fetch all courses (admin view) with optional filters.
   */
  async getCourses(
    page = 1,
    size = 1000,
    field = 'createdDate',
    direction = 'desc',
    status?: string
  ): Promise<AdminCourseApiResponse> {
    let url = `/api/course?page=${page}&size=${size}&field=${field}&direction=${direction}`;
    if (status && status !== 'ALL') url += `&status=${status}`;

    const response = await ApiConfigService.get<AdminCourseApiResponse>(url);
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải danh sách khoá học');
    }
    return response;
  },

  /**
   * Fetch single course by ID (admin — basic info).
   */
  async getCourseById(id: string): Promise<AdminCourse> {
    const response = await ApiConfigService.get<AdminCourseSingleResponse>(`/api/course/${id}`);
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải thông tin khoá học');
    }
    return response.data;
  },

  /**
   * Fetch full course detail by slug (includes moocs, videos, quizzes, documents).
   * Same endpoint as the user-facing getCourseBySlugName.
   */
  async getCourseDetailBySlug(slug: string): Promise<AdminCourse> {
    const response = await ApiConfigService.get<AdminCourseSingleResponse>(
      `/api/course/${slug}/by-slug-name`
    );
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải chi tiết khoá học');
    }
    return { ...response.data };
  },

  /**
   * Create a new course.
   */
  async createCourse(data: Partial<AdminCourse>): Promise<AdminCourse> {
    const response = await ApiConfigService.post<AdminCourseSingleResponse>('/api/course', data);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tạo khoá học');
    }
    return response.data;
  },

  /**
   * Update an existing course.
   */
  async updateCourse(id: string, data: Partial<AdminCourse>): Promise<AdminCourse> {
    const response = await ApiConfigService.put<AdminCourseSingleResponse>(`/api/course/${id}`, data);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật khoá học');
    }
    return response.data;
  },

  /**
   * Delete a course by ID.
   */
  async deleteCourse(id: string): Promise<void> {
    const response = await ApiConfigService.delete<any>(`/api/course/${id}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể xoá khoá học');
    }
  },

  /**
   * Update course status: REJECT or PUBLISHED.
   * PATCH /api/course/course-status/{id}?courseStatus=REJECT|PUBLISHED
   */
  async updateCourseStatus(id: string, status: 'REJECT' | 'PUBLISHED'): Promise<void> {
    const response = await ApiConfigService.patch<CourseStatusUpdateResponse>(
      `/api/course/course-status/${id}?courseStatus=${status}`,
      {}
    );
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật trạng thái khoá học');
    }
  },
};
