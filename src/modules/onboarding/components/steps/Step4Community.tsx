import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Handshake, Share2 } from 'lucide-react';

export function Step4Community() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail Section */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-orange-500/20 rounded-3xl blur-[40px] group-hover:bg-orange-500/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/community.png" 
            alt="Community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute -bottom-2 -left-4 lg:-bottom-6 lg:-left-6 flex flex-col gap-2.5 z-20">
          {[1, 2, 3].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="bg-card py-2 px-4 rounded-xl shadow-xl border border-border flex items-center gap-2.5 backdrop-blur-xl"
            >
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                {i === 0 ? "Hỗ trợ 24/7 trực tuyến" : i === 1 ? "Hoan nghênh thành viên mới" : "Tham gia góc thảo luận"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Giao lưu & <span className="text-orange-500 italic">KẾT NỐI</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Thị trường crypto thay đổi mỗi ngày và bạn không hề đơn độc. Tham gia cộng đồng hàng nghìn người trải nghiệm như một môi trường thu nhỏ của xã hội đầu tư.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Bạn có thể xây dựng mạng lưới qua:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-orange-500">
            <li><strong>Hỏi đáp chuyên môn:</strong> Đặt câu hỏi trực tiếp dưới mỗi bài giảng, cùng tranh luận với thầy giáo và các sinh viên.</li>
            <li><strong>Blog kỹ năng:</strong> Tự động trao đổi hay xây dựng thương hiệu kiến thức bằng cách viết Blog.</li>
            <li><strong>Hỗ trợ kỹ thuật:</strong> Kết nối ngay với đội vận hành hệ thống thông qua khung Chat Live nếu bạn gặp sự cố.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: <MessageSquare size={20} />, label: "Thảo luận nhóm" },
            { icon: <Users size={20} />, label: "Gặp gỡ chuyện gia" },
            { icon: <Handshake size={20} />, label: "Đồng hành giao dịch" },
            { icon: <Share2 size={20} />, label: "Tạo mạng lưới riêng" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl border border-border/40 hover:bg-orange-500/5 transition-colors text-left">
              <div className="text-orange-500 bg-orange-500/10 p-2.5 rounded-lg shrink-0">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-foreground leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
