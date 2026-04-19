import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export function Step5Rewards() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-amber-500/10 text-amber-500">
        <Trophy className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Tích lũy & Đổi thưởng</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Hoàn thành bài tập, điểm danh và tương tác năng nổ để nhận điểm thưởng. Dùng điểm thưởng đổi xu, USDT hoặc các phần quà hấp dẫn!
      </p>
    </motion.div>
  );
}
