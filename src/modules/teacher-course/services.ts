import { ApiConfigService } from '@/services/apiConfig';
import { TeacherCourse, TeacherCourseApiResponse, TeacherCourseSingleResponse, QuizQuestion, QuizQuestionsResponse, CreateCourseRequest, ImageUploadResponse } from './types';

export const teacherCourseService = {
  /**
   * Upload an image to the server and get back a URL.
   */
  async uploadThumbnail(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await ApiConfigService.post<ImageUploadResponse>('/api/images/upload', formData);
    
    // Based on user note: return URL even if success might be false, 
    // but check if data exists as it contains the URL.
    if (!response || !response.data) {
        throw new Error(response?.message?.messageDetail || 'Không thể tải ảnh lên');
    }
    return response.data;
  },

  /**
   * Fetch all courses for the teacher.
   * Modify the endpoint if the backend has a specific one for teacher courses.
   */
  async getCourses(
    page = 1,
    size = 1000,
    field = 'createdDate',
    direction = 'desc',
    status?: string
  ): Promise<TeacherCourseApiResponse> {
    let url = `/api/course/admin?page=${page}&size=${size}&field=${field}&direction=${direction}`;
    if (status && status !== 'ALL') url += `&status=${status}`;

    const response = await ApiConfigService.get<TeacherCourseApiResponse>(url);
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải danh sách khoá học');
    }
    return response;
  },

  /**
   * Fetch full course detail by courseId (includes moocs, videos, quizzes, documents).
   */
  async getCourseDetailById(courseId: string): Promise<TeacherCourse> {
    const response = await ApiConfigService.get<TeacherCourseSingleResponse>(
      `/api/course/authorize/${courseId}`
    );
    if (!response || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải chi tiết khoá học');
    }
    return { ...response.data };
  },

  /**
   * Create a new course.
   */
  async createCourse(data: CreateCourseRequest): Promise<TeacherCourse> {
    const response = await ApiConfigService.post<TeacherCourseSingleResponse>('/api/course', data);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tạo khoá học');
    }
    return response.data;
  },

  /**
   * Update an existing course.
   */
  async updateCourse(id: string, data: CreateCourseRequest): Promise<TeacherCourse> {
    const response = await ApiConfigService.put<TeacherCourseSingleResponse>(`/api/course/${id}`, data);
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
   * Fetch quiz questions by quizId
   */
  async getQuizQuestionsByQuizId(quizId: string): Promise<QuizQuestion[]> {
    const response = await ApiConfigService.get<QuizQuestionsResponse>(`/api/question/by-quiz?quizId=${quizId}`);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải chi tiết câu hỏi');
    }
    return response.data;
  },
};
