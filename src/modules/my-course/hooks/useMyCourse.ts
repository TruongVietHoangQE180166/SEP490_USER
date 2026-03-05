import { useEffect } from 'react';
import { myCourseState$, myCourseActions } from '../store';
import { myCourseService } from '../services';

export const useMyCourse = () => {
  const enrolledCourses = myCourseState$.enrolledCourses.get();
  const isLoading = myCourseState$.isLoading.get();
  const error = myCourseState$.error.get();

  const fetchMyCourses = async () => {
    myCourseActions.setLoading(true);
    try {
      const courses = await myCourseService.getMyCourses();
      myCourseActions.setEnrolledCourses(courses);
    } catch (err: any) {
      myCourseActions.setError(err.message || 'Không thể tải danh sách khóa học của bạn');
    } finally {
      myCourseActions.setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return {
    enrolledCourses,
    isLoading,
    error,
    refresh: fetchMyCourses
  };
};
