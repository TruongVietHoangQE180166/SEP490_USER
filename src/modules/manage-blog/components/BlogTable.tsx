'use client';

import React from 'react';
import { BlogPost } from '../../blog/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit3, Eye, MoreHorizontal, Trash2, EyeOff, Calendar, User as UserIcon, Tag } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ThunderLoader } from '@/components/thunder-loader';

interface BlogTableProps {
  blogs: BlogPost[];
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
  onView: (blog: BlogPost) => void;
  isLoading: boolean;
}

export const BlogTable: React.FC<BlogTableProps> = ({ 
  blogs, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  onView,
  isLoading 
}) => {
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
          Đang tải bài viết...
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
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Bài viết</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Tác giả</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Danh mục</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-border/40 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <img 
                          src={blog.image || '/placeholder-blog.jpg'} 
                          alt={blog.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=200&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      <div className="flex flex-col max-w-xs xl:max-w-md">
                        <span className="font-bold text-foreground tracking-tight truncate line-clamp-1">{blog.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {new Date(blog.createdDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase">
                          {blog.fullname ? blog.fullname.charAt(0) : 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-bold text-foreground">{blog.fullname || blog.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 w-fit">
                       <Tag size={12} />
                       <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                         {blog.categoryName}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={blog.view ? 'default' : 'destructive'} 
                      className={`rounded-lg font-black text-[10px] uppercase tracking-tighter ${
                        blog.view 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {blog.view ? 'Hiển thị' : 'Ẩn'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl border-border/40 shadow-xl">
                        <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 px-2 py-1.5">Hành động</DropdownMenuLabel>
                        
                        <DropdownMenuItem 
                          onClick={() => onView(blog)}
                          className="rounded-lg gap-2 cursor-pointer font-bold"
                        >
                          <Eye size={14} /> Xem chi tiết
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => onEdit(blog)}
                          className="rounded-lg gap-2 cursor-pointer font-bold text-primary focus:text-primary"
                        >
                          <Edit3 size={14} /> Chỉnh sửa bài viết
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          onClick={() => onToggleStatus(blog.id, blog.view)}
                          className={`rounded-lg gap-2 cursor-pointer font-bold ${blog.view ? 'text-amber-500' : 'text-emerald-500'}`}
                        >
                          {blog.view ? (
                            <><EyeOff size={14} /> Ẩn bài viết</>
                          ) : (
                            <><Eye size={14} /> Hiển thị bài viết</>
                          )}
                        </DropdownMenuItem>

                        <div className="h-px bg-border/40 my-1" />
                        
                        <DropdownMenuItem 
                          onClick={() => onDelete(blog.id)}
                          className="rounded-lg gap-2 cursor-pointer font-bold text-destructive focus:text-destructive"
                        >
                          <Trash2 size={14} /> Xóa bài viết
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
                    <p className="text-muted-foreground font-bold">Không tìm thấy bài viết nào.</p>
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
