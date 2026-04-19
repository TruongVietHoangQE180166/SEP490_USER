import React from 'react';
import { motion } from 'framer-motion';
import { Users2 } from 'lucide-react';

export function TeacherStep3Management() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-purple-500/10 text-purple-500">
        <Users2 className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Quản lý học viên hiệu quả</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Theo dõi danh sách học viên, tiến độ học tập và tương tác trực tiếp để giải đáp các thắc mắc của học viên trong quá trình học.
      </p>
    </motion.div>
  );
}
