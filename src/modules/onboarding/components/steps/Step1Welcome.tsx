import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export function Step1Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full text-center"
    >
      <div className="p-4 sm:p-6 rounded-full mb-6 sm:mb-8 shadow-inner bg-blue-500/10 text-blue-500">
        <GraduationCap className="w-12 h-12 sm:w-16 h-16" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Chào mừng đến với VICTEACH</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
        Nền tảng học hỏi và đầu tư tài chính số 1. Nơi bạn khám phá thế giới Crypto, Blockchain và DeFi với lộ trình rõ ràng.
      </p>
    </motion.div>
  );
}
