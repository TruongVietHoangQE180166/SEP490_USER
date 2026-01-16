'use client';

import { useEffect, useState } from 'react';
import { blogState$, blogActions } from '../store';
import { blogService } from '../services';
import { toast } from '@/components/ui/toast';

export const useBlog = () => {
  const posts = blogState$.posts.get();
  const isLoading = blogState$.isLoading.get();
  const error = blogState$.error.get();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      blogActions.setLoading(true);
      blogActions.setError(null);
      const data = await blogService.getAllPosts(1, 1000, 'createdDate', 'desc');
      blogActions.setPosts(data || []);
    } catch (err: any) {
      const message = err.message || 'Không thể tải bài viết';
      blogActions.setError(message);
      toast.error(message);
    } finally {
      blogActions.setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      blogActions.setLoading(true);
      blogActions.setError(null);
      
      if (query.trim()) {
        const data = await blogService.searchPosts(query);
        blogActions.setPosts(data);
      } else if (!selectedCategory) {
        await loadPosts();
      } else {
        const data = await blogService.getPostsByCategory(selectedCategory);
        blogActions.setPosts(data);
      }
    } catch (err: any) {
      const message = err.message || 'Lỗi khi tìm kiếm bài viết';
      blogActions.setError(message);
      toast.error(message);
    } finally {
      blogActions.setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setSearchQuery('');
    try {
      blogActions.setLoading(true);
      blogActions.setError(null);

      if (categoryName) {
        const data = await blogService.getPostsByCategory(categoryName);
        blogActions.setPosts(data);
      } else {
        await loadPosts();
      }
    } catch (err: any) {
      const message = err.message || 'Lỗi khi lọc bài viết';
      blogActions.setError(message);
      toast.error(message);
    } finally {
      blogActions.setLoading(false);
    }
  };

  const refresh = async () => {
    setSearchQuery('');
    setSelectedCategory(null);
    await loadPosts();
  };

  return {
    posts,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    loadPosts,
    handleSearch,
    handleCategoryFilter,
    refresh,
  };
};
