import { useState, useCallback, useEffect } from 'react';
import { ChartDemoData, UpdateChartDemoRequest } from '../types';
import { teacherCourseService } from '../services';
import { toast } from '@/components/ui/toast';

export const useChartDemo = (videoId: string | undefined) => {
  const [chartDemo, setChartDemo] = useState<ChartDemoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchChartDemo = useCallback(async () => {
    if (!videoId || videoId.startsWith('temp-')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await teacherCourseService.getChartDemoByVideo(videoId);
      setChartDemo(data);
    } catch (err: any) {
      console.error('Lỗi lấy dữ liệu Chart Demo', err);
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  const createChartDemo = useCallback(async (payload: any) => {
    if (!videoId) return;
    setIsCreating(true);
    try {
      await teacherCourseService.createChartDemo({ ...payload, videoId });
      toast.success('Khởi tạo Chart Demo thành công');
      await fetchChartDemo();
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khởi tạo Chart Demo');
    } finally {
      setIsCreating(false);
    }
  }, [videoId, fetchChartDemo]);

  const updateChartDemo = useCallback(async (payload: UpdateChartDemoRequest) => {
    if (!videoId) return;
    setIsUpdating(true);
    try {
      await teacherCourseService.updateChartDemo(videoId, payload);
      toast.success('Cập nhật Chart Demo thành công');
      await fetchChartDemo();
    } catch (err: any) {
      toast.error(err.message || 'Lỗi cập nhật Chart Demo');
    } finally {
      setIsUpdating(false);
    }
  }, [videoId, fetchChartDemo]);

  const deleteChartDemo = useCallback(async () => {
    if (!videoId) return;
    setIsDeleting(true);
    try {
      await teacherCourseService.deleteChartDemo(videoId);
      toast.success('Đã xóa Chart Demo thành công');
      setChartDemo(null);
    } catch (err: any) {
      toast.error(err.message || 'Lỗi xóa Chart Demo');
    } finally {
      setIsDeleting(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchChartDemo();
  }, [fetchChartDemo]);

  return {
    chartDemo,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createChartDemo,
    updateChartDemo,
    deleteChartDemo,
    reload: fetchChartDemo
  };
};
