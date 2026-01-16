import { observable } from '@legendapp/state';
import { BlogState, BlogCategory } from './types';

const initialBlogState: BlogState = {
  posts: [],
  featuredPosts: [],
  categories: [],
  currentPost: null,
  isLoading: true,
  isCategoriesLoading: true,
  error: null,
};

export const blogState$ = observable<BlogState>(initialBlogState);

// Actions
export const blogActions = {
  setPosts: (posts: BlogState['posts']) => {
    blogState$.posts.set(posts);
  },
  
  setFeaturedPosts: (posts: BlogState['posts']) => {
    blogState$.featuredPosts.set(posts);
  },

  setCategories: (categories: BlogCategory[]) => {
    blogState$.categories.set(categories);
  },

  setCurrentPost: (post: BlogState['currentPost']) => {
    blogState$.currentPost.set(post);
  },

  setLoading: (isLoading: boolean) => {
    blogState$.isLoading.set(isLoading);
  },

  setCategoriesLoading: (isLoading: boolean) => {
    blogState$.isCategoriesLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    blogState$.error.set(error);
  },

  reset: () => {
    blogState$.set(initialBlogState);
  },
};
