'use client';

import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { LayoutDashboard, BookOpen, Users, MessageSquare } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { authState$ } from '@/modules/auth/store';

import { observer, useSelector } from '@legendapp/state/react';
import { totalUnreadCount$, teacherDiscussionActions, teacherDiscussionState$ } from '@/modules/teacher-discussion/store';

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/teacher' },
  { icon: BookOpen, label: 'Khóa học của tôi', href: '/teacher/courses' },
  { icon: Users, label: 'Quản lý học viên', href: '/teacher/students' },
  { icon: MessageSquare, label: 'Thảo luận', href: '/teacher/discussions' },
];

export default observer(function TeacherLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDiscussionPage = pathname === '/teacher/discussions';
  const user = useSelector(() => authState$.user.get());
  const totalUnread = useSelector(() => totalUnreadCount$.get());
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (user?.userId && !initialized) {
      teacherDiscussionActions.loadCourses();
      setInitialized(true);
    }
  }, [user?.userId, initialized]);

  const dynamicItems = teacherMenuItems.map(item => {
    if (item.href === '/teacher/discussions') {
       return { ...item, badge: totalUnread };
    }
    return item;
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <AppSidebar 
        items={dynamicItems} 
        title="VICTEACH Teacher" 
        role="TEACHER" 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <main className={cn(
          "flex-1 bg-muted/10",
          isDiscussionPage ? "overflow-hidden p-0" : "overflow-y-auto p-8 pb-8"
        )}>
          <div className="w-full h-full">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
});
