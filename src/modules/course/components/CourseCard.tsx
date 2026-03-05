'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen } from 'lucide-react';
import { Course } from '../types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const studentCount = useMemo(() => {
    return course.totalStudents || Math.floor(Math.random() * 5000) + 500;
  }, [course.id, course.totalStudents]);

  return (
    <Link href={`/course/${course.slug}`} className="group">
      <Card className="overflow-hidden h-full border-border/50 bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 flex flex-col py-0 gap-0">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={course.thumbnailUrl || course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[10px] uppercase tracking-wider font-black text-primary-foreground shadow-lg shadow-primary/25 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {course.isEnrolled ? 'Tiếp tục học' : 'Xem chi tiết'}
            </motion.div>
          </div>

          <div className="absolute top-0 left-0 z-20 flex flex-col items-start gap-0.5">
            {course.isFree && (
              <div className="bg-emerald-600 text-white font-black text-[10px] px-3 py-1.5 rounded-br-xl shadow-xl border-b border-r border-white/20 backdrop-blur-sm uppercase tracking-wider flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Miễn phí
              </div>
            )}
            {course.isEnrolled && (
              <div className="bg-primary text-white font-black text-[10px] px-3 py-1.5 rounded-br-xl shadow-xl border-b border-r border-white/20 backdrop-blur-sm uppercase tracking-wider flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Đang sở hữu
              </div>
            )}
          </div>

          {!course.isEnrolled && course.discountPercent > 0 && !course.isFree && (
            <div className="absolute top-0 right-0 z-20">
              <div className="bg-red-600 text-white font-black text-[10px] px-3 py-1.5 rounded-bl-xl shadow-xl border-b border-l border-white/20 backdrop-blur-sm uppercase tracking-wider">
                Giảm {course.discountPercent}%
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-2 px-0.5">
            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[11px] font-bold">
                {course.averageRate?.toFixed(1) || '0.0'}
                <span className="text-[10px] text-amber-500/60 font-medium ml-1">
                  ({course.totalRate || 0})
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full border border-border/50">
              <Users className="h-3 w-3" />
              <span className="text-[10px] font-bold">{studentCount.toLocaleString()}</span>
            </div>
          </div>

          <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] mb-3">
            {course.title}
          </h3>
          
          <div className="mt-auto flex flex-wrap gap-1.5 min-h-[1.25rem] mb-2">
              {(course.assets ?? []).length > 0 ? (
                course.assets?.map((asset, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-primary/70 bg-primary/5 px-1.5 rounded-sm">
                    #{asset}
                  </span>
                ))
              ) : (
                <span className="text-[10px] font-bold text-transparent opacity-0">#placeholder</span>
              )}
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border/50">
            <div className="flex flex-col justify-center min-h-[2.5rem]">
              {course.isEnrolled ? (
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                  Vào học ngay
                </div>
              ) : course.isFree ? (
                <span className="text-xl font-black text-emerald-600 leading-none">
                  FREE
                </span>
              ) : course.discountPercent > 0 ? (
                <>
                  <span className="text-[10px] text-muted-foreground line-through decoration-red-500/40 leading-none mb-1">
                    {formatPrice(course.price)}
                  </span>
                  <span className="text-lg font-black text-primary leading-none">
                    {formatPrice(course.salePrice)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-black text-primary leading-none">
                  {formatPrice(course.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
               {!course.isEnrolled && (
                  <div className="rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Mua ngay
                  </div>
               )}
               {course.isEnrolled && (
                  <div className="rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    Học tiếp
                  </div>
               )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
