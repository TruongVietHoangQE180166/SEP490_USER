'use client';

import { useEffect } from 'react';
import { homeState$, homeActions } from '../store';
import { homeService } from '../services';

export const useHomeData = () => {
  const freeCourses = homeState$.freeCourses.get();
  const featuredCourses = homeState$.featuredCourses.get();
  const isLoading = homeState$.isLoading.get();
  const error = homeState$.error.get();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    homeActions.setLoading(true);
    try {
      const allCourses = await homeService.getHomeCourses();
      
      // Filter published courses
      const published = allCourses.filter(c => c.status === 'PUBLISHED');
      
      // Free courses
      const free = published.filter(c => c.isFree || c.price === 0);
      
      // Featured courses: averageRate >= 4 or top 6 if not many high rated
      const featured = [...published]
        .sort((a, b) => (b.averageRate || 0) - (a.averageRate || 0))
        .slice(0, 10);
      
      homeActions.setFreeCourses(free);
      homeActions.setFeaturedCourses(featured);
      homeActions.setError(null);
    } catch (err: any) {
      homeActions.setError(err.message || 'Không thể tải dữ liệu trang chủ');
    } finally {
      homeActions.setLoading(false);
    }
  };

  return {
    freeCourses,
    featuredCourses,
    isLoading,
    error,
    refresh: loadData,
  };
};
