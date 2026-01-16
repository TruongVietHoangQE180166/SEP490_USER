'use client';

import { useEffect, useState } from 'react';
import { blogState$, blogActions } from '../store';
import { blogService } from '../services';
import { toast } from '@/components/ui/toast';
import { loadingActions } from '@/stores/loadingStore';

export const useBlogDetail = (slug: string) => {
  const currentPost = blogState$.currentPost.get();
  const isLoading = blogState$.isLoading.get();
  const error = blogState$.error.get();

  const [openToggle, setOpenToggle] = useState<number | null>(0);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    loadingActions.showFetchLoading('Đang tải chi tiết bài viết...');
    try {
      blogActions.setLoading(true);
      blogActions.setError(null);
      const data = await blogService.getPostBySlug(slug);
      blogActions.setCurrentPost(data);
    } catch (err: any) {
      const message = err.message || 'Không thể tải chi tiết bài viết';
      blogActions.setError(message);
      toast.error(message);
    } finally {
      blogActions.setLoading(false);
      loadingActions.hideLoading();
    }
  };

  const handleToggle = (index: number) => {
    setOpenToggle((prev) => (prev === index ? null : index));
  };

  return {
    post: currentPost,
    isLoading,
    error,
    openToggle,
    loadPost,
    handleToggle,
  };
};
