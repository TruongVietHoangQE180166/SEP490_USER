import { useEffect, useState, useMemo } from 'react';
import { courseService } from '../services';
import { courseState$, courseActions } from '../store';
import { USER_LEVEL_ORDER, USER_LEVEL_LABEL, UserLevel } from '../types';
import { toast } from '@/components/ui/toast';
import { useCourses } from './useCourse';
import { authState$ } from '@/modules/auth/store';

/**
 * Module-level guards:
 * - inflight: prevents duplicate getCourseBySlugName calls for the same slug
 * - getMeInflight: prevents duplicate getMe calls (one across all hook instances)
 */
const inflight = new Map<string, Promise<void>>();
let getMeInflight: Promise<void> | null = null;

/**
 * Hook to fetch course details by slug name.
 * - Reads from global store (reactive, shared between all components).
 * - Only fires ONE API call per slug, even if mounted by multiple components.
 * - Fetches user level once and caches it in the store.
 * - Computes a levelWarning when the user's level differs from the course level.
 */
export const useCourseDetail = (slugName: string) => {
  const course = courseState$.currentCourse.get();
  const isLoading = courseState$.isLoading.get();
  const userLevel = courseState$.userLevel.get();
  const isAuthenticated = authState$.isAuthenticated.get();
  const [error, setError] = useState<string | null>(null);

  // UI States – kept local so they don't cause global re-renders
  const [deadline] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'section-0': true,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // Global course list for "Related Courses" (already cached by useCourses)
  const { courses: allCourses, isLoading: isRelatedCoursesLoading } = useCourses();

  useEffect(() => {
    if (!slugName) return;
    // Run both fetches concurrently on first mount
    loadCourseDetail();
    if (isAuthenticated) loadUserLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugName, isAuthenticated]);

  /** Fetch current user level once and cache in store */
  const loadUserLevel = async () => {
    if (userLevel) return; // already cached
    if (getMeInflight) return getMeInflight;

    getMeInflight = (async () => {
      try {
        const me = await courseService.getMe();
        if (me?.level) courseActions.setUserLevel(me.level);
      } catch {
        // Non-critical – silently ignore
      } finally {
        getMeInflight = null;
      }
    })();

    return getMeInflight;
  };

  const loadCourseDetail = async (forceRefresh = false) => {
    // 1. Already have the correct course in store → skip
    if (
      !forceRefresh &&
      course &&
      (course.slug === slugName || course.id === slugName)
    ) {
      return;
    }

    // 2. A request for this slug is already in-flight → wait for it
    if (!forceRefresh && inflight.has(slugName)) {
      return inflight.get(slugName);
    }

    // 3. Kick off the request and share it via the module-level guard
    const promise = (async () => {
      try {
        courseActions.setLoading(true);
        setError(null);

        const data = await courseService.getCourseBySlugName(slugName);

        if (data && data.status === 'PUBLISHED') {
          courseActions.setCurrentCourse(data);

          const completedIds: string[] = [];
          data.moocs?.forEach(mooc => {
            mooc.videos?.forEach(v => { if (v.isCompleted) completedIds.push(v.id); });
            mooc.quizzes?.forEach(q => { if (q.id && q.isCompleted) completedIds.push(q.id); });
            mooc.documents?.forEach(d => { if (d.isCompleted) completedIds.push(d.id); });
          });
          courseActions.setCompletedLessons(completedIds);
        } else {
          setError('Khóa học này chưa được công khai hoặc không tồn tại');
          courseActions.setCurrentCourse(null);
        }
      } catch (err: any) {
        const message = err.message || 'Không thể tải chi tiết khóa học';
        setError(message);
        toast.error(message);
      } finally {
        courseActions.setLoading(false);
        inflight.delete(slugName);
      }
    })();

    inflight.set(slugName, promise);
    return promise;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
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
      (mooc.videos || []).forEach(video => {
        if (video.duration) {
          const parts = String(video.duration).split(':').map(Number);
          if (parts.length === 3) totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
          else if (parts.length === 2) totalSeconds += parts[0] * 60 + parts[1];
          else if (parts.length === 1 && !isNaN(parts[0])) totalSeconds += parts[0] * 60;
        }
      });
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

  /**
   * Map the backend courseLevel string to a UserLevel key.
   * Backend may return values like "NEN_TANG", "Level 2", "Nền tảng", etc.
   */
  const courseLevelKey = useMemo((): UserLevel | null => {
    const raw = course?.courseLevel?.toUpperCase().replace(/\s/g, '_') || '';
    if (!raw) return null;
    // Direct enum match first
    if (raw in USER_LEVEL_ORDER) return raw as UserLevel;
    // Keyword fallback
    if (raw.includes('NHAP') || raw.includes('NHẬP') || raw.includes('1')) return 'NHAP_MON';
    if (raw.includes('NEN') || raw.includes('NỀN') || raw.includes('2')) return 'NEN_TANG';
    if (raw.includes('TRUNG') || raw.includes('3')) return 'TRUNG_CAP';
    if (raw.includes('THUC') || raw.includes('THỰC') || raw.includes('4')) return 'THUC_HANH';
    if (raw.includes('NANG') || raw.includes('NÂNG') || raw.includes('5')) return 'NANG_CAO';
    return null;
  }, [course?.courseLevel]);

  /**
   * Level warning relative to the authenticated user's level.
   * 'too_hard' → course level > user level
   * 'too_easy' → course level < user level
   * null       → same level, not authenticated, or levels unknown
   */
  const levelWarning = useMemo((): 'too_hard' | 'too_easy' | null => {
    if (!isAuthenticated || !userLevel || !courseLevelKey) return null;
    const userRank = USER_LEVEL_ORDER[userLevel];
    const courseRank = USER_LEVEL_ORDER[courseLevelKey];
    if (courseRank > userRank) return 'too_hard';
    if (courseRank < userRank) return 'too_easy';
    return null;
  }, [userLevel, courseLevelKey, isAuthenticated]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return {
    course,
    isLoading,
    error,
    refresh: () => loadCourseDetail(true),
    // User level
    userLevel,
    levelWarning,
    userLevelLabel: userLevel ? USER_LEVEL_LABEL[userLevel] : null,
    courseLevelKey,
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
    formatPrice,
  };
};
