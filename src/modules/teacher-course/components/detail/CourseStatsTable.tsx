import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, Users, Award, Star, Clock } from 'lucide-react';
import { itemVariants, LEVEL_MAP } from './constants';
import { cn } from '@/lib/utils';

interface CourseStatsTableProps {
  course: any;
  moocsLength: number;
  totalLessonsCount: number;
}

export const CourseStatsTable = ({ course, moocsLength, totalLessonsCount }: CourseStatsTableProps) => {
  const stats = [
    { 
        label: 'Tổng chương', 
        value: `${moocsLength}`, 
        unit: 'Chương',
        icon: <BookOpen size={20} />
    },
    { 
        label: 'Bài giảng', 
        value: `${totalLessonsCount}`, 
        unit: 'Bài học',
        icon: <PlayCircle size={20} />
    },
    { 
        label: 'Học viên', 
        value: (course.totalStudents || course.countEnrolledStudents || 0).toLocaleString(), 
        unit: 'Học viên',
        icon: <Users size={20} />
    },
    { 
        label: 'Đánh giá', 
        value: (course.averageRate || 0).toFixed(1), 
        unit: `(${course.totalRate || 0})`,
        icon: <Star size={20} />
    },
  ];

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <div 
            key={i} 
            className="group relative overflow-hidden rounded-xl border-2 border-border/40 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/[0.05]"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                {stat.icon}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">{stat.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black tracking-tight">{stat.value}</span>
                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase">{stat.unit}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};
