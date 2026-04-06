import { ApiConfigService } from '@/services/apiConfig';
import { TeacherStudentApiResponse } from './types';

export const teacherStudentService = {
  /**
   * Fetch all students for the teacher dashboard
   */
  async getStudents(
    page = 1,
    size = 1000,
    field = 'createdDate',
    direction = 'desc'
  ): Promise<TeacherStudentApiResponse> {
    const url = `/api/dashboard/teacher/students?page=${page}&size=${size}&field=${field}&direction=${direction}`;
    const response = await ApiConfigService.get<TeacherStudentApiResponse>(url);
    
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Không thể tải danh sách học viên');
    }
    
    return response;
  }
};
