import React from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';

export function Step3Market() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-purple-500/10 text-purple-500">
        <LineChart className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Thị trường Real-time</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Theo dõi biến động thị trường, giá rổ và phân tích các dự án mới nhất một cách chính xác và nhanh chóng ngay trên hệ thống.
      </p>
    </motion.div>
  );
}
