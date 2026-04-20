import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  SearchIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { observer } from '@legendapp/state/react';
import { authState$ } from '@/modules/auth/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { getNormalizedRole } from '@/modules/auth/utils';


export const DashboardHeader = observer(() => {
  const user = authState$.user.get();
  const normalizedRole = getNormalizedRole(user?.role);

  return (
    <header className="h-24 sticky top-0 z-50 border-b border-sidebar-border/30 bg-sidebar/70 backdrop-blur-xl px-8 flex items-center justify-between transition-all duration-500">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/10 to-transparent" />
      
      {/* Search Bar area */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-sidebar-foreground/30 group-focus-within:text-sidebar-primary group-focus-within:scale-110 transition-all duration-300" />
          </div>
          <Input 
            placeholder="Tìm kiếm thông tin hệ thống..." 
            className="w-full bg-sidebar-accent/30 border-sidebar-border/20 focus:bg-sidebar-accent/50 focus:border-sidebar-primary/40 focus:ring-4 focus:ring-sidebar-primary/10 pl-11 h-11 rounded-full transition-all duration-300 text-sm placeholder:text-sidebar-foreground/30"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <ThemeToggle />
        </div>

        <div className="h-10 w-px bg-gradient-to-b from-transparent via-sidebar-border/50 to-transparent mx-1" />

        <div className="flex items-center gap-4 group cursor-pointer p-1.5 pl-2 pr-4 rounded-3xl bg-sidebar-accent/30 border border-sidebar-border/20 hover:bg-sidebar-accent/60 hover:border-sidebar-primary/20 transition-all duration-500 shadow-sm hover:shadow-md">
           <div className="relative shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-sidebar-primary to-purple-500 rounded-full opacity-30 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
              <Avatar className="size-11 border-2 border-background ring-2 ring-sidebar-primary/10 shadow-lg transition-all relative z-10">
                 <AvatarImage src={user?.avatar} />
                 <AvatarFallback className="text-sm font-black bg-sidebar-primary text-white">
                   {user?.fullname?.substring(0, 2).toUpperCase() || '??'}
                 </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 border-2 border-background rounded-full shadow-lg z-20 animate-pulse" />
           </div>

           <div className="flex flex-col min-w-0 transition-transform duration-300 group-hover:translate-x-1">
              <div className="flex items-center gap-2.5">
                 <span className="text-sm font-black leading-none text-sidebar-foreground group-hover:text-sidebar-primary transition-colors truncate max-w-[140px] tracking-tight">
                    {user?.fullname || user?.username}
                 </span>
                 <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 shadow-sm",
                    normalizedRole === 'ADMIN' 
                      ? "bg-red-500 text-white border-red-600/20" 
                      : "bg-sidebar-primary text-white border-sidebar-primary-foreground/20"
                 )}>
                    {normalizedRole === 'ADMIN' ? 'ADMIN' : 'TEACHER'}
                 </span>
              </div>
              <span className="text-[10px] font-bold text-sidebar-foreground/30 mt-1 truncate max-w-[160px] uppercase tracking-tighter">
                 {user?.email || "Chưa cập nhật email"}
              </span>
           </div>
        </div>
      </div>
    </header>
  );
});


