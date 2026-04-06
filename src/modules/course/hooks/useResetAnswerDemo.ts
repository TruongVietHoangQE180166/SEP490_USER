import { useState, useCallback } from 'react';
import { ResetAnswerDemoApiResponse } from '../types';
import { courseService } from '../services';

export interface UseResetAnswerDemoState {
  isResetting: boolean;
  result: ResetAnswerDemoApiResponse | null;
  error: string | null;
}

export const useResetAnswerDemo = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<ResetAnswerDemoApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(async (chartId: string): Promise<ResetAnswerDemoApiResponse | null> => {
    setIsResetting(true);
    setError(null);
    setResult(null);
    try {
      const response = await courseService.resetAnswerDemo(chartId);
      setResult(response);
      if (!response?.success) {
        setError(response?.message?.messageDetail || 'Reset thất bại.');
      }
      return response;
    } catch (err: any) {
      const msg = err?.message || 'Không thể reset mô phỏng.';
      setError(msg);
      return null;
    } finally {
      setIsResetting(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { isResetting, result, error, reset, clear };
};
