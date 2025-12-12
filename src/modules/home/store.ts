import { observable } from '@legendapp/state';
import { HomeState, Post } from './types';

const initialHomeState: HomeState = {
  posts: [],
  stats: null,
  isLoading: false,
};

export const homeState$ = observable<HomeState>(initialHomeState);

// Actions
export const homeActions = {
  setPosts: (posts: Post[]) => {
    homeState$.posts.set(posts);
  },

  setStats: (stats: HomeState['stats']) => {
    homeState$.stats.set(stats);
  },

  setLoading: (isLoading: boolean) => {
    homeState$.isLoading.set(isLoading);
  },

  likePost: (postId: string) => {
    const posts = homeState$.posts.peek();
    const postIndex = posts.findIndex((p) => p.id === postId);
    
    if (postIndex !== -1) {
      homeState$.posts[postIndex].likes.set(posts[postIndex].likes + 1);
    }
  },

  reset: () => {
    homeState$.set(initialHomeState);
  },
};
