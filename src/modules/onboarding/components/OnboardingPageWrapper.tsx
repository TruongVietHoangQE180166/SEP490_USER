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
      router.replace('/teacher/dashboard');
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
      
      {/* Cảnh báo khi bỏ qua */}
      <AlertDialog open={showSkipAlert} onOpenChange={setShowSkipAlert}>
        <AlertDialogContent className="w-[90vw] max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn bỏ qua?</AlertDialogTitle>
            <AlertDialogDescription>
              Hệ thống có rất nhiều tính năng thú vị và phần thưởng hấp dẫn đang chờ bạn khám phá. Bạn có thể xem lại sau nhưng sẽ tốt hơn nếu bạn dành 1 phút để tìm hiểu ngay bây giờ!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Xem tiếp</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSkip} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white border-transparent">
              Vẫn bỏ qua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Nút bỏ qua - Positioned better for mobile */}
      <button
        onClick={skipOnboarding}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground font-medium transition-colors z-10"
      >
        <Home className="w-3 h-3 sm:w-4 sm:h-4" /> Bỏ qua
      </button>

      {/* Thanh tiến trình - Adjust for mobile notch/status bar */}
      <div className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {STEPS_COMPONENTS.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1 sm:h-2 rounded-full transition-all duration-300",
              idx === currentStep ? "w-6 sm:w-10 bg-primary" : "w-1.5 sm:w-3 bg-border"
            )}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center justify-center pt-8 sm:pt-0">
        <div className="min-h-[300px] sm:min-h-[400px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <CurrentComponent key={currentStep} />
          </AnimatePresence>
        </div>

        {/* Hành động - Stacks on mobile */}
        <div className="w-full max-w-sm mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:flex-1 rounded-xl h-11 sm:h-12"
            onClick={currentStep === 0 ? skipOnboarding : () => setCurrentStep(prev => prev - 1)}
          >
            {currentStep === 0 ? "Bỏ qua" : "Trở lại"}
          </Button>

          {currentStep < STEPS_COMPONENTS.length - 1 ? (
            <Button
              size="lg"
              className="w-full sm:flex-1 group rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-12"
              onClick={nextStep}
            >
              Tiếp tục
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full sm:flex-1 group rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 sm:h-12"
              onClick={handleComplete}
            >
              Bắt đầu ngay
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
