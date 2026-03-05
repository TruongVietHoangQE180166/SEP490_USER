'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import { AdminCourse, ManageCourseState } from '../types';
import { manageCourseState$, manageCourseActions } from '../store';
import { manageCourseService } from '../services';
import { toast } from '@/components/ui/toast';

export const useManageCourse = () => {
  // ── Observable selectors ──────────────────────────────────────────────────
  const allCourses = useSelector(manageCourseState$.courses) as AdminCourse[];
  const isLoading = useSelector(manageCourseState$.isLoading) as boolean;
  const isModalOpen = useSelector(manageCourseState$.isModalOpen) as boolean;
  const modalMode = useSelector(manageCourseState$.modalMode) as 'create' | 'edit' | 'view';
  const selectedCourse = useSelector(manageCourseState$.selectedCourse) as AdminCourse | null;
  const filterStatus = useSelector(manageCourseState$.filterStatus) as string;
  const currentPage = useSelector(manageCourseState$.currentPage) as number;
  const pageSize = useSelector(manageCourseState$.pageSize) as number;

  // ── Local UI state ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState<{
    id: string;
    currentStatus: string;
    title: string;
  } | null>(null);

  // ── Smooth fake loading for filter UX ─────────────────────────────────────
  const triggerFakeLoading = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 500);
  }, []);

  // ── Fetch all courses once and cache client-side ──────────────────────────
  const fetchCourses = useCallback(async () => {
    manageCourseActions.setLoading(true);
    try {
      const response = await manageCourseService.getCourses(1, 1000, 'createdDate', 'desc');
      manageCourseActions.setCourses(response.data.content);
      manageCourseActions.setError(null);
    } catch (err: any) {
      manageCourseActions.setError(err.message);
      toast.error(err.message || 'Không thể tải danh sách khoá học');
    } finally {
      manageCourseActions.setLoading(false);
    }
  }, []);

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filteredCourses = useMemo(() => {
    if (!allCourses) return [];

    return allCourses.filter((course) => {
      // Status filter
      if (filterStatus !== 'ALL' && course.status !== filterStatus) return false;

      // Search by title / description / author name
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.description?.toLowerCase().includes(q) ||
          course.author?.name?.toLowerCase().includes(q) ||
          course.categoryName?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [allCourses, filterStatus, searchQuery]);

  // ── Client-side pagination ────────────────────────────────────────────────
  const totalElements = filteredCourses.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const displayCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, currentPage, pageSize]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    triggerFakeLoading();
    manageCourseActions.setCurrentPage(page);
  };

  const handleFilterChange = (filters: { status?: string }) => {
    triggerFakeLoading();
    manageCourseActions.setFilters(filters);
    manageCourseActions.setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    triggerFakeLoading();
    setSearchQuery(query);
    manageCourseActions.setCurrentPage(1);
  };

  // ── Create / Edit save ────────────────────────────────────────────────────
  const handleSave = async (data: Partial<AdminCourse>) => {
    setIsSubmitting(true);
    const label = modalMode === 'create' ? 'Đang tạo khoá học...' : 'Đang cập nhật...';
    const toastId = toast.loading(label);
    try {
      if (modalMode === 'create') {
        await manageCourseService.createCourse(data);
        toast.success('Khoá học mới đã được tạo thành công!');
      } else if (modalMode === 'edit' && selectedCourse) {
        await manageCourseService.updateCourse(selectedCourse.id, data);
        toast.success('Khoá học đã được cập nhật!');
      }
      manageCourseActions.closeModal();
      await fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteCourse = (id: string) => {
    setCourseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    const toastId = toast.loading('Đang xoá khoá học...');
    try {
      await manageCourseService.deleteCourse(courseToDelete);
      toast.success('Đã xoá khoá học khỏi hệ thống');
      manageCourseActions.removeCourseFromList(courseToDelete);
    } catch (err: any) {
      toast.error(err.message || 'Không thể thực hiện yêu cầu');
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      toast.dismiss(toastId);
    }
  };

  // ── Status toggle ─────────────────────────────────────────────────────────
  const toggleCourseStatus = (id: string, currentStatus: string, title: string) => {
    setCourseToToggle({ id, currentStatus, title });
    setIsStatusDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!courseToToggle) return;
    // PUBLISHED → REJECT, anything else (DRAFT/REJECT) → PUBLISHED
    const newStatus = courseToToggle.currentStatus === 'PUBLISHED' ? 'REJECT' : 'PUBLISHED';
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    try {
      await manageCourseService.updateCourseStatus(courseToToggle.id, newStatus);
      toast.success(
        newStatus === 'PUBLISHED'
          ? 'Khoá học đã được duyệt thành công'
          : 'Khoá học đã bị từ chối'
      );
      manageCourseActions.updateCourseInList(courseToToggle.id, {
        status: newStatus as any,
      });
      await fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setIsStatusDialogOpen(false);
      setCourseToToggle(null);
      toast.dismiss(toastId);
    }
  };

  return {
    // Data
    courses: displayCourses,
    allCourses,
    isLoading: isLoading || isProcessing,
    isModalOpen,
    modalMode,
    selectedCourse,
    currentPage,
    totalPages,
    totalElements,
    filterStatus,
    searchQuery,
    isSubmitting,
    // Delete
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    courseToDelete,
    // Status toggle
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    courseToToggle,
    // Actions
    fetchCourses,
    handleSave,
    deleteCourse,
    handleDeleteConfirm,
    toggleCourseStatus,
    handleStatusConfirm,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    openModal: manageCourseActions.openModal,
    closeModal: manageCourseActions.closeModal,
  };
};
