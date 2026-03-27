'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

import { BasicInfo } from './create/types';
import { StepBasicInfo } from './create/StepBasicInfo';
import { useTeacherCourseDetail } from '../hooks/useTeacherCourseDetail';
import { useTeacherCourseForm } from '../hooks/useTeacherCourseForm';
import { ThunderLoader } from '@/components/thunder-loader';
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

interface TeacherCourseEditPanelProps {
  courseId: string;
  onBack: () => void;
}

export const TeacherCourseEditPanel = ({ courseId, onBack }: TeacherCourseEditPanelProps) => {
  const router = useRouter();
  const { course, isLoading: isFetching } = useTeacherCourseDetail(courseId);
  const { handleUpdateCourse: updateCourse, isSubmitting } = useTeacherCourseForm();
  const [isSuccess, setIsSuccess] = useState(false);

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
    assets: []
  });

  // Sync state when course data is loaded
  useEffect(() => {
    if (course) {
      // API might return Vietnamese or English level names, map them to LEVEL_X
      const mapApiLevelToInternal = (lvl?: string | null) => {
        if (!lvl) return 'LEVEL_1';
        const uLvl = lvl.toUpperCase();
        // Beginner levels
        if (uLvl.includes('NHẬP MÔN') || uLvl.includes('NHAP_MON') || uLvl === 'BEGINNER' || uLvl === 'BASIC' || uLvl === 'LEVEL_1') return 'LEVEL_1';
        // Intermediate/Foundation
        if (uLvl.includes('NỀN TẢNG') || uLvl.includes('NEN_TANG') || uLvl === 'LEVEL_2') return 'LEVEL_2';
        if (uLvl.includes('TRUNG CẤP') || uLvl.includes('TRUNG_CAP') || uLvl === 'INTERMEDIATE' || uLvl === 'LEVEL_3') return 'LEVEL_3';
        // Advanced
        if (uLvl.includes('THỰC HÀNH') || uLvl.includes('THUC_HANH') || uLvl === 'LEVEL_4') return 'LEVEL_4';
        if (uLvl.includes('NÂNG CAO') || uLvl.includes('NANG_CAO') || uLvl === 'ADVANCED' || uLvl === 'PRO' || uLvl === 'LEVEL_5') return 'LEVEL_5';
        
        return 'LEVEL_1';
      };

      setBasicInfo({
        title: course.title || '',
        description: course.description || '',
        level: mapApiLevelToInternal(course.courseLevel),
        isFree: course.isFree || false,
        price: course.price?.toString() || '',
        hasDiscount: (course.discountPercent || 0) > 0,
        discountPercent: course.discountPercent?.toString() || '',
        thumbnail: null,
        thumbnailUrl: course.thumbnailUrl || '', 
        previewVideo: null,
        assets: course.assets || []
      });
    }
  }, [course]);

  const handleUpdateCourse = async () => {
    if (!basicInfo.title.trim()) {
        toast.error('Vui lòng nhập tiêu đề khóa học');
        return;
    }

    try {
      await updateCourse(courseId, basicInfo);
      setIsSuccess(true);
      
      // Faster redirect for punchy UX
      setTimeout(() => {
        onBack();
      }, 800);

    } catch (err: any) {
      console.error('Update failed:', err);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ThunderLoader size="xl" variant="default" animate="thunder" showGlow />
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.4em] animate-pulse">Đang tải dữ liệu khóa học...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-md hover:bg-muted transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="h-6 w-[1px] bg-border/60" />
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest leading-none mb-1">Cài đặt cơ bản</span>
                <h1 className="text-sm font-black tracking-tight line-clamp-1 max-w-[300px]">
                Chỉnh sửa: {course?.title}
                </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                    disabled={isSubmitting || !basicInfo.title || isSuccess}
                    size="sm" 
                    className={cn(
                        "rounded-xl font-black h-10 px-8 gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-widest text-[11px]",
                        isSuccess ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                >
                    {isSubmitting ? (
                        <RefreshCw size={16} className="animate-spin" />
                    ) : isSuccess ? (
                        <CheckCircle2 size={16} />
                    ) : (
                        <Save size={16} />
                    )}
                    {isSubmitting ? 'Đang lưu...' : isSuccess ? 'Đã cập nhật' : 'Lưu thay đổi'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-2">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-black">Xác nhận lưu thay đổi?</AlertDialogTitle>
                  <AlertDialogDescription className="font-medium">
                    Bạn có chắc chắn muốn cập nhật các thông tin cơ bản cho khóa học này không? 
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl font-bold border-2">Hủy bỏ</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleUpdateCourse}
                    className="rounded-xl font-black bg-primary hover:bg-primary/90"
                  >
                    Xác nhận lưu
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center space-y-2"
        >
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full mb-2">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Thông tin chung</span>
            </div>
            <h2 className="text-3xl font-[1000] tracking-tight text-foreground">Cập nhật thiết lập</h2>
            <p className="text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">Thay đổi các thông tin cơ bản giúp khóa học của bạn luôn được cập nhật và thu hút học viên.</p>
        </motion.div>

        <AnimatePresence mode="wait">
            <div key="edit-form" className="relative">
                {isSuccess && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-40 bg-background/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border-2 border-emerald-500/20"
                     >
                        <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
                            <CheckCircle2 size={40} />
                        </div>
                        <p className="font-black text-xl text-emerald-600">Tuyệt vời! Dữ liệu đã được lưu</p>
                        <p className="text-sm text-muted-foreground mt-1">Đang chuyển hướng về danh sách...</p>
                     </motion.div>
                )}
                <StepBasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
            </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherCourseEditPanel;
