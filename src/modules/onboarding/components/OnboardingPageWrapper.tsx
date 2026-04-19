"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from '@legendapp/state/react';
import { authState$ } from '@/modules/auth/store';
import { onboardingService } from '../services';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingIndicator } from '@/components/PageLoadingIndicator';
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

// Import các bước cho Học viên
import { Step1Welcome } from './steps/Step1Welcome';
import { Step2Courses } from './steps/Step2Courses';
import { Step3Market } from './steps/Step3Market';
import { Step4Community } from './steps/Step4Community';
import { Step5Rewards } from './steps/Step5Rewards';

// Import các bước cho Giảng viên
import { TeacherStep1Welcome } from './steps/teacher/TeacherStep1Welcome';
import { TeacherStep2Content } from './steps/teacher/TeacherStep2Content';
import { TeacherStep3Management } from './steps/teacher/TeacherStep3Management';
import { TeacherStep4Analytics } from './steps/teacher/TeacherStep4Analytics';
import { TeacherStep5Revenue } from './steps/teacher/TeacherStep5Revenue';

const STUDENT_STEPS = [
  Step1Welcome,
  Step2Courses,
  Step3Market,
  Step4Community,
  Step5Rewards
];

const TEACHER_STEPS = [
  TeacherStep1Welcome,
  TeacherStep2Content,
  TeacherStep3Management,
  TeacherStep4Analytics,
  TeacherStep5Revenue
];

export function OnboardingPageWrapper() {
  const router = useRouter();
  const user = useSelector(() => authState$.user.get());
  
  // Xác định bộ bước dựa trên role
  const userRole = user?.roles?.[0] || user?.role || 'USER';
  const isTeacher = userRole === 'TEACHER' || userRole === 'ROLE_TEACHER';
  const STEPS_COMPONENTS = isTeacher ? TEACHER_STEPS : STUDENT_STEPS;

  const [currentStep, setCurrentStep] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const [showSkipAlert, setShowSkipAlert] = useState(false);

  // Kiểm tra trạng thái đăng nhập và trạng thái onboarding
  useEffect(() => {
    // Nếu chưa đăng nhập thì đẩy ra home
    if (!user?.userId) {
      router.replace('/');
      return;
    }

    const checkStatus = async () => {
      try {
        const { hasSeen } = await onboardingService.checkOnboardingStatus(user.userId);
        if (hasSeen) {
          // Bạn này xem rồi, cho về trang chủ luôn
          router.replace('/');
        } else {
          setIsChecking(false);
        }
      } catch (err) {
        console.error("Failed to check onboarding", err);
        setIsChecking(false); // Dù lỗi vẫn cho xem onboard, hoặc có thể đẩy ra home
      }
    };

    checkStatus();
  }, [user?.userId, router]);

  const handleComplete = async () => {
    if (user?.userId) {
      await onboardingService.markAsSeen(user.userId, userRole);
    }
    
    // Điều hướng về trang phù hợp sau khi hoàn thành
    if (isTeacher) {
      router.replace('/teacher');
    } else {
      router.replace('/');
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS_COMPONENTS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const skipOnboarding = () => {
    setShowSkipAlert(true);
  };

  const confirmSkip = () => {
    setShowSkipAlert(false);
    handleComplete();
  };

  if (isChecking || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><PageLoadingIndicator /></div>;
  }

  const CurrentComponent = STEPS_COMPONENTS[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      {/* Cảnh báo khi bỏ qua */}
      <AlertDialog open={showSkipAlert} onOpenChange={setShowSkipAlert}>
        <AlertDialogContent className="w-[90vw] max-w-[420px] rounded-3xl border-border/50 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Vội vã thế sao? ✨</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium text-muted-foreground leading-relaxed">
              Hệ thống có rất nhiều tính năng thú vị và phần thưởng hấp dẫn đang chờ bạn khám phá. Bạn có muốn dành 1 phút để trở thành chuyên gia không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-4">
            <AlertDialogCancel className="w-full sm:flex-1 h-12 rounded-xl font-bold border-border/60">Quay lại xem</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSkip} className="w-full sm:flex-1 h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-widest text-xs border-none">
              Vẫn bỏ qua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Nút bỏ qua - Positioned better for mobile */}
      <button
        onClick={skipOnboarding}
        className="absolute top-6 right-6 sm:top-10 sm:right-10 px-5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground font-black uppercase tracking-widest transition-all z-20 hover:bg-muted/30 rounded-full backdrop-blur-sm"
      >
        <Home className="w-4 h-4 text-primary" /> Bỏ qua
      </button>

      {/* Thanh tiến trình - Adjust for mobile notch/status bar */}
      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10 p-2 bg-background/40 backdrop-blur-md rounded-full border border-border/50">
        {STEPS_COMPONENTS.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-500",
              idx === currentStep ? "w-8 sm:w-16 bg-primary shadow-lg shadow-primary/20" : "w-1.5 sm:w-2 bg-border/60"
            )}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center justify-center pt-16 sm:pt-20 pb-8 relative z-10 mx-auto px-4 sm:px-8">
        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <CurrentComponent key={currentStep} />
          </AnimatePresence>
        </div>

        {/* Hành động - Stacks on mobile */}
        <div className="w-full max-w-xl mx-auto mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-0">
          <Button
            size="lg"
            variant="ghost"
            className="w-full sm:flex-1 rounded-2xl h-12 sm:h-14 font-black text-xs uppercase tracking-widest hover:bg-muted/50 transition-all"
            onClick={currentStep === 0 ? skipOnboarding : () => setCurrentStep(prev => prev - 1)}
          >
            {currentStep === 0 ? "Bỏ qua" : "Trở lại"}
          </Button>

          {currentStep < STEPS_COMPONENTS.length - 1 ? (
            <Button
              size="lg"
              className="w-full sm:flex-1 group rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 sm:h-14 font-black uppercase tracking-tighter text-base shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95"
              onClick={nextStep}
            >
              Tiếp tục
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full sm:flex-1 group rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter text-base h-12 sm:h-14 shadow-2xl shadow-primary/30 animate-in zoom-in-95 duration-500 transition-all hover:-translate-y-1 active:scale-95"
              onClick={handleComplete}
            >
              Bắt đầu ngay
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
