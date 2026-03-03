'use client';

import { observer } from '@legendapp/state/react';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { courseState$, courseActions } from '../store';
import { LessonContent } from './LessonContent';
import { PlayCircle, FileText, HelpCircle, ChevronLeft, Menu, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ThunderLoader } from '@/components/thunder-loader';

export const LearningView = observer(({ slug }: { slug: string }) => {
  const { course, refresh } = useCourseDetail(slug);
  const currentCourse = course;
  const currentLesson = courseState$.currentLesson.get();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMoocs, setExpandedMoocs] = useState<Record<string, boolean>>({});

  const toggleMooc = (moocId: string) => {
    setExpandedMoocs(prev => ({ ...prev, [moocId]: !prev[moocId] }));
  };

  const allLessons = useMemo(() => {
    if (!currentCourse) return [];
    return (currentCourse.moocs ?? [])
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      .flatMap(mooc => {
        const lessons = [
            ...(mooc.videos || []).map(v => ({ ...v, type: 'video' })),
            ...(mooc.quizzes || []).map(q => ({ ...q, type: 'quiz' })),
            ...(mooc.documents || []).map(d => ({ ...d, type: 'document' }))
        ].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        return lessons.map(lesson => ({
            ...lesson,
            isLocked: mooc.isUnlocked === false || (lesson as any).isUnlocked === false
        }));
      });
  }, [currentCourse]);

  useEffect(() => {
    if (currentCourse?.moocs) {
      setExpandedMoocs(prev => {
        if (Object.keys(prev).length === 0) {
          const init: Record<string, boolean> = {};
          currentCourse.moocs?.forEach(m => init[m.id] = true);
          return init;
        }
        return prev;
      });
    }
  }, [currentCourse]);

  useEffect(() => {
    if (!currentCourse || allLessons.length === 0) return;
    
    // Validate if the currently selected lesson actually belongs to this opened course
    const isLessonValid = currentLesson && allLessons.some(l => l.id === currentLesson.id);
    
    if (!currentLesson || !isLessonValid) {
      courseActions.setCurrentLesson(allLessons[0] as any);
    }
  }, [currentCourse, currentLesson, allLessons]);

  const validLesson = allLessons.find(l => l.id === currentLesson?.id) || allLessons[0];
  const currentIdx = allLessons.findIndex(l => l.id === validLesson?.id);
  const previousLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx !== -1 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const isLoading = !currentCourse || !allLessons || allLessons.length === 0;

  return (
    <>
    <div className={`flex fixed inset-0 z-50 bg-background overflow-hidden transition-all duration-500 ${isLoading ? 'pointer-events-none blur-sm opacity-50' : ''}`}>
      {/* Sidebar - Course Content */}
      <div className={`
        ${isSidebarOpen ? 'w-96' : 'w-0'} 
        transition-all duration-300 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col overflow-hidden
      `}>
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-black text-xl line-clamp-1">{currentCourse?.title || 'Đang tải khóa học...'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col py-2">
            {(currentCourse?.moocs ?? []).length > 0 ? (
              [...(currentCourse?.moocs ?? [])]
                .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                .map((mooc, mIndex) => {
                  const lessons = [
                      ...(mooc.videos || []).map(v => ({ ...v, type: 'video' })),
                      ...(mooc.quizzes || []).map(q => ({ ...q, type: 'quiz' })),
                      ...(mooc.documents || []).map(d => ({ ...d, type: 'document' }))
                  ].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

                return (
                  <div key={mooc.id} className="border-b border-border/40 pb-2 mb-2">
                    <button 
                      onClick={() => toggleMooc(mooc.id)}
                      className={`w-full flex items-center justify-between py-4 px-6 transition-colors group hover:bg-muted/50`}
                    >
                      <h3 className={`text-sm font-black uppercase tracking-widest transition-colors text-left flex-1 flex items-center gap-2 ${mooc.isUnlocked === false ? 'text-muted-foreground/80' : 'text-muted-foreground group-hover:text-primary'}`}>
                        {mIndex + 1}. {mooc.title}
                        {mooc.isCompleted && mooc.isUnlocked !== false && <CheckCircle2 className="h-3 w-3 text-green-500 inline-block" />}
                      </h3>
                      <div className="flex items-center gap-2">
                         {mooc.isUnlocked === false && <Lock className="h-4 w-4 text-muted-foreground/50" />}
                         <ChevronLeft className={`h-4 w-4 text-muted-foreground transition-transform ${expandedMoocs[mooc.id] ? '-rotate-90' : 'rotate-180'}`} />
                      </div>
                    </button>
                    {expandedMoocs[mooc.id] && (
                      <div className="flex flex-col pt-1">
                        {lessons.map((lesson: any) => {
                          const isLocked = mooc.isUnlocked === false || lesson.isUnlocked === false;
                          const isActive = validLesson?.id === lesson.id;
                          const isCompleted = courseState$.completedLessons.get().includes(lesson.id);
                          
                          return (
                          <button
                            key={lesson.id}
                            disabled={isLocked}
                            onClick={() => courseActions.setCurrentLesson(lesson)}
                            className={`
                              w-full flex items-center gap-3 py-4 pl-10 pr-6 transition-all text-left border-t border-border/10
                              ${isLocked ? 'opacity-60 cursor-not-allowed text-muted-foreground' : (isActive ? 'bg-primary/5 text-primary border-l-4 border-l-primary' : 'hover:bg-muted/50 text-muted-foreground')}
                            `}
                          >
                            <div className="flex-shrink-0 relative">
                              {lesson.type === 'video' && <PlayCircle className="h-4 w-4" />}
                              {lesson.type === 'document' && <FileText className="h-4 w-4" />}
                              {lesson.type === 'quiz' && <HelpCircle className="h-4 w-4" />}
                            </div>
                            <span className={`text-sm flex-1 line-clamp-2 leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {lesson.title}
                            </span>
                            {isCompleted && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            )}
                            {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />}
                          </button>
                        )})}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="p-4 text-sm text-muted-foreground text-center">Khóa học hiện chưa có nội dung.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-muted/10 relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link href={`/course/${currentCourse?.slug || '#'}`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Quay lại trang giới thiệu
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-muted-foreground uppercase">Tiến trình học ({Math.round(currentCourse?.progress || 0)}%)</span>
                <div className="w-32 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${currentCourse?.progress || 0}%` }} />
                </div>
             </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <div className="max-w-5xl mx-auto p-8 lg:p-12 mb-8">
            {validLesson ? (
              <LessonContent lesson={validLesson} onRefresh={refresh} />
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                 <div className="p-10 rounded-full bg-primary/5 animate-pulse">
                    <PlayCircle className="h-20 w-20 text-primary opacity-20" />
                 </div>
                 <h2 className="text-2xl font-bold text-muted-foreground">Chọn một bài học để bắt đầu</h2>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <footer className="h-16 shrink-0 border-t border-border/50 bg-card/30 backdrop-blur-md flex items-center justify-between px-8 z-10">
            <Button 
                variant="ghost" 
                className="font-bold gap-2 text-muted-foreground"
                disabled={!previousLesson || previousLesson.isLocked}
                onClick={() => previousLesson && courseActions.setCurrentLesson(previousLesson as any)}
            >
                <ChevronLeft className="h-4 w-4" /> Bài trước
            </Button>
            <div className="text-sm font-bold text-muted-foreground">
                Đang xem: <span className="text-foreground">{validLesson?.title || '...'}</span>
            </div>
            <Button 
                variant="default" 
                className="font-bold gap-2 bg-primary text-white disabled:opacity-50"
                disabled={!nextLesson || nextLesson.isLocked}
                onClick={() => nextLesson && courseActions.setCurrentLesson(nextLesson as any)}
            >
                Bài tiếp theo <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
        </footer>
      </div>
    </div>

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px]">
          <ThunderLoader className="w-32 h-32" variant="default" animate="thunder" showGlow={true} showFill={true} />
        </div>
      )}
    </>
  );
});
