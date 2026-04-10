'use client';

import { useCallback, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { teacherStudentState$, teacherStudentActions } from '../store';
import { teacherStudentService } from '../services';
import { toast } from '@/components/ui/toast';

export const useTeacherStudent = () => {
  const students = useSelector(() => teacherStudentState$.students.get());
  const isLoading = useSelector(() => teacherStudentState$.isLoading.get());
  const error = useSelector(() => teacherStudentState$.error.get());
  const totalElements = useSelector(() => teacherStudentState$.totalElements.get());
  const currentPage = useSelector(() => teacherStudentState$.currentPage.get());
  const pageSize = useSelector(() => teacherStudentState$.pageSize.get());
  const searchQuery = useSelector(() => teacherStudentState$.searchQuery.get());
  const filterStatus = useSelector(() => teacherStudentState$.filterStatus.get());
  const selectedStudentCourses = useSelector(() => teacherStudentState$.selectedStudentCourses.get());
  const isDetailLoading = useSelector(() => teacherStudentState$.isDetailLoading.get());

  const fetchStudents = useCallback(async () => {
    teacherStudentActions.setLoading(true);
    teacherStudentActions.setError(null);
    try {
      // In a real application we would pass currentPage and pageSize, 
      // but API seems to accept size=1000 and we do frontend filtering/pagination for now
      const response = await teacherStudentService.getStudents(1, 1000);
      teacherStudentActions.setStudents(response.data.content || []);
      teacherStudentActions.setPagination({
        totalElement: response.data.totalElement || 0,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Lỗi khi tải danh sách học viên';
      teacherStudentActions.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      teacherStudentActions.setLoading(false);
    }
  }, []);

  const fetchStudentCourses = useCallback(async (userId: string) => {
    teacherStudentActions.setDetailLoading(true);
    teacherStudentActions.resetSelectedCourses();
    try {
      const response = await teacherStudentService.getStudentCourses(userId);
      teacherStudentActions.setSelectedStudentCourses(response.data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Lỗi khi tải chi tiết khóa học của học viên';
      toast.error(errorMessage);
    } finally {
      teacherStudentActions.setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    isLoading,
    isDetailLoading,
    selectedStudentCourses,
    error,
    totalElements,
    currentPage,
    pageSize,
    searchQuery,
    filterStatus,
    setFilters: teacherStudentActions.setFilters,
    setCurrentPage: teacherStudentActions.setCurrentPage,
    fetchStudentCourses,
    reload: fetchStudents,
  };
};
