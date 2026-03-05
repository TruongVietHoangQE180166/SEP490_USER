'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  LogOut,
  ShieldCheck,
  GraduationCap,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  MessageCircleQuestion,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { observer } from '@legendapp/state/react';
import { authState$ } from '@/modules/auth/store';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface AppSidebarProps {
  items: SidebarItem[];
  title: string;
  role: 'ADMIN' | 'TEACHER';
}

export const AppSidebar = observer(({ items, title, role }: AppSidebarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useLogout();
  const user = authState$.user.get();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className={cn(
        "sticky top-0 h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-colors duration-300 z-50 shadow-sm",
      )}
    >
      {/* Brand Header */}
      <div className="p-6 h-20 flex items-center justify-between border-b border-sidebar-border overflow-hidden whitespace-nowrap">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="bg-sidebar-primary/10 p-2 rounded-xl">
                {role === 'ADMIN' ? 
                  <ShieldCheck className="text-sidebar-primary h-5 w-5" /> : 
                  <GraduationCap className="text-sidebar-primary h-5 w-5" />
                }
              </div>
              <span className="font-black text-xl tracking-tighter text-sidebar-foreground">
                {title}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mx-auto"
            >
              <div className="bg-sidebar-primary/10 p-2 rounded-xl">
                {role === 'ADMIN' ? 
                  <ShieldCheck className="text-sidebar-primary h-5 w-5" /> : 
                  <GraduationCap className="text-sidebar-primary h-5 w-5" />
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer or simple divider can go here if needed */}


      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 flex flex-col gap-1 custom-scrollbar">
        <div className={cn(
          "px-3 mb-2 flex items-center justify-between transition-all duration-300",
          isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        )}>
           <p className="text-[10px] font-black text-sidebar-foreground/40 uppercase tracking-[0.2em]">
            Danh mục
          </p>
        </div>
        
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="group relative">
              <div className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative z-10 mb-1",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-md shadow-sidebar-primary/20" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}>
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-sidebar-primary"
                )} />

                {!isCollapsed && (
                  <span className="text-sm tracking-tight leading-none">{item.label}</span>
                )}

                {isActive && !isCollapsed && (
                   <motion.div 
                     layoutId="active-indicator"
                     className="ml-auto size-1.5 rounded-full bg-sidebar-primary-foreground"
                   />
                )}
              </div>
            </Link>
          );
        })}
      </div>


      {/* Sidebar Actions & Footer */}
      <div className="p-4 gap-2 flex flex-col border-t border-sidebar-border bg-sidebar">
        <div className="flex flex-col gap-1">
            {/* Back to Home Action */}
            <Link href="/">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-4 h-11 rounded-xl transition-all hover:bg-sidebar-accent group px-4",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Home className="h-4 w-4 text-sidebar-foreground/70 group-hover:text-sidebar-primary transition-colors" />
                {!isCollapsed && <span className="text-sm text-sidebar-foreground/70 group-hover:text-sidebar-foreground">Trang chủ</span>}
              </Button>
            </Link>

            {/* Collapse Toggle */}
            <Button 
              variant="ghost" 
              onClick={toggleSidebar}
              className={cn(
                "w-full justify-start gap-4 h-11 rounded-xl group transition-all hover:bg-sidebar-accent px-4",
                isCollapsed && "justify-center px-0"
              )}
            >
              <div className="flex items-center justify-center">
                {isCollapsed ? 
                  <PanelLeftOpen className="h-4 w-4 text-sidebar-foreground/70 group-hover:text-sidebar-primary transition-colors" /> : 
                  <PanelLeftClose className="h-4 w-4 text-sidebar-foreground/70 group-hover:text-sidebar-primary transition-colors" />
                }
              </div>
              {!isCollapsed && <span className="text-sm text-sidebar-foreground/70 group-hover:text-sidebar-foreground">Thu gọn</span>}
            </Button>

            {/* Logout Action */}
            <Button 
              variant="ghost" 
              onClick={logout}
              className={cn(
                "w-full justify-start gap-4 h-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95 group px-4",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="font-bold text-sm">Đăng xuất</span>}
            </Button>

        </div>
      </div>

    </motion.aside>
  );
});


