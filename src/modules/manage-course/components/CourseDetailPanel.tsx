'use client';

import React from 'react';
import { useAdminCourseDetail } from '../hooks/useAdminCourseDetail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { getEmbedUrl } from '@/lib/utils';
import { ThunderLoader } from '@/components/thunder-loader';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Play,
  PlayCircle,
  Share2,
  Star,
  Timer,
  Users,
  Video,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clapperboard,
  ClipboardList,
  Target,
  Award,
  Eye,
  ArrowDownToLine,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const LEVEL_MAP: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
};

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  PUBLISHED: {
    label: 'Đã duyệt',
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  DRAFT: {
    label: 'Chờ duyệt',
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  REJECT: {
    label: 'Từ chối',
    className: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
    dot: 'bg-rose-500',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface AdminCourseDetailPageProps {
  courseId: string;
  onBack: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const AdminCourseDetailPage = ({ courseId, onBack }: AdminCourseDetailPageProps) => {
  const {
    course,
    isLoading,
    error,
    reload,
    expandedSections,
    toggleSection,
    isPlaying,
    setIsPlaying,
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
  } = useAdminCourseDetail(courseId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ThunderLoader size="xl" variant="default" animate="thunder" showGlow showFill />
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.4em] animate-pulse">
          Đang tải chi tiết khoá học...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-rose-500/60" />
        <p className="text-foreground font-bold">{error ?? 'Không tìm thấy khoá học'}</p>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack} className="rounded-xl gap-2">
            <ArrowLeft size={16} /> Quay lại
          </Button>
          <Button onClick={reload} className="rounded-xl gap-2">
            <RefreshCw size={16} /> Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const isPublished = course.status === 'PUBLISHED';
  const isRejected = course.status === 'REJECT';
  const statusCfg = STATUS_CONFIG[course.status] ?? STATUS_CONFIG['DRAFT'];
  const authorName = course.author?.name ?? course.createdBy ?? 'Không rõ';
  const authorAvatar = course.author?.avatar
    ? course.author.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=128`;

  const thumbnail =
    course.thumbnailUrl || 'https://placehold.co/1280x720/1e1e2e/6366f1?text=VIC+Course';

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-8">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary/[0.025] blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[150px]" />
      </div>

      <div className="relative px-6">
        <div className="mx-auto max-w-7xl">

          {/* ── Top bar ── */}
          <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="group flex items-center gap-2.5 rounded-full border border-primary/20 bg-background/60 px-5 py-2.5 text-sm font-bold text-foreground backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span>Quay lại danh sách khoá học</span>
            </motion.button>

            <div className="flex items-center gap-3">
              {!isPublished && (
                <Button
                  onClick={() => requestStatusChange('PUBLISHED')}
                  disabled={isStatusUpdating}
                  className="h-11 px-7 rounded-full font-black gap-2 uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={16} /> Duyệt khoá học
                </Button>
              )}
              {!isRejected && (
                <Button
                  onClick={() => requestStatusChange('REJECT')}
                  disabled={isStatusUpdating}
                  className="h-11 px-7 rounded-full font-black gap-2 uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <XCircle size={16} /> Từ chối khoá học
                </Button>
              )}
            </div>
          </div>

          {/* ── Course Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex-1 space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} animate-pulse`} />
                    {statusCfg.label}
                  </span>
                  <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full border-border/50 bg-background/55 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur">
                    <BookOpen className="h-3.5 w-3.5" /> KHÓA HỌC TRỰC TUYẾN
                  </Badge>
                  {(course.courseLevel || course.level) && (
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {course.courseLevel || (course.level && LEVEL_MAP[course.level]) || course.level}
                    </Badge>
                  )}
                  {course.categoryName && (
                    <Badge variant="secondary" className="rounded-full text-xs bg-primary/10 text-primary border-none">
                      {course.categoryName}
                    </Badge>
                  )}
                </div>

                <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {course.title}
                </h1>
                <p className="max-w-3xl text-foreground/70">{course.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-amber-600 dark:text-amber-500 text-base">
                      {course.averageRate?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-foreground/60 text-xs">({course.totalRate || 0} đánh giá)</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-foreground/20" />
                  <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-foreground/70 font-medium">
                      {course.countEnrolledStudents != null 
                        ? `${course.countEnrolledStudents.toLocaleString()} học viên` 
                        : (course.totalStudents != null ? `${course.totalStudents.toLocaleString()} học viên` : 'Chưa có học viên')}
                    </span>
                  </div>
                  {course.assets && course.assets.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {course.assets.map((asset, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider bg-secondary/80 text-secondary-foreground border-border/40"
                        >
                          {asset.charAt(0).toUpperCase() + asset.slice(1).toLowerCase()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Tạo ngày {formatDate(course.createdDate)}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/40 bg-background/60 backdrop-blur hover:border-border/60 hover:bg-background/70 shadow-lg shrink-0">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* ── Main content ── */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

            {/* ── Video Player ── */}
            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur aspect-video shadow-2xl shadow-primary/5">
              {!isPlaying ? (
                <div className="relative h-full w-full bg-gradient-to-br from-primary/10 via-primary/5 to-background/50">
                  <img
                    src={thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/1280x720/1e1e2e/6366f1?text=VIC+Course'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    {(course as any).videoPreview ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(true)}
                        className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/50 bg-white/10 backdrop-blur-md transition-all hover:border-primary hover:bg-primary/20 hover:text-primary text-white"
                      >
                        <Play className="h-8 w-8 ml-1" fill="currentColor" />
                      </motion.button>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/60">
                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <Video className="h-7 w-7 text-white/40" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Chưa có video preview</p>
                      </div>
                    )}
                  </div>

                  {/* Price overlay */}
                  <div className="absolute top-5 right-5">
                    {course.isFree || course.price === 0 ? (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-primary/90 text-primary-foreground backdrop-blur-sm">MIỄN PHÍ</span>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        {course.salePrice > 0 && course.salePrice < course.price && (
                          <span className="text-xs text-white/50 line-through">{formatCurrency(course.price)}</span>
                        )}
                        <span className="px-3 py-1.5 rounded-xl text-sm font-black bg-black/60 text-white backdrop-blur-sm">
                          {formatCurrency(course.salePrice > 0 ? course.salePrice : course.price)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white pointer-events-none">
                    <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Preview khoá học</p>
                      <p className="font-bold text-sm">{course.title}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-black relative flex items-center justify-center">
                  {getEmbedUrl((course as any).videoPreview) ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl((course as any).videoPreview)}
                      title="Course Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/60">
                      <AlertTriangle className="h-8 w-8 text-white/40" />
                      <p className="text-sm font-bold uppercase tracking-widest text-white/80">Video không khả dụng</p>
                      <Button variant="outline" size="sm" className="mt-2 rounded-full px-6 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white" onClick={() => setIsPlaying(false)}>
                        Đóng
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* ── Stats grid ── */}
            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Số chương', value: `${moocs.length} chương`, icon: <BookOpen className="h-5 w-5" /> },
                { label: 'Số tài nguyên', value: `${totalLessonsCount} tài nguyên`, icon: <PlayCircle className="h-5 w-5" /> },
                { label: 'Học viên', value: course.countEnrolledStudents != null ? course.countEnrolledStudents.toLocaleString() : (course.totalStudents != null ? course.totalStudents.toLocaleString() : 'Chưa có'), icon: <Users className="h-5 w-5" /> },
                { label: 'Trình độ', value: course.courseLevel || (course.level && LEVEL_MAP[course.level]) || course.level || 'Chưa có', icon: <Award className="h-5 w-5" /> },
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg border border-border/20 bg-background/50 p-2 text-primary">{stat.icon}</div>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs font-black uppercase tracking-widest text-foreground/40">{stat.label}</p>
                      <div className="text-lg font-bold text-foreground leading-tight">{stat.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ── Curriculum + Sidebar grid ── */}
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Curriculum */}
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Nội dung khoá học</h3>
                      <Badge variant="secondary" className="bg-background/50">{moocs.length} Chương</Badge>
                    </div>

                    {moocs.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground/50">
                        <BookOpen className="h-12 w-12" strokeWidth={1} />
                        <p className="text-sm font-medium">Khoá học chưa có nội dung</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-track]:bg-muted/20">
                        {[...moocs]
                          .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
                          .map((mooc: any, mIndex: number) => {
                            const key = `section-${mIndex}`;
                            const isExpanded = !!expandedSections[key];
                            const lessons = [
                              ...(mooc.videos || []).map((v: any) => ({ ...v, type: 'video' })),
                              ...(mooc.quizzes || []).map((q: any) => ({ ...q, type: 'quiz' })),
                              ...(mooc.documents || []).map((d: any) => ({ ...d, type: 'document' })),
                            ].sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

                            return (
                              <div key={mooc.id || mIndex} className="overflow-hidden rounded-xl border border-border/30 bg-background/30">
                                <button
                                  onClick={() => toggleSection(key)}
                                  className="w-full p-4 text-left transition-colors hover:bg-background/50 flex items-center justify-between"
                                >
                                  <div className="flex-1">
                                    <h4 className="font-semibold flex items-center gap-2 text-foreground">
                                      <span className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0">
                                        {mIndex + 1}
                                      </span>
                                      {mooc.title}
                                    </h4>
                                    <div className="flex items-center gap-3 ml-8 mt-1">
                                      {(mooc.videos?.length ?? 0) > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/50">
                                          <Clapperboard className="h-3 w-3" />
                                          {mooc.videos.length} Video
                                        </span>
                                      )}
                                      {(mooc.quizzes?.length ?? 0) > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/50">
                                          <ClipboardList className="h-3 w-3" />
                                          {mooc.quizzes.length} Quiz
                                        </span>
                                      )}
                                      {(mooc.documents?.length ?? 0) > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/50">
                                          <FileText className="h-3 w-3" />
                                          {mooc.documents.length} Tài liệu
                                        </span>
                                      )}
                                      {lessons.length === 0 && (
                                        <span className="text-[10px] text-foreground/30 font-medium">Chưa có nội dung</span>
                                      )}
                                    </div>
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
                                    {lessons.map((lesson: any, lIdx: number) => (
                                      <div
                                        key={lesson.id || `${lesson.type}-${lIdx}`}
                                        className="flex items-center justify-between p-4 border-b border-border/10 last:border-b-0 hover:bg-background/40 transition-colors cursor-pointer group/lesson"
                                        onClick={() => setSelectedLesson(lesson)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/50 text-foreground/60 shrink-0 group-hover/lesson:bg-primary/10 group-hover/lesson:text-primary transition-colors">
                                            {lesson.type === 'video' ? <PlayCircle className="h-4 w-4" />
                                              : lesson.type === 'quiz' ? <Timer className="h-4 w-4" />
                                              : <FileText className="h-4 w-4" />}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-foreground group-hover/lesson:text-primary transition-colors">{lesson.title}</p>
                                            <p className="text-xs text-foreground/40">
                                              {lesson.type === 'video' ? 'Video' : lesson.type === 'quiz' ? 'Bài kiểm tra' : 'Tài liệu'}
                                            </p>
                                          </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover/lesson:opacity-100 transition-opacity text-primary">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-4 sticky top-6">

                  {/* Author */}
                  <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                    <div className="relative space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Giảng viên</h3>
                        {course.author && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Xác minh
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border/60 bg-background">
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="h-full w-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=128`; }}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-lg font-semibold text-foreground">{authorName}</h4>
                          {course.author?.email && (
                            <p className="text-sm text-foreground/60">{course.author.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Pricing */}
                  <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Thông tin giá</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/60">Giá gốc</span>
                        <span className="font-black text-foreground">
                          {course.isFree || course.price === 0 ? 'Miễn phí' : formatCurrency(course.price)}
                        </span>
                      </div>
                      {course.salePrice > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground/60">Giá KM</span>
                          <span className="font-black text-primary">{formatCurrency(course.salePrice)}</span>
                        </div>
                      )}
                      {course.discountPercent > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground/60">Giảm giá</span>
                          <span className="font-black text-rose-500">-{course.discountPercent}%</span>
                        </div>
                      )}
                      <div className="h-px bg-border/30" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">Giá cuối</span>
                        <span className="text-2xl font-black text-primary">
                          {course.isFree || course.price === 0
                            ? 'Miễn phí'
                            : formatCurrency(course.salePrice > 0 ? course.salePrice : course.price)}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Meta */}
                  <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-5 backdrop-blur space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Thông tin</h3>
                    {[
                      { label: 'Tạo ngày', value: formatDate(course.createdDate) },
                      { label: 'Slug', value: course.slug, mono: true },
                      { label: 'ID', value: course.id, mono: true, truncate: true },
                      ...(course.level ? [{ label: 'Cấp độ', value: LEVEL_MAP[course.level] ?? course.level }] : []),
                      ...(course.categoryName ? [{ label: 'Danh mục', value: course.categoryName }] : []),
                    ].map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-muted-foreground/60 font-bold uppercase tracking-wider shrink-0">{item.label}</span>
                        <span
                          className={`text-xs font-medium text-right ${(item as any).mono ? 'font-mono' : ''} ${(item as any).truncate ? 'truncate max-w-[120px]' : ''}`}
                          title={(item as any).truncate ? item.value : undefined}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Rating summary */}
                  {(course.totalRate ?? 0) > 0 && (
                    <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground mb-4">Đánh giá</h3>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-5xl font-black text-foreground tabular-nums">
                          {(course.averageRate ?? 0).toFixed(1)}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-5 w-5 ${s <= Math.round(course.averageRate ?? 0) ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{course.totalRate ?? 0} đánh giá</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Status Confirm Dialog ── */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={(open) => { if (!open) cancelStatusChange(); }}>
        <AlertDialogContent className="max-w-xl rounded-2xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">
              {pendingStatus === 'PUBLISHED' ? '✅ Duyệt khoá học?' : '❌ Từ chối khoá học?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground" asChild>
              <div>
                <span className="font-bold text-foreground">"{course.title}"</span>
                {pendingStatus === 'PUBLISHED' ? (
                  <p className="mt-1">
                    Khoá học sẽ được <span className="text-emerald-600 font-bold">công khai</span> và học viên có thể tìm thấy, đăng ký khoá học này.
                  </p>
                ) : (
                  <p className="mt-1">
                    Khoá học sẽ bị <span className="text-rose-600 font-bold">từ chối</span> và ẩn khỏi danh sách. Giảng viên cần chỉnh sửa lại trước khi gửi duyệt lần tiếp theo.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={cancelStatusChange}
              disabled={isStatusUpdating}
              className="rounded-lg font-bold"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusConfirm}
              disabled={isStatusUpdating}
              className={`${
                pendingStatus === 'PUBLISHED'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              } text-white rounded-lg font-black uppercase tracking-widest disabled:opacity-60`}
            >
              {isStatusUpdating
                ? 'Đang xử lý...'
                : pendingStatus === 'PUBLISHED'
                  ? 'Xác nhận duyệt'
                  : 'Xác nhận từ chối'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Lesson Preview Modal ── */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl bg-background rounded-2xl border border-border/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/20 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {selectedLesson.type === 'video' ? <PlayCircle className="h-5 w-5" /> : selectedLesson.type === 'quiz' ? <Timer className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg line-clamp-1">{selectedLesson.title}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{selectedLesson.type === 'video' ? 'Video Bài Giảng' : selectedLesson.type === 'quiz' ? 'Bài Kiểm Tra' : 'Tài Liệu'}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-rose-500/10 hover:text-rose-500" onClick={() => setSelectedLesson(null)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-muted/5">
              {selectedLesson.type === 'video' && (
                 <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-border/10">
                   {selectedLesson.videoUrl && getEmbedUrl(selectedLesson.videoUrl) ? (
                     <iframe width="100%" height="100%" src={getEmbedUrl(selectedLesson.videoUrl)} frameBorder="0" allowFullScreen />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                       <AlertTriangle className="h-10 w-10 opacity-50 text-rose-500" />
                       <p className="font-medium text-sm">Video không khả dụng hoặc định dạng không hỗ trợ</p>
                       <p className="text-xs break-all max-w-md text-center opacity-60 px-4">{selectedLesson.videoUrl || 'Không có URL'}</p>
                     </div>
                   )}
                 </div>
              )}
              {selectedLesson.type === 'document' && (
                 <div className="flex flex-col items-center justify-center p-10 bg-background rounded-xl border border-border/20 text-center gap-4">
                   <FileText className="h-16 w-16 text-primary/40" />
                   <p className="text-muted-foreground max-w-sm">Tài liệu "{selectedLesson.title}" có thể được xem trực tiếp hoặc tải về máy.</p>
                   <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                     {selectedLesson.viewUrl && (
                       <a href={selectedLesson.viewUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all text-sm">
                         <Eye size={16} /> Xem trực tuyến
                       </a>
                     )}
                     {selectedLesson.downloadUrl && (
                       <a href={selectedLesson.downloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 outline outline-1 outline-border transition-all text-sm">
                         <ArrowDownToLine size={16} /> Tải tài liệu
                       </a>
                     )}
                   </div>
                 </div>
              )}
              {selectedLesson.type === 'quiz' && (
                 <div className="space-y-6 mt-4 pb-8">
                   <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                     <div className="p-6 rounded-xl border border-border/20 bg-background flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                       <Timer className="h-8 w-8 text-amber-500 mb-2" />
                       <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Thời gian làm bài</p>
                       <p className="text-2xl font-black text-foreground">{selectedLesson.timeLimit ? `${Math.floor(selectedLesson.timeLimit / 60)} phút` : 'Không giới hạn'}</p>
                     </div>
                     <div className="p-6 rounded-xl border border-border/20 bg-background flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                       <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                       <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Điểm đỗ yêu cầu</p>
                       <p className="text-2xl font-black text-foreground">{selectedLesson.passingScore ? `${selectedLesson.passingScore}%` : 'Không xác định'}</p>
                     </div>
                   </div>

                   {/* Quiz Questions List */}
                   <div className="max-w-4xl mx-auto space-y-4 pt-4 border-t border-border/20">
                     <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Danh sách câu hỏi 
                        {quizQuestions.length > 0 && <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">{quizQuestions.length} câu</Badge>}
                     </h4>
                     
                     {isQuizLoading ? (
                       <div className="py-12 flex flex-col items-center justify-center gap-3">
                         <ThunderLoader size="lg" animate="thunder" />
                         <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Đang tải câu hỏi...</p>
                       </div>
                     ) : quizQuestions.length > 0 ? (
                       <div className="space-y-4">
                         {[...quizQuestions]
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((q, idx) => (
                           <div key={q.id} className="p-5 bg-background/50 border border-border/20 rounded-2xl shadow-sm space-y-4 hover:border-border/40 transition-colors">
                             <div className="flex items-start gap-3">
                               <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                                 {idx + 1}
                               </div>
                               <p className="font-semibold text-foreground mt-1 leading-relaxed">{q.content}</p>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                               {[...q.answers]
                                  .map((a, aIdx) => (
                                 <div key={a.id} className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${a.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 shadow-sm shadow-emerald-500/5' : 'bg-muted/30 border-border/20'}`}>
                                   <div className={`mt-0.5 shrink-0 h-5 w-5 rounded-full flex items-center justify-center border shadow-sm ${a.isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-border bg-background text-transparent'}`}>
                                      <CheckCircle2 className={`h-3.5 w-3.5 ${a.isCorrect ? 'opacity-100' : 'opacity-0'}`} />
                                   </div>
                                   <span className={`text-sm ${a.isCorrect ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-foreground/80 font-medium'}`}>{a.content}</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="py-16 flex flex-col items-center justify-center text-muted-foreground bg-background/50 rounded-2xl border border-dashed border-border/40">
                         <Target className="h-12 w-12 opacity-20 mb-4" />
                         <p className="font-medium">Chưa có câu hỏi nào trong bài kiểm tra này.</p>
                       </div>
                     )}
                   </div>
                 </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};
