import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Target } from 'lucide-react';

export function TeacherStep4Analytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-teal-500/20 rounded-3xl blur-[40px] group-hover:bg-teal-500/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/teacher_analytics.png" 
            alt="Teacher Analytics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute -bottom-4 right-4 lg:-bottom-6 lg:right-6 flex gap-4 z-20">
           <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="bg-card p-4 rounded-xl shadow-2xl border border-border flex items-center gap-3 backdrop-blur-xl"
           >
             <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
               <TrendingUp size={20} />
             </div>
             <span className="text-sm font-black uppercase text-foreground">Tăng trưởng +15%</span>
           </motion.div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Phân tích <span className="text-teal-500 italic">DỮ LIỆU</span> sâu sắc
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Mỗi quyết định mở rộng giáo trình đều nên xuất phát từ con số thật. Hệ thống báo cáo phân tích mạnh mẽ giúp tối ưu nguồn lực của bạn.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Truy cập tổng quan vào:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
            <li><strong>Dữ liệu Doanh số:</strong> Thống kê trực tiếp số lượng bán hàng với biểu đồ doanh số đa chiều.</li>
            <li><strong>Tỷ lệ Retention:</strong> Báo cáo tỷ lệ quay lại của học sinh, tần suất họ xem video hoặc bỏ dở để kịp thời điều chỉnh.</li>
            <li><strong>Bảo mật bản quyền:</strong> Lịch sử đăng nhập thiết bị người dùng.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: <BarChart3 size={20} />, title: "Hiệu năng", desc: "Thông kê theo tháng" },
            { icon: <PieChart size={20} />, title: "Lượt xem", desc: "Tần suất học tập" },
            { icon: <Target size={20} />, title: "Mục tiêu", desc: "Thống kê hoàn thành" },
            { icon: <TrendingUp size={20} />, title: "Doanh số", desc: "Chuyển đổi thực tế" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 hover:bg-muted/30 transition-all text-left">
              <div className="text-teal-500 bg-teal-500/10 p-2.5 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate w-full">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground font-medium truncate w-full">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
