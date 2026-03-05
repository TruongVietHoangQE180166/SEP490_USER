'use client';

import { observer } from '@legendapp/state/react';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
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
  Play,
  PlayCircle,
  Share2,
  Star,
  Timer,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn, getEmbedUrl } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { RelatedCourses } from "./RelatedCourses";

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
    formatPrice
  } = useCourseDetail(slug);

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

          {/* ... existing header content ... */}
          {/* (I'll keep the overall structure but I need to find the right place for the slider) */}

          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 space-y-6"
          >
            {/* Promotional Offer Card */}
            {!currentCourse.isEnrolled && discountPercent > 0 && (
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
                      <Link href={`/learn/${currentCourse.id}`}>
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
                              Đăng ký học ngay
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
                      </Link>
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

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-foreground">{currentCourse.averageRate || currentCourse.rating}</span>
                    <span className="text-foreground/60">({studentCount.toLocaleString()} học viên)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(currentCourse.assets ?? []).map((asset, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">
                        #{asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/40 bg-background/60 backdrop-blur hover:border-border/60 hover:bg-background/70 shadow-lg">
                  <Share2 className="h-5 w-5" />
                </Button>
                
                {currentCourse.isEnrolled ? (
                  <Link href={`/learn/${currentCourse.id}`}>
                    <Button className="h-12 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground min-w-[140px] font-bold transition-all">
                      Vào học ngay
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/learn/${currentCourse.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-amber-500 opacity-60 blur group-hover:opacity-100 transition-opacity animate-pulse" />
                      <Button className="relative h-12 px-6 rounded-full bg-primary text-primary-foreground border-none font-bold shadow-xl overflow-hidden">
                        <span className="relative z-10">
                          Đăng ký học ({formatPrice(currentCourse.salePrice || currentCourse.price)})
                        </span>
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                      </Button>
                    </motion.div>
                  </Link>
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
                { label: "Tổng thời lượng", value: totalDurationText, icon: <Clock className="h-5 w-5" /> },
                { label: "Số bài giảng", value: `${totalLessonsCount} bài`, icon: <PlayCircle className="h-5 w-5" /> },
                { 
                  label: "Tài sản (Assets)", 
                  value: (currentCourse.assets ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentCourse.assets?.map((asset, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-primary/5 border-primary/10 text-primary text-[10px] px-2 py-0 h-5 font-bold">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  ) : "Chưa cập nhật", 
                  icon: <Zap className="h-5 w-5" /> 
                },
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

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Curriculum */}
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg">
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

                        return (
                          <div key={mooc.id} className="overflow-hidden rounded-xl border border-border/30 bg-background/30">
                            <button 
                              onClick={() => toggleSection(sectionKey)}
                              className="w-full p-4 text-left transition-colors hover:bg-background/50 flex items-center justify-between group/section"
                            >
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <span className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs">
                                    {mIndex + 1}
                                  </span>
                                  {mooc.title}
                                </h4>
                                <p className="text-xs text-foreground/60 ml-8">{lessons.length} bài học</p>
                              </div>
                              <ChevronRight className={`h-5 w-5 text-foreground/40 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            <motion.div
                              initial={false}
                              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border/20">
                                {lessons.map((lesson: any) => (
                                  <div key={lesson.id} className="group/lesson flex items-center justify-between p-4 hover:bg-background/40 transition-all border-b border-border/10 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/50 text-foreground/60">
                                        {lesson.type === 'video' ? <PlayCircle className="h-4 w-4" /> : lesson.type === 'quiz' ? <Timer className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{lesson.title}</p>
                                        <div className="flex items-center gap-2">
                                          <p className="text-xs text-foreground/50 capitalize">{lesson.type} {lesson.duration ? `· ${lesson.duration}` : ''}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <PlayCircle className="h-4 w-4 text-primary opacity-0 group-hover/lesson:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ))}
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
                      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Quản trị viên</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Xác minh
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/60 bg-background">
                          <img src={currentCourse.author?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang"} alt={currentCourse.author?.name || "Instructor"} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <h4 className="text-xl font-semibold text-foreground tracking-tight">{currentCourse.author?.name || "Trường Việt Hoàng"}</h4>
                          <p className="text-sm text-foreground/70 font-medium">{currentCourse.author?.role || "Quản trị viên"}</p>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-foreground/70 border-l-2 border-primary/20 pl-4 italic">
                        "Chuyên gia phân tích thị trường tiền mã hóa với hơn 8 năm kinh nghiệm thực chiến từ những ngày đầu của Blockchain. Đã đồng hành và hỗ trợ hàng nghìn nhà đầu tư tối ưu hóa danh mục trong các chu kỳ thị trường. Đam mê chia sẻ kiến thức về DeFi, Web3 và xây dựng cộng đồng đầu tư bền vững, minh bạch."
                      </p>


                      {currentCourse.isEnrolled ? (
                        <Link href={`/learn/${currentCourse.id}`} className="block">
                          <Button className="w-full h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold transition-all">
                            Vào học ngay
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/learn/${currentCourse.id}`} className="block">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative group"
                          >
                            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-amber-500 opacity-50 blur group-hover:opacity-100 transition-opacity animate-pulse" />
                            <Button className="relative w-full h-12 rounded-xl bg-primary text-primary-foreground border-none font-bold shadow-lg overflow-hidden">
                              <span className="relative z-10">
                                Đăng ký học ({formatPrice(currentCourse.salePrice || currentCourse.price)})
                              </span>
                              <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                              />
                            </Button>
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
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
