import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export function TeacherStep4Analytics() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-pink-500/10 text-pink-500">
        <BarChart3 className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Phân tích & Thống kê</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Hệ thống báo cáo doanh thu, đánh giá khóa học và dữ liệu phân tích chi tiết giúp bạn tối ưu hóa nội dung giảng dạy.
      </p>
    </motion.div>
  );
}
