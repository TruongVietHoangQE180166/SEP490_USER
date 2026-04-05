import { useState, useCallback, useEffect } from 'react';
import { ChartDemoData } from '../types';
import { courseService } from '../services';

export const useStudentChartDemo = (videoId: string | undefined) => {
  const [chartDemo, setChartDemo] = useState<ChartDemoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChartDemo = useCallback(async () => {
    if (!videoId) return;
    setIsLoading(true);
    try {
      const data = await courseService.getChartDemoByVideo(videoId);
      setChartDemo(data);
    } catch (err) {
      setChartDemo(null);
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchChartDemo();
  }, [fetchChartDemo]);

  return { chartDemo, isLoading };
};
