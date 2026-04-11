import React from 'react';
import { Info, Target, Compass, TrendingUp, BookOpen, Users, BarChart2 } from 'lucide-react';

const Introduction = () => {
  return (
    <div className="space-y-0">

      {/* WELCOME SECTION */}
      <section id="welcome" className="scroll-mt-32 mb-14">
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-4">
            Nền tảng học tập
          </span>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Info size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Chào mừng đến với VIC Teach</h2>
        </div>

        <p className="text-base leading-relaxed text-muted-foreground mb-6">
          Hệ thống đào tạo và giao dịch mô phỏng VIC Teach là nền tảng tiên phong kết hợp giữa giáo dục tài chính và thực hành giao dịch thực tế — cung cấp môi trường học tập an toàn, hiện đại với đầy đủ công cụ cần thiết để bạn trở thành nhà đầu tư chuyên nghiệp.
        </p>

        <div className="rounded-2xl overflow-hidden border border-border shadow-lg mb-6">
          <img
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop"
            alt="VIC Teach Dashboard"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '10,000+', label: 'Học viên đã tốt nghiệp' },
            { num: '200+', label: 'Bài học chuyên sâu' },
            { num: 'Real-time', label: 'Dữ liệu thị trường sống' },
          ].map((s) => (
            <div key={s.label} className="bg-muted/40 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-foreground">{s.num}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* MISSION SECTION */}
      <section id="mission" className="scroll-mt-32 mb-14">
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400 mb-4">
            Sứ mệnh
          </span>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Target size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Sứ mệnh của chúng tôi</h2>
        </div>

        <blockquote className="border-l-2 border-primary pl-4 mb-6">
          <p className="text-base italic text-muted-foreground leading-relaxed">
            Chúng tôi tin rằng mỗi người đều xứng đáng được tiếp cận với kiến thức tài chính chuyên sâu — không rào cản, không rủi ro vốn thật trong quá trình học.
          </p>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Giáo dục toàn diện',
              desc: 'Lộ trình từ cơ bản đến nâng cao, bám sát thực tế thị trường tài chính toàn cầu với nội dung được cập nhật liên tục.',
            },
            {
              title: 'Thực hành an toàn',
              desc: 'Giao dịch mô phỏng với dữ liệu real-time, không rủi ro về vốn thật — trải nghiệm sát với thực tế nhất.',
            },
            {
              title: 'Cộng đồng hỗ trợ',
              desc: 'Kết nối với hàng nghìn học viên và chuyên gia, chia sẻ kinh nghiệm và cùng phát triển chiến lược đầu tư.',
            },
            {
              title: 'Theo dõi tiến độ',
              desc: 'Hệ thống phân tích chi tiết hiệu suất giao dịch, giúp bạn nhận diện điểm mạnh và cải thiện nhược điểm.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl p-5 border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <h3 className="text-base font-bold">{card.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="scroll-mt-32 mb-14">
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 mb-4">
            Cách hoạt động
          </span>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Lộ trình học tập</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl overflow-hidden border border-border h-44">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
              alt="Trading charts"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            {[
              { icon: <BookOpen size={14} />, title: 'Học lý thuyết có hệ thống', desc: 'Khóa học theo module từ phân tích kỹ thuật, cơ bản đến quản lý rủi ro chuyên sâu.' },
              { icon: <TrendingUp size={14} />, title: 'Giao dịch mô phỏng thực tế', desc: 'Áp dụng kiến thức với dữ liệu thị trường trực tiếp, không rủi ro tài chính.' },
              { icon: <Users size={14} />, title: 'Cộng đồng và mentoring', desc: 'Nhận phản hồi từ chuyên gia và chia sẻ chiến lược với học viên toàn quốc.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground mb-0.5">{item.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { step: 'Bước 01', title: 'Đăng ký & Định hướng', desc: 'Kiểm tra năng lực đầu vào và nhận lộ trình học phù hợp với mục tiêu của bạn.' },
            { step: 'Bước 02', title: 'Học & Luyện tập', desc: 'Hoàn thành module lý thuyết kết hợp với bài tập giao dịch mô phỏng hàng ngày.' },
            { step: 'Bước 03', title: 'Đánh giá & Tốt nghiệp', desc: 'Nhận chứng chỉ sau khi hoàn thành chương trình và đạt kết quả giao dịch mô phỏng.' },
          ].map((s) => (
            <div key={s.step} className="border border-border rounded-2xl p-4">
              <div className="text-xs font-semibold text-primary mb-2">{s.step}</div>
              <div className="text-sm font-bold text-foreground mb-1">{s.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border mb-14" />

      {/* VIDEO SECTION */}
      <section id="video-intro" className="scroll-mt-32 mb-14">
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-4">
            Video giới thiệu
          </span>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Compass size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Khám phá nền tảng</h2>
        </div>

        <p className="text-base text-muted-foreground mb-5 leading-relaxed">
          Xem video dưới đây để hiểu rõ hơn về cách VIC Teach hoạt động và những gì bạn sẽ đạt được sau khoá học.
        </p>

        <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-lg mb-4">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Giới thiệu hệ thống VIC Teach"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-border h-40">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
              alt="Analytics dashboard"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-border h-40">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
              alt="Financial data"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Introduction;