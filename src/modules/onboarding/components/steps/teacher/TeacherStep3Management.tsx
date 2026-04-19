import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, ClipboardCheck, Sparkles } from 'lucide-react';

export function TeacherStep3Management() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-[40px] group-hover:bg-blue-500/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/teacher_analytics.png" 
            alt="Management" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute bottom-4 left-4 lg:-left-6 lg:bottom-10 bg-card p-4 rounded-2xl shadow-2xl border border-border space-y-3 z-20 min-w-[200px] backdrop-blur-xl">
           <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
               <Users size={24} />
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Học viên mới</p>
                <p className="font-black text-sm text-foreground">+128 Học viên</p>
             </div>
           </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Quản lý trực tiếp <span className="text-blue-500 italic">HỌC VIÊN</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Bạn chính là người đồng hành đáng tin cậy nhất. Dễ dàng theo dõi tiến độ, đánh giá năng lực của học sinh trên dashboard riêng.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Bạn có được công cụ để:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
            <li><strong>Chăm sóc trực tuyến:</strong> Trả lời tức thì câu hỏi của sinh viên hoặc thiết lập bài trả lời mẫu tiết kiệm thời gian.</li>
            <li><strong>Kiểm soát bài học điểm:</strong> Nắm được % đạt chuẩn/trượt của bài học để từ đó sửa giáo án cho thích hợp.</li>
            <li><strong>Điều chỉnh linh hoạt:</strong> Cập nhật nội dung mô tả, thay thế video/file bất cứ khi nào bạn thấy cần nâng cấp phiên bản.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: <ClipboardCheck size={20} />, title: "Chấm điểm", desc: "Hệ thống tự động" },
            { icon: <Settings size={20} />, title: "Quản trị", desc: "Cấu hình bài giảng" },
            { icon: <Sparkles size={20} />, title: "Thảo luận", desc: "Kết nối Q&A" },
            { icon: <Users size={20} />, title: "Theo dõi", desc: "Chăm sóc học viên" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-start p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-all text-left">
              <div className="text-blue-500 mb-2 p-2.5 bg-blue-500/10 rounded-lg">
                {item.icon}
              </div>
              <h4 className="font-bold text-sm text-foreground mb-1">{item.title}</h4>
              <p className="text-[11px] text-muted-foreground font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
