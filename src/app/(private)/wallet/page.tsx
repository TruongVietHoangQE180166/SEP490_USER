'use client';

import { WalletModule } from '@/modules/wallet';
import { motion } from 'framer-motion';
import { GridBackground } from '@/components/ui/grid-background';

export default function WalletPage() {
  return (
    <div className="relative min-h-screen bg-background pt-16 md:pt-24 pb-12 md:pb-20">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-[1850px]">
        <header className="mb-10 md:mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Tài chính an toàn</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4 uppercase italic">
              Quản lý <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">Ví Tiền</span>
            </h1>
            
            <p className="text-muted-foreground font-medium text-base md:text-lg max-w-2xl mx-auto px-4">
              Trung tâm quản lý tài sản số của bạn. Theo dõi số dư, nạp tiền và quản lý mọi giao dịch với độ bảo mật tối đa.
            </p>
          </motion.div>
          
          {/* Subtle line decoration */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </header>

        <WalletModule />
      </div>
    </div>
  );
}
