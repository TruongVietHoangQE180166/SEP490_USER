'use client';

import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { LayoutDashboard, Users, Settings, FileText, CreditCard, GraduationCap } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/admin' },
  { icon: Users, label: 'Quản lý người dùng', href: '/admin/users' },
  { icon: GraduationCap, label: 'Quản lý khoá học', href: '/admin/courses' },
  { icon: FileText, label: 'Quản lý tin tức', href: '/admin/blogs' },
  { icon: CreditCard, label: 'Quản lý giao dịch', href: '/admin/payments' },
  { icon: Settings, label: 'Cài đặt hệ thống', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <AppSidebar 
        items={adminMenuItems} 
        title="Admin Portal" 
        role="ADMIN" 
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-8 bg-muted/10">
          <div className="max-w-7xl mx-auto h-full">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
}

