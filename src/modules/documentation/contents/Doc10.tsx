import React from 'react';
import { Flag, Rocket, Layers, Globe, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Doc10 = () => (
  <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    <div className="relative">
       <div className="absolute top-0 left-6 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent hidden md:block" />

       {/* Phase 1 */}
       <section id="phase-1" className="relative pl-0 md:pl-20 scroll-mt-32">
          <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary z-10 hidden md:flex shadow-xl shadow-primary/20">
             <Flag size={20} className="font-black" />
          </div>
          
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                Giai đoạn 1: Khởi tạo (2024)
             </div>
             <h3 className="text-2xl font-black text-foreground">Xây dựng nền tảng vững chắc</h3>
             <p className="text-muted-foreground leading-relaxed max-w-3xl">
                Tập trung vào việc phát triển kiến trúc hệ thống lõi, tích hợp các bộ thư viện UI Premium và thiết lập quy trình bảo mật tài chính 2FA.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {['Ra mắt phiên bản Beta cho 100 học viên', 'Tích hợp thanh toán QR Code tự động', 'Hoàn thiện hệ thống quản lý bài giảng Video', 'Thiết lập cộng đồng VIC Community trên Discord'].map((item, i) => (
                   <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border/40 text-xs font-bold text-foreground/70">
                      <Zap size={14} className="text-primary mt-0.5 shrink-0" />
                      {item}
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* Phase 2 */}
       <section id="phase-2" className="relative pl-0 md:pl-20 mt-20 scroll-mt-32">
          <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-background border-4 border-primary/30 flex items-center justify-center text-primary/40 z-10 hidden md:flex">
             <Rocket size={20} />
          </div>
          
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest border border-border/40">
                Giai đoạn 2: Tăng trưởng (2025)
             </div>
             <h3 className="text-2xl font-black text-foreground">Mở rộng quy mô & Cá nhân hóa</h3>
             <p className="text-muted-foreground leading-relaxed max-w-3xl">
                Ứng dụng trí tuệ nhân tạo (AI) để phân tích lộ trình học và gợi ý khóa học phù hợp cho từng cá nhân. Ra mắt app mobile chính thức.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 opacity-60">
                {['Ra mắt VIC Mobile App (iOS & Android)', 'Hệ thống Mentorship 1:1 trực tuyến', 'Cấp chứng chỉ NFT trên Blockchain', 'Đạt mốc 10.000 học viên thường xuyên'].map((item, i) => (
                   <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border/40 text-xs font-bold">
                      <Layers size={14} className="mt-0.5 shrink-0" />
                      {item}
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* Phase 3 */}
       <section id="phase-3" className="relative pl-0 md:pl-20 mt-20 scroll-mt-32">
          <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-background border-4 border-primary/10 flex items-center justify-center text-primary/20 z-10 hidden md:flex">
             <Globe size={20} />
          </div>
          
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest border border-border/40">
                Giai đoạn 3: Hệ sinh thái (2026+)
             </div>
             <h3 className="text-2xl font-black text-foreground">Vươn tầm quốc tế</h3>
             <p className="text-muted-foreground leading-relaxed max-w-3xl">
                Trở thành nền tảng đào tạo kỹ năng tài chính và kỹ thuật hàng đầu khu vực Đông Nam Á, hỗ trợ đa ngôn ngữ và kết nối việc làm toàn cầu.
             </p>
             <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 flex flex-col items-center text-center gap-4">
                <Heart className="text-primary animate-pulse" size={40} />
                <h4 className="font-black text-foreground uppercase tracking-widest text-sm">Hành trình không giới hạn</h4>
                <p className="text-xs text-muted-foreground max-w-md">Chúng tôi cam kết đồng hành cùng học viên để kiến tạo một thế hệ làm chủ công nghệ và tự do tài chính.</p>
             </div>
          </div>
       </section>
    </div>
  </div>
);

export default Doc10;
