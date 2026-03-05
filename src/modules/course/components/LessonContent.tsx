'use client';

import { observer } from '@legendapp/state/react';
import { Button } from '@/components/ui/button';
import { courseActions, courseState$ } from '../store';
import { useCourseTracking } from '../hooks/useCourseTracking';
import { CheckCircle2, Circle, FileText, Clock, Target, PlayCircle, Trophy, Lock, Loader2 } from 'lucide-react';
import { getEmbedUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export const LessonContent = observer(({ lesson, onRefresh }: { lesson: any, onRefresh?: () => void }) => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  
  const isCompleted = courseState$.completedLessons.get().includes(lesson.id);
  
  // Timers to enforce completion locks
  const [docTimeElapsed, setDocTimeElapsed] = useState(0);
  const [videoTimeElapsed, setVideoTimeElapsed] = useState(0);
  
  const { markAsCompleted, isUpdating } = useCourseTracking();

  // Constants
  const DOC_REQUIRED_TIME = 30; // 30 seconds for document
  const VIDEO_REQUIRED_TIME = 60; // 60 seconds (simulated as 90% of a video since iframe duration is untrackable)

  useEffect(() => {
    // Reset timers when lesson changes
    setDocTimeElapsed(0);
    setVideoTimeElapsed(0);
  }, [lesson.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lesson.type === 'document' && !isCompleted && docTimeElapsed < DOC_REQUIRED_TIME) {
      interval = setInterval(() => {
        setDocTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (lesson.type === 'video' && !isCompleted && videoTimeElapsed < VIDEO_REQUIRED_TIME) {
      interval = setInterval(() => {
        setVideoTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [lesson.type, lesson.id, isCompleted, docTimeElapsed, videoTimeElapsed]);

  if (lesson.isLocked) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-background to-muted border-4 border-border/40 shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
            <Lock className="h-16 w-16 text-muted-foreground/60" />
          </div>
        </div>
        <div className="text-center space-y-3 max-w-md mx-auto">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Nội dung này đang bị khóa</h2>
          <p className="text-muted-foreground font-medium">Bạn cần hoàn thành các nội dung trước đó hoặc có quyền truy cập để mở khóa bài học này.</p>
          <div className="pt-4">
            <Button 
                variant="outline" 
                className="rounded-full px-8 font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                onClick={() => {
                   // Redirect or suggest next action
                }}
            >
                Quay lại bài học khả dụng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (lesson.type === 'video') {
    const isVideoLocked = videoTimeElapsed < VIDEO_REQUIRED_TIME && !isCompleted;
    const remainingVideoTime = VIDEO_REQUIRED_TIME - videoTimeElapsed;
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl relative group ring-1 ring-border/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          {getEmbedUrl(lesson.videoUrl) ? (
            <iframe
              src={getEmbedUrl(lesson.videoUrl) as string}
              className="w-full h-full relative z-10"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-white/60 bg-neutral-900 border border-neutral-800">
                <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium text-lg">Video không khả dụng</p>
             </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 bg-card/50 p-6 rounded-xl border border-border/50">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                 <PlayCircle className="w-3.5 h-3.5" /> Video bài giảng
              </div>
              {isCompleted && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest">
                   <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                </div>
              )}
            </div>
            <h1 className="text-3xl font-black text-foreground leading-tight">{lesson.title}</h1>
            <p className="text-muted-foreground font-medium text-sm line-clamp-2">{lesson.description || 'Xem video để hoàn thành nội dung bài học này.'}</p>
          </div>
          <Button 
            disabled={isVideoLocked || isUpdating}
            variant={isCompleted ? "default" : "outline"} 
            className={`gap-2 shrink-0 rounded-full h-12 px-6 font-bold transition-all ${isCompleted ? 'shadow-lg shadow-primary/20 bg-primary text-white hover:scale-105' : (isVideoLocked ? 'bg-muted text-muted-foreground opacity-70 cursor-not-allowed' : 'bg-background text-foreground hover:bg-muted hover:scale-105')}`}
            onClick={async () => {
                if (isCompleted) return;
                const success = await markAsCompleted(lesson.id, 'VIDEO');
                if (success) {
                  if (onRefresh) onRefresh();
                }
            }}
          >
            {isUpdating ? (
               <Loader2 className="h-4 w-4 animate-spin" />
            ) : isVideoLocked ? (
              <>
                <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
                Đang xem ({remainingVideoTime}s)
              </>
            ) : (
              <>
                <CheckCircle2 className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-primary'}`} />
                {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (lesson.type === 'document') {
    const isDocLocked = docTimeElapsed < DOC_REQUIRED_TIME && !isCompleted;
    const remainingDocTime = DOC_REQUIRED_TIME - docTimeElapsed;

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-b from-card to-background rounded-xl border border-border/50 shadow-xl overflow-hidden text-center relative">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
          
          <div className="relative pt-16 px-8 pb-12">
            <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/10 border border-primary/20 relative z-10 group">
               <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
               <FileText className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                   <FileText className="w-3.5 h-3.5" /> Tài liệu đọc
                </div>
                {isCompleted && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                    </div>
                )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">{lesson.title}</h1>
            <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Tài liệu này được thiết kế để đọc ở một trang mới. Vui lòng bấm vào nút bên dưới để mở hoặc tải xuống phòng khi bạn cần lưu trữ.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                {lesson.viewUrl && (
                  <a href={lesson.viewUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                      <Button size="lg" className="rounded-full px-8 h-14 font-black transition-all hover:-translate-y-1 shadow-xl shadow-primary/20 text-lg w-full">
                          Mở xem tài liệu mới
                      </Button>
                  </a>
                )}
                {lesson.downloadUrl && (
                  <a href={lesson.downloadUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="rounded-full px-8 h-14 font-black transition-all hover:bg-muted text-lg w-full">
                          Tải xuống máy
                      </Button>
                  </a>
                )}
            </div>
          </div>
          
          <div className="bg-muted/30 py-6 border-t border-border/50 flex justify-center">
              <Button 
                disabled={isDocLocked || isUpdating}
                variant={isCompleted ? "default" : "outline"} 
                size="lg"
                className={`gap-2 font-bold rounded-full transition-all h-12 px-8 ${isCompleted ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105' : (isDocLocked ? 'bg-muted text-muted-foreground opacity-70 cursor-not-allowed' : 'bg-background text-foreground hover:bg-muted hover:scale-105')}`}
                onClick={async () => {
                    if (isCompleted) return;
                    const success = await markAsCompleted(lesson.id, 'DOCUMENT');
                    if (success) {
                        if (onRefresh) onRefresh();
                    }
                }}
              >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isDocLocked ? (
                    <>
                      <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
                      Vui lòng đọc ít nhất {remainingDocTime} giây...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-primary'}`} /> 
                      {isCompleted ? 'Đã đọc xong tài liệu này' : 'Đánh dấu đã đọc xong'}
                    </>
                  )}
              </Button>
          </div>
        </div>
      </div>
    );
  }

  if (lesson.type === 'quiz') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card rounded-xl border border-border/50 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 filter blur-[2px] pointer-events-none">
             <Trophy className="w-64 h-64 text-primary" />
          </div>
          
          <div className="relative pt-16 px-8 sm:px-12 pb-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                   <Trophy className="w-3.5 h-3.5" /> Bài kiểm tra
                </div>
                {isCompleted && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                    </div>
                )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">{lesson.title}</h1>
            <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto mb-12">
              Hoàn thành bài kiểm tra để đánh giá kiến thức và tiếp tục mở khóa các nội dung tiếp theo của khóa học.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <div className="p-6 bg-background rounded-lg border border-border/50 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Thời gian</p>
                    <p className="text-3xl font-black text-foreground">{lesson.timeLimit ? `${lesson.timeLimit}s` : 'Vô cực'}</p>
                </div>
                <div className="p-6 bg-background rounded-lg border border-border/50 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Target className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Tỷ lệ qua môn</p>
                    <p className="text-3xl font-black text-foreground">{lesson.passingScore ? `${lesson.passingScore}%` : '-'}</p>
                </div>
            </div>

            <div className="flex justify-center">
                <Button 
                   size="lg" 
                   className="rounded-full px-14 h-16 font-black transition-all hover:-translate-y-1 shadow-2xl shadow-primary/30 text-xl w-full sm:w-auto"
                   onClick={() => router.push(`/learn/${slug}/quiz/${lesson.id}`)}
                >
                    Vào giao diện kiểm tra
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});
