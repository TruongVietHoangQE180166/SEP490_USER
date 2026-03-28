'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TeacherCourse, QuizQuestion } from '../types';
import { teacherCourseService } from '../services';
import { toast } from '@/components/ui/toast';

export const useTeacherCourseDetail = (courseId: string) => {
  const [course, setCourse] = useState<TeacherCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  // Lesson preview dialog
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  useEffect(() => {
    if (selectedLesson && selectedLesson.type === 'quiz' && selectedLesson.id) {
      setIsQuizLoading(true);
      teacherCourseService.getQuizQuestionsByQuizId(selectedLesson.id)
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
      const resp = await teacherCourseService.getCourseDetailById(courseId);
      setCourse(resp);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải chi tiết khoá học');
      toast.error(err.message || 'Lỗi tải chi tiết khoá học');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const moocs = useMemo(() => {
    if (!course || !course.moocs) return [];
    return [...course.moocs].sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [course?.moocs]);

  const totalLessonsCount = useMemo(() => {
    if (!moocs) return 0;
    return moocs.reduce((acc, curr) => {
      const v = curr.videos?.length || 0;
      const q = curr.quizzes?.length || 0;
      const d = curr.documents?.length || 0;
      return acc + v + q + d;
    }, 0);
  }, [moocs]);

  const totalDurationText = useMemo(() => {
    if (!course || !course.totalDuration) return '0 Giờ';
    return course.totalDuration;
  }, [course?.totalDuration]);

  return {
    course,
    isLoading,
    error,
    reload: loadDetail,
    expandedSections,
    toggleSection,
    isPlaying,
    setIsPlaying,
    moocs,
    totalLessonsCount,
    totalDurationText,
    selectedLesson,
    setSelectedLesson,
    quizQuestions,
    isQuizLoading,
  };
};
