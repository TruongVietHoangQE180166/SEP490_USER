'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { BlogPost } from '../types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return (
    <Link href={`/blog/${post.slugName}`} className="block group">
      <Card className="relative overflow-hidden rounded-lg border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col p-0">
        
        {/* Image Section */}
        <div
          className={cn(
            'relative overflow-hidden flex-shrink-0',
            featured ? 'aspect-[21/9]' : 'aspect-[16/9]'
          )}
        >
          <motion.img
            src={
              post.image ||
              'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
            }
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Tags */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <Badge className="bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20 px-3 py-1 font-bold">
              {post.categoryName}
            </Badge>

            {featured && (
              <Badge className="bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                Nổi bật
              </Badge>
            )}
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25"
            >
              <BookOpen className="h-4 w-4" />
              Đọc bài viết
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-3 p-4 flex-grow">
          <div className="space-y-2 flex-grow">
            <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>

            <p className="line-clamp-3 text-sm text-muted-foreground">
              {post.content}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-auto">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`} alt={post.userName} />
                <AvatarFallback>
                  {post.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-xs">
                <span className="font-medium text-foreground">
                  {post.userName}
                </span>
                <span className="text-muted-foreground">
                  {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-primary" />
              <span>{post.readTime} phút</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
