import { useState, useCallback } from 'react';
import { AnswerDemoRequest, AnswerDemoApiResponse } from '../types';
import { courseService } from '../services';

export const useCreateAnswerDemo = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [result, setResult] = useState<AnswerDemoApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = useCallback(async (payload: AnswerDemoRequest): Promise<AnswerDemoApiResponse | null> => {
    setIsPlacingOrder(true);
    setError(null);
    setResult(null);
    try {
      const response = await courseService.createAnswerDemo(payload);
      setResult(response);
      return response;
    } catch (err: any) {
      const msg = err?.message || 'Không thể đặt lệnh.';
      setError(msg);
      return { success: false, message: { messageCode: '', messageDetail: msg }, errors: null, data: null as any };
    } finally {
      setIsPlacingOrder(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { isPlacingOrder, result, error, placeOrder, clear };
};
