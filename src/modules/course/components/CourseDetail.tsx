'use client';

import { observer } from '@legendapp/state/react';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Languages,
  Lock,
  MessageSquare,
  Play,
  PlayCircle,
  Share2,
  Star,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  Zap,
  Facebook,
  Instagram,
  Music,
  MessageCircle,
  Twitter,
  Globe,
  Phone,
  Target,
  GraduationCap,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Lightbulb
} from "lucide-react";
import { UserInformation } from '@/modules/profile/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn, getEmbedUrl } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { RelatedCourses } from "./RelatedCourses";
import { paymentActions } from '@/modules/payment/store';
import { useCourseRatings } from '../hooks/useCourseRatings';
import { useState, useMemo, useCallback, useRef } from 'react';
import { authState$ } from '@/modules/auth/store';
import { SupportChatService } from '@/modules/support-chat/services';
import { chatState$ } from '@/modules/support-chat/store';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ============================================================================
// CUSTOM SCROLLBAR STYLE
// ============================================================================
const CustomScrollbarStyle = () => (
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(var(--primary-rgb, 59, 130, 246), 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(var(--primary-rgb, 59, 130, 246), 0.4);
      }
    `}</style>
);

import { CountdownTimer } from './CountdownTimer';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CourseDetail = observer(({ slug }: { slug: string }) => {
  const router = useRouter();
  const isAuthenticated = authState$.isAuthenticated.get();
  const { 
    course: currentCourse, 
    isLoading,
    deadline,
    expandedSections,
    toggleSection,
    isPlaying,
    setIsPlaying,
    totalLessonsCount,
    studentCount,
    totalDurationText,
    discountPercent,
    relatedCourses,
    isRelatedCoursesLoading,
    formatPrice,
    levelWarning,
    userLevelLabel,
  } = useCourseDetail(slug);

  const { ratings, isLoading: isRatingsLoading, averageRating, ratingDistribution, totalRatings } = useCourseRatings(currentCourse?.id);

  const [ratingSort, setRatingSort] = useState<'newest' | 'lowest' | 'highest'>('newest');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'learn' | 'skills' | 'trust'>('learn');
  const filterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFilter = useCallback((fn: () => void) => {
    setIsFiltering(true);
    fn();
    if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    filterTimerRef.current = setTimeout(() => setIsFiltering(false), 300);
  }, []);

  const displayedRatings = useMemo(() => {
    let result = ratingFilter !== null ? ratings.filter(r => r.rating === ratingFilter) : [...ratings];
    if (ratingSort === 'newest') {
      result = result.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (ratingSort === 'lowest') {
      result = result.sort((a, b) => a.rating - b.rating);
    } else {
      result = result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [ratings, ratingSort, ratingFilter]);

  const levelDetails = useMemo(() => {
    const normLevel = currentCourse?.courseLevel?.toLowerCase() || '';
    if (normLevel.includes('1') || normLevel.includes('nhập') || normLevel.includes('nhap')) {
      return { label: 'Nhập môn', colorClass: 'bg-emerald-500/10 border-emerald-500/20', iconClass: 'text-emerald-500', innerClass: 'text-emerald-600 dark:text-emerald-400' };
    }
    if (normLevel.includes('2') || normLevel.includes('nền') || normLevel.includes('nen')) {
      return { label: 'Nền tảng', colorClass: 'bg-blue-500/10 border-blue-500/20', iconClass: 'text-blue-500', innerClass: 'text-blue-600 dark:text-blue-400' };
    }
    if (normLevel.includes('3') || normLevel.includes('trung') || normLevel.includes('trung')) {
      return { label: 'Trung cấp', colorClass: 'bg-amber-500/10 border-amber-500/20', iconClass: 'text-amber-500', innerClass: 'text-amber-600 dark:text-amber-400' };
    }
    if (normLevel.includes('4') || normLevel.includes('thực') || normLevel.includes('thuc')) {
      return { label: 'Thực hành', colorClass: 'bg-orange-500/10 border-orange-500/20', iconClass: 'text-orange-500', innerClass: 'text-orange-600 dark:text-orange-400' };
    }
    if (normLevel.includes('5') || normLevel.includes('nâng') || normLevel.includes('nang')) {
      return { label: 'Nâng cao', colorClass: 'bg-rose-500/10 border-rose-500/20', iconClass: 'text-rose-500', innerClass: 'text-rose-600 dark:text-rose-400' };
    }
    return { label: currentCourse?.courseLevel || 'Chưa phân loại', colorClass: 'bg-indigo-500/10 border-indigo-500/20', iconClass: 'text-indigo-500', innerClass: 'text-indigo-600 dark:text-indigo-400' };
  }, [currentCourse?.courseLevel]);

  const handleRegistration = () => {
    if (!currentCourse) return;

    if (!authState$.isAuthenticated.get()) {
      router.push('/login');
      return;
    }
    
    paymentActions.setPaymentInfo({
      courseId: currentCourse.id,
      courseTitle: currentCourse.title,
      courseThumbnail: currentCourse.thumbnailUrl || currentCourse.thumbnail || '',
      courseDescription: currentCourse.description,
      price: currentCourse.price,
      salePrice: currentCourse.salePrice || currentCourse.price,
      discountPercent: currentCourse.discountPercent || 0
    });
    
    router.push(`/payment/${currentCourse.slug}`);
  };

  if (isLoading || !currentCourse) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background pt-8 pb-8">
        <div className="relative px-6 py-0">
          <div className="mx-auto max-w-8xl">
            {/* Back Button Skeleton */}
            <Skeleton className="mb-8 h-10 w-64 rounded-full" />

            {/* Header Skeleton */}
            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
               <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-40 rounded-full" />
                  <Skeleton className="h-12 w-3/4 rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <div className="flex gap-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
               </div>
               <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-12 w-40 rounded-full" />
               </div>
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
               <div className="lg:col-span-2 space-y-6">
                  {/* Video Skeleton */}
                  <Skeleton className="aspect-video w-full rounded-2xl" />
                  
                  {/* Stats Skeleton */}
                  <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-24 rounded-2xl" />
                      <Skeleton className="h-24 rounded-2xl" />
                      <Skeleton className="h-24 rounded-2xl" />
                  </div>

                   {/* Curriculum Skeleton */}
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
               </div>

               {/* Sidebar Skeleton */}
               <div className="lg:col-span-1">
                  <Skeleton className="h-[500px] w-full rounded-2xl sticky top-24" />
               </div>
            </div>

            {/* Related Courses Skeleton */}
            <div className="mt-16 border-t border-border/40 pt-10">
                <Skeleton className="h-8 w-48 mb-8 rounded-full" />
                <div className="flex gap-6 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="min-w-[300px] h-[380px] rounded-2xl" />
                    ))}
                </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
      <main className="relative min-h-screen overflow-hidden bg-background pt-8 pb-8">
      <CustomScrollbarStyle />
      {/* Glassmorphism background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary/[0.025] blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[150px]" />
      </div>

      <div className="relative px-6 py-0">
        <div className="mx-auto max-w-8xl">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/course')}
            className="group mb-8 flex items-center gap-2.5 rounded-full border border-primary/20 bg-background/60 px-5 py-2.5 text-sm font-bold text-foreground backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Quay lại danh sách khóa học</span>
          </motion.button>

          {/* Course Completion Banner */}
          {isAuthenticated && currentCourse.progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="mb-8 relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background/60 p-8 backdrop-blur-xl shadow-2xl shadow-emerald-500/10"
            >
              {/* Animated sparkles/confetti background effect */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                    <Award className="h-10 w-10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full p-1.5 shadow-lg border-2 border-background animate-bounce">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">
                    <Zap className="h-3 w-3 fill-current" />
                    Thành tích tuyệt vời
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Chúc mừng! Bạn đã hoàn thành khóa học
                  </h3>
                  <p className="text-foreground/70 font-medium text-base md:text-lg leading-relaxed">
                    Bạn đã xuất sắc chinh phục toàn bộ nội dung của khóa học. 
                    Mọi nỗ lực học tập của bạn đều đã được đền đáp xứng đáng.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <Link href={`/certificate/${currentCourse.slug}`} target="_blank">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
                      <Button 
                        size="lg"
                        className="relative w-full md:w-auto h-16 px-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none font-black text-lg shadow-xl"
                      >
                        <Award className="mr-3 h-6 w-6" />
                        Nhận chứng chỉ
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Level Warning Banner */}
          {levelWarning && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8 relative overflow-hidden"
            >
              {/* Animated border glow */}
              <div className={`absolute -inset-[1px] rounded-2xl blur-sm opacity-60 animate-pulse ${
                levelWarning === 'too_hard'
                  ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500'
              }`} />

              <div className={`relative rounded-2xl border-2 px-6 py-5 backdrop-blur-xl ${
                levelWarning === 'too_hard'
                  ? 'bg-rose-950/60 border-rose-500/60 dark:bg-rose-950/80'
                  : 'bg-amber-950/60 border-amber-500/60 dark:bg-amber-950/80'
              }`}>
                {/* Top strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                  levelWarning === 'too_hard'
                    ? 'bg-gradient-to-r from-rose-700 via-red-400 to-rose-700'
                    : 'bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600'
                }`} />

                <div className="flex gap-4 items-start">
                  {/* Icon */}
                  <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-xl border-2 shadow-lg ${
                    levelWarning === 'too_hard'
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-400 shadow-rose-500/20'
                      : 'border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-amber-500/20'
                  }`}>
                    {levelWarning === 'too_hard'
                      ? <TrendingUp className="h-6 w-6" />
                      : <TrendingDown className="h-6 w-6" />
                    }
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Badge + Title row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border ${
                        levelWarning === 'too_hard'
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full animate-ping ${
                          levelWarning === 'too_hard' ? 'bg-rose-400' : 'bg-amber-400'
                        }`} />
                        {levelWarning === 'too_hard' ? 'Cảnh báo nghiêm trọng' : 'Lưu ý quan trọng'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        levelWarning === 'too_hard' ? 'text-rose-500/60' : 'text-amber-500/60'
                      }`}>
                        Cấp độ của bạn: <span className="font-black">{userLevelLabel}</span>
                      </span>
                    </div>

                    {/* Main warning text */}
                    <h4 className={`text-base font-black leading-snug tracking-tight ${
                      levelWarning === 'too_hard' ? 'text-rose-300' : 'text-amber-300'
                    }`}>
                      {levelWarning === 'too_hard'
                        ? '⚠️ Khóa học này vượt quá cấp độ hiện tại của bạn — rủi ro cao khi tiếp tục'
                        : '📉 Khóa học này thấp hơn cấp độ của bạn — có thể không phù hợp'}
                    </h4>

                    {/* Detailed description */}
                    <p className="text-sm text-white/60 leading-relaxed">
                      {levelWarning === 'too_hard'
                        ? `Hệ thống phát hiện cấp độ khóa học này cao hơn đáng kể so với trình độ "${userLevelLabel}" của bạn. Điều này có thể khiến bạn gặp khó khăn nghiêm trọng trong quá trình học tập.`
                        : `Khóa học này được thiết kế cho trình độ thấp hơn cấp độ "${userLevelLabel}" hiện tại của bạn. Nội dung có thể quá cơ bản và không mang lại giá trị tương xứng với thời gian đầu tư.`}
                    </p>

                    {/* Consequence bullet list */}
                    <ul className={`space-y-1.5 text-xs font-semibold leading-relaxed ${
                      levelWarning === 'too_hard' ? 'text-rose-400/80' : 'text-amber-400/80'
                    }`}>
                      {levelWarning === 'too_hard' ? (
                        <>
                          <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">›</span> Kiến thức nền tảng có thể chưa đủ để theo kịp nội dung</li>
                          <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">›</span> Nguy cơ bỏ dở khóa học cao hơn so với mức trung bình</li>
                          <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">›</span> VicTeach khuyến nghị hoàn thành các khóa học cấp thấp hơn trước</li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">›</span> Nội dung có thể quá quen thuộc và thiếu kiến thức mới</li>
                          <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">›</span> Thời gian học có thể không được tối ưu cho cấp độ của bạn</li>
                          <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">›</span> VicTeach khuyến nghị các khóa học phù hợp hơn với trình độ hiện tại</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 space-y-6"
          >
            {/* Promotional Offer Card */}
            {!(isAuthenticated && currentCourse.isEnrolled) && discountPercent > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mb-8 overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-background/80 to-background/60 p-6 backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-50 animate-pulse" />

                <div className="relative space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">
                        <Zap className="h-3 w-3 mr-1" />
                        GIẢM {discountPercent}%
                      </Badge>
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 py-1 animate-pulse">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Chỉ còn vài suất học ưu đãi
                      </Badge>
                    </div>
                    <Badge variant="outline" className="border-primary/40 bg-background/60 text-foreground">
                      <Timer className="h-3 w-3 mr-1" />
                      Ưu đãi có hạn
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">Ưu đãi kết thúc sau:</h3>
                      <p className="text-sm text-foreground/70">
                        Đừng bỏ lỡ cơ hội tiết kiệm {formatPrice(currentCourse.price - currentCourse.salePrice)}!
                      </p>
                    </div>
                    <CountdownTimer deadline={deadline} />
                  </div>

                  <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-border/40">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground/60">Giá gốc</p>
                      <p className="text-2xl font-bold text-foreground/40 line-through">{formatPrice(currentCourse.price)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground/60">Giá ưu đãi</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {formatPrice(currentCourse.salePrice)}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div onClick={handleRegistration} className="cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group"
                        >
                          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-amber-500 opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
                          <Button 
                            size="lg" 
                            className="relative h-14 px-8 rounded-full bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground border-none font-black text-lg shadow-2xl overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {currentCourse.isFree ? 'Nhận khóa học ngay' : 'Đăng ký học ngay'}
                              <ArrowLeft className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-1" />
                            </span>
                            {/* Shimmer Effect */}
                            <motion.div
                              initial={{ x: '-100%' }}
                              animate={{ x: '200%' }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex-1 space-y-3">
                <Badge variant="outline" className="inline-flex items-center gap-2 rounded-full border-border/50 bg-background/55 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur">
                  <BookOpen className="h-3.5 w-3.5" />
                  KHÓA HỌC TRỰC TUYẾN
                </Badge>

                <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {currentCourse.title}
                </h1>
                <p className="max-w-3xl text-foreground/70">{currentCourse.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-amber-600 dark:text-amber-500 text-base">{currentCourse.averageRate?.toFixed(1) || '0.0'}</span>
                    <span className="text-foreground/60 text-xs">({currentCourse.totalRate || 0} đánh giá)</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-foreground/20" />
                  <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-foreground/70 font-medium">
                      {typeof studentCount === 'number' ? `${studentCount.toLocaleString()} học viên` : 'Chưa có học viên'}
                    </span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-foreground/20" />
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${levelDetails.colorClass}`}>
                    <Award className={`h-4 w-4 ${levelDetails.iconClass}`} />
                    <span className="text-foreground/70 font-medium">
                      Trình độ: <span className={`font-bold ${levelDetails.innerClass}`}>{levelDetails.label}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(currentCourse.assets ?? []).map((asset, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] h-6">
                        #{asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full border-border/40 bg-background/60 backdrop-blur hover:border-border/60 hover:bg-background/70 shadow-lg"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                {(isAuthenticated && currentCourse.isEnrolled) ? (
                  <Link href={`/learn/${currentCourse.slug}`}>
                    <Button className="h-12 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground min-w-[140px] font-bold transition-all">
                      Vào học ngay
                    </Button>
                  </Link>
                ) : (
                  <div onClick={handleRegistration} className="cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-amber-500 opacity-60 blur group-hover:opacity-100 transition-opacity animate-pulse" />
                      <Button className="relative h-12 px-6 rounded-full bg-primary text-primary-foreground border-none font-bold shadow-xl overflow-hidden">
                        <span className="relative z-10">
                          {currentCourse.isFree ? 'Nhận khóa học' : `Đăng ký học (${formatPrice(currentCourse.salePrice || currentCourse.price)})`}
                        </span>
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Video Player / Thumbnail */}
            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur aspect-video shadow-2xl shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />
              
              {!isPlaying ? (
                <div className="relative h-full w-full bg-gradient-to-br from-primary/10 via-primary/5 to-background/50">
                  <img src={currentCourse.thumbnailUrl || currentCourse.thumbnail} alt={currentCourse.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(true)}
                      className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/50 bg-white/10 backdrop-blur-md transition-all hover:border-primary hover:bg-primary/20 hover:text-primary text-white"
                    >
                      <Play className="h-8 w-8 ml-1" fill="currentColor" />
                    </motion.button>
                  </div>
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white pointer-events-none">
                    <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Video className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Xem thử khóa học</p>
                        <p className="font-bold text-sm">Giới thiệu về {currentCourse.title}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-black relative flex items-center justify-center">
                  {getEmbedUrl(currentCourse.videoPreview) ? (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={getEmbedUrl(currentCourse.videoPreview)} 
                      title="Course Preview" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/60">
                         <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <AlertTriangle className="h-8 w-8 text-white/40" />
                         </div>
                         <div className="text-center">
                             <p className="text-sm font-bold uppercase tracking-widest text-white/80">Video không khả dụng</p>
                             <p className="text-xs text-white/40 mt-1">Vui lòng thử lại sau</p>
                         </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 rounded-full px-6 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white"
                            onClick={() => setIsPlaying(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Course Stats */}
            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Số chương", value: `${(currentCourse.moocs ?? []).length} Chương`, icon: <BookOpen className="h-5 w-5" /> },
                { label: "Số học liệu", value: `${totalLessonsCount} tài nguyên`, icon: <PlayCircle className="h-5 w-5" /> },
                { label: "Tổng thời lượng", value: totalDurationText, icon: <Clock className="h-5 w-5" /> },
              ].map((stat, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg border border-border/20 bg-background/50 p-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs font-black uppercase tracking-widest text-foreground/40">{stat.label}</p>
                      <div className="text-lg font-bold text-foreground leading-tight">{stat.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Learning Progress (Only for enrolled users) */}
            {(isAuthenticated && currentCourse.isEnrolled) && (
              <motion.div 
                variants={itemVariants} 
                className="relative overflow-hidden rounded-xl border border-border/40 bg-background/40 p-5 backdrop-blur-sm"
              >
                <div className="flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">Tiến độ khóa học</h4>
                            <p className="text-sm font-semibold text-foreground">
                                Đã hoàn thành {Math.round((currentCourse.progress || 0) * totalLessonsCount / 100)}/{totalLessonsCount} bài học
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-primary">{Math.round(currentCourse.progress || 0)}%</span>
                        </div>
                    </div>
                    
                    <div className="relative h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${currentCourse.progress || 0}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>

                    {(isAuthenticated && currentCourse.progress === 100) && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Chúc mừng! Bạn đã hoàn thành khóa học
                            </div>
                            <Link href={`/certificate/${currentCourse.slug}`} target="_blank">
                                <Button 
                                    size="sm" 
                                    className="rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-black text-[10px] uppercase tracking-widest px-6 shadow-xl shadow-primary/5 transition-all"
                                >
                                    <Award className="w-3.5 h-3.5 mr-2" />
                                    Xem chứng chỉ
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
              </motion.div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Course Additional Info Section - Integrated gracefully */}
                <div className="space-y-8">
                  {/* Tab Switcher */}
                  <div className="flex flex-wrap items-center gap-2 bg-background/40 p-2 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-xl">
                    {[
                      { id: 'learn', label: 'Bài học', fullLabel: 'Những gì bạn sẽ học', icon: <FileText className="w-5 h-5" />, color: 'primary' },
                      { id: 'skills', label: 'Kỹ năng', fullLabel: 'Kỹ năng nhận được', icon: <GraduationCap className="w-5 h-5" />, color: 'emerald-500' },
                      { id: 'trust', label: 'Uy tín', fullLabel: 'Uy tín & Tham khảo', icon: <Award className="w-5 h-5" />, color: 'amber-500' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveInfoTab(tab.id as any)}
                        className={cn(
                          "relative flex-1 min-w-[120px] flex items-center justify-center gap-2.5 px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-300 overflow-hidden group",
                          activeInfoTab === tab.id ? "text-white" : "text-foreground/40 hover:text-foreground/70"
                        )}
                      >
                        {activeInfoTab === tab.id && (
                          <motion.div
                            layoutId="activeTabGlow"
                            className={cn(
                              "absolute inset-0 shadow-2xl",
                              tab.id === 'learn' ? "bg-indigo-600 shadow-indigo-600/40" : 
                              tab.id === 'skills' ? "bg-emerald-600 shadow-emerald-600/40" : 
                              "bg-amber-600 shadow-amber-600/40"
                            )}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2.5">
                          <span className={cn(
                            "transition-transform duration-500",
                            activeInfoTab === tab.id ? "scale-110 rotate-12" : "group-hover:scale-110"
                          )}>
                            {tab.icon}
                          </span>
                          <span className="hidden sm:inline">{tab.fullLabel}</span>
                          <span className="sm:hidden">{tab.label}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                      {activeInfoTab === 'learn' && (
                        <motion.div
                          key="learn"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="group relative overflow-hidden rounded-[3rem] border border-white/10 bg-background/20 p-10 md:p-12 backdrop-blur-3xl transition-all duration-700 hover:shadow-[0_0_80px_-15px_rgba(var(--primary-rgb),0.2)] hover:border-primary/40"
                        >
                          <div className="absolute -top-24 -left-24 h-80 w-80 bg-primary/15 blur-[120px] rounded-full animate-pulse pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

                          <h3 className="relative z-10 text-3xl font-black tracking-tight text-foreground flex items-center gap-5 mb-10">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-2xl shadow-indigo-500/30 transform group-hover:scale-110 transition-all">
                              <FileText className="h-8 w-8" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black uppercase tracking-[0.3em] text-indigo-500/60 mb-1">Kiến thức trọng tâm</span>
                              <span>Những gì bạn sẽ học</span>
                            </div>
                          </h3>
                          
                          <div className="relative z-10 grid gap-x-12 gap-y-7 sm:grid-cols-2">
                            {(!currentCourse.whatYouWillLearn || currentCourse.whatYouWillLearn.length === 0) ? (
                              <p className="text-sm text-foreground/50 italic col-span-2 py-8 text-center bg-white/5 rounded-2xl border border-white/5">Chưa có thông tin cập nhật.</p>
                            ) : (
                              currentCourse.whatYouWillLearn.map((item, i) => (
                                <motion.div 
                                  key={i} 
                                  whileHover={{ x: 10 }}
                                  className="group/item flex items-start gap-5 p-4 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
                                >
                                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-500">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                  <span className="text-lg font-bold text-foreground/80 leading-snug group-hover/item:text-foreground">{item}</span>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}

                      {activeInfoTab === 'skills' && (
                        <motion.div
                          key="skills"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-emerald-500/[0.03] via-background/40 to-teal-500/[0.03] p-10 md:p-12 backdrop-blur-2xl transition-all duration-700 hover:border-emerald-500/30 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.15)]"
                        >
                          <div className="absolute -right-16 -top-16 h-64 w-64 bg-emerald-500/10 blur-[100px] rounded-full transition-all group-hover:bg-emerald-500/20 pointer-events-none" />
                          
                          <h3 className="relative z-10 text-2xl font-black tracking-tight text-foreground flex items-center gap-5 mb-10">
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 transform group-hover:scale-110 transition-all">
                              <GraduationCap className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 mb-1">Achievement</span>
                              <span>Kỹ năng nhận được</span>
                            </div>
                          </h3>
                          
                          <div className="relative z-10 grid gap-x-12 gap-y-7 sm:grid-cols-2">
                            {(!currentCourse.targetAudiences || currentCourse.targetAudiences.length === 0) ? (
                              <div className="py-10 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-foreground/40 text-sm col-span-2">Chưa có thông tin cập nhật.</div>
                            ) : (
                              currentCourse.targetAudiences.map((item, i) => (
                                <motion.div 
                                  key={i} 
                                  whileHover={{ x: 10 }}
                                  className="group/item flex items-center gap-5 p-4 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
                                >
                                  <div className="h-3 w-3 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                  <span className="text-lg font-semibold text-foreground/70 leading-tight group-hover/item:text-foreground">{item}</span>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}

                      {activeInfoTab === 'trust' && (
                        <motion.div
                          key="trust"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-amber-500/[0.03] via-background/40 to-orange-500/[0.03] p-10 md:p-12 backdrop-blur-2xl transition-all duration-700 hover:border-amber-500/30 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.15)]"
                        >
                          <div className="absolute -right-16 -top-16 h-64 w-64 bg-amber-500/10 blur-[100px] rounded-full transition-all group-hover:bg-amber-500/20 pointer-events-none" />
                          
                          <h3 className="relative z-10 text-2xl font-black tracking-tight text-foreground flex items-center gap-5 mb-10">
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-xl shadow-amber-500/30 transform group-hover:scale-110 transition-all">
                              <Award className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60 mb-1">Verify</span>
                              <span>Uy tín & Tham khảo</span>
                            </div>
                          </h3>
                          
                          <div className="relative z-10 grid gap-x-12 gap-y-7 sm:grid-cols-2">
                            {(!currentCourse.benefits || currentCourse.benefits.length === 0) ? (
                                <div className="py-10 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-foreground/40 text-sm col-span-2">Chưa có thông tin cập nhật.</div>
                            ) : (
                              currentCourse.benefits.map((item, i) => (
                                <motion.div 
                                  key={i} 
                                  whileHover={{ x: 10 }}
                                  className="group/item flex items-center gap-5 p-4 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
                                >
                                  <div className="h-3 w-3 shrink-0 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                  <span className="text-lg font-semibold text-foreground/70 leading-tight group-hover/item:text-foreground">{item}</span>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Curriculum Section */}
                <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-background/60 p-6 md:p-8 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Nội dung khóa học</h3>
                      <Badge variant="secondary" className="bg-background/50">
                        {(currentCourse.moocs ?? []).length} Chương
                      </Badge>
                    </div>

                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                      {[...(currentCourse.moocs ?? [])]
                        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                        .map((mooc, mIndex) => {
                          const sectionKey = `section-${mIndex}`;
                          const isExpanded = expandedSections[sectionKey];
                          
                          const lessons = [
                              ...(mooc.videos || []).map(v => ({ ...v, type: 'video' })),
                              ...(mooc.quizzes || []).map(q => ({ ...q, type: 'quiz' as const })),
                              ...(mooc.documents || []).map(d => ({ ...d, type: 'document' }))
                          ].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

                        const isEnrolled = isAuthenticated && currentCourse.isEnrolled;
                        const isMoocLocked = !isEnrolled ? (mooc.isUnlocked !== true) : (mooc.isUnlocked === false);

                        return (
                          <div key={mooc.id || mIndex} className={`overflow-hidden rounded-xl border bg-background/30 transition-all ${ isMoocLocked ? 'border-border/20' : 'border-border/30'}`}>
                            <button 
                              onClick={() => toggleSection(sectionKey)}
                              className="w-full p-4 text-left transition-colors hover:bg-background/50 flex items-center justify-between group/section"
                            >
                              <div className="flex-1">
                                <h4 className={`font-semibold flex items-center gap-2 ${ isMoocLocked ? 'text-foreground/60' : 'text-foreground'}`}>
                                  <span className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0">
                                    {mIndex + 1}
                                  </span>
                                  {mooc.title}
                                  {isMoocLocked && (
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                                  )}
                                  {isEnrolled && mooc.isCompleted && mooc.isUnlocked !== false && (
                                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 className="h-3 w-3" /> Xong
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-foreground/60 ml-8">{lessons.length} bài học</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <ChevronRight className={`h-5 w-5 text-foreground/40 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </button>

                            <motion.div
                              initial={false}
                              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border/20">
                                {lessons.map((lesson: any, lIdx: number) => {
                                  const isLessonLocked = isEnrolled 
                                    ? (mooc.isUnlocked === false || lesson.isUnlocked === false)
                                    : (mooc.isUnlocked !== true && lesson.isUnlocked !== true);

                                  return (
                                    <div key={lesson.id || `${lesson.type}-${lIdx}`} className="flex items-center justify-between p-4 border-b border-border/10 last:border-b-0">
                                      <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border shrink-0 ${ isLessonLocked ? 'border-border/30 bg-background/30 text-foreground/30' : 'border-border/40 bg-background/50 text-foreground/60'}`}>
                                          {lesson.type === 'video' ? <PlayCircle className="h-4 w-4" /> : lesson.type === 'quiz' ? <Timer className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                        </div>
                                        <div>
                                          <p className={`text-sm font-medium ${ isLessonLocked ? 'text-foreground/50' : ''}`}>{lesson.title}</p>
                                          <p className="text-xs text-foreground/40">{lesson.type === 'video' ? 'Video' : lesson.type === 'quiz' ? 'Bài kiểm tra' : 'Tài liệu'}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {isLessonLocked ? (
                                          <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                                        ) : lesson.isCompleted ? (
                                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 shadow-sm shadow-green-500/40">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                          </span>
                                        ) : (
                                          <PlayCircle className="h-4 w-4 text-primary opacity-0 group-hover/lesson:opacity-100 transition-opacity" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Instructor */}
              <div className="lg:col-span-1">
                 <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg sticky top-24">
                   <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                   
                   <div className="relative space-y-6">
                     <div className="flex items-center justify-between">
                       <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Giảng viên</h3>
                       <Badge className="bg-primary/10 text-primary border-primary/20">
                         <CheckCircle2 className="h-3 w-3 mr-1" />
                         Xác minh
                       </Badge>
                     </div>
 
                     <div className="flex flex-col gap-6">
                       {/* Part 1: Identity Header */}
                       <div className="flex items-center gap-4 px-1">
                         <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/60 bg-background shadow-inner">
                           <img 
                             src={currentCourse.profileResponse?.avatar || currentCourse.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentCourse.createdBy || 'Giangvien'}`} 
                             alt={currentCourse.profileResponse?.fullName || currentCourse.author?.name || currentCourse.createdBy || "Giảng viên"} 
                             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">
                             Tạo bởi giảng viên
                           </p>
                           <h4 className="text-xl font-bold text-foreground tracking-tight truncate">
                             {currentCourse.profileResponse?.fullName || currentCourse.createdBy || currentCourse.author?.name || "Giảng viên"}
                           </h4>
                           {currentCourse.createdBy && (
                             <div className="pt-0.5">
                               <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold px-2 py-0.5 leading-none transition-all hover:bg-primary/10 select-none">
                                 @{currentCourse.createdBy}
                               </Badge>
                             </div>
                           )}
                           <div className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 pt-2 flex items-center gap-1.5">
                             <div className="h-1 w-1 rounded-full bg-primary/30" />
                             {currentCourse.author?.role || "Giảng viên chuyên nghiệp"}
                           </div>
                         </div>
                       </div>
 
                       {/* Part 2: Social Connections (Only show if link exists) */}
                       {currentCourse.profileResponse?.information && Object.values(currentCourse.profileResponse.information).some(v => v) && (
                         <div className="w-full space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Kết nối mạng xã hội</p>
                           <div className="flex flex-wrap gap-2.5">
                             {[
                               { id: 'facebook', icon: Facebook, color: 'bg-[#1877F2]' },
                               { id: 'instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                               { id: 'tiktok', icon: ({ className }: { className?: string }) => (
                                   <svg className={className} viewBox="0 0 448 512" fill="currentColor">
                                     <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
                                   </svg>
                                 ), color: 'bg-zinc-950' },
                               { id: 'zalo', icon: ({ className }: { className?: string }) => (
                                   <img 
                                     src="https://page.widget.zalo.me/static/images/2.0/Logo.svg" 
                                     alt="Zalo" 
                                     className="h-full w-full object-contain" 
                                   />
                                 ), color: 'bg-[#0068FF] p-1' },
                               { id: 'twitter', icon: Twitter, color: 'bg-sky-500' },
                             ].map((social) => {
                               // @ts-ignore - indexing UserInformation
                               const link = currentCourse.profileResponse?.information?.[social.id];
                               return link ? (
                                 <a 
                                   key={social.id} 
                                   href={link.startsWith('http') ? link : `https://${link}`} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className={cn(
                                     "flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95",
                                     social.color
                                   )}
                                   title={social.id}
                                 >
                                   <social.icon className={cn("text-white", social.id === 'zalo' ? 'h-full w-full p-0.5' : 'h-6 w-6')} />
                                 </a>
                               ) : null;
                             })}
                           </div>
                         </div>
                       )}
 
                       {/* Part 3: Direct Contact */}
                       <div className="w-full relative group cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-primary/[0.02] p-2.5 transition-all hover:bg-primary/[0.05] hover:border-primary/20">
                          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Phone className="h-12 w-12 -rotate-12" />
                          </div>
                          <div className="flex items-center gap-3 relative z-10">
                             <div className={cn(
                               "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md",
                               currentCourse.profileResponse?.phoneNumber ? "bg-primary text-primary-foreground shadow-primary/10" : "bg-muted text-muted-foreground shadow-none"
                             )}>
                                <Phone className="h-4.5 w-4.5" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/60 leading-none mb-1">Liên hệ trực tiếp</span>
                                <span className={cn(
                                  "text-base font-bold tabular-nums tracking-tight",
                                  currentCourse.profileResponse?.phoneNumber ? "text-foreground" : "text-foreground/30 italic font-medium"
                                )}>
                                  {currentCourse.profileResponse?.phoneNumber || "Đang cập nhật..."}
                                </span>
                             </div>
                          </div>
                       </div>
 
                       {/* Part 4: Bio/Description */}
                       <div className="space-y-1.5 px-0.5">
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Về giảng viên</p>
                         <p className={cn(
                           "text-[13px] leading-relaxed border-l-2 pl-3 italic",
                           currentCourse.profileResponse?.description ? "text-foreground/70 border-primary/10" : "text-foreground/30 border-muted/50"
                         )}>
                           {currentCourse.profileResponse?.description || "Giảng viên hiện đang bận rộn xây dựng nội dung chất lượng cao. Lời giới thiệu dự kiến sẽ sớm được cập nhật."}
                         </p>
                       </div>

                       {/* Part 5: Primary Actions (Bottom) */}
                       <div className="w-full pt-4 border-t border-border/40 space-y-3">
                         <Button 
                            variant="outline" 
                            onClick={async () => {
                              const userId = authState$.user.peek()?.userId || (typeof window !== 'undefined' ? localStorage.getItem('guest_id') : 'guest');
                              if (!userId) return;
                              
                              const courseData = {
                                id: currentCourse.id,
                                title: currentCourse.title,
                                thumbnail: currentCourse.thumbnailUrl || currentCourse.thumbnail,
                                price: currentCourse.salePrice || currentCourse.price,
                                slug: currentCourse.slug
                              };

                              await SupportChatService.sendMessage({
                                userId,
                                senderId: userId,
                                senderRole: 'user',
                                senderName: authState$.user.peek()?.username || 'Khách',
                                content: `[COURSE_INQUIRY]${JSON.stringify(courseData)}`
                              });
                              
                              // Open chat window instead of alert
                              chatState$.open();
                            }}
                            className="w-full h-11 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                          >
                            <MessageCircle size={16} />
                            Hỏi về khóa học này
                          </Button>

                          {(isAuthenticated && currentCourse.isEnrolled) ? (
                         <Link href={`/learn/${currentCourse.slug}`} className="block">
                           <Button className="w-full h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold transition-all">
                             Vào học ngay
                           </Button>
                         </Link>
                       ) : (
                         <div onClick={handleRegistration} className="w-full cursor-pointer pt-2">
                           <motion.div
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             className="relative group"
                           >
                             <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-amber-500 opacity-50 blur group-hover:opacity-100 transition-opacity animate-pulse" />
                             <Button className="relative w-full h-12 rounded-xl bg-primary text-primary-foreground border-none font-bold shadow-lg overflow-hidden">
                               <span className="relative z-10">
                                 {currentCourse.isFree ? 'Nhận khóa học' : `Đăng ký học (${formatPrice(currentCourse.salePrice || currentCourse.price)})`}
                               </span>
                               <motion.div
                                 initial={{ x: '-100%' }}
                                 animate={{ x: '200%' }}
                                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                               />
                             </Button>
                           </motion.div>
                         </div>
                       )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Ratings Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="mt-10 border-t border-border/40 pt-10"
            >
              <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Star className="h-4 w-4 fill-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Đánh giá của học viên</h3>
                  <span className="text-sm text-muted-foreground/60">({totalRatings} đánh giá)</span>
                </div>

                {isRatingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Summary */}
                    <div className="lg:col-span-1">
                      <div className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur sticky top-24">
                        <div className="flex flex-col items-center gap-2 mb-6">
                          <span className="text-6xl font-black text-foreground tabular-nums">{averageRating.toFixed(1)}</span>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-5 w-5 ${ s <= Math.round(averageRating) ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{totalRatings} đánh giá</p>
                        </div>
                        <div className="space-y-2">
                          {ratingDistribution.map(({ star, count, percent }) => (
                            <button
                              key={star}
                              onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                              className={`w-full flex items-center gap-3 rounded-lg px-2 py-1 transition-colors ${
                                ratingFilter === star ? 'bg-amber-500/10' : 'hover:bg-muted/50'
                              }`}
                            >
                              <span className="text-xs font-bold text-muted-foreground w-3">{star}</span>
                              <Star className={`h-3 w-3 shrink-0 ${ ratingFilter === star ? 'fill-amber-500 text-amber-500' : 'fill-amber-400 text-amber-400'}`} />
                              <div className="flex-1 h-2 rounded-full bg-primary/10 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${percent}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className={`h-full rounded-full ${ ratingFilter === star ? 'bg-amber-500' : 'bg-amber-400'}`}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground/60 w-7 text-right">{count}</span>
                            </button>
                          ))}
                        </div>
                        {ratingFilter !== null && (
                          <button
                            onClick={() => setRatingFilter(null)}
                            className="mt-3 w-full text-[11px] font-bold text-primary hover:underline"
                          >
                            Xóa bộ lọc
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Review Cards */}
                    <div className="lg:col-span-2">
                      {/* Sort + filter bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/30">
                          {([['newest', 'Mới nhất'], ['highest', 'Cao → thấp'], ['lowest', 'Thấp → cao']] as const).map(([val, label]) => (
                            <button
                              key={val}
                              onClick={() => triggerFilter(() => setRatingSort(val))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                ratingSort === val
                                  ? 'bg-background shadow text-foreground'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[5,4,3,2,1].map(s => (
                            <button
                              key={s}
                              onClick={() => triggerFilter(() => setRatingFilter(ratingFilter === s ? null : s))}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border transition-all ${
                                ratingFilter === s
                                  ? 'bg-amber-500 text-white border-amber-500 shadow shadow-amber-500/30'
                                  : 'border-border/40 text-muted-foreground hover:border-amber-400 hover:text-amber-500'
                              }`}
                            >
                              <Star className={`h-2.5 w-2.5 ${ ratingFilter === s ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`space-y-3 max-h-[400px] overflow-y-auto pr-2 transition-opacity duration-200 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted/20 ${isFiltering ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        {isFiltering ? (
                          <div className="space-y-3">
                            {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                          </div>
                        ) : displayedRatings.length === 0 ? (
                          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground/50">
                            <Star className="h-10 w-10 text-muted-foreground/20" />
                            <p className="text-sm font-medium">
                              {totalRatings === 0 ? "Chưa có đánh giá nào cho khóa học này" : "Không có đánh giá nào phù hợp"}
                            </p>
                          </div>
                        ) : displayedRatings.map((review) => (
                          <div
                            key={review.id}
                            className="group rounded-2xl border border-border/40 bg-background/60 p-5 backdrop-blur hover:border-border/60 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={review.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.fullName}`}
                                alt={review.fullName}
                                className="h-10 w-10 rounded-full object-cover border-2 border-border/40 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <p className="font-semibold text-sm text-foreground">{review.fullName}</p>
                                  <span className="text-xs text-muted-foreground/50">
                                    {new Date(review.createdDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 mb-2">
                                  {[1,2,3,4,5].map(s => (
                                    <Star key={s} className={`h-3.5 w-3.5 ${ s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
                                  ))}
                                  <span className="text-xs text-muted-foreground/60 ml-1 font-bold">{review.rating}.0</span>
                                </div>
                                {review.comment && (
                                  <p className="text-sm text-muted-foreground/80 leading-relaxed">{review.comment}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </motion.div>

             {/* Related Courses Slider */}
             {relatedCourses.length > 0 ? (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={itemVariants}
                  className="mt-16 border-t border-border/40 pt-10"
                >
                  <RelatedCourses courses={relatedCourses} title="Khóa học liên quan" />
                </motion.div>
             ) : isRelatedCoursesLoading ? (
                 <div className="mt-16 border-t border-border/40 pt-10">
                    <Skeleton className="h-8 w-48 mb-8 rounded-full" />
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="min-w-[300px] h-[380px] rounded-2xl" />
                        ))}
                    </div>
                </div>
             ) : null}
          </motion.div>
        </div>
      </div>
    </main>
  );
});
