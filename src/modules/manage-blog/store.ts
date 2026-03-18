import { observable } from '@legendapp/state';
import { BlogPost, BlogCategory } from '../blog/types';
import { BlogManagementState } from './types';

const initialBlogState: BlogManagementState = {
  blogs: [],
  isLoading: false,
  isUploading: false,
  error: null,
  selectedBlog: null,
  isModalOpen: false,
  modalMode: 'view',
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  filterCategory: 'ALL',
  searchQuery: '',
  categories: [],
  isCategoriesLoading: false,
};

export const blogState$ = observable<BlogManagementState>(initialBlogState);

export const blogActions = {
  setBlogs: (blogs: BlogPost[]) => {
    blogState$.blogs.set(blogs);
  },
  setPagination: (data: { totalElement: number, totalPages?: number, page?: number }) => {
    blogState$.totalElements.set(data.totalElement);
    if (data.totalPages) blogState$.totalPages.set(data.totalPages);
    if (data.page) blogState$.currentPage.set(data.page);
  },
  setCurrentPage: (page: number) => {
    blogState$.currentPage.set(page);
  },
  setFilters: (filters: { category?: string, query?: string }) => {
    if (filters.category !== undefined) blogState$.filterCategory.set(filters.category);
    if (filters.query !== undefined) blogState$.searchQuery.set(filters.query);
    blogState$.currentPage.set(1); // Reset to first page on filter change
  },
  setLoading: (isLoading: boolean) => {
    blogState$.isLoading.set(isLoading);
  },
  setUploading: (isUploading: boolean) => {
    blogState$.isUploading.set(isUploading);
  },
  setError: (error: string | null) => {
    blogState$.error.set(error);
  },
  setSelectedBlog: (blog: BlogPost | null) => {
    blogState$.selectedBlog.set(blog);
  },
  openModal: (mode: 'create' | 'edit' | 'view', blog: BlogPost | null = null) => {
    blogState$.modalMode.set(mode);
    blogState$.selectedBlog.set(blog);
    blogState$.isModalOpen.set(true);
  },
  closeModal: () => {
    blogState$.isModalOpen.set(false);
    blogState$.selectedBlog.set(null);
  },
  setCategories: (categories: BlogCategory[]) => {
    blogState$.categories.set(categories);
  },
  setCategoriesLoading: (isLoading: boolean) => {
    blogState$.isCategoriesLoading.set(isLoading);
  },
  updateBlogInList: (blogId: string, updates: Partial<BlogPost>) => {
    const blogs = blogState$.blogs.get();
    const index = blogs.findIndex(b => b.id === blogId);
    if (index !== -1) {
      blogState$.blogs[index].assign(updates);
    }
  },
  reset: () => {
    blogState$.set(initialBlogState);
  }
};
