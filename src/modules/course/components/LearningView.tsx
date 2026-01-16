'use client';

import { observer } from '@legendapp/state/react';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { courseState$, courseActions } from '../store';
import { LessonContent } from './LessonContent';
import { PlayCircle, FileText, HelpCircle, ChevronLeft, Menu, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export const LearningView = observer(({ id }: { id: string }) => {
  const { course } = useCourseDetail(id);
  const currentCourse = course;
  const currentLesson = courseState$.currentLesson.get();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (currentCourse && !currentLesson && (currentCourse.moocs ?? []).length > 0) {
      const firstMooc = currentCourse.moocs[0];
      const firstLesson = firstMooc.videos?.[0] || firstMooc.quizzes?.[0] || firstMooc.documents?.[0];
      if (firstLesson) {
        courseActions.setCurrentLesson(firstLesson as any);
      }
    }
  }, [currentCourse, currentLesson]);

  if (!currentCourse) return <div className="p-20 text-center">Đang tải phòng học...</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar - Course Content */}
      <div className={`
        ${isSidebarOpen ? 'w-96' : 'w-0'} 
        transition-all duration-300 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col overflow-hidden
      `}>
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-black text-xl line-clamp-1">{currentCourse.title}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {(currentCourse.moocs ?? []).length > 0 ? (
              [...(currentCourse.moocs ?? [])]
                .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                .map((mooc, mIndex) => {
                  const lessons = [
                      ...(mooc.videos || []).map(v => ({ ...v, type: 'video' })),
                      ...(mooc.quizzes || []).map(q => ({ ...q, type: 'quiz' })),
                      ...(mooc.documents || []).map(d => ({ ...d, type: 'document' }))
                  ].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

                return (
                  <div key={mooc.id} className="space-y-3">
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest px-2">
                      {mIndex + 1}. {mooc.title}
                    </h3>
                    <div className="space-y-1">
                      {lessons.map((lesson: any) => (
                        <button
                          key={lesson.id}
                          onClick={() => courseActions.setCurrentLesson(lesson)}
                          className={`
                            w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                            ${currentLesson?.id === lesson.id 
                              ? 'bg-primary/10 text-primary shadow-sm' 
                              : 'hover:bg-muted text-muted-foreground'}
                          `}
                        >
                          <div className="flex-shrink-0">
                            {lesson.type === 'video' && <PlayCircle className="h-4 w-4" />}
                            {lesson.type === 'document' && <FileText className="h-4 w-4" />}
                            {lesson.type === 'quiz' && <HelpCircle className="h-4 w-4" />}
                          </div>
                          <span className="text-sm font-bold flex-1 line-clamp-1">{lesson.title}</span>
                        </button>
                      ))}
                    </div>
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
            <Link href={`/course/${currentCourse.slug}`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Quay lại trang giới thiệu
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-muted-foreground uppercase">Tiến trình học</span>
                <div className="w-32 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary w-1/3 rounded-full" />
                </div>
             </div>
             <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/5">Nhận chứng chỉ</Button>
          </div>
        </header>

        {/* Content Body */}
        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-8 lg:p-12 mb-20">
            {currentLesson ? (
              <LessonContent lesson={currentLesson} />
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                 <div className="p-10 rounded-full bg-primary/5 animate-pulse">
                    <PlayCircle className="h-20 w-20 text-primary opacity-20" />
                 </div>
                 <h2 className="text-2xl font-bold text-muted-foreground">Chọn một bài học để bắt đầu</h2>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom Navigation */}
        <footer className="h-16 border-t border-border/50 bg-card/30 backdrop-blur-md flex items-center justify-between px-8 absolute bottom-0 left-0 right-0 z-10">
            <Button variant="ghost" className="font-bold gap-2 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" /> Bài trước
            </Button>
            <div className="text-sm font-bold text-muted-foreground">
                Đang xem: <span className="text-foreground">{currentLesson?.title}</span>
            </div>
            <Button variant="default" className="font-bold gap-2 bg-primary text-white">
                Bài tiếp theo <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
        </footer>
      </div>
    </div>
  );
});
