import { useState, useCallback } from 'react';
import { AnswerDemoResponse } from '../types';
import { courseService } from '../services';

export const useAnswerDemoDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<AnswerDemoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (id: string): Promise<AnswerDemoResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await courseService.getAnswerDemoById(id);
      if (response?.success && response.data) {
        setDetail(response.data);
        return response.data;
      }
      return null;
    } catch (err: any) {
      const msg = err?.message || 'Không thể lấy chi tiết lệnh';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return { isLoading, detail, error, fetchDetail, clear };
};
