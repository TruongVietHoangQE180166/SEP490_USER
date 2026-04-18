'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

import { BasicInfo } from './create/types';
import { StepBasicInfo } from './create/StepBasicInfo';
import { useTeacherCourseForm } from '../hooks/useTeacherCourseForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const TeacherCourseCreatePanel = () => {
  const router = useRouter();
  const { handleCreateCourse: createCourse, isSubmitting } = useTeacherCourseForm();

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    title: '',
    description: '',
    level: 'LEVEL_1',
    isFree: false,
    price: '',
    hasDiscount: false,
    discountPercent: '',
    thumbnail: null,
    thumbnailUrl: '',
    previewVideo: null,
    assets: [],
    whatYouWillLearn: [],
    targetAudiences: [],
    benefit: []
  });

  const handleCreateCourse = async () => {
    if (!basicInfo.title.trim()) return;
    try {
      await createCourse(basicInfo);
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/teacher/courses')}
              className="rounded-md hover:bg-muted transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="h-6 w-[1px] bg-border/60" />
            <h1 className="text-lg font-bold tracking-tight">
              Tạo khóa học mới
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-xl font-bold border-border/60 hover:bg-muted/50 hidden md:flex h-10 px-6">
              Lưu bản nháp
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                    disabled={isSubmitting || !basicInfo.title}
                    size="sm" 
                    className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 h-10 gap-2 transition-all active:scale-95"
                >
                    {isSubmitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <Save size={18} />
                        </motion.div>
                    ) : (
                        <Rocket size={18} />
                    )}
                    {isSubmitting ? 'Đang tạo...' : 'Xuất bản ngay'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-2">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-black">Xác nhận tạo khóa học mới?</AlertDialogTitle>
                  <AlertDialogDescription className="font-medium">
                    Hành động này sẽ khởi tạo khóa học của bạn trên hệ thống. Sau khi tạo xong, bạn có thể bắt đầu thêm các chương trình học và bài phát tập.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl font-bold border-2">Để sau</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCreateCourse}
                    className="rounded-xl font-black bg-primary hover:bg-primary/90"
                  >
                    Đồng ý tạo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="mb-10 text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Thiết lập thông tin chung</h2>
            <p className="text-muted-foreground font-medium">Sau khi tạo khóa học, bạn sẽ có thể thêm bài giảng và nội dung chi tiết.</p>
        </div>

        <AnimatePresence mode="wait">
            <StepBasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
        </AnimatePresence>
      </div>
    </div>
  );
};
