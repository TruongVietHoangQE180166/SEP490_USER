'use client';

import React, { useState, useEffect } from 'react';
import { useTeacherCourseDetail } from '../hooks/useTeacherCourseDetail';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, AlertTriangle, RefreshCw, 
  LayoutDashboard, ListTree, Save, 
  Sparkles, Settings, Eye, 
  Layers, BarChart3, Info
} from 'lucide-react';
import { ThunderLoader } from '@/components/thunder-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

import { CourseHeader } from './detail/CourseHeader';
import { CourseVideoPlayer } from './detail/CourseVideoPlayer';
import { CourseStatsTable } from './detail/CourseStatsTable';
import { CourseSidebar } from './detail/CourseSidebar';
import { LessonPreviewModal } from './detail/LessonPreviewModal';
import { CourseCurriculumEditor } from './detail/CourseCurriculumEditor';
import { containerVariants, LEVEL_MAP } from './detail/constants';

interface TeacherCourseDetailPanelProps {
  courseId: string;
  onBack: () => void;
}

type TabType = 'overview' | 'curriculum';

export const TeacherCourseDetailPanel = ({ courseId, onBack }: TeacherCourseDetailPanelProps) => {
  const {
    course,
    isLoading,
    error,
    reload,
    expandedSections,
    toggleSection,
    isPlaying,
    setIsPlaying,
    moocs: initialMoocs,
    totalLessonsCount,
    selectedLesson,
    setSelectedLesson,
    quizQuestions,
    isQuizLoading,
    handleCreateMooc,
    isCreatingMooc,
    handleUpdateMooc,
    isUpdatingMooc,
    handleDeleteMooc,
    isDeletingMooc,
    handleDeleteVideo,
    isDeletingVideo,
    handleDeleteDocument,
    isDeletingDocument,
    handleDeleteQuiz,
    isDeletingQuiz,
    handleUpdateQuizQuestions,
    isUpdatingQuestions,
  } = useTeacherCourseDetail(courseId);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [localMoocs, setLocalMoocs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Sync moocs from API once loaded
  useEffect(() => {
    if (initialMoocs && initialMoocs.length > 0) {
      // Map API moocs to our editor format (flatten lessons if needed)
      const mapped = initialMoocs.map((m: any) => ({
        ...m,
        lessons: [
          ...(m.videos || []).map((v: any) => ({ ...v, type: 'video' })),
          ...(m.quizzes || []).map((q: any) => ({ ...q, type: 'quiz' })),
          ...(m.documents || []).map((d: any) => ({ ...d, type: 'document' })),
        ].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      }));
      setLocalMoocs(mapped);
    }
  }, [initialMoocs]);

  const handleSaveCurriculum = async () => {
    setIsSaving(true);
    // TODO: Implement save logic through service
    console.log('Saving curriculum:', localMoocs);
    setTimeout(() => {
        setIsSaving(false);
        toast.success('Đã cập nhật chương trình giảng dạy!');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ThunderLoader size="xl" animate="thunder" showGlow />
        <p className="text-muted-foreground font-black text-xs uppercase animate-pulse">
          Đang chuẩn bị không gian làm việc...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-500/10 flex items-center justify-center text-rose-500 mb-2">
            <AlertTriangle className="h-10 w-10" />
        </div>
        <div className="space-y-1">
            <h3 className="text-xl font-black">Xảy ra lỗi khi tải dữ liệu</h3>
            <p className="text-muted-foreground font-medium max-w-sm">{error ?? 'Hệ thống không tìm thấy tài liệu khoá học này.'}</p>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button variant="outline" onClick={onBack} className="rounded-xl font-bold h-12 px-8 border-2">
            Quay lại
          </Button>
          <Button onClick={reload} className="rounded-xl font-black h-12 px-10 gap-2 bg-primary">
            <RefreshCw size={18} /> Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-background/50 pb-20">
      {/* ── Dashboard Top Bar ── */}
      <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-10 w-10 p-0 rounded-xl hover:bg-muted transition-colors border-2 border-border/20"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="h-8 w-[1px] bg-border/40 hidden sm:block" />
            <div className="hidden sm:block">
                <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] block mb-0.5">BIÊN TẬP NỘI DUNG KHÓA HỌC</span>
                <h1 className="text-sm font-black tracking-tight">{course.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom Tabs moved to Top Header for better access */}
            <div className="hidden lg:flex p-1 bg-muted/30 border border-border/40 rounded-xl min-w-[320px]">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2.5 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'overview' ? "bg-background shadow-md text-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <LayoutDashboard size={14} /> <span>Tổng quan</span>
                </button>
                <button
                    onClick={() => setActiveTab('curriculum')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2.5 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'curriculum' ? "bg-background shadow-md text-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <ListTree size={14} /> <span>Bài giảng</span>
                </button>
            </div>
            {/* Action buttons removed as requested */}
          </div>
        </div>
      </div>

      <div className="relative px-6 pt-10">
        <div className="mx-auto max-w-7xl">
          {/* ── Page Header / Course Summary ── */}
          <div className="mb-10 flex flex-col gap-6 relative">
            <div className="flex items-start gap-6 relative flex-1 min-w-0">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary/5 border-2 border-primary/10 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    <Layers size={32} className="text-primary/40" />
                 </div>
                 <div className="space-y-3 pt-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-widest">
                            Trạng thái: Hoạt động
                        </span>
                        <span className={cn(
                            "text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest",
                            (course.level as string) === 'LEVEL_5' || course.courseLevel === 'Nâng cao' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            (course.level as string) === 'LEVEL_4' || course.courseLevel === 'Thực hành' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                            (course.level as string) === 'LEVEL_3' || course.level === 'INTERMEDIATE' || course.courseLevel === 'Trung cấp' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            (course.level as string) === 'LEVEL_2' || course.courseLevel === 'Nền tảng' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                            Cấp độ: {course.courseLevel || (course.level && LEVEL_MAP[course.level as any]) || 'Nhập môn'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none break-words text-foreground">{course.title}</h2>
                 </div>
            </div>

            {/* Mobile Tabs (only visible on small screens) */}
            <div className="lg:hidden flex p-1 bg-muted/30 border border-border/40 rounded-xl w-full">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2.5 h-10 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'overview' ? "bg-background shadow-md text-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <LayoutDashboard size={14} /> <span>Tổng quan</span>
                </button>
                <button
                    onClick={() => setActiveTab('curriculum')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2.5 h-10 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'curriculum' ? "bg-background shadow-md text-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <ListTree size={14} /> <span>Bài giảng</span>
                </button>
            </div>
          </div>

          <div className="relative">
            {activeTab === 'overview' ? (
                <div className="space-y-10">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <CourseVideoPlayer course={course} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onReload={reload} />

                            <CourseStatsTable course={course} moocsLength={initialMoocs.length} totalLessonsCount={totalLessonsCount} />

                            {/* Course Description Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card border-2 border-border/40 p-8 rounded-xl shadow-sm space-y-6"
                            >
                                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                        <Info size={20} />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight uppercase">Mô tả khóa học</h3>
                                </div>
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                    <p className="text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                                        {course.description || "Chưa có mô tả cho khóa học này."}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="lg:col-span-1">
                            <CourseSidebar course={course} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <CourseCurriculumEditor 
                        moocs={localMoocs} 
                        onUpdateMoocs={setLocalMoocs}
                        onLessonPreview={setSelectedLesson}
                        onLessonEdit={(lesson, moocId) => {
                            console.log('Edit/Add lesson:', lesson, 'for mooc:', moocId);
                            setSelectedLesson({ ...lesson, isEditing: true, targetMoocId: moocId });
                        }}
                        onCreateMooc={handleCreateMooc}
                        isCreatingMooc={isCreatingMooc}
                        onUpdateMooc={handleUpdateMooc}
                        isUpdatingMooc={isUpdatingMooc}
                        onDeleteMooc={handleDeleteMooc}
                        isDeletingMooc={isDeletingMooc}
                        onDeleteVideo={handleDeleteVideo}
                        isDeletingVideo={isDeletingVideo}
                        onDeleteDocument={handleDeleteDocument}
                        isDeletingDocument={isDeletingDocument}
                        onDeleteQuiz={handleDeleteQuiz}
                        isDeletingQuiz={isDeletingQuiz}
                    />
                </div>
            )}
          </div>
        </div>
      </div>

      {selectedLesson && (
        <LessonPreviewModal
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
          quizQuestions={quizQuestions}
          isQuizLoading={isQuizLoading}
          onUpdateQuizQuestions={handleUpdateQuizQuestions}
          isUpdatingQuestions={isUpdatingQuestions}
          onSuccess={() => {
            setSelectedLesson(null);
            reload();
          }}
        />
      )}
    </main>
  );
};
