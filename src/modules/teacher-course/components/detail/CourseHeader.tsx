import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Share2, Star, Users, Clock } from 'lucide-react';
import { STATUS_CONFIG, LEVEL_MAP, formatDate } from './constants';

interface CourseHeaderProps {
  course: any;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => {
  const statusCfg = STATUS_CONFIG[course.status] ?? STATUS_CONFIG['DRAFT'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 space-y-4"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} animate-pulse`} />
              {statusCfg.label}
            </span>
            <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full border-border/50 bg-background/55 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" /> KHÓA HỌC TRỰC TUYẾN
            </Badge>
            {(course.courseLevel || course.level) && (
              <Badge variant="secondary" className="rounded-full text-xs">
                {course.courseLevel || (course.level && LEVEL_MAP[course.level]) || course.level}
              </Badge>
            )}
            {course.categoryName && (
              <Badge variant="secondary" className="rounded-full text-xs bg-primary/10 text-primary border-none">
                {course.categoryName}
              </Badge>
            )}
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {course.title}
          </h1>
          <p className="max-w-3xl text-foreground/70">{course.description}</p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="font-bold text-amber-600 dark:text-amber-500 text-base">
                {course.averageRate?.toFixed(1) || '0.0'}
              </span>
              <span className="text-foreground/60 text-xs">({course.totalRate || 0} đánh giá)</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-foreground/20" />
            <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground/70 font-medium">
                {course.countEnrolledStudents != null 
                  ? `${course.countEnrolledStudents.toLocaleString()} học viên` 
                  : (course.totalStudents != null ? `${course.totalStudents.toLocaleString()} học viên` : 'Chưa có học viên')}
              </span>
            </div>
            {course.assets && course.assets.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {course.assets.map((asset: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider bg-secondary/80 text-secondary-foreground border-border/40"
                  >
                    {asset.charAt(0).toUpperCase() + asset.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Tạo ngày {formatDate(course.createdDate)}
            </div>
          </div>
        </div>

        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/40 bg-background/60 backdrop-blur hover:border-border/60 hover:bg-background/70 shadow-lg shrink-0">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};
