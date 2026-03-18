'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { AdminCourse, CourseStatus, QuizQuestion } from '../types';
import { manageCourseService } from '../services';
import { manageCourseActions } from '../store';
import { toast } from '@/components/ui/toast';

/**
 * Hook to fetch full admin course detail by courseId and manage status updates.
 */
export const useAdminCourseDetail = (courseId: string) => {
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'section-0': true, // open first section by default
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // ── Status update dialog state ─────────────────────────────────────────────
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'PUBLISHED' | 'REJECT' | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  // ── Lesson preview dialog state ────────────────────────────────────────────
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  // ── Quiz Questions State ───────────────────────────────────────────────────
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  useEffect(() => {
    if (selectedLesson && selectedLesson.type === 'quiz' && selectedLesson.id) {
      setIsQuizLoading(true);
      manageCourseService.getQuizQuestionsByQuizId(selectedLesson.id)
        .then((data) => setQuizQuestions(data))
        .catch((err) => toast.error(err.message || 'Lỗi tải câu hỏi'))
        .finally(() => setIsQuizLoading(false));
    } else {
      setQuizQuestions([]);
    }
  }, [selectedLesson]);

  const loadDetail = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await manageCourseService.getCourseDetailById(courseId);
      setCourse(data);
    } catch (err: any) {
      const msg = err.message || 'Không thể tải chi tiết khoá học';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Derived ───────────────────────────────────────────────────────────────

  const moocs: any[] = useMemo(() => (course as any)?.moocs ?? [], [course]);

  const totalLessonsCount = useMemo(
    () =>
      moocs.reduce(
        (acc: number, m: any) =>
          acc + (m.videos?.length ?? 0) + (m.quizzes?.length ?? 0) + (m.documents?.length ?? 0),
        0
      ),
    [moocs]
  );

  const totalDurationText = useMemo(() => {
    let totalSeconds = 0;
    moocs.forEach((mooc: any) => {
      (mooc.videos ?? []).forEach((v: any) => {
        if (v.duration) {
          const parts = String(v.duration).split(':').map(Number);
          if (parts.length === 3) totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
          else if (parts.length === 2) totalSeconds += parts[0] * 60 + parts[1];
          else if (parts.length === 1 && !isNaN(parts[0])) totalSeconds += parts[0] * 60;
        }
      });
      (mooc.quizzes ?? []).forEach((q: any) => {
        if (q.timeLimit && !isNaN(Number(q.timeLimit))) totalSeconds += Number(q.timeLimit) * 60;
      });
    });

    if (totalSeconds === 0) return course?.totalDuration ?? 'Đang cập nhật';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} giờ`);
    if (minutes > 0 || hours === 0) parts.push(`${minutes} phút`);
    return parts.join(' ');
  }, [moocs, course]);

  // ── Status update flow ────────────────────────────────────────────────────

  const requestStatusChange = useCallback((newStatus: 'PUBLISHED' | 'REJECT') => {
    setPendingStatus(newStatus);
    setConfirmDialogOpen(true);
  }, []);

  const handleStatusConfirm = useCallback(async () => {
    if (!course || !pendingStatus) return;
    setIsStatusUpdating(true);
    manageCourseActions.setStatusUpdating(true);
    const toastId = toast.loading('Đang cập nhật trạng thái khoá học...');
    try {
      await manageCourseService.updateCourseStatus(course.id, pendingStatus);
      setCourse((prev) => prev ? { ...prev, status: pendingStatus as CourseStatus } : prev);
      toast.success(
        pendingStatus === 'PUBLISHED' 
          ? '✅ Khoá học đã được duyệt thành công!' 
          : '❌ Khoá học đã bị từ chối.'
      );
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setIsStatusUpdating(false);
      manageCourseActions.setStatusUpdating(false);
      setConfirmDialogOpen(false);
      setPendingStatus(null);
      toast.dismiss(toastId);
    }
  }, [course, pendingStatus]);

  const cancelStatusChange = useCallback(() => {
    setConfirmDialogOpen(false);
    setPendingStatus(null);
  }, []);

  return {
    course,
    isLoading,
    error,
    reload: loadDetail,
    // UI state
    expandedSections,
    toggleSection,
    isPlaying,
    setIsPlaying,
    // Derived
    moocs,
    totalLessonsCount,
    totalDurationText,
    // Status update flow
    confirmDialogOpen,
    pendingStatus,
    isStatusUpdating,
    requestStatusChange,
    handleStatusConfirm,
    cancelStatusChange,
    selectedLesson,
    setSelectedLesson,
    quizQuestions,
    isQuizLoading,
  };
};
