import React from 'react';
import { Users, MessageSquare, Award, Share2, Heart, Sparkles } from 'lucide-react';

const Doc5 = () => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    <section id="network" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <Users size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Cộng đồng VIC</h2>
      </div>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">
        Học tập không bao giờ là đơn độc tại VIC Teach. Chúng tôi xây dựng một mạng lưới kết nối giữa học viên, giảng viên và các chuyên gia hàng đầu trong ngành.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 rounded-2xl bg-card border border-border/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
               <MessageSquare size={24} />
            </div>
            <h4 className="font-black text-foreground">Diễn đàn thảo luận</h4>
            <p className="text-xs text-muted-foreground">Nơi giải đáp mọi thắc mắc về kỹ thuật và kiến thức chuyên môn bởi đội ngũ Admin.</p>
         </div>
         <div className="p-8 rounded-2xl bg-card border border-border/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
               <Award size={24} />
            </div>
            <h4 className="font-black text-foreground">Bảng xếp hạng</h4>
            <p className="text-xs text-muted-foreground">Ghi nhận những nỗ lực học tập xuất sắc và trao giải thưởng hàng tháng cho Top học viên.</p>
         </div>
         <div className="p-8 rounded-2xl bg-card border border-border/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
               <Share2 size={24} />
            </div>
            <h4 className="font-black text-foreground">Kết nối sự nghiệp</h4>
            <p className="text-xs text-muted-foreground">Giới thiệu các cơ hội việc làm hấp dẫn từ các đối tác chiến lược của VIC Group.</p>
         </div>
      </div>
    </section>

    <section id="spirit" className="scroll-mt-32 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl p-10 border border-primary/20 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-8 text-primary opacity-5">
          <Sparkles size={120} />
       </div>
       <div className="relative z-10 space-y-6 max-w-2xl">
          <h3 className="text-2xl font-black text-foreground italic flex items-center gap-3">
             <Heart className="text-rose-500 fill-rose-500" size={24} /> Tinh thần VIC
          </h3>
          <p className="text-muted-foreground font-medium italic">
            "Chia sẻ kiến thức là cách tốt nhất để nhân đôi giá trị." Tại VIC Teach, chúng tôi khuyến khích sự tử tế, tôn trọng sự khác biệt và nỗ lực không ngừng nghỉ để hoàn thiện bản thân mỗi ngày.
          </p>
          <div className="flex gap-4 pt-4">
             <div className="px-4 py-2 bg-background/50 rounded-lg border border-border/20 text-[10px] font-black uppercase tracking-widest">+50,000 Thành viên</div>
             <div className="px-4 py-2 bg-background/50 rounded-lg border border-border/20 text-[10px] font-black uppercase tracking-widest">120+ Mentor</div>
          </div>
       </div>
    </section>
  </div>
);

export default Doc5;
