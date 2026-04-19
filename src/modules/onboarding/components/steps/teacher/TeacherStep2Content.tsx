import React from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, CheckCircle2, Video, FileText, Layout } from 'lucide-react';

export function TeacherStep2Content() {
  const features = [
    { icon: <Video size={18} />, label: "Bài giảng 4K Streaming" },
    { icon: <FileText size={18} />, label: "Tài nguyên PDF đính kèm" },
    { icon: <Layout size={18} />, label: "Quản trị phân mục bài giảng" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-[40px] group-hover:bg-emerald-500/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/teacher_content.png" 
            alt="Teacher Content" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute top-4 right-4 lg:-right-6 lg:top-10 bg-card p-4 rounded-2xl shadow-2xl border border-border flex flex-col gap-3 z-20 min-w-[220px] backdrop-blur-xl">
           <div className="flex items-center gap-3 border-b border-border pb-2">
             <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <Clapperboard size={20} />
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Upload Video</p>
           </div>
           <div className="space-y-2.5">
             <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground w-full">
               <span>Đang xử lý chuẩn HD...</span>
               <span className="text-emerald-500 w-10 text-right">85%</span>
             </div>
             <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  className="h-full bg-emerald-500"
                />
             </div>
           </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Xây dựng <span className="text-emerald-500 italic">BÀI GIẢNG</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Sử dụng công cụ tạo khóa học chuyên nghiệp, với băng thông đường truyền ổn định để bạn đăng tải nội dung không giới hạn dung lượng.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Bạn có toàn quyền kiểm soát:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
            <li><strong>Chương mục chuẩn hóa:</strong> Tổ chức kiến thức theo các Volume/Chapter giúp sinh viên dễ tiếp thu.</li>
            <li><strong>Xử lý Video tự động:</strong> Chỉ cần thả file thô, cloud sẽ nén chuẩn hóa về các định dạng HLS giúp truy xuất độ mượt gốc cho User.</li>
            <li><strong>Bài test chuyên sâu:</strong> Hệ thống nhập danh sách trắc nghiệm đa lựa chọn đi kèm cài đặt mức điểm yêu cầu linh hoạt.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 gap-3 pt-4">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-border/40 hover:bg-emerald-500/5 transition-all text-left"
            >
              <div className="text-emerald-500 bg-emerald-500/10 p-2.5 rounded-lg shrink-0">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-foreground truncate w-full">{item.label}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
