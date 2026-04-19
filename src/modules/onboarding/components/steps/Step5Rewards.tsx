import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, Trophy, Crown } from 'lucide-react';

export function Step5Rewards() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail Section */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-[40px] transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/rewards.png" 
            alt="Rewards" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-4 right-4 lg:-top-6 lg:right-6 bg-gradient-to-br from-amber-400 to-amber-600 p-3.5 rounded-full shadow-2xl z-20 ring-4 ring-background"
        >
          <Crown className="text-white w-6 h-6" />
        </motion.div>
      </div>

      {/* Right Content Section */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Học bứt phá, nạp <span className="text-amber-500 italic">THƯỞNG</span> cực lớn
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Mỗi hành động tích cực của bạn đều được ghi lại. Việc nâng cấp Hạng Thẻ không chỉ chứng nhận sự hiểu biết mà còn mang tới những đặc quyền tiết kiệm thực tế.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Hệ sinh thái thẻ Gamification:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
            <li><strong>Điểm kinh nghiệm (EXP):</strong> Nhận thêm mỗi khi học bài đủ thời lượng, làm Quiz chính xác hoặc điểm danh bằng hệ thống Tracking.</li>
            <li><strong>Cấp độ Ranking:</strong> Phân chia từ Bronze, Gold, Diamond đến Master. Cấp càng cao, đặc quyền ưu đãi càng lớn.</li>
            <li><strong>Bộ huy hiệu độc quyền:</strong> Các huy chương danh dự khắc họa chặng đường chuyên sâu mà bạn hoàn thành.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          {[
            { icon: <Star />, label: "Tích lũy EXP", color: "text-amber-500" },
            { icon: <Award />, label: "Thăng Hạng", color: "text-blue-500" },
            { icon: <Zap />, label: "Đặc quyền VIP", color: "text-purple-500" },
            { icon: <Trophy />, label: "Vinh danh Ranking", color: "text-rose-500" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 hover:bg-muted/30 hover:-translate-y-1 transition-all">
               <div className={`${item.color} mb-3`}>
                 {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28 })}
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-foreground text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
