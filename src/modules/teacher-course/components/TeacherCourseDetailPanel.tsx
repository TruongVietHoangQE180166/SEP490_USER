'use client';

import React from 'react';
import { useTeacherCourseDetail } from '../hooks/useTeacherCourseDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import { ThunderLoader } from '@/components/thunder-loader';

interface TeacherCourseDetailPanelProps {
  courseId: string;
  onBack: () => void;
}

export const TeacherCourseDetailPanel = ({ courseId, onBack }: TeacherCourseDetailPanelProps) => {
  const { course, isLoading, error, reload } = useTeacherCourseDetail(courseId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ThunderLoader size="xl" animate="thunder" showGlow />
        <p className="text-muted-foreground font-black text-xs uppercase animate-pulse">
          Đang tải thông tin khoá học...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-rose-500/60" />
        <p className="text-foreground font-bold">{error ?? 'Không tìm thấy khoá học'}</p>
        <Button variant="outline" onClick={onBack} className="rounded-xl gap-2">
          <ArrowLeft size={16} /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="rounded-full shrink-0">
          <ArrowLeft size={16} className="mr-2" /> Quay lại
        </Button>
        <h1 className="text-3xl font-black">{course.title}</h1>
      </div>

      <div className="p-8 border border-border/40 bg-card rounded-3xl shadow-sm">
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <p className="font-medium text-lg">Giao diện quản lý chi tiết khoá học của Giảng viên</p>
        </div>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Tại đây, giảng viên có thể xem, chỉnh sửa nội dung chi tiết của khoá học: Upload Video, Tải lên Tài liệu, Quản lý Mooc, tạo Quiz, v.v. (Giao diện này đang được xây dựng theo yêu cầu riêng biệt).
        </p>
        <div className="p-4 bg-muted/50 rounded-xl font-mono text-xs text-muted-foreground">
          <p>ID Khoá học: {course.id}</p>
          <p>Trạng thái: {course.status}</p>
        </div>
      </div>
    </div>
  );
};
