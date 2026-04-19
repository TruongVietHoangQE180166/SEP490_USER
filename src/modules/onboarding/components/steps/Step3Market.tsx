import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

export function Step3Market() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
    >
      {/* Left Thumbnail Section */}
      <div className="relative w-full aspect-video lg:aspect-square flex items-center justify-center group order-1 lg:order-1">
        <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-[40px] group-hover:bg-blue-600/30 transition-all duration-700" />
        <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
           <img 
            src="/onboarding/trading.png" 
            alt="Trading Market" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
        
        <div className="absolute top-1/2 -right-4 lg:-right-10 -translate-y-1/2 bg-card p-5 rounded-2xl shadow-2xl border border-border space-y-4 z-20 hidden sm:block backdrop-blur-xl">
           <div className="flex items-center gap-3 border-b border-border pb-3">
             <Activity className="text-blue-500 w-5 h-5" />
             <span className="text-sm font-black uppercase tracking-tight text-foreground">Thị trường ảo</span>
           </div>
           <div className="space-y-3">
             <div className="flex items-center justify-between gap-5">
               <span className="text-sm text-muted-foreground font-semibold">Lợi nhuận</span>
               <span className="text-sm text-emerald-500 font-bold">+24.5%</span>
             </div>
             <div className="h-1.5 w-36 bg-muted rounded-full overflow-hidden">
               <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
               />
             </div>
           </div>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex flex-col text-left space-y-6 order-2 lg:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight text-balance">
            Thực hành <span className="text-blue-600 italic">GIAO DỊCH</span> ảo
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
            Bước ra khỏi lý thuyết, đã đến lúc bạn đưa mọi kiến thức vào môi trường giao dịch trực tiếp. Nền tảng phân tích kỹ thuật của chúng tôi được thiết kế bám sát dữ liệu thị trường thực tế.
          </p>
        </div>

        <div className="text-base text-foreground/80 space-y-3 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <p className="font-bold text-foreground">Trải nghiệm phòng giao dịch:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-blue-600">
            <li><strong>Khớp lệnh Mua/Bán:</strong> Học cách thiết lập các tín hiệu Market Order, Stop Loss, Take Profit.</li>
            <li><strong>Phân tích biểu đồ:</strong> Bộ công cụ nến Nhật toàn vẹn cùng các chỉ báo (Indicators) quen thuộc như RSI, MACD.</li>
            <li><strong>Testnet rủi ro bằng 0:</strong> Mỗi người dùng đều có một quỹ tiền ảo để thỏa sức đầu tư mà không sợ sai lầm.</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: <ShieldCheck size={20} />, title: "An toàn tuyệt đối", desc: "Không rủi ro tài chính" },
            { icon: <TrendingUp size={20} />, title: "Live Market", desc: "Sát dữ liệu thị trường" },
            { icon: <Zap size={20} />, title: "Khớp lệnh AI", desc: "Giả lập tốc độ cao" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 hover:bg-muted/30 transition-all text-left">
              <div className="text-blue-500 mb-2 bg-blue-500/10 p-2.5 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground font-medium leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
