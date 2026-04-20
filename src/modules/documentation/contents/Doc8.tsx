import React from 'react';
import { HelpCircle, MessageCircle, AlertCircle, CreditCard, PlayCircle, Settings } from 'lucide-react';

const Doc8 = () => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    {/* Section: Account FAQs */}
    <section id="faq-account" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <HelpCircle size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Vấn đề tài khoản</h2>
      </div>

      <div className="space-y-4">
        {[
          { q: 'Làm thế nào để đổi mật khẩu?', a: 'Bạn vào phần Cài đặt tài khoản -> Bảo mật -> Đổi mật khẩu. Chúng tôi sẽ yêu cầu nhập mật khẩu cũ và xác thực qua OTP Email.' },
          { q: 'Tôi có thể đổi địa chỉ Email không?', a: 'Hiện tại hệ thống chưa hỗ trợ đổi Email trực tiếp để đảm bảo tính định danh. Vui lòng liên hệ hỗ trợ nếu bạn thực sự cần thay đổi.' },
          { q: 'Tại sao tài khoản của tôi bị khóa?', a: 'Tài khoản có thể bị khóa nếu hệ thống phát hiện hành vi spam, vi phạm bản quyền nội dung hoặc có dấu hiệu đăng nhập trái phép nhiều lần.' }
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-xl bg-card border border-border/40 hover:border-primary/20 transition-all group">
            <h4 className="font-black text-foreground mb-3 flex items-start gap-3">
               <span className="text-primary mt-1">Q.</span> {item.q}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed pl-7">
               {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Section: Payment FAQs */}
    <section id="faq-payment" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <CreditCard size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Thanh toán & Hoàn tiền</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
            <AlertCircle className="text-amber-500" size={24} />
            <h4 className="font-black text-foreground">Chính sách hoàn tiền</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
               VIC Teach cam kết hoàn trả 100% học phí nếu bạn chưa xem quá 10% nội dung khóa học và thực hiện yêu cầu trong vòng 7 ngày kể từ ngày đăng ký.
            </p>
         </div>
         <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
            <MessageCircle className="text-blue-500" size={24} />
            <h4 className="font-black text-foreground">Hỗ trợ thanh toán</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
               Nếu bạn đã chuyển khoản nhưng tiền chưa vào ví sau 30 phút, vui lòng chụp ảnh hóa đơn và gửi vào mục "Hỗ trợ trực tuyến" để được xử lý thủ công ngay lập tức.
            </p>
         </div>
      </div>
    </section>

    {/* Section: Course Access */}
    <section id="faq-course" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <PlayCircle size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Truy cập khóa học</h2>
      </div>

      <div className="space-y-4">
         <div className="p-6 bg-card border border-border/40 rounded-xl">
            <h4 className="font-black text-foreground mb-2">Khóa học có thời hạn bao lâu?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Tất cả các khóa học trả phí tại VIC Teach đều được sở hữu trọn đời. Bạn có thể xem lại bất cứ khi nào bạn muốn.</p>
         </div>
         <div className="p-6 bg-card border border-border/40 rounded-xl">
            <h4 className="font-black text-foreground mb-2">Tôi có thể tải video về máy không?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Vì lý do bản quyền, chúng tôi không hỗ trợ tải video trực tiếp về máy. Tuy nhiên, bạn có thể tải các tài liệu đi kèm (PDF, Code, Excel) một cách thoải mái.</p>
         </div>
      </div>
    </section>

    {/* Section: Tech Issues */}
    <section id="faq-tech" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <Settings size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Lỗi kỹ thuật thường gặp</h2>
      </div>

      <div className="bg-muted/30 p-8 rounded-2xl border border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-2">
              <h5 className="font-black text-foreground uppercase tracking-tight text-sm">Video bị giật, lag?</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">Hãy thử giảm độ phân giải xuống 720p hoặc 480p ở góc trình phát video. Đảm bảo bạn không sử dụng VPN khi truy cập hệ thống.</p>
           </div>
           <div className="space-y-2">
              <h5 className="font-black text-foreground uppercase tracking-tight text-sm">Không nhận được OTP?</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">Kiểm tra kỹ hòm thư "Spam" hoặc "Quảng cáo". Nếu vẫn không thấy, hãy chờ 60 giây và nhấn "Gửi lại mã".</p>
           </div>
        </div>
      </div>
    </section>
  </div>
);

export default Doc8;
