'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, ArrowRight, Star, Award, ExternalLink } from 'lucide-react';
import { EnrolledCourse } from '../types';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ReviewModal } from './ReviewModal';
import { useMyCourse } from '../hooks/useMyCourse';
import { observer } from '@legendapp/state/react';

interface MyCourseCardProps {
  course: EnrolledCourse;
  index: number;
}

export const MyCourseCard = observer(({ course, index }: MyCourseCardProps) => {
  const { userRatings } = useMyCourse();
  const isCompleted = course.progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.21, 0.45, 0.32, 0.9]
      }}
    >
      <Card className="group relative overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] hover:border-primary/30 flex flex-col md:flex-row md:h-56 rounded-[32px] p-2">
        {/* Thumbnail Section */}
        <Link href={`/course/${course.slug}`} className="relative w-full md:w-80 h-48 md:h-auto md:self-stretch shrink-0 rounded-[24px] overflow-hidden block">
          <img
            src={course.thumbnailUrl || course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-60" />
          
          {/* View Course Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
              <ExternalLink className="h-6 w-6" />
            </div>
          </div>

          {isCompleted && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1.5 bg-emerald-500 text-white font-black text-[9px] uppercase px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                <Trophy className="h-3 w-3" />
                Đã hoàn thành
              </div>
            </div>
          )}
        </Link>

        {/* Content Section */}
        <div className="flex-1 p-6 md:px-10 md:py-6 flex flex-col">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase px-3">
                Nội dung khóa học
              </Badge>
              <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[11px] font-bold">
                <Clock className="h-3.5 w-3.5" />
                Truy cập gần đây
              </div>
            </div>

            <Link href={`/course/${course.slug}`}>
              <h3 className="text-2xl font-black text-foreground hover:text-primary transition-colors duration-300 line-clamp-1 mb-3 tracking-tight cursor-pointer">
                {course.title}
              </h3>
            </Link>
            
            <p className="text-sm text-muted-foreground/80 line-clamp-2 md:line-clamp-1 font-medium mb-6">
              Tiếp tục hành trình học tập và nâng cao kỹ năng của bạn.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-primary tracking-tighter tabular-nums">
                    {course.progress}%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 self-end mb-1.5">
                    Hoàn thành
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* Certificate button – only when 100% */}
                {isCompleted && (
                  <Link href={`/certificate/${course.slug}`} onClick={(e) => e.stopPropagation()}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-black text-[11px] uppercase tracking-wider transition-all"
                    >
                      <Award className="h-4 w-4" />
                      Chứng chỉ
                    </motion.div>
                  </Link>
                )}

                <ReviewModal courseId={course.id} courseTitle={course.title}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/50 hover:bg-secondary text-foreground font-black text-[11px] uppercase tracking-wider border border-border/50 transition-all backdrop-blur-md"
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {userRatings[course.id] ? 'Sửa đánh giá' : 'Đánh giá'}
                  </button>
                </ReviewModal>

                <Link href={`/learn/${course.slug}`} onClick={(e) => e.stopPropagation()}>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 2 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
                  >
                    {isCompleted ? 'Xem lại' : 'Học tiếp'}
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Progress Track */}
            <div className="relative h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "circOut" }}
                className={`absolute inset-y-0 left-0 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] ${
                  isCompleted ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-primary'
                }`}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
