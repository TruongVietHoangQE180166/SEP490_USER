import { useEffect, useCallback } from 'react';
import { myCourseState$, myCourseActions } from '../store';
import { myCourseService } from '../services';

export const useMyCourse = () => {
  const enrolledCourses = myCourseState$.enrolledCourses.get();
  const isLoading = myCourseState$.isLoading.get();
  const error = myCourseState$.error.get();

  const fetchMyCourses = useCallback(async () => {
    myCourseActions.setLoading(true);
    try {
      const courses = await myCourseService.getMyCourses();
      myCourseActions.setEnrolledCourses(courses);
    } catch (err: any) {
      myCourseActions.setError(err.message || 'Không thể tải danh sách khóa học của bạn');
    } finally {
      myCourseActions.setLoading(false);
    }
  }, []);

  const fetchCourseRating = useCallback(async (courseId: string) => {
    try {
      const rating = await myCourseService.getCourseRating(courseId);
      myCourseActions.setUserRating(courseId, rating);
      return rating;
    } catch (err) {
      console.error('Failed to fetch rating:', err);
      return null;
    }
  }, []);

  return {
    enrolledCourses,
    isLoading,
    error,
    refresh: fetchMyCourses,
    userRatings: myCourseState$.userRatings.get(),
    fetchCourseRating
  };
};
