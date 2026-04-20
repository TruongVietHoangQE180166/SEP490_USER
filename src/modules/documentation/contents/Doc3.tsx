import React from 'react';
import { ShieldCheck, UserCheck, Wallet, ArrowUpCircle, ArrowDownCircle, BellRing, Lock, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const Doc3 = () => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
    {/* Section: Security 2FA */}
    <section id="security" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <Lock size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Bảo mật đa lớp (2FA)</h2>
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert">
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Tại VIC Teach, sự an toàn của tài sản và dữ liệu học tập của bạn là ưu tiên hàng đầu. Chúng tôi triển khai hệ thống xác thực 2 lớp (2FA) tiêu chuẩn tài chính.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-card border border-border/40 space-y-3">
             <Smartphone className="text-primary" size={20} />
             <h4 className="font-black text-foreground">Xác thực Google Authenticator</h4>
             <p className="text-sm text-muted-foreground">Sử dụng mã OTP 6 số sinh ra theo thời gian thực, đảm bảo ngay cả khi lộ mật khẩu, tài khoản vẫn an toàn.</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/40 space-y-3">
             <BellRing className="text-primary" size={20} />
             <h4 className="font-black text-foreground">Thông báo đăng nhập lạ</h4>
             <p className="text-sm text-muted-foreground">Hệ thống AI sẽ gửi cảnh báo tức thì qua Email và App khi phát hiện đăng nhập từ trình duyệt hoặc vị trí lạ.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Section: Profile KYC */}
    <section id="profile" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <UserCheck size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Cập nhật định danh (KYC)</h2>
      </div>

      <div className="bg-muted/30 border border-dashed border-primary/20 rounded-2xl p-8 mb-10">
         <h4 className="font-black text-foreground flex items-center gap-2 mb-4">
            <ShieldCheck className="text-primary" size={18} /> Tại sao cần KYC?
         </h4>
         <p className="text-sm text-muted-foreground leading-relaxed">
            Để đảm bảo tính minh bạch trong việc rút tiền và cấp chứng chỉ quốc tế, VIC Teach yêu cầu người dùng xác thực thông tin cá nhân. Tài khoản đã KYC sẽ có hạn mức rút tiền cao hơn 500% so với tài khoản thông thường.
         </p>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {['Chụp ảnh CCCD', 'Xác thực khuôn mặt', 'Chờ duyệt (24h)'].map((step, i) => (
               <div key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">{i+1}</span>
                  <span className="text-xs font-bold text-foreground">{step}</span>
               </div>
            ))}
         </div>
      </div>
    </section>

    {/* Section: Wallet */}
    <section id="wallet" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <Wallet size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Hệ thống ví điện tử</h2>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border/40 mb-10 group">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 transition-all group-hover:opacity-100" />
         <div className="relative p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
               <p className="text-muted-foreground font-medium leading-relaxed">
                  Mỗi tài khoản tại VIC Teach được tích hợp một ví điện tử riêng biệt. Tiền trong ví được sử dụng để đăng ký khóa học, mua tài liệu hoặc rút về tài khoản ngân hàng cá nhân.
               </p>
               <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm font-bold text-foreground/80 lowercase first-letter:uppercase">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Miễn phí giao dịch nội bộ
                  </li>
                  <li className="flex items-center gap-2 text-sm font-bold text-foreground/80 lowercase first-letter:uppercase">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Kết nối trực tiếp qua QR Code
                  </li>
               </ul>
            </div>
            <div className="w-full md:w-64 aspect-video rounded-xl bg-black/5 flex flex-col items-center justify-center border border-border/20 shadow-inner">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Số dư minh họa</p>
               <p className="text-2xl font-black text-primary">15,000,000 VND</p>
            </div>
         </div>
      </div>
    </section>

    {/* Section: Deposit Withdraw */}
    <section id="deposit-withdraw" className="scroll-mt-32 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <ArrowUpCircle size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Nạp & Rút tiền</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <ArrowDownCircle className="text-emerald-500" size={20} />
               <h3 className="text-xl font-bold text-foreground">Nạp tiền</h3>
            </div>
            <p className="text-sm text-muted-foreground">Hỗ trợ chuyển khoản nhanh 24/7 qua 40+ ngân hàng tại Việt Nam. Tiền sẽ vào ví tự động trong vòng 3 phút.</p>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] font-bold text-emerald-600 italic">
               * Tip: Luôn điền đúng nội dung chuyển khoản được cung cấp tại màn hình nạp tiền.
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <ArrowUpCircle className="text-rose-500" size={20} />
               <h3 className="text-xl font-bold text-foreground">Rút tiền</h3>
            </div>
            <p className="text-sm text-muted-foreground">Lệnh rút tiền được xử lý thủ công bởi bộ phận tài chính để đảm bảo an toàn. Thời gian xử lý: 08:00 - 17:00 hàng ngày.</p>
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[11px] font-bold text-rose-600 italic">
               * Lưu ý: Hạn mức rút tối thiểu là 100,000 VND.
            </div>
         </div>
      </div>
    </section>
  </div>
);

export default Doc3;
