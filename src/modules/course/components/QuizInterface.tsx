import React, { useState, useEffect, useMemo } from 'react';
import { observer } from '@legendapp/state/react';
import { courseState$, courseActions } from '../store';
import { useQuizQuestions } from '../hooks/useQuizQuestions';
import { useCourseTracking } from '../hooks/useCourseTracking';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, Target, AlertCircle, CheckCircle2, Timer, LogOut, SendHorizontal, Flag, XCircle } from 'lucide-react';
import { ThunderLoader } from '@/components/thunder-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { toast } from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

export const QuizInterface = observer(({ quizId: propQuizId, slug }: { quizId?: string; slug?: string }) => {
  const router = useRouter();
  const storeQuizId = courseState$.currentQuizId.get();
  const quizId = propQuizId || storeQuizId;
  
  const { course } = useCourseDetail(slug || '');
  
  const lesson = useMemo(() => {
    if (!course || !quizId) return courseState$.currentLesson.get();
    
    // Find quiz in course to get metadata
    for (const mooc of (course.moocs || [])) {
        const quiz = (mooc.quizzes || []).find(q => q.id === quizId);
        if (quiz) return { ...quiz, type: 'quiz' };
    }
    return courseState$.currentLesson.get();
  }, [course, quizId, courseState$.currentLesson.get()]);

  const { questions, isLoading: isQuestionsLoading } = useQuizQuestions(quizId || undefined);
  const { markAsCompleted } = useCourseTracking();
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // States for confirmation dialogs
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Prevent accidental reload/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && Object.keys(userAnswers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted, userAnswers]);

  // Handle browser back button (Popstate)
  useEffect(() => {
    if (isSubmitted) return;

    // Push redundant state to keep user on same page
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
       setShowExitDialog(true);
       // Re-push state so user doesn't actually leave
       window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSubmitted]);

  // Initialize timer
  useEffect(() => {
    if (lesson?.type === 'quiz' && lesson.timeLimit) {
      setTimeLeft(Number(lesson.timeLimit));
    }
  }, [lesson]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const toggleFlag = (questionId: string) => {
    if (isSubmitted) return;
    setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    let correctCount = 0;
    questions.forEach(q => {
      const correctAnswer = q.answers.find(a => a.isCorrect);
      if (userAnswers[q.id] === correctAnswer?.id) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / (questions.length || 1)) * 100);
    const isPassed = calculatedScore >= (lesson?.passingScore || 80);
    
    setScore(calculatedScore);
    setCorrectAnswersCount(correctCount);
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    setCurrentQuestionIdx(-1); // Show summary screen immediately after submit

    if (isPassed) {
        toast.success(`Chúc mừng! Bạn đã vượt qua bài thi với ${calculatedScore}%`);
        if (quizId) {
            markAsCompleted(quizId, 'QUIZ');
        }
    } else {
        toast.error(`Rất tiếc! Bạn chỉ đạt ${calculatedScore}%. Cần ít nhất ${lesson?.passingScore || 80}% để đạt.`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitConfirm = () => {
    if (slug) {
      router.push(`/learn/${slug}`);
    } else {
      courseActions.setQuizMode(false);
    }
  };

  if (isQuestionsLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <ThunderLoader className="w-24 h-24 mb-4" variant="default" animate="thunder" showGlow={true} showFill={true} />
        <p className="text-muted-foreground font-medium animate-pulse">Đang chuẩn bị câu hỏi...</p>
      </div>
    );
  }

  if (isSubmitted && currentQuestionIdx === -1) {
    const isPassed = score >= (lesson?.passingScore || 80);
    return (
      <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 text-center animate-in zoom-in-95 duration-500">
        <div className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-6 md:mb-8 shadow-2xl ${isPassed ? 'bg-green-500/10 text-green-500 shadow-green-500/20' : 'bg-red-500/10 text-red-500 shadow-red-500/20'}`}>
          {isPassed ? <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" /> : <AlertCircle className="w-10 h-10 md:w-12 md:h-12" />}
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4">{isPassed ? 'Chúc mừng!' : 'Rất tiếc!'}</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-2">
          Kết quả: <span className={`font-black ${isPassed ? 'text-green-500' : 'text-red-500'}`}>{score}%</span>
        </p>
        
        <div className="p-5 md:p-8 rounded-xl bg-card border border-border/50 shadow-xl mb-8 md:mb-12 text-sm md:text-base">
           <div className="flex justify-between items-center mb-3 md:mb-4">
              <span className="text-muted-foreground font-medium">Kết quả:</span>
              <span className={`font-bold ${isPassed ? 'text-green-500' : 'text-red-500'}`}>{isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'}</span>
           </div>
           <div className="flex justify-between items-center mb-3 md:mb-4">
              <span className="text-muted-foreground font-medium">Số câu đúng:</span>
              <span className="font-bold">{correctAnswersCount} / {questions.length}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Tỷ lệ yêu cầu:</span>
              <span className="font-bold">{lesson?.passingScore || 80}%</span>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
           {!isPassed && (
             <Button 
               variant="outline" 
               size="lg" 
               className="rounded-xl px-8 md:px-10 h-12 md:h-14 font-bold text-sm md:text-base"
               onClick={() => {
                 setIsSubmitted(false);
                 setCurrentQuestionIdx(0);
                 setUserAnswers({});
                 setFlaggedQuestions({});
                 if (lesson?.timeLimit) setTimeLeft(Number(lesson.timeLimit));
               }}
             >
               Làm lại bài
             </Button>
           )}
           <Button 
             variant="secondary"
             size="lg" 
             className="rounded-xl px-8 md:px-10 h-12 md:h-14 font-bold text-sm md:text-base"
             onClick={() => setCurrentQuestionIdx(0)}
           >
             Xem lại bài làm
           </Button>
           <Button 
             size="lg" 
             className="rounded-xl px-8 md:px-10 h-12 md:h-14 font-bold shadow-xl shadow-primary/20 text-sm md:text-base"
             onClick={handleExitConfirm}
           >
             Quay lại bài học
           </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <>
    <div className="max-w-[1850px] mx-auto py-4 md:py-8 px-4 lg:px-8 h-full">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start relative h-full">
        
        {/* Left Sidebar: Question Navigator */}
        <div className="w-full lg:w-80 shrink-0 lg:sticky top-4 md:top-8 space-y-4 md:space-y-6 order-2 lg:order-1">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-lg">Danh sách câu hỏi</h3>
              <div className="text-xs font-bold px-2 py-1 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                {Object.keys(userAnswers).length} / {questions.length}
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-4 gap-2 md:gap-3">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isFlagged = flaggedQuestions[q.id];
                const isActive = currentQuestionIdx === idx;
                const isCorrect = isSubmitted && userAnswers[q.id] === q.answers.find(a => a.isCorrect)?.id;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center font-bold text-xs md:text-sm transition-all hover:scale-105 active:scale-95 border",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-background border-primary" 
                        : isSubmitted
                          ? isCorrect 
                            ? "bg-green-500/10 text-green-600 border-green-500/20" 
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                          : isFlagged
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:border-amber-500"
                            : isAnswered 
                              ? "bg-primary/10 text-primary border-primary/20 hover:border-primary/40" 
                              : "bg-muted/50 text-muted-foreground border-transparent hover:border-primary/30"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col gap-4">
              {timeLeft !== null && (
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${timeLeft < 30 ? 'bg-red-500/10 text-red-600 border-red-500/30 animate-pulse' : 'bg-primary/5 text-primary border-primary/20'}`}>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    <span className="font-bold text-sm">Thời gian còn lại</span>
                  </div>
                  <span className="text-xl font-black tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              )}
              
              {!isSubmitted ? (
                <Button
                  size="lg"
                  className="w-full rounded-xl h-12 md:h-14 font-black bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2 text-sm md:text-base"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  Nộp bài thi <Target className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full rounded-xl h-12 md:h-14 font-black transition-all gap-2 text-sm md:text-base"
                  onClick={() => setCurrentQuestionIdx(-1)}
                >
                  Xem tổng kết <Target className="w-5 h-5" />
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full rounded-xl h-12 font-bold gap-2 text-muted-foreground hover:text-red-500 hover:border-red-500/30"
                onClick={() => setShowExitDialog(true)}
              >
                <ChevronLeft className="w-5 h-5" /> Thoát bài thi
              </Button>
            </div>
          </div>

          <div className="hidden lg:block p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 text-primary mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-black text-sm uppercase tracking-wider">Lưu ý</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Bạn cần đạt ít nhất <span className="text-primary font-bold">{lesson?.passingScore || 80}%</span> để hoàn thành nội dung này. Câu trả lời của bạn sẽ được tự động lưu.
            </p>
          </div>
        </div>

        {/* Right Content: Question Card */}
        <div className="flex-1 w-full min-h-0 order-1 lg:order-2">
          <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-10 shadow-xl relative min-h-[300px] md:min-h-[600px] flex flex-col">
            
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg md:text-xl shadow-inner">
                    {currentQuestionIdx + 1}
                 </div>
                 <div className="space-y-0.5">
                    <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">Câu hỏi hiện tại</div>
                    <div className="text-xs md:text-sm font-bold">Lĩnh vực: {lesson?.title}</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => toggleFlag(currentQuestion?.id)}
                   className={cn(
                     "rounded-full gap-2 px-3 md:px-4 font-bold transition-all text-xs md:text-sm",
                     flaggedQuestions[currentQuestion?.id] 
                       ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" 
                       : "text-muted-foreground hover:bg-muted"
                   )}
                >
                   <Flag className={cn("w-4 h-4", flaggedQuestions[currentQuestion?.id] && "fill-current")} />
                   <span className="hidden md:inline">{flaggedQuestions[currentQuestion?.id] ? "Đang phân vân" : "Đánh dấu phân vân"}</span>
                </Button>

                <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 border border-border/50">
                   <div className="md:flex hidden -space-x-1">
                      {questions.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary/30" />
                      ))}
                   </div>
                   <span className="text-[10px] md:text-xs font-bold text-muted-foreground">{currentQuestionIdx + 1} / {questions.length}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-muted rounded-full mb-6 md:mb-12 overflow-hidden">
              <motion.div 
                 className="h-full bg-primary"
                 initial={{ width: 0 }}
                 animate={{ width: `${((currentQuestionIdx + 1) / (questions.length || 1)) * 100}%` }}
                 transition={{ duration: 0.3 }}
              />
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion?.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 md:space-y-10"
                >
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-foreground leading-snug tracking-tight">
                    {currentQuestion?.content}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion?.answers.map((answer, aIdx) => {
                      const isSelected = userAnswers[currentQuestion.id] === answer.id;
                      const label = String.fromCharCode(65 + aIdx);
                      return (
                        <button
                          key={answer.id}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                          className={cn(
                            "p-3 md:p-6 rounded-2xl border-2 text-left transition-all duration-200 group relative flex items-center gap-3 md:gap-5",
                            isSelected 
                              ? (isSubmitted 
                                  ? (answer.isCorrect ? "border-green-500 bg-green-50/50" : "border-red-500 bg-red-50/50")
                                  : "border-primary bg-primary/[0.03] ring-4 ring-primary/5 shadow-lg shadow-primary/5")
                              : (isSubmitted && answer.isCorrect
                                  ? "border-green-500 bg-green-50/50"
                                  : "border-border/40 bg-card hover:border-primary/30 hover:bg-muted/30")
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 flex items-center justify-center font-black transition-all shrink-0 text-xs md:text-base",
                            isSelected 
                              ? (isSubmitted
                                  ? (answer.isCorrect ? "border-green-500 bg-green-500 text-white" : "border-red-500 bg-red-500 text-white")
                                  : "border-primary bg-primary text-white rotate-6")
                              : (isSubmitted && answer.isCorrect
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-border bg-muted/20 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary")
                          )}>
                            {label}
                          </div>
                          <span className={cn(
                            "text-sm md:text-xl font-bold transition-colors flex-1 leading-tight",
                            isSelected 
                              ? (isSubmitted ? (answer.isCorrect ? "text-green-700" : "text-red-700") : "text-foreground")
                              : (isSubmitted && answer.isCorrect ? "text-green-700" : "text-muted-foreground group-hover:text-foreground")
                          )}>
                            {answer.content}
                          </span>
                          {isSubmitted && answer.isCorrect && (
                             <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6 text-green-500 shrink-0" />
                          )}
                          {isSubmitted && isSelected && !answer.isCorrect && (
                             <XCircle className="w-5 md:w-6 h-5 md:h-6 text-red-500 shrink-0" />
                          )}
                          {!isSubmitted && isSelected && (
                            <motion.div 
                              layoutId="active-check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-primary flex items-center justify-center shrink-0"
                            >
                               <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-6 md:mt-12 pt-5 md:pt-8 border-t border-border/20">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-xl px-3 md:px-8 h-12 md:h-14 font-bold gap-2 text-muted-foreground hover:bg-muted text-xs md:text-sm"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" /> <span className="md:inline hidden">Quay lại</span>
              </Button>
              
              <div className="text-[10px] md:text-xs font-black text-muted-foreground md:hidden uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                {currentQuestionIdx + 1} / {questions.length}
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="rounded-xl px-4 md:px-10 h-12 md:h-14 font-black bg-foreground text-background hover:bg-foreground/90 transition-all gap-2 disabled:opacity-30 text-xs md:text-sm shadow-lg shadow-foreground/10"
                  disabled={currentQuestionIdx === questions.length - 1}
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                >
                  <span className="md:inline hidden">Tiếp theo</span> <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Confirmation Dialogs */}
    <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto sm:mx-0">
             <LogOut className="w-6 h-6 text-red-500" />
          </div>
          <AlertDialogTitle className="text-xl font-black">Thoát bài thi?</AlertDialogTitle>
          <AlertDialogDescription className="text-base font-medium">
            Mọi tiến trình làm bài của bạn sẽ bị mất nếu bạn rời khỏi trang này. Bạn có chắc chắn muốn thoát không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="rounded-xl border-border/50 h-12 font-bold hover:bg-muted">Ở lại làm bài</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleExitConfirm}
            className="rounded-xl bg-red-500 text-white hover:bg-red-600 h-12 font-black shadow-lg shadow-red-500/20"
          >
            Vâng, thoát ra
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto sm:mx-0">
             <SendHorizontal className="w-6 h-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-xl font-black">Nộp bài thi?</AlertDialogTitle>
          <AlertDialogDescription className="text-base font-medium">
            Bạn đã hoàn thành <span className="text-primary font-bold">{Object.keys(userAnswers).length}/{questions.length}</span> câu hỏi. Bạn có chắc chắn muốn nộp bài ngay bây giờ không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="rounded-xl border-border/50 h-12 font-bold hover:bg-muted">Tiếp tục làm bài</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit}
            className="rounded-xl bg-primary text-white hover:bg-primary/90 h-12 font-black shadow-lg shadow-primary/20"
          >
            Đồng ý nộp bài
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
});
