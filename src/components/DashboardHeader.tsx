import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  SearchIcon,
  Maximize
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
    <header className="h-20 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Search Bar area */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40 group-focus-within:text-sidebar-primary transition-colors" />
          <Input 
            placeholder="Tìm kiếm nhanh..." 
            className="w-full bg-sidebar-accent/50 border-transparent focus:bg-sidebar-accent focus:border-sidebar-primary/20 pl-10 h-10 rounded-xl transition-all"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="h-8 w-px bg-sidebar-border mx-2" />

        <div className="flex items-center gap-4 group cursor-pointer p-1.5 pr-3 rounded-2xl hover:bg-sidebar-accent transition-all duration-300">
           <div className="relative shrink-0">
              <Avatar className="size-10 ring-2 ring-sidebar-primary/10 shadow-sm transition-all group-hover:ring-sidebar-primary/30">
                 <AvatarImage src={user?.avatar} />
                 <AvatarFallback className="text-sm font-bold bg-sidebar-primary/10 text-sidebar-primary">
                   {user?.username?.substring(0, 2).toUpperCase() || '??'}
                 </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-sidebar rounded-full shadow-sm" />
           </div>

           <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold leading-none text-sidebar-foreground group-hover:text-sidebar-primary transition-colors truncate max-w-[120px]">
                    {user?.username}
                 </span>
                 <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0",
                    normalizedRole === 'ADMIN' 
                      ? "bg-red-500/10 text-red-500 border-red-500/20" 
                      : "bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20"
                 )}>
                    {normalizedRole === 'ADMIN' ? 'ADMIN' : 'TEACHER'}
                 </span>
              </div>
              <span className="text-[11px] text-sidebar-foreground/40 mt-1 truncate max-w-[150px]">
                 {user?.email}
              </span>
           </div>
        </div>
      </div>
    </header>
  );
});


