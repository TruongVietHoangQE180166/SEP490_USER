'use client';

import React, { useEffect } from 'react';
import { observer } from '@legendapp/state/react';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  ChevronRight,
  Inbox,
  Loader2,
  Layout,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminDiscussionState$, adminDiscussionActions } from '../store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseDiscussion } from '@/modules/course/components/CourseDiscussion';

export const AdminDiscussionMain = observer(() => {
  const state = adminDiscussionState$.get();
  const { courses, selectedCourseId, isLoading, error } = state;
  
  useEffect(() => {
    // Reset selection when entering AND leaving the page
    adminDiscussionState$.selectedCourseId.set(null);
    return () => {
      adminDiscussionState$.selectedCourseId.set(null);
    };
  }, []);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar - Course List */}
      <div className={cn(
        "w-full md:w-80 border-r border-border/40 flex flex-col bg-muted/2",
        selectedCourseId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-border/40 space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Inbox size={22} className="text-primary" />
              Tổng quan Thảo luận
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-none font-black px-2.5">
              {courses.length}
            </Badge>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Tìm tên khóa học..."
              className="w-full bg-muted/30 border border-border/30 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3 text-muted-foreground/50">
              <Loader2 className="animate-spin text-primary/40" size={32} />
              <p className="text-[11px] font-black uppercase tracking-widest">Đang quét hệ thống...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
              <Layout size={48} className="text-muted/10" />
              <p className="text-xs font-bold text-muted-foreground/40 leading-relaxed px-4">Không tìm thấy khóa học nào có thảo luận.</p>
            </div>
          ) : (
            courses.map(course => (
              <button
                key={course.id}
                onClick={() => adminDiscussionActions.selectCourse(course.id)}
                className={cn(
                  "w-full p-4 flex items-center gap-4 rounded-2xl transition-all duration-300 relative group text-left",
                  selectedCourseId === course.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.01] z-10" 
                    : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300",
                  selectedCourseId === course.id 
                    ? "bg-white/20 border-white/20" 
                    : "bg-muted/20 border-border/20 group-hover:border-primary/20"
                )}>
                  <BookOpen size={20} className={selectedCourseId === course.id ? "text-white" : "text-primary/60"} />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "text-[13px] font-black tracking-tight truncate transition-colors",
                      selectedCourseId === course.id ? "text-white" : "text-foreground/80"
                    )}>
                      {course.title}
                    </h3>
                    {(course as any).unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shrink-0 shadow-lg shadow-rose-500/20 animate-in zoom-in">
                        {(course as any).unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                {selectedCourseId === course.id && (
                  <ChevronRight size={16} className="text-white/40 self-center" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Area - Chat window */}
      <div className={cn(
        "flex-1 flex flex-col bg-background relative min-w-0",
        (!selectedCourseId || isLoading) ? "hidden md:flex items-center justify-center p-12" : "flex h-full"
      )}>
        {isLoading ? (
           <div className="flex flex-col items-center gap-5 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40 animate-pulse">Đang nạp kênh thảo luận...</p>
           </div>
        ) : !selectedCourseId ? (
          <div className="text-center space-y-8 max-w-sm px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mx-auto w-32 h-32">
               <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
               <div className="relative w-full h-full bg-muted/10 rounded-[2.5rem] flex items-center justify-center border border-border/20 shadow-xl">
                 <MessageSquare size={48} className="text-primary/20" />
               </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black tracking-tighter">Giám sát Thảo luận</h2>
              <p className="text-muted-foreground/60 text-sm font-medium leading-relaxed">
                Hệ thống tập trung tất cả các kênh thảo luận. Chọn một học phần để bắt đầu giám sát hoặc tham gia hỗ trợ.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Integrated Chat Header for Admin Dashboard */}
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between gap-6 bg-background/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
               <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-inner">
                     <BookOpen size={22} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 group/title">
                     <h3 className="text-sm font-black tracking-tight truncate w-full group-hover/title:text-primary transition-colors duration-300" title={selectedCourse?.title}>
                        {selectedCourse?.title}
                     </h3>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/80">
                        <div className="relative flex h-2 w-2">
                           <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                           <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </div>
                        <span className="uppercase tracking-widest">Kênh thảo luận công khai (Admin Mode)</span>
                     </div>
                  </div>
               </div>

               <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/20 hover:text-rose-500 font-black h-10 px-5 shrink-0 transition-all active:scale-95 shadow-sm border-2"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent(`open-banned-list-${selectedCourseId}`));
                }}
               >
                  <Ban className="h-4 w-4 mr-2" />
                  Quản lý cấm
               </Button>
            </div>

            <div className="flex-1 overflow-hidden">
               {/* Admin always has high permissions, so isEnrolled=true to view chat */}
               <CourseDiscussion courseId={selectedCourseId} isEnrolled={true} fullHeight={true} />
            </div>
          </>
        )}
      </div>
    </div>
  );
});
