import React from 'react';
import { 
  BarChart3, Zap, ShieldCheck, TrendingUp, TrendingDown, 
  Layers, Wallet, Activity, Search, Brain, Target, 
  Clock, CheckCircle2, AlertTriangle, MousePointer2, Globe
} from 'lucide-react';

const TradingBasics = () => {
  return (
    <div className="space-y-0">
      {/* HEADER SECTION */}
      <section id="basics" className="scroll-mt-32 mb-14">
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4 font-bold uppercase tracking-wider">
            Kiến thức nền tảng
          </span>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Cơ bản về Giao dịch</h2>
        </div>
        
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Giao dịch tài chính (Trading) là nghệ thuật quản trị vốn và cảm xúc để thu lợi nhuận từ biến động giá. Tại VIC Teach, chúng tôi cung cấp hệ sinh thái học tập kết hợp dữ liệu thị trường thực tế giúp bạn nhanh chóng thành thạo các kỹ năng này.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 rounded-xl border border-border bg-muted/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={80} />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp size={18} />
                    Lệnh Mua (Long/Buy)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Được thực hiện khi bạn dự đoán giá sẽ tăng. Lợi nhuận được tính bằng chênh lệch giữa giá đóng lệnh và giá vào lệnh (trừ phí).
                </p>
             </div>
             <div className="p-6 rounded-xl border border-border bg-muted/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingDown size={80} />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <TrendingDown size={18} />
                    Lệnh Bán (Short/Sell)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Thực hiện khi dự báo giá giảm. Bạn "mượn" tài sản để bán ở giá cao và mua lại trả ở giá thấp hơn để hưởng chênh lệch.
                </p>
             </div>
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* CORE CONCEPTS */}
      <section id="terms" className="scroll-mt-32 mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
            <Layers size={21} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Thuật ngữ cốt lõi</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
                { title: 'Nến (Candlestick)', desc: 'Gồm Thân nến và Râu nến, biểu thị 4 mức giá: Mở, Đóng, Cao nhất, Thấp nhất trong một khung giờ.' },
                { title: 'Volume (Khối lượng)', desc: 'Tổng số tiền đã giao dịch trong một khoảng thời gian. Volume lớn xác nhận xu hướng mạnh.' },
                { title: 'Leverage (Đòn bẩy)', desc: 'Sử dụng vốn vay để khuếch đại lợi nhuận. Ví dụ đòn bẩy x10 giúp bạn dùng 100$ để vào lệnh 1000$.' },
                { title: 'Margin (Ký quỹ)', desc: 'Số vốn thực tế bạn bỏ ra để giữ một vị thế giao dịch khi sử dụng đòn bẩy.' },
                { title: 'Spread (Chênh lệch)', desc: 'Khoảng cách giữa giá mua (Ask) và giá bán (Bid) tốt nhất trên thị trường.' },
                { title: 'ROI (%)', desc: 'Tỷ lệ lợi nhuận trên vốn đầu tư. Giúp bạn đo lường hiệu quả của từng chiến thuật.' },
            ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/20 transition-all bg-card/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {idx + 1}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-foreground mb-1">{item.title}</h4>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* ANALYSIS METHODS */}
      <section id="analysis" className="scroll-mt-32 mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
            <Search size={22} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Phương pháp Phân tích</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="p-5 rounded-xl bg-muted/30 border-l-4 border-l-amber-500">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <BarChart3 size={16} className="text-amber-500" />
                        Phân tích Kỹ thuật (TA)
                    </h4>
                    <p className="text-sm text-muted-foreground">Sử dụng biểu đồ, các chỉ báo (RSI, MACD, EMA) và mô hình giá trong quá khứ để dự đoán hướng đi tiếp theo của thị trường.</p>
                </div>
                <div className="p-5 rounded-xl bg-muted/30 border-l-4 border-l-blue-500">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Globe size={16} className="text-blue-500" />
                        Phân tích Cơ bản (FA)
                    </h4>
                    <p className="text-sm text-muted-foreground">Đánh giá giá trị thực của tài sản dựa trên tin tức kinh tế, chính trị, công nghệ và các đối tác của dự án.</p>
                </div>
            </div>
            <div className="flex flex-col justify-center bg-card border border-border rounded-xl p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Brain size={18} className="text-purple-500" />
                    Tâm lý Giao dịch
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 text-red-600 text-xs font-bold ring-1 ring-red-500/20">
                        <span>FOMO: Sợ bỏ lỡ cơ hội</span>
                        <AlertTriangle size={14} />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/5 text-orange-600 text-xs font-bold ring-1 ring-orange-500/20">
                        <span>FUD: Tin đồn gây sợ hãi</span>
                        <AlertTriangle size={14} />
                    </div>
                    <div className="p-3 bg-green-500/5 text-green-700 dark:text-green-400 text-xs leading-relaxed italic border border-green-500/10 rounded-lg">
                        "Nhà đầu tư giỏi nhất là người biết kiểm soát cảm xúc khi cả thế giới đang hoảng loạn."
                    </div>
                </div>
            </div>
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* ORDER TYPES */}
      <section id="order-types" className="scroll-mt-32 mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
            <MousePointer2 size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Các loại Lệnh giao dịch</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-border rounded-xl hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Clock size={16} className="text-primary" />
                    <h4 className="font-bold">Lệnh Thị trường (Market Order)</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Khớp lệnh ngay lập tức ở mức giá tốt nhất hiện tại. Phù hợp khi bạn cần vào lệnh/thoát lệnh nhanh chóng mà không quá bận tâm về giá.
                </p>
            </div>
            <div className="p-5 border border-border rounded-xl hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Target size={16} className="text-primary" />
                    <h4 className="font-bold">Lệnh Giới hạn (Limit Order)</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Bạn đặt trước một mức giá mong muốn. Lệnh chỉ được thực hiện khi giá thị trường chạm đến con số đó. Giúp bạn tối ưu giá vào lệnh.
                </p>
            </div>
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* DEMO SYSTEM */}
      <section id="demo-trading" className="scroll-mt-32 mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
            <Zap size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Hệ thống Demo Real-time</h2>
        </div>
        
        <div className="bg-muted/40 p-6 rounded-xl border border-border border-l-4 border-l-indigo-500 mb-8">
            <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-indigo-500 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Trải nghiệm thực tế</span>
            </div>
            <p className="text-base leading-relaxed text-foreground/80">
                Hệ thống Demo của VIC Teach kết nối trực tiếp với API sàn Binance qua Socket, đồ thị hiển thị từng biến động nhỏ nhất (1ms) của Bitcoin, Ethereum và các tài sản hàng đầu.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                <Wallet className="mb-3 text-primary" size={20} />
                <h4 className="font-bold text-sm mb-2">Quản lý Ví</h4>
                <p className="text-[12px] text-muted-foreground">Theo dõi số dư USDT và Points linh hoạt giúp bạn làm quen với ngân sách giao dịch.</p>
             </div>
             <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                <Activity className="mb-3 text-primary" size={20} />
                <h4 className="font-bold text-sm mb-2">Thanh khoản</h4>
                <p className="text-[12px] text-muted-foreground">Lệnh mua/bán được khớp ngay lập tức theo giá thị trường (Market Order).</p>
             </div>
             <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                <Layers className="mb-3 text-primary" size={20} />
                <h4 className="font-bold text-sm mb-2">Lịch sử Lệnh</h4>
                <p className="text-[12px] text-muted-foreground">Lưu trữ chi tiết từng lệnh âm/dương để bạn tự đánh giá hiệu quả chiến thuật.</p>
             </div>
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* RISK MANAGEMENT */}
      <section id="safety" className="scroll-mt-32 mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 text-red-600 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">An toàn & Quản trị Rủi ro</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
               <p className="mb-4 font-bold text-foreground">Nguyên tắc "Vàng" bảo toàn vốn:</p>
               <div className="space-y-4">
                   {[
                       'Không bao giờ dùng quá 2-5% số dư cho 1 lệnh giao dịch.',
                       'Luôn đặt Stop Loss (Cắt lỗ) trước khi vào lệnh.',
                       'Chốt lời (Take Profit) theo kế hoạch, không tham lam.',
                       'Không giao dịch khi đang mệt mỏi hoặc bị kích động cảm xúc.'
                   ].map((text, i) => (
                       <div key={i} className="flex items-center gap-3">
                           <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                           <span className="text-xs">{text}</span>
                       </div>
                   ))}
               </div>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h4 className="text-red-600 dark:text-red-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase">
                    <AlertTriangle size={18} /> Cảnh báo cháy tài khoản
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Sử dụng đòn bẩy quá cao (ví dụ x50, x100) có thể khiến tài khoản của bạn bị thanh lý (lỗ sạch 100%) chỉ với một biến động nhỏ của thị trường. Hãy luôn bắt đầu với đòn bẩy x1, x2 khi mới học.
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default TradingBasics;
