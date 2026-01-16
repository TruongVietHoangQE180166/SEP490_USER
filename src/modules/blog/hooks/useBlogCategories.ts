'use client';

import { useEffect } from 'react';
import { blogState$, blogActions } from '../store';
import { blogService } from '../services';
import { toast } from '@/components/ui/toast';
import { loadingActions } from '@/stores/loadingStore';

export const useBlogCategories = () => {
  const categories = blogState$.categories.get();
  const isLoading = blogState$.isCategoriesLoading.get();
  const error = blogState$.error.get();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    loadingActions.showFetchLoading('Đang tải danh mục...');
    try {
      blogActions.setCategoriesLoading(true);
      blogActions.setError(null);
      const data = await blogService.getBlogCategories();
      blogActions.setCategories(data);
    } catch (err: any) {
      const message = err.message || 'Không thể tải danh mục bài viết';
      blogActions.setError(message);
      toast.error(message);
    } finally {
      blogActions.setCategoriesLoading(false);
      loadingActions.hideLoading();
    }
  };

  return {
    categories,
    isLoading,
    error,
    loadCategories,
  };
};
