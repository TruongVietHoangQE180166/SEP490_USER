import React from 'react';
import { Cpu, Server, Smartphone, Globe, Zap, Database, Lock } from 'lucide-react';

const Doc4 = () => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    <section id="infrastructure" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <Cpu size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Hạ tầng công nghệ</h2>
      </div>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">
        Hệ sinh thái VIC Teach được xây dựng trên những công nghệ hiện đại nhất, đảm bảo tính ổn định và khả năng mở rộng không giới hạn cho hàng triệu người dùng.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 rounded-xl bg-card border border-border/40 hover:border-primary/20 transition-all">
            <Server className="text-primary mb-3" size={24} />
            <h4 className="font-black text-foreground">Microservices Architecture</h4>
            <p className="text-xs text-muted-foreground">Các module như Thanh toán, Video Player, Chat được tách biệt hoàn toàn, giúp hệ thống không bao giờ bị sập toàn bộ khi một phần gặp sự cố.</p>
         </div>
         <div className="p-6 rounded-xl bg-card border border-border/40 hover:border-primary/20 transition-all">
            <Database className="text-primary mb-3" size={24} />
            <h4 className="font-black text-foreground">High Performance DB</h4>
            <p className="text-xs text-muted-foreground">Sử dụng PostgreSQL kết hợp Redis Caching cho phép truy xuất dữ liệu khóa học và tiến độ học tập với độ trễ dưới 50ms.</p>
         </div>
      </div>
    </section>

    <section id="security-tech" className="scroll-mt-32 p-8 rounded-2xl bg-muted/30 border border-border/40">
       <div className="flex items-center gap-3 mb-6">
          <Lock className="text-primary" size={20} />
          <h3 className="text-xl font-black text-foreground">Bảo mật & Mã hóa</h3>
       </div>
       <div className="space-y-4">
          {[
            { t: 'Mã hóa SSL/TLS', d: 'Toàn bộ dữ liệu truyền đi giữa trình duyệt và máy chủ được mã hóa cấp độ quân sự.' },
            { t: 'Firewall & Anti-DDoS', d: 'Hệ thống bảo vệ đa tầng chống lại các cuộc tấn công từ chối dịch vụ và truy cập trái phép.' },
            { t: 'Daily Backup', d: 'Dữ liệu được sao lưu hàng ngày tại 3 vị trí địa lý khác nhau để đảm bảo an toàn tuyệt đối.' }
          ].map((item, i) => (
             <div key={i} className="flex gap-4 p-4 rounded-lg bg-background border border-border/20">
                <span className="text-primary font-black text-xs uppercase tracking-widest min-w-[120px]">{item.t}</span>
                <p className="text-xs text-muted-foreground">{item.d}</p>
             </div>
          ))}
       </div>
    </section>
  </div>
);

export default Doc4;
