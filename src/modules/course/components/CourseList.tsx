import { observer } from '@legendapp/state/react';
import { motion } from 'framer-motion';
import { CourseCard } from './CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Course } from '../types';
import { SearchX } from 'lucide-react';

interface CourseListProps {
  courses?: Course[];
}

export const CourseList = observer(({ courses: propCourses }: CourseListProps) => {
  const displayCourses = propCourses || [];


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
