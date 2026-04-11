'use client';

import React from 'react';
import { User } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, User as UserIcon, MoreHorizontal, Ban, Unlock } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ThunderLoader } from '@/components/thunder-loader';

interface UserTableProps {
  users: User[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  isLoading: boolean;
}


export const UserTable: React.FC<UserTableProps> = ({ users, onToggleStatus, isLoading }) => {


  if (isLoading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center gap-4 bg-background/30 backdrop-blur-sm rounded-2xl border border-border/40">
        <ThunderLoader 
          size="xl" 
          variant="default" 
          animate="thunder" 
          showGlow 
          showFill
        />
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Tên người dùng</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Vai trò</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Cấp độ</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-110 transition-transform">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground tracking-tight">{user.username}</span>
                        <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       {user.role === 'ADMIN' ? (
                         <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Shield size={14} className="fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Admin</span>
                         </div>
                       ) : user.role === 'TEACHER' ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                           <UserIcon size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Teacher</span>
                        </div>
                       ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                           <UserIcon size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">User</span>
                        </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Badge variant="outline" className="rounded-lg h-6 px-2 text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20 whitespace-nowrap">
                        {user.level === 'NHAP_MON' ? 'Nhập môn' : user.level || 'Chưa xác định'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={user.status === 'ACTIVE' ? 'default' : 'destructive'} 
                      className={`rounded-lg font-black text-[10px] uppercase tracking-tighter ${
                        user.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-border/40 shadow-xl">
                        <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 px-2 py-1.5">Hành động</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => onToggleStatus(user.id, user.status)}
                          className={`rounded-lg gap-2 cursor-pointer font-bold ${user.status === 'INACTIVE' ? 'text-emerald-500 focus:text-emerald-500' : 'text-amber-500 focus:text-amber-500'}`}
                        >
                          {user.status === 'INACTIVE' ? (
                            <><Unlock size={14} /> Kích hoạt người dùng</>
                          ) : (
                            <><Ban size={14} /> Ngừng hoạt động</>
                          )}

                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-muted/20 border-border/40 border-2 border-dashed rounded-full">
                       <UserIcon className="text-muted-foreground h-10 w-10" />
                    </div>
                    <p className="text-muted-foreground font-bold">Không tìm thấy người dùng nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
