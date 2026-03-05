import { ApiConfigService } from '@/services/apiConfig';
import { Course, CourseApiResponse, CoursePaginationResponse, Question, Rating, RatingPaginationResponse } from './types';

export const courseService = {
  async getAllCourses(page = 1, size = 1000, field = 'createdDate', direction = 'desc'): Promise<Course[]> {
    const response = await ApiConfigService.get<CourseApiResponse<CoursePaginationResponse>>(
      `/api/course?page=${page}&size=${size}&field=${field}&direction=${direction}`
    );

    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch courses');
    }

    return (response.data.content || []).map(course => ({
      ...course,
      // Mapping for backward compatibility if needed by existing UI
      thumbnail: course.thumbnailUrl,
      rating: course.averageRate,
      // No longer overwriting price/salePrice as we use backend fields directly now
    }));
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const response = await ApiConfigService.get<CourseApiResponse<Course>>(`/api/course/${slug}`);
    
    if (!response || !response.success || !response.data) {
      return null;
    }

    const course = response.data;
    return {
      ...course,
      thumbnail: course.thumbnailUrl,
      rating: course.averageRate,
    };
  },

  async getCourseBySlugName(slugName: string): Promise<Course | null> {
    const response = await ApiConfigService.get<CourseApiResponse<Course>>(`/api/course/${slugName}/by-slug-name`);
    
    if (!response || !response.success || !response.data) {
      return null;
    }

    const course = response.data;
    return {
      ...course,
      thumbnail: course.thumbnailUrl,
      rating: course.averageRate,
    };
  },

  async getCourseById(id: string): Promise<Course | null> {
    // Note: If backend only supports slug for public view, this might need to change
    const response = await ApiConfigService.get<CourseApiResponse<Course>>(`/api/course/${id}`);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  },

  async getQuizQuestions(quizId: string): Promise<Question[]> {
    const response = await ApiConfigService.get<CourseApiResponse<Question[]>>(`/api/question/by-quiz?quizId=${quizId}`);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch quiz questions');
    }
    return response.data;
  },

  async trackProgress(id: string, type: 'DOCUMENT' | 'VIDEO' | 'QUIZ', isCompleted: boolean = true): Promise<any> {
    const response = await ApiConfigService.patch<any>(
      `/api/course/tracking/${id}?type=${type}&isCompleted=${isCompleted}`,
      {} // Empty body
    );
    
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to track progress');
    }
    
    return response.data;
  },

  async getRatings(courseId: string, page = 1, size = 1000, field = 'createdDate', direction = 'desc'): Promise<Rating[]> {
    const response = await ApiConfigService.get<CourseApiResponse<RatingPaginationResponse>>(
      `/api/rate?page=${page}&size=${size}&field=${field}&direction=${direction}&courseId=${courseId}`
    );

    if (!response || !response.success || !response.data) {
      return [];
    }

    return response.data.content || [];
  },

  async createRating(courseId: string, rating: number, comment: string): Promise<any> {
    const response = await ApiConfigService.post<any>('/api/rate', {
      courseId,
      rate: rating,
      comment
    });

    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to submit rating');
    }

    return response.data;
  }
};
