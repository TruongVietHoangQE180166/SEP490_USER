import { ApiConfigService } from '@/services/apiConfig';
import { TeacherCourse, TeacherCourseApiResponse, TeacherCourseSingleResponse, QuizQuestion, QuizQuestionsResponse, CreateCourseRequest, ImageUploadResponse, VideoUploadResponse, DocumentUploadResponse, CreateQuizRequest, CreateQuizResponse, ChartDemoApiResponse, CreateChartDemoRequest, UpdateChartDemoRequest } from './types';

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

  /**
   * Upload video preview for a course.
   * POST /api/course/upload?courseId={courseId}
   * Body: multipart/form-data  { file: File }
   */
  async uploadVideoPreview(courseId: string, file: File): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await ApiConfigService.post<VideoUploadResponse>(
      `/api/course/upload?courseId=${courseId}`,
      formData
    );
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải video preview lên');
    }
    return response;
  },

  /**
   * Create a new Mooc (lesson) under a course
   */
  async createMooc(courseId: string, title: string): Promise<any> {
    const data = {
      title,
      description: 'Chưa có mô tả',
      isPreview: true,
    };
    const response = await ApiConfigService.post<any>(`/api/mooc?courseId=${courseId}`, data);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tạo bài học');
    }
    return response.data;
  },

  /**
   * Update an existing Mooc (chapter/lesson)
   */
  async updateMooc(moocId: string, title: string): Promise<any> {
    const data = {
      title,
      description: 'Chưa có mô tả',
      isPreview: true,
    };
    const response = await ApiConfigService.put<any>(`/api/mooc/${moocId}`, data);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật bài học');
    }
    return response.data;
  },

  /**
   * Delete an existing Mooc
   */
  async deleteMooc(moocId: string): Promise<void> {
    const response = await ApiConfigService.delete<any>(`/api/mooc/${moocId}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể xoá chương học');
    }
  },

  /**
   * Delete a Video lesson by ID
   */
  async deleteVideo(videoId: string): Promise<void> {
    const response = await ApiConfigService.delete<any>(`/api/video/${videoId}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể xoá bài học video');
    }
  },

  /**
   * Update an existing Video lesson (title / replace file)
   * PUT /api/video/{videoId}?title=...&duration=1&isPreview=true
   * Body: multipart/form-data { file?: File }
   */
  async updateVideo(videoId: string, title: string, file?: File): Promise<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    const url = `/api/video/${videoId}?title=${encodeURIComponent(title)}&duration=1&isPreview=true`;
    const response = await ApiConfigService.put<any>(url, formData);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật bài học video');
    }
    return response.data;
  },

  /**
   * Upload a document for a Mooc
   * POST /api/documents/{moocId}/upload?title=...&fileType=...
   * Body: multipart/form-data { file: File }
   */
  async uploadDocument(moocId: string, file: File, title: string, fileType: string): Promise<DocumentUploadResponse['data']> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `/api/documents/${moocId}/upload?title=${encodeURIComponent(title)}&fileType=${fileType}`;
    const response = await ApiConfigService.post<DocumentUploadResponse>(url, formData);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải tài liệu lên');
    }
    return response.data;
  },

  /**
   * Update an existing document
   * PUT /api/documents/{documentId}?title=...&fileType=...
   * Body: multipart/form-data { file?: File }
   */
  async updateDocument(documentId: string, file: File, title: string, fileType: string): Promise<DocumentUploadResponse['data']> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `/api/documents/${documentId}?title=${encodeURIComponent(title)}&fileType=${fileType}`;
    const response = await ApiConfigService.put<DocumentUploadResponse>(url, formData);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật tài liệu');
    }
    return response.data;
  },

  /**
   * Delete a document
   * DELETE /api/documents/{documentId}
   */
  async deleteDocument(documentId: string): Promise<any> {
    const response = await ApiConfigService.delete<any>(`/api/documents/${documentId}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể xóa tài liệu');
    }
    return response.data;
  },

  /**
   * Upload video for a Mooc
   */
  async uploadMoocVideo(moocId: string, file: File, title: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    // Request is POST /api/video/{moocId}/upload?title=...&duration=1&isPreview=true
    const url = `/api/video/${moocId}/upload?title=${encodeURIComponent(title)}&duration=1&isPreview=true`;
    
    const response = await ApiConfigService.post<any>(url, formData);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải video lên');
    }
    return response.data;
  },

  /**
   * Create Quiz for a Mooc
   * POST /api/quiz?moocId=xxx
   */
  async createQuiz(moocId: string, payload: CreateQuizRequest): Promise<CreateQuizResponse['data']> {
    const url = `/api/quiz?moocId=${moocId}`;
    const response = await ApiConfigService.post<CreateQuizResponse>(url, payload);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tạo bài kiểm tra');
    }
    return response.data;
  },

  /**
   * Update Quiz content (title, timeLimit, passingScore)
   * PUT /api/quiz/{quizId}
   */
  async updateQuiz(quizId: string, payload: CreateQuizRequest): Promise<CreateQuizResponse['data']> {
    const url = `/api/quiz/${quizId}`;
    const response = await ApiConfigService.put<CreateQuizResponse>(url, payload);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật bài kiểm tra');
    }
    return response.data;
  },

  /**
   * Delete a Quiz
   * DELETE /api/quiz/{quizId}
   */
  async deleteQuiz(quizId: string): Promise<void> {
    const response = await ApiConfigService.delete<any>(`/api/quiz/${quizId}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể xoá bài kiểm tra');
    }
  },

  /**
   * Fetch Chart Demo by Video ID
   * GET /api/chart-demo/by-video/{videoId}
   */
  async getChartDemoByVideo(videoId: string): Promise<ChartDemoApiResponse['data'] | null> {
    try {
      const response = await ApiConfigService.get<ChartDemoApiResponse>(`/api/chart-demo/by-video/${videoId}`);
      if (response && response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Create Chart Demo
   * POST /api/chart-demo?videoId=...&ts=...&startTradeTs=...&closeTs=...&limitTs=...&provideMoney=...&objectDone=...&description=...
   */
  async createChartDemo(payload: CreateChartDemoRequest): Promise<ChartDemoApiResponse['data']> {
    const params = new URLSearchParams({
      videoId: payload.videoId,
      ts: payload.ts.toString(),
      startTradeTs: payload.startTradeTs.toString(),
      closeTs: payload.closeTs.toString(),
      limitTs: payload.limitTs.toString(),
      provideMoney: payload.provideMoney.toString(),
      objectDone: payload.objectDone.toString(),
      description: payload.description
    });
    const url = `/api/chart-demo?${params.toString()}`;
    const response = await ApiConfigService.post<ChartDemoApiResponse>(url, null);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể tạo Chart Demo');
    }
    return response.data;
  },
  /**
   * Update Chart Demo
   * PUT /api/chart-demo/by-video/{videoId}?ts=...&startTradeTs=...&closeTs=...&limitTs=...&provideMoney=...&objectDone=...&description=...
   */
  async updateChartDemo(videoId: string, payload: UpdateChartDemoRequest): Promise<ChartDemoApiResponse['data']> {
    const params = new URLSearchParams({
      ts: payload.ts.toString(),
      startTradeTs: payload.startTradeTs.toString(),
      closeTs: payload.closeTs.toString(),
      limitTs: payload.limitTs.toString(),
      provideMoney: payload.provideMoney.toString(),
      objectDone: payload.objectDone.toString(),
      description: payload.description
    });
    const url = `/api/chart-demo/by-video/${videoId}?${params.toString()}`;
    const response = await ApiConfigService.put<ChartDemoApiResponse>(url, null);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể cập nhật Chart Demo');
    }
    return response.data;
  },

  /**
   * Delete Chart Demo
   * DELETE /api/chart-demo/by-video/{videoId}
   */
  async deleteChartDemo(videoId: string): Promise<void> {
    const response = await ApiConfigService.delete<{ message: any; errors: any; data: any; success: boolean }>(`/api/chart-demo/by-video/${videoId}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Không thể xóa Chart Demo');
    }
  }
};

