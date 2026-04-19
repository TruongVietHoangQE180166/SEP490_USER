import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function TeacherStep5Revenue() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
       {/* Left Thumbnail */}
       <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-[40px] animate-pulse" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/teacher_revenue.png" 
            alt="Revenue" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute top-4 left-4 lg:-top-6 lg:-left-6 bg-card p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-4 z-20 backdrop-blur-xl">
          <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-inner">
            <Wallet size={24} />
          </div>
          <div className="text-left pr-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Ví giảng viên</p>
            <p className="font-black text-sm text-foreground">50.000.000đ</p>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Tối ưu hóa <span className="text-emerald-500 italic">THU NHẬP</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Tận hưởng quả ngọt. Tiền mua khoá học sẽ được đối soát tự động rồi đổ về ví ngay trong ứng dụng của bạn một cách nhanh chóng.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Cơ chế giao dịch chuẩn mực:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
            <li><strong>Tra cứu lịch sử:</strong> Mỗi đơn hàng từ sinh viên đều được kê khai cực kì minh bạch, chống thất thoát.</li>
            <li><strong>Rút VNĐ siêu tốc:</strong> Đặt lệnh rút tiền dễ dàng với tất cả ngân hàng nội địa phổ biến.</li>
            <li><strong>Cấu trúc hoa hồng:</strong> Mức chia sẻ chiết khấu cạnh tranh hàng đầu thị trường, giúp bạn thu cực lời.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: <CreditCard size={20} />, label: "Rút tiền mượt mà", desc: "Xử lý hàng ngày" },
            { icon: <ArrowUpRight size={20} />, label: "Gia tăng % lãi", desc: "Tỉ lệ chiết khấu cao" },
            { icon: <CheckCircle2 size={20} />, label: "An toàn pháp lý", desc: "Sao kê minh bạch" },
            { icon: <Wallet size={20} />, label: "Bảo trì số dư", desc: "Ví bảo mật" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 hover:bg-muted/30 transition-all text-left">
              <div className="text-emerald-500 bg-emerald-500/10 p-2.5 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate w-full">{item.label}</h4>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tight truncate w-full">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
