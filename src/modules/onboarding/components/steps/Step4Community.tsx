import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export function Step4Community() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-pink-500/10 text-pink-500">
        <Users className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Cộng đồng năng động</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Tham gia các hội nhóm, kết nối và trao đổi trực tiếp với giảng viên cùng những nhà đầu tư khác trên nền tảng.
      </p>
    </motion.div>
  );
}
