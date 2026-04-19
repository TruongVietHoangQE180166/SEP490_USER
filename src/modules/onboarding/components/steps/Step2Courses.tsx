import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Video, FileText, ClipboardList } from 'lucide-react';

export function Step2Courses() {
  const features = [
    { icon: <Video size={18} />, label: "Bài giảng Video HD" },
    { icon: <FileText size={18} />, label: "Tài liệu đính kèm" },
    { icon: <ClipboardList size={18} />, label: "Bài kiểm tra" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left: Thumbnail */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-[40px] group-hover:bg-emerald-500/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/courses.png" 
            alt="Courses" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute top-4 left-4 lg:-left-6 lg:top-10 bg-card p-4 rounded-2xl shadow-2xl border border-border flex flex-col gap-3 z-20 min-w-[200px] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <BookOpen size={20} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Giảng trình</p>
          </div>
          <div className="space-y-2.5">
            {[1, 2].map((_, i) => (
              <div key={i} className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: i === 0 ? "80%" : "60%" }}
                  className="h-full bg-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Hệ thống <span className="text-emerald-500 italic">KHOÁ HỌC</span> chuyên sâu
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Mỗi phút giây bạn dành cho học tập đều được hệ thống ghi nhận. Chúng tôi cung cấp lượng kiến thức khổng lồ được biên soạn kỹ lưỡng bởi các chuyên gia.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Hướng dẫn học tập hiệu quả:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
            <li><strong>Video chi tiết:</strong> Các video hướng dẫn trực quan, phân tích đầu tư qua góc nhìn thực tế.</li>
            <li><strong>Tài liệu bổ trợ:</strong> Tải nội dung dưới định dạng PDF, Excel phục vụ việc ôn tập mọi lúc.</li>
            <li><strong>Bài kiểm tra (Quiz):</strong> Hệ thống tự động theo dõi, chấm câu hỏi trắc nghiệm và đánh giá chuẩn.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/40 hover:bg-emerald-500/5 transition-all"
            >
              <div className="text-emerald-500 bg-emerald-500/10 p-2.5 rounded-lg shrink-0">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-foreground">{item.label}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto hidden sm:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
