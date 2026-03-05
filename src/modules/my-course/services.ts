import { ApiConfigService } from '@/services/apiConfig';
import { CourseApiResponse, CoursePaginationResponse } from '../course/types';
import { EnrolledCourse } from './types';

export const myCourseService = {
  async getMyCourses(page = 1, size = 1000): Promise<EnrolledCourse[]> {
    const response = await ApiConfigService.get<CourseApiResponse<CoursePaginationResponse>>(
      `/api/course?page=${page}&size=${size}`
    );

    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch enrolled courses');
    }

    // Filter to only get courses that the user has enrolled in
    return (response.data.content || [])
      .filter(course => course.isEnrolled)
      .map(course => ({
        ...course,
        thumbnail: course.thumbnailUrl,
        progress: course.progress || 0,
      } as EnrolledCourse));
  }
};
