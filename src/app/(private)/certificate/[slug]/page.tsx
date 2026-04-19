'use client';

import { useCourseDetail } from '@/modules/course/hooks/useCourseDetail';
import { CourseCertificate } from '@/modules/course/components/CourseCertificate';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { observer } from '@legendapp/state/react';
import { Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { withAuthGuard } from '@/guards/authGuard';

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-background">
    <div className="relative">
       <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
       <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
    </div>
    <div className="text-center space-y-1">
       <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Academy Verification</p>
       <p className="text-xs text-muted-foreground font-bold">Đang xác thực thông tin chứng chỉ...</p>
    </div>
  </div>
);

const CertificatePage = observer(() => {
  const { slug } = useParams();
  const { course, isLoading: isCourseLoading, error: courseError } = useCourseDetail(slug as string);
  const { profile, isLoading: isProfileLoading } = useProfile();

  // isLoading from useCourseDetail already includes isInitializing guard,
  // so this is safe – no flash of error state possible.
  if (isCourseLoading || isProfileLoading) {
    return <LoadingScreen />;
  }


  // Handle Missing Data or API Error
  if (!course || !profile || courseError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
           <ArrowLeft className="w-10 h-10 text-zinc-400" />
        </div>
        <div className="text-center space-y-3">
           <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Truy cập thất bại</h1>
           <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
             {courseError || "Chúng tôi không thể tìm thấy dữ liệu khóa học hoặc hồ sơ của bạn. Vui lòng đảm bảo bạn đã tham gia khóa học này."}
           </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
           <Link href="/course">
              <button className="w-full sm:w-auto px-8 py-3 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors">Về danh sách khóa học</button>
           </Link>
           <button 
             onClick={() => window.location.reload()}
             className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
           >Thử lại</button>
        </div>
      </div>
    );
  }

  // Strict Progress Validation: Calculate actual completion to ensure 100% accuracy
  const totalLessons = (course.moocs || []).reduce((acc, m) => 
    acc + (m.videos?.length || 0) + (m.quizzes?.length || 0) + (m.documents?.length || 0), 0);
  
  const completedLessons = (course.moocs || []).reduce((acc, m) => {
    const v = m.videos?.filter(i => i.isCompleted).length || 0;
    const q = m.quizzes?.filter(i => i.isCompleted).length || 0;
    const d = m.documents?.filter(i => i.isCompleted).length || 0;
    return acc + v + q + d;
  }, 0);

  const actualProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isFullyCompleted = totalLessons > 0 && completedLessons === totalLessons;

  if (!isFullyCompleted) {
    const displayProgress = Math.round(actualProgress);
    return (
       <div className="min-h-screen flex flex-col items-center justify-center space-y-12 p-10 text-center bg-zinc-50 dark:bg-zinc-950">
         <div className="relative">
            {/* Outer Progress Ring */}
            <div className="w-48 h-48 rounded-full border-8 border-zinc-200 dark:border-zinc-800 relative">
               <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-primary"
                    style={{
                      strokeDasharray: 553,
                      strokeDashoffset: 553 - (553 * actualProgress) / 100,
                      transition: 'stroke-dashoffset 1s ease-out'
                    }}
                  />
               </svg>
            </div>
            
            {/* Center Lock Status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="bg-primary/10 p-4 rounded-full mb-2">
                  <ShieldAlert className="w-8 h-8 text-primary animate-pulse" />
               </div>
               <span className="text-3xl font-black text-foreground">{displayProgress}%</span>
            </div>
         </div>

         <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
               <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
               Chứng chỉ đang khóa
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground decoration-primary decoration-4">Tiến độ chưa hoàn tất</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Bạn cần hoàn đạt <strong>100% tiến độ học tập</strong> để hệ thống tự động cấp chứng chỉ xác thực từ Antigravity Academy.
            </p>
            <p className="text-sm font-bold text-muted-foreground/60 italic uppercase tracking-wider">
               "Hành trình vạn dặm bắt đầu từ một bước chân"
            </p>
         </div>

         <div className="flex flex-col items-center gap-8">
            <Link href={`/learn/${course.slug}`}>
               <button className="group bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(var(--primary-rgb),0.4)] active:scale-95 flex items-center gap-3">
                  Hoàn thành khóa học ngay
                  <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
               </button>
            </Link>
            
            <div className="flex items-center gap-4 opacity-40">
               <div className="h-px w-12 bg-muted-foreground" />
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Official Verification</p>
               <div className="h-px w-12 bg-muted-foreground" />
            </div>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-0 bg-zinc-50 dark:bg-zinc-950 p-2 sm:p-10 certificate-page flex flex-col items-center justify-start sm:justify-center pt-6 sm:pt-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <CourseCertificate course={course} profile={profile} />
      </div>
    </div>
  );
});

export default withAuthGuard(CertificatePage);
