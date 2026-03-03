import { useState } from 'react';
import { courseService } from '../services';
import { courseActions } from '../store';
import { TrackingType } from '../types';
import { toast } from '@/components/ui/toast';

export const useCourseTracking = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const markAsCompleted = async (id: string, type: TrackingType) => {
    setIsUpdating(true);
    try {
      await courseService.trackProgress(id, type, true);
      
      // Update local store
      courseActions.markLessonCompleted(id);
      
      // toast.success('Đã hoàn thành bài học!');
      return true;
    } catch (error: any) {
      console.error('Failed to mark as completed:', error);
      toast.error(error.message || 'Không thể lưu tiến trình');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    markAsCompleted,
    isUpdating
  };
};
