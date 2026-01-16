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
              Xem khóa học
            </motion.div>
          </div>

          {course.discountPercent > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-red-500 text-white border-none font-black text-xs px-2 py-0.5 shadow-lg shadow-red-500/30">
                -{course.discountPercent}%
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-bold">{course.averageRate || course.rating || 0}</span>
            </div>
            <span className="text-muted-foreground text-xs">•</span>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <Users className="h-3 w-3" />
              <span>{studentCount.toLocaleString()} học viên</span>
            </div>
          </div>

          <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] mb-3">
            {course.title}
          </h3>
          
          <div className="mt-auto flex flex-wrap gap-1.5 min-h-[1.25rem] mb-1">
              {(course.assets ?? []).length > 0 ? (
                course.assets?.map((asset, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-primary/70">
                    #{asset}
                  </span>
                ))
              ) : (
                <span className="text-[10px] font-bold text-transparent opacity-0">#placeholder</span>
              )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border/50">
            <div className="flex flex-col justify-center min-h-[2.5rem]">
              {course.discountPercent > 0 ? (
                <>
                  <span className="text-xs text-muted-foreground line-through decoration-red-500/50 leading-none mb-1">
                    {formatPrice(course.price)}
                  </span>
                  <span className="text-lg font-black text-primary leading-none">
                    {formatPrice(course.salePrice)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-primary leading-none">
                  {formatPrice(course.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
