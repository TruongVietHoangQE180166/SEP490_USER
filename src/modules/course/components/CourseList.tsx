import { observer } from '@legendapp/state/react';
import { motion } from 'framer-motion';
import { CourseCard } from './CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Course } from '../types';
import { SearchX } from 'lucide-react';

interface CourseListProps {
  courses?: Course[];
  isLoading?: boolean;
}

const CourseCardSkeleton = () => (
  <div className="rounded-2xl border border-border/50 bg-card p-0 overflow-hidden flex flex-col h-full animate-pulse">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="p-4 space-y-4 flex-grow">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export const CourseList = observer(({ courses: propCourses, isLoading }: CourseListProps) => {
  const displayCourses = propCourses || [];

  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (displayCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-muted/30 p-8 rounded-full mb-6 ring-8 ring-muted/10">
            <SearchX className="h-14 w-14 text-muted-foreground/40" />
        </div>
        <h3 className="text-2xl font-black tracking-tight">Không tìm thấy khóa học nào</h3>
        <p className="text-muted-foreground max-w-sm mt-2 font-medium">
            Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với từ khóa hoặc bộ lọc của bạn. Thử điều chỉnh lại nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {displayCourses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <CourseCard course={course} />
        </motion.div>
      ))}
    </div>
  );
});
