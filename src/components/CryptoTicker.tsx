'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Bell } from 'lucide-react';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const TICKER_MESSAGES = [
  "Chào mừng đến với VICT Academy - Nền tảng học tập Crypto chuyên sâu.",
  "Tin mới: Bitcoin vượt mốc kháng cự quan trọng. Xem ngay phân tích mới nhất.",
  "Dự án mới: Tổng quan về hệ sinh thái Lớp 2 sắp ra mắt.",
  "Mẹo bảo mật: Tuyệt đối không chia sẻ mã khóa Seed Phrase của bạn cho bất kỳ ai.",
  "Học tập: Tham gia khóa học Crypto 101 hoàn toàn miễn phí ngay hôm nay.",
];

export const CryptoTicker = () => {
  const pathname = usePathname();
  const isAuthPage = pathname && Object.values(ROUTES.AUTH).some((route) => pathname.startsWith(route));

  if (isAuthPage) return null;

  return (
    <div className="relative flex h-10 w-full items-center overflow-hidden border-b border-border/50 bg-muted/30 backdrop-blur-sm">
      <div className="z-10 flex h-full items-center bg-background px-4 text-xs font-bold uppercase tracking-wider text-primary shadow-lg border-r border-border/50">
        <Bell className="mr-2 h-3.5 w-3.5 fill-primary" />
        Breaking
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <motion.div
          animate={{
            x: [0, -1000], 
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ willChange: "transform" }}
          className="flex whitespace-nowrap gap-12"
        >
          {/* Repeat messages to create seamless loop */}
          {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((message, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground/90 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              {message}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="z-10 bg-background/50 h-full flex items-center px-4 backdrop-blur-md">
        <Bell className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
      </div>
    </div>
  );
};
