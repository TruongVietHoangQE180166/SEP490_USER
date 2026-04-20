import React from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

const Doc9 = () => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    {/* copyright */}
    <section className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <ShieldCheck size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Bản quyền & Sở hữu trí tuệ</h2>
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Tất cả nội dung khóa học, bài giảng video, mã nguồn và tài liệu đi kèm trên VIC Teach được bảo vệ bởi luật sở hữu trí tuệ.
        </p>
        <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl flex gap-4">
           <AlertTriangle className="text-rose-500 shrink-0" size={24} />
           <div className="space-y-4">
              <h4 className="font-black text-rose-600 uppercase tracking-tighter text-sm">Hành vi bị nghiêm cấm</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'Chia sẻ tài khoản học tập cho người khác',
                   'Quay phim màn hình bài giảng trái phép',
                   'Phát tán tài liệu khóa học lên mạng xã hội',
                   'Sử dụng AI để re-up nội dung giảng viên'
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <XCircle size={14} className="text-rose-400" /> {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </section>

    {/* Quality Standards */}
    <section id="quality" className="scroll-mt-32">
       <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <CheckCircle size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Tiêu chuẩn chất lượng bài giảng</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 rounded-xl border border-border/40 bg-card">
            <h5 className="font-black text-foreground mb-3 text-sm">Video & Âm thanh</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">Độ phân giải tối thiểu 1080p, tốc độ khung hình 30fps. Âm thanh trong trẻo, không bị nhiễu nền hoặc tạp âm lớn.</p>
         </div>
         <div className="p-6 rounded-xl border border-border/40 bg-card">
            <h5 className="font-black text-foreground mb-3 text-sm">Cấu trúc giáo trình</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">Phải có mục tiêu rõ ràng cho từng chương. Thời lượng mỗi video nên dao động từ 5 đến 15 phút để tối ưu việc tiếp thu.</p>
         </div>
         <div className="p-6 rounded-xl border border-border/40 bg-card">
            <h5 className="font-black text-foreground mb-3 text-sm">Tài liệu đính kèm</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">Phải bao gồm file PDF tóm tắt bài học, Code mẫu (nếu là lập trình) hoặc các mẫu biểu mẫu thực hành thực tế.</p>
         </div>
      </div>
    </section>

    {/* Community Guidelines */}
    <section id="community" className="scroll-mt-32">
       <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <FileText size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Văn hóa cộng đồng</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Chúng tôi xây dựng môi trường học tập văn minh, hỗ trợ lẫn nhau. Mọi hành vi công kích cá nhân, quảng cáo rác (spam) sẽ bị xử lý không báo trước.</p>
      
      <div className="p-1 border border-border/20 rounded-2xl bg-muted/20">
         <div className="p-8 rounded-[calc(1rem-1px)] bg-background">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Heart size={32} />
               </div>
               <h4 className="text-xl font-black text-foreground">Học tập văn minh - Kết nối bền vững</h4>
               <p className="text-xs text-muted-foreground max-w-sm">Cảm ơn bạn đã chung tay cùng VIC Teach xây dựng một hệ sinh thái giáo dục hiện đại và tử tế.</p>
            </div>
         </div>
      </div>
    </section>
  </div>
);

export default Doc9;
