import { useEffect, useState, useMemo } from 'react';
import { courseService } from '../services';
import { Course } from '../types';
import { toast } from '@/components/ui/toast';
import { useCourses } from './useCourse';

/**
 * Hook to fetch course details by slug name.
 * This is isolated from the global course store to ensure 
 * data consistency for the specific course being viewed.
 */
export const useCourseDetail = (slugName: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [deadline] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ['section-0']: true // Open first section by default
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // Global courses for "Related Courses"
  const { courses: allCourses, isLoading: isRelatedCoursesLoading } = useCourses();

  useEffect(() => {
    if (slugName) {
      loadCourseDetail();
    }
  }, [slugName]);

  const loadCourseDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await courseService.getCourseBySlugName(slugName);
      if (data && data.status === 'PUBLISHED') {
        setCourse(data);
        
        // Populate completed lessons from API response data
        const completedIds: string[] = [];
        data.moocs?.forEach(mooc => {
          mooc.videos?.forEach(v => { if (v.isCompleted) completedIds.push(v.id); });
          mooc.quizzes?.forEach(q => { if (q.isCompleted && q.id) completedIds.push(q.id); });
          mooc.documents?.forEach(d => { if (d.isCompleted) completedIds.push(d.id); });
        });
        
        // Update global store for consistency
        const { courseActions } = await import('../store');
        courseActions.setCompletedLessons(completedIds);
      } else {
        setError('Khóa học này chưa được công khai hoặc không tồn tại');
      }
    } catch (err: any) {
      const message = err.message || 'Không thể tải chi tiết khóa học';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Derived Calculations
  const totalLessonsCount = useMemo(() => {
    return (course?.moocs ?? []).reduce((acc, mooc) => {
      return acc + (mooc.videos?.length || 0) + (mooc.quizzes?.length || 0) + (mooc.documents?.length || 0);
    }, 0);
  }, [course]);

  const studentCount = useMemo(() => {
    if (course?.countEnrolledStudents != null) return course.countEnrolledStudents;
    return course?.totalStudents ?? 'Chưa có';
  }, [course?.countEnrolledStudents, course?.totalStudents]);


  const totalDurationText = useMemo(() => {
    let totalSeconds = 0;
    (course?.moocs ?? []).forEach(mooc => {
      // Add Video durations
      (mooc.videos || []).forEach(video => {
        if (video.duration) {
          const parts = String(video.duration).split(':').map(Number);
          if (parts.length === 3) { // hh:mm:ss
            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
          } else if (parts.length === 2) { // mm:ss
            totalSeconds += parts[0] * 60 + parts[1];
          } else if (parts.length === 1 && !isNaN(parts[0])) { // minutes as plain number
            totalSeconds += parts[0] * 60;
          }
        }
      });
      // Add Quiz time limits
      (mooc.quizzes || []).forEach(quiz => {
        if (quiz.timeLimit && !isNaN(Number(quiz.timeLimit))) {
          totalSeconds += Number(quiz.timeLimit) * 60;
        }
      });
    });

    if (totalSeconds === 0) return 'Đang cập nhật';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours} giờ`);
    if (minutes > 0 || hours === 0) parts.push(`${minutes} phút`);

    return parts.join(' ');
  }, [course?.moocs]);

  const discountPercent = useMemo(() => {
    if (!course) return 0;
    return course.discountPercent || (course.price > course.salePrice 
      ? Math.round(((course.price - course.salePrice) / course.price) * 100)
      : 0);
  }, [course]);

  const relatedCourses = useMemo(() => {
    if (!course) return [];
    return allCourses.filter(c => c.id !== course.id);
  }, [allCourses, course]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return {
    course,
    isLoading,
    error,
    refresh: loadCourseDetail,
    // UI State & Handlers
    deadline,
    expandedSections,
    toggleSection,
    isPlaying,
    setIsPlaying,
    // Derived Data
    totalLessonsCount,
    studentCount,
    totalDurationText,
    discountPercent,
    relatedCourses,
    isRelatedCoursesLoading,
    formatPrice
  };
};
