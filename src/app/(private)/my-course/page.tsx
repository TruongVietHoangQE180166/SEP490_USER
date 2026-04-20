import { MyCourseList } from "@/modules/my-course/components/MyCourseList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khóa học của tôi | VICTEACH",
  description: "Quản lý và theo dõi tiến độ các khóa học bạn đã đăng ký.",
};

export default function MyCoursePage() {
  return (
    <main className="min-h-screen bg-background pt-8 pb-10">
      <div className="mx-auto max-w-[1850px] px-6">
        <header className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
            Khu vực học tập
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
            Khóa học <span className="text-primary italic">Của tôi</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Nơi lưu trữ tất cả các khóa học bạn đã tham gia. Hãy tiếp tục hành trình nâng cao kiến thức và kỹ năng của mình mỗi ngày.
          </p>
        </header>

        <MyCourseList />
      </div>
    </main>
  );
}
