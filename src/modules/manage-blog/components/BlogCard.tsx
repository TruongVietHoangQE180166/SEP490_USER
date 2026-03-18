'use client';

import React from 'react';
import { BlogPost } from '../../blog/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Edit3, 
  Eye, 
  Trash2, 
  EyeOff, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BlogCardProps {
  blog: BlogPost;
  onToggleStatus: (id: string, slugName: string, currentStatus: boolean) => void;
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
  onView: (blog: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ 
  blog, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  return (
    <div className="group relative flex flex-col bg-card rounded-xl border border-border/40 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={blog.image || '/placeholder-blog.jpg'} 
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Badges on Image */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge 
            className={`rounded-lg font-black text-[10px] uppercase tracking-tighter border-none px-3 py-1 ${
              blog.view 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-500 text-white'
            }`}
          >
            {blog.view ? 'Đang hiển thị' : 'Đang ẩn'}
          </Badge>
        </div>

        {/* Action Menu */}
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-xl border border-white/10">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border/40 shadow-2xl backdrop-blur-xl">
              <DropdownMenuItem 
                onClick={() => onEdit(blog)}
                className="rounded-xl gap-3 cursor-pointer font-bold text-sm h-11 focus:bg-primary/10 focus:text-primary"
              >
                <Edit3 size={16} /> Chỉnh sửa bài viết
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => onToggleStatus(blog.id, blog.slugName, blog.view)}
                className={`rounded-xl gap-3 cursor-pointer font-bold text-sm h-11 ${blog.view ? 'text-amber-500 focus:bg-amber-50 focus:text-amber-600' : 'text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600'}`}
              >
                {blog.view ? (
                  <><EyeOff size={16} /> Tạm ẩn bài viết</>
                ) : (
                  <><Eye size={16} /> Hiển thị công khai</>
                )}
              </DropdownMenuItem>

              <div className="h-px bg-border/40 my-1 mx-1" />
              
              <DropdownMenuItem 
                onClick={() => onDelete(blog.id)}
                className="rounded-xl gap-3 cursor-pointer font-bold text-sm h-11 text-destructive focus:bg-destructive/5 focus:text-destructive"
              >
                <Trash2 size={16} /> Xóa vĩnh viễn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white">
              <Tag size={12} className="text-primary-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {blog.categoryName}
              </span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
             <Calendar size={14} />
             <span className="text-xs font-bold uppercase tracking-tighter">
                {new Date(blog.createdDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
             </span>
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 font-medium leading-relaxed">
            {blog.content.replace(/<[^>]*>?/gm, '')}
          </p>
        </div>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 border border-border/40">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                {blog.fullname ? blog.fullname.charAt(0).toUpperCase() : 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col -space-y-0.5">
               <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Tác giả</span>
               <span className="text-sm font-bold text-foreground">{blog.fullname || blog.userName}</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => onView(blog)}
            className="group/btn h-10 px-4 rounded-xl font-bold text-xs gap-2 hover:bg-primary hover:text-white transition-all shadow-none"
          >
            Chi tiết
            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
