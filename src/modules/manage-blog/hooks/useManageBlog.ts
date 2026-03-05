'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import { BlogPost, BlogCategory } from '../../blog/types';
import { blogState$, blogActions } from '../store';
import { blogService } from '../services';
import { toast } from '@/components/ui/toast';

export const useManageBlog = () => {
  const allBlogs = useSelector(blogState$.blogs) as BlogPost[] | undefined;
  const categories = useSelector(blogState$.categories) as BlogCategory[];
  const isLoading = useSelector(blogState$.isLoading) as boolean;
  const isUploading = useSelector(blogState$.isUploading) as boolean;
  const isModalOpen = useSelector(blogState$.isModalOpen) as boolean;
  const modalMode = useSelector(blogState$.modalMode) as 'create' | 'edit' | 'view';
  const selectedBlog = useSelector(blogState$.selectedBlog) as BlogPost | null;

  const filterCategory = useSelector(blogState$.filterCategory) as string;
  const currentPage = useSelector(blogState$.currentPage) as number;
  const pageSize = useSelector(blogState$.pageSize) as number;

  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [blogToToggleStatus, setBlogToToggleStatus] = useState<{
    id: string;
    slugName: string;
    currentStatus: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerFakeLoading = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 600);
  }, []);

  // ─── Fetch blogs ────────────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    blogActions.setLoading(true);
    try {
      const response = await blogService.getBlogs(1, 1000, 'createdDate', 'desc');
      blogActions.setBlogs(response.data.content);
      blogActions.setError(null);
    } catch (err: any) {
      blogActions.setError(err.message);
      toast.error(err.message || 'Không thể tải danh sách bài viết');
    } finally {
      blogActions.setLoading(false);
    }
  }, []);

  // ─── Fetch categories ───────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    blogActions.setCategoriesLoading(true);
    try {
      const response = await blogService.getCategories();
      blogActions.setCategories(response.data);
    } catch (err: any) {
      toast.error('Không thể tải danh mục bài viết');
    } finally {
      blogActions.setCategoriesLoading(false);
    }
  }, []);

  // ─── Filtered / paginated blogs ─────────────────────────────────────────────
  const filteredBlogs = useMemo(() => {
    if (!allBlogs) return [];
    return allBlogs.filter((blog) => {
      if (filterCategory !== 'ALL' && blog.categoryName !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          blog.title.toLowerCase().includes(q) ||
          blog.content.toLowerCase().includes(q) ||
          blog.fullname.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allBlogs, filterCategory, searchQuery]);

  const totalElements = filteredBlogs.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const displayBlogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(start, start + pageSize);
  }, [filteredBlogs, currentPage, pageSize]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    triggerFakeLoading();
    blogActions.setCurrentPage(page);
  };

  const handleFilterChange = (filters: { category?: string }) => {
    triggerFakeLoading();
    blogActions.setFilters(filters);
  };

  const handleSearchChange = (query: string) => {
    triggerFakeLoading();
    setSearchQuery(query);
    blogActions.setCurrentPage(1);
  };

  // ─── Save (create / edit) ───────────────────────────────────────────────────
  /**
   * Flow:
   * 1. If a new image File is provided → uploadImage() → get Cloudinary URL.
   * 2. Build JSON payload.
   * 3. Call createBlog() or updateBlog().
   *
   * FormData fields expected:
   *   title, content, categoryId, view (string), image? (File)
   */
  const handleSave = async (formData: FormData) => {
    setIsSubmitting(true);

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const view = formData.get('view') === 'true';
    const imageFile = formData.get('image') as File | null;

    // Resolve userId from localStorage
    const userId =
      typeof window !== 'undefined'
        ? (localStorage.getItem('userId') ?? '')
        : '';

    const toastId = toast.loading(
      modalMode === 'create' ? 'Đang tạo bài viết...' : 'Đang cập nhật...'
    );

    try {
      // Step 1 — Upload image (if a new file was chosen)
      let imageUrl: string | undefined;
      if (imageFile && imageFile.size > 0) {
        blogActions.setUploading(true);
        toast.loading('Đang tải ảnh lên...', { id: toastId });
        imageUrl = await blogService.uploadImage(imageFile);
        blogActions.setUploading(false);
      }

      // Step 2 — Create or update
      if (modalMode === 'create') {
        if (!imageUrl) {
          throw new Error('Vui lòng chọn ảnh bìa cho bài viết.');
        }
        await blogService.createBlog({ title, content, image: imageUrl, view, userId, categoryId });
        toast.success('Thành công! Bài viết mới đã được thêm.', { id: toastId });
      } else if (modalMode === 'edit' && selectedBlog) {
        // PUT /api/blogs/blog-id/{id}: chỉ có title, content, image, categoryId
        // image: dùng URL mới nếu vừa upload, fallback về URL cũ nếu không thay ảnh
        const updatePayload = {
          title,
          content,
          categoryId,
          image: imageUrl ?? selectedBlog.image,
        };
        await blogService.updateBlog(selectedBlog.id, updatePayload);
        toast.success('Thành công! Bài viết đã được cập nhật.', { id: toastId });
      }

      blogActions.closeModal();
      await fetchBlogs();
    } catch (err: any) {
      blogActions.setUploading(false);
      toast.error(err.message || 'Có lỗi xảy ra khi lưu bài viết', { id: toastId });
    } finally {
      setIsSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    const toastId = toast.loading('Đang xóa bài viết...');
    try {
      await blogService.deleteBlog(blogToDelete);
      toast.success('Đã xóa bài viết khỏi hệ thống');
      await fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || 'Không thể thực hiện yêu cầu');
    } finally {
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
      toast.dismiss(toastId);
    }
  };

  const deleteBlog = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Toggle status: cần slugName để gọi PUT /api/blogs/show/{slugName}
  const toggleBlogStatus = (id: string, slugName: string, currentStatus: boolean) => {
    setBlogToToggleStatus({ id, slugName, currentStatus });
    setIsStatusDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!blogToToggleStatus) return;
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    try {
      const newStatus = !blogToToggleStatus.currentStatus;
      await blogService.toggleBlogVisibility(blogToToggleStatus.slugName, newStatus);
      toast.success(
        newStatus ? 'Bài viết đã được hiển thị công khai' : 'Bài viết đã được tạm ẩn'
      );
      blogActions.updateBlogInList(blogToToggleStatus.id, { view: newStatus });
      await fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setIsStatusDialogOpen(false);
      setBlogToToggleStatus(null);
      toast.dismiss(toastId);
    }
  };

  return {
    blogs: displayBlogs,
    categories,
    isLoading: isLoading || isProcessing,
    isUploading,
    isModalOpen,
    modalMode,
    selectedBlog,
    currentPage,
    totalPages,
    totalElements,
    filterCategory,
    searchQuery,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    blogToToggleStatus,
    isSubmitting,
    fetchBlogs,
    fetchCategories,
    handleSave,
    handleDeleteConfirm,
    deleteBlog,
    toggleBlogStatus,
    handleStatusConfirm,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    openModal: blogActions.openModal,
    closeModal: blogActions.closeModal,
  };
};
