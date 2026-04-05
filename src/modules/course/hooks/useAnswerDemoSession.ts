import { useState, useCallback, useEffect } from 'react';
import { AnswerDemoSession } from '../types';
import { courseService } from '../services';

export const useAnswerDemoSession = (chartId: string | undefined) => {
  const [session, setSession] = useState<AnswerDemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!chartId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getAnswerDemoSession(chartId);
      setSession(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải lịch sử giao dịch.');
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [chartId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { session, isLoading, error, refetch: fetchSession };
};
