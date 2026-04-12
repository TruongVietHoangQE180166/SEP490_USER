'use client';

import { motion } from 'framer-motion';
import { Award, Download, Printer, Share2, ShieldCheck, Star, CheckCircle2, QrCode, Globe, BookOpen, Clock, Zap } from 'lucide-react';
import { Course } from '../types';
import { UserProfile } from '@/modules/profile/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
interface CourseCertificateProps {
  course: Course;
  profile: UserProfile;
}

export const CourseCertificate = ({ course, profile }: CourseCertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `VICT-${course.id.substring(0, 4)}-${profile.id.substring(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return (
    <div className="flex flex-col items-center gap-12 py-10 print:p-0 print:m-0">
      {/* Combined High-end Fonts & Global Print Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Montserrat:wght@300;400;700;900&family=Pinyon+Script&display=swap');
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-signature { font-family: 'Pinyon Script', cursive; }

        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all content by default */
          body * {
            visibility: hidden !important;
          }
          /* Specifically show the certificate path with clean backgrounds */
          .certificate-page, 
          .certificate-page * {
            visibility: visible !important;
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
          }
          .certificate-layout, 
          .certificate-layout * {
            visibility: visible !important;
            /* Re-enable background graphics for the certificate content itself */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Position the certificate to dominate the first page */
          .certificate-layout {
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) scale(0.98) !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 9999 !important;
            background: white !important; /* The certificate's own white background */
            display: block !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Hide the floating action dock during print */
          .print\:hidden {
            display: none !important;
          }
        }

          /* Decoration Utilities */
          .clip-ribbon {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
          }
          .scalloped-edges {
            background: radial-gradient(circle at 50% 0%, #C5A059 10%, transparent 11%),
                        radial-gradient(circle at 100% 50%, #C5A059 10%, transparent 11%),
                        radial-gradient(circle at 50% 100%, #C5A059 10%, transparent 11%),
                        radial-gradient(circle at 0% 50%, #C5A059 10%, transparent 11%);
            background-size: 20px 20px;
          }
        }
      `}</style>

      {/* Main Certificate Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative scale-[0.5] sm:scale-100 origin-center sm:origin-top"
      >
        <div 
          ref={certificateRef}
          className="certificate-layout relative text-[#1a1a1a] w-[1123px] h-[794px] shadow-[0_60px_120px_-10px_rgba(0,0,0,0.3)] p-[32px] overflow-hidden print:shadow-none print:m-0 print:border-none ring-1 ring-black/5 flex-shrink-0"
          style={{
            background: 'radial-gradient(circle at center, #ffffff 0%, #fcfcfc 100%)',
            border: '24px solid transparent',
            borderImage: 'linear-gradient(135deg, #8B6E3C 0%, #C5A059 25%, #FFF2B2 50%, #C5A059 75%, #8B6E3C 100%) 1',
          }}
        >
          {/* Outer Deep Border Shadow Layer */}
          <div className="absolute inset-[-24px] pointer-events-none border-[1px] border-black/10 z-20" />
          <div className="absolute inset-[0px] pointer-events-none border-[1px] border-white/40 z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />

          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
            {/* Internal Border - Elegant Gold Line */}
            <div className="h-full w-full border-[3px] border-[#C5A059] relative flex flex-col p-8 lg:p-10">
              <div className="absolute inset-1 border-[1px] border-[#C5A059]/30" />
              
              {/* Corner Decorative Elements - Enhanced */}
              <div className="absolute -top-1 -left-1 w-24 h-24 border-t-8 border-l-8 border-[#C5A059] z-20" />
              <div className="absolute -top-1 -right-1 w-24 h-24 border-t-8 border-r-8 border-[#C5A059] z-20" />
              <div className="absolute -bottom-1 -left-1 w-24 h-24 border-b-8 border-l-8 border-[#C5A059] z-20" />
              <div className="absolute -bottom-1 -right-1 w-24 h-24 border-b-8 border-r-8 border-[#C5A059] z-20" />
  
              {/* Platform Brand Header */}
              <div className="flex justify-between items-start w-full relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="bg-[#1a1a1a] p-2 rounded-xl rotate-3 shadow-lg">
                      <Zap className="w-6 h-6 text-[#C5A059] fill-[#C5A059]" />
                    </div>
                    <div className="text-left font-cinzel">
                       <p className="font-black text-xl tracking-tight text-[#1a1a1a]">VIC<span className="text-[#C5A059]">TEACH</span></p>
                       <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400 leading-none">Excellence in Education</p>
                    </div>
                 </div>
                 <div className="text-right font-montserrat">
                    <div className="flex items-center justify-end gap-1 mb-1">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#C5A059] text-[#C5A059] opacity-80" />)}
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#C5A059]">Verified Certificate</p>
                 </div>
              </div>
  
              {/* Central Content */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 relative z-10 py-2">
                 
                 <div className="space-y-1.5 text-center">
                    <h1 className="font-cinzel font-black text-5xl tracking-[0.1em] text-[#1a1a1a] uppercase leading-[1.1]">
                      CHỨNG CHỈ<br />
                      <span className="text-[#C5A059]">HOÀN THÀNH</span>
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px w-12 bg-[#C5A059]" />
                      <p className="text-xs font-playfair italic text-[#C5A059] tracking-[0.2em] font-bold">CERTIFICATE OF COMPLETION</p>
                      <div className="h-px w-12 bg-[#C5A059]" />
                    </div>
                 </div>
  
                 <div className="space-y-3 text-center">
                    <p className="text-lg font-playfair italic font-medium text-zinc-400">Chứng nhận này được trân trọng trao cho</p>
                    <h2 className="text-6xl font-playfair font-black text-[#1a1a1a] tracking-tight relative cursor-default uppercase whitespace-nowrap">
                      {profile.fullName || profile.username || "Học Viên Danh Dự"}
                      <div className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50" />
                    </h2>
                 </div>
  
                 <div className="space-y-3 max-w-4xl text-center">
                    <p className="text-base font-playfair italic font-medium text-zinc-400 leading-relaxed">
                      Đã xuất sắc hoàn thành tất cả các nội dung và yêu cầu trong khóa học
                    </p>
                    <div className="relative inline-block group">
                       <h3 className="text-3xl font-cinzel font-black text-[#C5A059] leading-tight tracking-tight uppercase px-8">
                         {course.title}
                       </h3>
                    </div>
                 </div>
  
                 {/* Course Metrics Information (Simplified) */}
                 <div className="flex justify-center gap-16 w-full max-w-3xl py-4 border-t border-zinc-100 font-montserrat">
                    <div className="flex flex-col items-center gap-0.5">
                       <div className="flex items-center gap-2 text-[#C5A059]">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cấp độ</span>
                       </div>
                       <p className="font-black text-base text-[#1a1a1a] uppercase tracking-tight">{course.courseLevel || "Chuyên Nghiệp"}</p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                       <div className="flex items-center gap-2 text-[#C5A059]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Trạng thái</span>
                       </div>
                       <p className="font-black text-base text-[#1a1a1a] uppercase tracking-tight">100% Hoàn Thành</p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                       <div className="flex items-center gap-2 text-[#C5A059]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Xác thực</span>
                       </div>
                       <p className="font-black text-base text-[#1a1a1a] uppercase tracking-tight">Hệ Thống VicTeach</p>
                    </div>
                 </div>
              </div>
  
              {/* Bottom Panel: Signatures & Verification */}
              <div className="mt-auto flex justify-between items-end relative z-10 font-montserrat px-6 pb-2">
                 {/* Left: Cert ID & QR */}
                 <div className="flex flex-col items-start gap-2">
                    <div className="bg-white p-1.5 border border-zinc-100 shadow-xl rounded-xl rotate-2 hover:rotate-0 transition-transform cursor-pointer group">
                       <QrCode className="w-14 h-14 text-[#1a1a1a]" strokeWidth={1} />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black text-[#C5A059] uppercase tracking-widest leading-none">ID Chỉnh danh</p>
                       <p className="text-[10px] font-mono font-bold text-[#1a1a1a]">{certificateId}</p>
                    </div>
                 </div>
  
                 {/* Middle: Master-Crafted Official Award Seal */}
                 <div className="flex flex-col items-center justify-center relative mb-2 group scale-[0.85] origin-bottom">
                    {/* Decorative Ribbons Behind Seal */}
                    <div className="absolute -bottom-4 flex gap-2 pointer-events-none opacity-80 z-0">
                      <div className="w-7 h-16 bg-gradient-to-b from-[#8B6E3C] via-[#C5A059] to-[#8B6E3C] clip-ribbon shadow-lg translate-x-1" />
                      <div className="w-7 h-16 bg-gradient-to-b from-[#8B6E3C] via-[#C5A059] to-[#8B6E3C] clip-ribbon shadow-lg -translate-x-1" />
                    </div>
                    
                    {/* Main Seal Body */}
                    <div className="w-28 h-28 rounded-full bg-white shadow-[0_15px_40px_rgba(139,110,60,0.4)] relative p-1 z-10">
                       <div className="absolute inset-0 rounded-full border-[6px] border-[#C5A059]/10" />
                       <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C5A059] animate-[spin_60s_linear_infinity]" />
                       <div className="absolute inset-[2.5px] rounded-full bg-gradient-to-tr from-[#8B6E3C] via-[#FFF2B2] to-[#C5A059] p-[1.5px] shadow-inner">
                          <div className="h-full w-full rounded-full bg-white flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
                             <div className="absolute inset-1 border-[1px] border-dashed border-[#C5A059]/40 rounded-full animate-[spin_40s_linear_infinity]" />
                             <motion.div
                               animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                               className="relative z-10"
                             >
                               <Star className="w-10 h-10 text-[#8B6E3C] fill-[#C5A059] filter drop-shadow(0_2px_4px_rgba(0,0,0,0.1))" />
                             </motion.div>
                             <div className="relative z-10 flex flex-col items-center -mt-0.5">
                                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#8B6E3C] font-montserrat">VERIFIED</p>
                                <p className="text-[5px] font-black uppercase tracking-[0.4em] text-[#C5A059] font-montserrat opacity-80">OFFICIAL SEAL</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
  
                  {/* Right: Signature */}
                  <div className="flex flex-col items-center gap-2 text-center min-w-[200px]">
                     <div className="relative w-full">
                        <p className="font-signature text-4xl text-[#1a1a1a] font-normal leading-none transform -rotate-1 translate-y-1 opacity-95">
                          {course.createdBy || "VicTeach"}
                        </p>
                     </div>
                     <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />
                     <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-[#1a1a1a] uppercase tracking-[0.3em]">Instructor Signature</p>
                       {(course.author?.name || course.profileResponse?.fullName) && (
                         <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest mt-0.5">
                           {course.author?.name || course.profileResponse?.fullName}
                         </p>
                       )}
                       <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">Giảng viên / Người khởi tạo</p>
                     </div>
                  </div>
              </div>
  
              {/* Background branding subtle watermarks */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                 <Award className="w-[650px] h-[650px] text-[#1a1a1a]" />
              </div>
  
              {/* Small Footer */}
              <div className="absolute bottom-4 left-10 flex items-center gap-8 text-zinc-300 font-montserrat opacity-80">
                 <div className="flex items-center gap-2">
                    <Globe className="w-2.5 h-2.5" />
                    <span className="text-[7px] font-black uppercase tracking-[0.3em]">victeach.io.vn</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span className="text-[7px] font-black uppercase tracking-[0.3em]">Official Certification</span>
                 </div>
              </div>
            </div>
        </div>

        {/* Floating Actions Dock - NOW BELOW CERTIFICATE FOR CLARITY */}
        <div className="mt-12 flex justify-center w-full print:hidden">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-3 bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5"
            >
              <Button 
                onClick={handlePrint}
                className="rounded-full h-14 px-12 flex items-center gap-4 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 font-montserrat font-bold text-xs uppercase tracking-[0.15em] shadow-xl border-none"
              >
                <Download className="w-5 h-5" />
                <span>Tải Chứng Chỉ Bảo Mật (PDF)</span>
              </Button>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
