import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Palette, BarChart, Banknote } from 'lucide-react';

export function TeacherStep1Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-[40px] group-hover:bg-purple-500/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/teacher_welcome.png" 
            alt="Teacher Welcome" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 lg:-left-6 lg:bottom-10 bg-card p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-4 z-20 backdrop-blur-xl"
        >
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
            <GraduationCap size={24} className="animate-pulse" />
          </div>
          <div className="text-left pr-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/70 mb-1">Đối tác giáo dục</p>
            <p className="font-black text-sm text-foreground">Lan tỏa giá trị cộng đồng</p>
          </div>
        </motion.div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Chào mừng <span className="text-purple-500 italic">GIẢNG VIÊN</span> mới
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Tại VICTEACH, chúng tôi đem đến hệ thống giáo dục cao cấp, nơi bạn số hóa bài giảng và nhân rộng sức ảnh hưởng đến hàng vạn học viên đam mê tài chính trên toàn quốc.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Hành trình Giảng viên của bạn:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
            <li><strong>Soạn thảo khóa học:</strong> Đăng tải nội dung linh hoạt với nhiều định dạng: Video trực tuyến, PDF tải về, và tạo hệ thống Quiz đa dạng.</li>
            <li><strong>Giám sát chặt chẽ:</strong> Kiểm soát toàn diện phản hồi khóa học, quản lý bình luận học sinh chuyên nghiệp.</li>
            <li><strong>Thuận tiện tài chính:</strong> Hệ thống tự động ghi nhận thanh toán và theo dõi tăng trưởng, đảm bảo phân chia hoa hồng minh bạch.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { icon: <Palette size={24} />, label: 'Sáng tạo', color: 'text-purple-500' },
            { icon: <BarChart size={24} />, label: 'Quản lý', color: 'text-blue-500' },
            { icon: <Banknote size={24} />, label: 'Thu nhập', color: 'text-emerald-500' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-all cursor-default"
            >
              <div className={`h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3 ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-xs font-bold text-foreground uppercase tracking-widest">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
