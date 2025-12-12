'use client';

import { useEffect } from 'react';
import { homeState$, homeActions } from '../store';
import { homeService } from '../services';
import { loadingActions } from '@/stores/loadingStore';

export const useHomeData = () => {
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    loadingActions.showFetchLoading('Đang tải bài viết...');
    try {
      const [postsData, statsData] = await Promise.all([
        homeService.getPosts(),
        homeService.getStats(),
      ]);
      homeActions.setPosts(postsData);
      homeActions.setStats(statsData);
    } finally {
      loadingActions.hideLoading();
    }
  };

  const likePost = async (postId: string) => {
    loadingActions.showUpdateLoading('Đang cập nhật...');
    try {
      await homeService.likePost(postId);
      homeActions.likePost(postId);
    } finally {
      loadingActions.hideLoading();
    }
  };

  return {
    posts: homeState$.posts.get(),
    stats: homeState$.stats.get(),
    isLoading: homeState$.isLoading.get(),
    likePost,
    refresh: loadData,
  };
};
