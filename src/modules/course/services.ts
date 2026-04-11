import { ApiConfigService } from '@/services/apiConfig';
import {
  Course, CourseApiResponse, CoursePaginationResponse, Question,
  Rating, RatingPaginationResponse,
  ChartDemoApiResponse, ChartDemoData,
  AnswerDemoSession, AnswerDemoSessionApiResponse,
  AnswerDemoByChartApiResponse, AnswerDemoByChartItem,
  ResetAnswerDemoApiResponse, AnswerDemoRequest, AnswerDemoApiResponse
} from './types';

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
      `/api/rate?page=${page}&size=${size}&field=${field}&direction=${direction}&courseId=${courseId}&isCurrentUser=false`
    );

    if (!response || !response.success || !response.data) {
      return [];
    }

    return response.data.content || [];
  },

  async createRating(courseId: string, rating: number, comment: string): Promise<any> {
    const response = await ApiConfigService.post<any>(`/api/rate?courseId=${courseId}`, {
      rateValue: rating,
      comment
    });

    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to submit rating');
    }

    return response.data;
  },

  async updateRating(id: string, rating: number, comment: string): Promise<any> {
    const response = await ApiConfigService.put<any>(`/api/rate?rateId=${id}`, {
      rateValue: rating,
      comment
    });

    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to update rating');
    }

    return response.data;
  },

  async getChartDemoByVideo(videoId: string): Promise<ChartDemoData | null> {
    try {
      const response = await ApiConfigService.get<ChartDemoApiResponse>(`/api/chart-demo/by-video/${videoId}`);
      if (response && response.success && response.data) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async getAnswerDemoSession(chartId: string): Promise<AnswerDemoSession | null> {
    try {
      const response = await ApiConfigService.get<AnswerDemoSessionApiResponse>(`/api/answer-demo/session/${chartId}`);
      if (response && response.success && response.data) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async getAnswerDemoByChart(
    chartId: string,
    page = 1,
    size = 1000,
    field = 'createdDate',
    direction = 'desc',
  ): Promise<AnswerDemoByChartItem[]> {
    try {
      const response = await ApiConfigService.get<AnswerDemoByChartApiResponse>(
        `/api/answer-demo/by-chart?page=${page}&size=${size}&field=${field}&direction=${direction}&chartId=${chartId}`,
      );
      if (response && response.success && response.data) {
        return response.data.content || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  async resetAnswerDemo(chartId: string): Promise<ResetAnswerDemoApiResponse> {
    const response = await ApiConfigService.delete<ResetAnswerDemoApiResponse>(
      `/api/answer-demo/reset/${chartId}`,
    );
    return response;
  },

  async createAnswerDemo(payload: AnswerDemoRequest): Promise<AnswerDemoApiResponse> {
    const response = await ApiConfigService.post<AnswerDemoApiResponse>(
      '/api/answer-demo',
      payload
    );
    if (!response) {
      throw new Error('Failed to place demo order (No response)');
    }
    return response;
  },

  async getAnswerDemoById(id: string): Promise<AnswerDemoApiResponse> {
    const response = await ApiConfigService.get<AnswerDemoApiResponse>(`/api/answer-demo/${id}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch answer demo detail');
    }
    return response;
  },
};
