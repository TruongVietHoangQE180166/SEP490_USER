import React from 'react';
import { motion } from 'framer-motion';
import { BookPlus } from 'lucide-react';

export function TeacherStep2Content() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-emerald-500/10 text-emerald-500">
        <BookPlus className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Xây dựng bài giảng chuyên nghiệp</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Công cụ tạo bài giảng mạnh mẽ, hỗ trợ video, tài liệu và các bài kiểm tra trắc nghiệp giúp học viên nắm bắt kiến thức tốt nhất.
      </p>
    </motion.div>
  );
}
