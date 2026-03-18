import { useState, useEffect } from 'react';
import { courseService } from '../services';
import { Rating } from '../types';

export const useCourseRatings = (courseId: string | undefined) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchRatings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await courseService.getRatings(courseId);
        setRatings(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải đánh giá');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [courseId]);

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
    percent: ratings.length > 0
      ? Math.round((ratings.filter(r => r.rating === star).length / ratings.length) * 100)
      : 0
  }));

  return {
    ratings,
    isLoading,
    error,
    averageRating,
    ratingDistribution,
    totalRatings: ratings.length
  };
};
