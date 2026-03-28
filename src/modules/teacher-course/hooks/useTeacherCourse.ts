'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import { teacherCourseState$, teacherCourseActions } from '../store';
import { teacherCourseService } from '../services';
import { toast } from '@/components/ui/toast';
import { TeacherCourse } from '../types';

export const useTeacherCourse = () => {
  const allCourses = useSelector(teacherCourseState$.courses) as TeacherCourse[];
  const isLoading = useSelector(teacherCourseState$.isLoading) as boolean;
  const filterStatus = useSelector(teacherCourseState$.filterStatus) as string;
  const searchQuery = useSelector(teacherCourseState$.searchQuery) as string;
  const currentPage = useSelector(teacherCourseState$.currentPage) as number;
  const pageSize = useSelector(teacherCourseState$.pageSize) as number;
  const totalElements = useSelector(teacherCourseState$.totalElements) as number;
  const totalPages = useSelector(teacherCourseState$.totalPages) as number;
  const isDeleting = useSelector(teacherCourseState$.isDeleting) as boolean;

  const loadCourses = useCallback(async () => {
    teacherCourseActions.setLoading(true);
    teacherCourseActions.setError(null);
    try {
      // Just fetching all for simplicity like ManageCourse
      const resp = await teacherCourseService.getCourses(
        1,
        1000,
        'createdDate',
        'desc'
      );
      if (resp.data) {
        teacherCourseActions.setCourses(resp.data.content || []);
      }
    } catch (err: any) {
      teacherCourseActions.setError(err.message || 'Lỗi tải danh sách khoá học');
      teacherCourseActions.setCourses([]);
      toast.error(err.message || 'Lỗi tải danh sách khoá học');
    } finally {
      teacherCourseActions.setLoading(false);
    }
  }, []);

  const setFilterStatus = (status: string) => {
    teacherCourseActions.setFilters({ status });
  };

  const setSearchQuery = (query: string) => {
    teacherCourseActions.setFilters({ query });
  };

  const filteredCourses = useMemo(() => {
    let result = [...allCourses];

    if (filterStatus && filterStatus !== 'ALL') {
      result = result.filter(course => course.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allCourses, searchQuery, filterStatus]);

  // Handle local pagination
  const displayCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, currentPage, pageSize]);

  const totalCalculatedPages = Math.ceil(filteredCourses.length / pageSize);

  useEffect(() => {
    teacherCourseActions.setPagination({ totalElement: filteredCourses.length, totalPages: totalCalculatedPages });
  }, [filteredCourses.length, totalCalculatedPages]);

  const openAddModal = () => {
    teacherCourseActions.setSelectedCourse(null);
    teacherCourseActions.openModal('create');
  };

  const openEditModal = (course: TeacherCourse) => {
    teacherCourseActions.setSelectedCourse(course);
    teacherCourseActions.openModal('edit', course);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá khoá học này?')) return;
    teacherCourseActions.setDeleting(true);
    try {
      await teacherCourseService.deleteCourse(id);
      toast.success('Xoá khoá học thành công');
      teacherCourseActions.removeCourseFromList(id);
    } catch (err: any) {
      toast.error(err.message || 'Không thể xoá khoá học');
    } finally {
      teacherCourseActions.setDeleting(false);
    }
  };

  return {
    courses: allCourses,
    displayCourses,
    filteredCourses,
    isLoading,
    filterStatus,
    searchQuery,
    currentPage,
    pageSize,
    totalElements,
    totalPages: totalCalculatedPages,
    isDeleting,
    loadCourses,
    setFilterStatus,
    setSearchQuery,
    openAddModal,
    openEditModal,
    handleDeleteCourse,
    setCurrentPage: teacherCourseActions.setCurrentPage,
  };
};
