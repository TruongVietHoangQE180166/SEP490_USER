'use client';

import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { LayoutDashboard, Users, FileText, CreditCard, GraduationCap, MessageCircle } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { SupportChatService } from '@/modules/support-chat/services';
import { chatState$ } from '@/modules/support-chat/store';
import { observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const AdminLayoutClient = observer(({ children }: { children: React.ReactNode }) => {
  const unreadCount = chatState$.unreadCount.get();

  useEffect(() => {
    // Initial fetch of unread count
    const fetchUnreadCount = async () => {
      const rooms = await SupportChatService.getAllConversations();
      const total = rooms.reduce((sum, room) => sum + (room.unread_count || 0), 0);
      chatState$.unreadCount.set(total);
    };
    fetchUnreadCount();

    // Subscribe to updates
    const channel = SupportChatService.subscribeToAllMessages(() => {
      // Refresh count on any change (insert/update)
      fetchUnreadCount();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const pathname = usePathname();
  const isAdminSupportChat = pathname === '/admin/support-chat';
  
  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/admin' },
    { icon: Users, label: 'Quản lý người dùng', href: '/admin/users' },
    { icon: GraduationCap, label: 'Quản lý khoá học', href: '/admin/courses' },
    { 
      icon: MessageCircle, 
      label: 'Hỗ trợ trực tuyến', 
      href: '/admin/support-chat',
      badge: unreadCount
    },
    { icon: FileText, label: 'Quản lý tin tức', href: '/admin/blogs' },
    { icon: CreditCard, label: 'Quản lý giao dịch', href: '/admin/payments' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <AppSidebar 
        items={adminMenuItems} 
        title="Admin Portal" 
        role="ADMIN" 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <main className={cn(
          "flex-1 overflow-y-auto",
          isAdminSupportChat ? "bg-background" : "p-8 pb-8 bg-muted/10"
        )}>
          <div className={cn(
            "mx-auto min-h-full",
            !isAdminSupportChat && "max-w-[1850px]"
          )}>
              {children}
          </div>
        </main>
      </div>
    </div>
  );
});

export default AdminLayoutClient;
