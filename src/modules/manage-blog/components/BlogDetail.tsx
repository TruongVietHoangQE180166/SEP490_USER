'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User as UserIcon, 
  Tag, 
  Eye, 
  Share2, 
  Bookmark,
  ArrowLeft,
  Quote
} from 'lucide-react';
import { BlogPost } from '../../blog/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface BlogDetailProps {
  blog: BlogPost;
  onBack: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ 
  blog, 
  onBack, 
  onEdit,
  showActions = true 
}) => {
  // Format date to Vietnamese locale
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30"
    >
      {/* Back Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-muted/50 transition-all rounded-xl px-4 h-10"
          >
            <ArrowLeft size={16} />
            <span className="font-semibold">Quay lại</span>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 pb-16">
        {/* Hero Section with Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/40 mb-8 group">
            <img
              src={blog.image || '/placeholder-blog.jpg'}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <Badge className="bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-primary/50">
                <Tag size={12} className="mr-1.5" />
                {blog.categoryName}
              </Badge>
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="absolute top-6 right-6 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-11 w-11 backdrop-blur-md bg-white/90 hover:bg-white transition-all shadow-lg"
                  onClick={onEdit}
                >
                  <Share2 size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-11 w-11 backdrop-blur-md bg-white/90 hover:bg-white transition-all shadow-lg"
                >
                  <Bookmark size={18} />
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Title & Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 space-y-6"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground tracking-tight">
              {blog.title}
            </h1>
          </div>

          {/* Author & Metadata */}
          <div className="flex flex-wrap items-center gap-4 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20 shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog.fullname}`} />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold text-base">
                  {blog.fullname?.charAt(0) || blog.userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  {blog.fullname || blog.userName}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Tác giả</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} className="text-primary" />
              <span className="text-sm font-semibold">{formatDate(blog.createdDate)}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye size={14} className="text-primary" />
              <span className="text-sm font-semibold">{blog.view ? 'Công khai' : 'Ẩn'}</span>
            </div>
          </div>
        </motion.div>

        <Separator className="mb-8 border-border/60" />

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium text-foreground/90">
            {blog.content}
          </div>
        </motion.article>

        {/* Engagement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex justify-end"
        >
          {showActions && onEdit && (
            <Button
              onClick={onEdit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105"
            >
              Chỉnh sửa bài viết
            </Button>
          )}
        </motion.div>

        {/* Quote/Note Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 p-6 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500"
        >
          <div className="flex gap-4">
            <Quote size={24} className="text-amber-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-amber-700 dark:text-amber-500">
                Ghi chú dành cho bạn
              </p>
              <p className="text-foreground font-medium italic">
                Bài viết này được quản lý trong hệ thống. Đảm bảo nội dung chính xác và phù hợp với tiêu chuẩn cộng đồng.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tags Section (if needed in future) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-8 pt-6 border-t border-border/40"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-primary" />
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mr-2">Danh mục:</span>
            <Badge variant="secondary" className="font-semibold px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted/80 transition-colors">
              {blog.categoryName}
            </Badge>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
