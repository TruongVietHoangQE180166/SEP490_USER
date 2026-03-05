import { courseService } from '../course/services';
import { Course } from '../course/types';

export const homeService = {
  async getHomeCourses(): Promise<Course[]> {
    return await courseService.getAllCourses();
  },
};