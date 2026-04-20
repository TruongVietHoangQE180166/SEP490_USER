'use client';

import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { LayoutDashboard, BookOpen, Users } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/teacher' },
  { icon: BookOpen, label: 'Khóa học của tôi', href: '/teacher/courses' },
  { icon: Users, label: 'Quản lý học viên', href: '/teacher/students' },
];

export default function TeacherLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <AppSidebar 
        items={teacherMenuItems} 
        title="VICTEACH Teacher" 
        role="TEACHER" 
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-8 bg-muted/10">
          <div className="max-w-[1850px] mx-auto h-full">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
}
