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
  badge?: number;
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
      animate={{ 
        width: isCollapsed ? '90px' : '300px',
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }}
      className={cn(
        "sticky top-0 h-screen flex flex-col bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground border-r border-sidebar-border/50 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-500",
      )}
    >
      {/* Brand Header */}
      <div className="p-6 h-24 flex items-center justify-between border-b border-sidebar-border/40 overflow-hidden whitespace-nowrap relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent" />
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-4"
            >
              <div className="bg-gradient-to-br from-sidebar-primary to-sidebar-primary/60 p-2.5 rounded-2xl shadow-lg shadow-sidebar-primary/20">
                {role === 'ADMIN' ? 
                  <ShieldCheck className="text-white h-6 w-6" /> : 
                  <GraduationCap className="text-white h-6 w-6" />
                }
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter text-sidebar-foreground leading-none">
                   {title.split(' ')[0]}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sidebar-primary opacity-80 mt-1">
                   {title.split(' ').slice(1).join(' ') || 'PORTAL'}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              className="mx-auto"
            >
              <div className="bg-gradient-to-br from-sidebar-primary to-sidebar-primary/60 p-2.5 rounded-2xl shadow-lg shadow-sidebar-primary/20">
                {role === 'ADMIN' ? 
                  <ShieldCheck className="text-white h-6 w-6" /> : 
                  <GraduationCap className="text-white h-6 w-6" />
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 flex flex-col gap-2 custom-scrollbar">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 mb-4"
          >
             <p className="text-[10px] font-black text-sidebar-foreground/30 uppercase tracking-[0.25em]">
              Menu chính
            </p>
          </motion.div>
        )}
        
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="group relative">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative z-10 mb-1 border border-transparent",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-[0_8px_20px_-6px_rgba(var(--sidebar-primary-rgb),0.5)] border-sidebar-primary/20" 
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-sidebar-border/40"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-500",
                  isActive ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:text-sidebar-primary"
                )} />

                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm tracking-tight leading-none flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}

                {item.badge !== undefined && item.badge > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "h-5 min-w-[22px] px-1.5 flex items-center justify-center rounded-lg text-[10px] font-black shadow-lg transition-all",
                      isActive 
                        ? "bg-white text-sidebar-primary" 
                        : "bg-sidebar-primary text-white"
                    )}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}

                {isActive && (
                   <motion.div 
                     layoutId="active-pill"
                     className="absolute inset-0 bg-sidebar-primary rounded-2xl -z-10"
                     transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                   />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Actions & Footer Section */}
      <div className="mt-auto p-4 flex flex-col gap-4 border-t border-sidebar-border/40 bg-sidebar/30 backdrop-blur-sm relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/10 to-transparent" />
        
        <div className="flex flex-col gap-1 px-1">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-3.5 h-11 rounded-2xl transition-all hover:bg-sidebar-accent group px-4 hover:border-sidebar-border/40 border border-transparent",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <div className="bg-muted/50 p-1.5 rounded-lg group-hover:bg-sidebar-primary/10 transition-colors">
                  <Home className="h-4 w-4 text-sidebar-foreground/50 group-hover:text-sidebar-primary transition-colors" />
                </div>
                {!isCollapsed && <span className="text-xs font-bold text-sidebar-foreground/60 group-hover:text-sidebar-foreground">Về trang chủ</span>}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              onClick={toggleSidebar}
              className={cn(
                "w-full justify-start gap-3.5 h-11 rounded-2xl group transition-all hover:bg-sidebar-accent px-4 hover:border-sidebar-border/40 border border-transparent",
                isCollapsed && "justify-center px-0"
              )}
            >
              <div className="bg-muted/50 p-1.5 rounded-lg group-hover:bg-sidebar-primary/10 transition-colors">
                {isCollapsed ? 
                  <PanelLeftOpen className="h-4 w-4 text-sidebar-foreground/50 group-hover:text-sidebar-primary transition-colors" /> : 
                  <PanelLeftClose className="h-4 w-4 text-sidebar-foreground/50 group-hover:text-sidebar-primary transition-colors" />
                }
              </div>
              {!isCollapsed && <span className="text-xs font-bold text-sidebar-foreground/60 group-hover:text-sidebar-foreground">Thu gọn menu</span>}
            </Button>

            <Button 
              variant="ghost" 
              onClick={logout}
              className={cn(
                "w-full justify-start gap-3.5 h-11 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95 group px-4 hover:border-destructive/20 border border-transparent",
                isCollapsed && "justify-center px-0"
              )}
            >
               <div className="bg-destructive/5 p-1.5 rounded-lg group-hover:bg-destructive/10 transition-colors">
                 <LogOut className="h-4 w-4" />
               </div>
              {!isCollapsed && <span className="font-black text-xs uppercase tracking-widest">Đăng xuất</span>}
            </Button>
        </div>
      </div>

      {/* Decorative Glow */}
      {!isCollapsed && (
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-sidebar-primary/5 blur-[80px] rounded-full pointer-events-none" />
      )}
    </motion.aside>
  );
});



