import { useState, useCallback, useEffect } from 'react';
import { AnswerDemoByChartItem } from '../types';
import { courseService } from '../services';

export const useAnswerDemoByChart = (chartId: string | undefined) => {
  const [items, setItems] = useState<AnswerDemoByChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!chartId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getAnswerDemoByChart(chartId);
      setItems(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải lịch sử giao dịch.');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [chartId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, isLoading, error, refetch: fetchItems };
};
