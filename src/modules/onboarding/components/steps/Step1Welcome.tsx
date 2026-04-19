import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, LineChart, Users } from 'lucide-react';

export function Step1Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail Section */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-[40px] group-hover:bg-primary/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/welcome.png" 
            alt="Welcome to VicTeach" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 right-4 lg:-right-6 lg:bottom-10 bg-card p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-4 z-20 backdrop-blur-xl"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div className="text-left pr-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">Khởi đầu mới</p>
            <p className="font-black text-sm text-foreground">Cùng kiến tạo tương lai</p>
          </div>
        </motion.div>
      </div>

      {/* Right Content Section */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Chào mừng đến với <span className="text-primary italic">VICTEACH</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Nền tảng học hỏi và đầu tư tài chính hàng đầu. Dưới đây là hành trình giúp bạn nắm vững kiến thức và làm chủ công cụ tài chính số:
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Trong hệ thống này, bạn sẽ được trải nghiệm:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Học tập chuyên sâu:</strong> Hàng trăm khoá học từ cơ bản đến nâng cao về Crypto và Blockchain.</li>
            <li><strong>Thực hành an toàn:</strong> Áp dụng kiến thức trực tiếp trên nền tảng giao dịch ảo không rủi ro.</li>
            <li><strong>Cộng đồng hỗ trợ:</strong> Tương tác cùng chuyên gia và hàng ngàn học viên khác, cùng nhau giải đáp thắc mắc mỗi ngày.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { icon: <BookOpen size={24} />, label: 'Học tập', color: 'bg-blue-500/10 text-blue-500' },
            { icon: <LineChart size={24} />, label: 'Giao dịch', color: 'bg-emerald-500/10 text-emerald-500' },
            { icon: <Users size={24} />, label: 'Cộng đồng', color: 'bg-amber-500/10 text-amber-500' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex flex-col justify-center items-center lg:items-start p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-all cursor-default"
            >
              <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
