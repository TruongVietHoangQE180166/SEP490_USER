'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export default function TeacherCourseAddRoute() {
  const router = useRouter();

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/teacher/courses')} className="rounded-full shrink-0">
          <ArrowLeft size={16} className="mr-2" /> Quay lại
        </Button>
        <h1 className="text-3xl font-black">Tạo Khoá Học Mới</h1>
      </div>

      <div className="p-8 border border-border/40 bg-card rounded-3xl shadow-sm text-center">
        <PlusCircle className="h-12 w-12 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="text-2xl font-bold mb-2">Giao diện Thêm Khoá Học (Đang phát triển)</h2>
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Giao diện nhập thông tin tạo khoá học dành cho Giảng viên (tách biệt so với Admin) sẽ được đặt tại đây. 
        </p>
      </div>
    </div>
  );
}
