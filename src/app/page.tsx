'use client';

import { observer } from '@legendapp/state/react';
import { FooterBlock } from '@/components/sections/footer-block';
import HeroSection from '@/components/hero-section';
import Image from 'next/image';
import { OurServicesSection } from '@/components/uitripled/our-services-section-shadcnui';
import { CTAHeroBlock } from '@/components/uitripled/cta-hero-block-shadcnui';
import { CardsSlider } from '@/components/uitripled/card-slider-new';
import { useHomeData } from '@/modules/home/hooks/useHomeData';
import KineticTestimonial from '@/components/ui/kinetic-testimonials';
import { FAQAccordionBlock } from '@/components/uitripled/faq-accordion-block-shadcnui';
import { LogoStepper } from '@/components/ui/logo-stepper';
import { LayerStack, Card as StackCard } from '@/components/ui/layer-stack';
import { 
  Bitcoin, 
  Wallet, 
  LineChart, 
  ShieldCheck, 
  Link, 
  Globe, 
  Cpu, 
  Zap,
  Coins
} from 'lucide-react';

const homeLogos = [
  { icon: <Bitcoin className="w-8 h-8 text-primary" />, label: "Bitcoin & Altcoins" },
  { icon: <Zap className="w-8 h-8 text-primary" />, label: "Ethereum & Smart Contracts" },
  { icon: <Link className="w-8 h-8 text-primary" />, label: "Blockchain Technology" },
  { icon: <Wallet className="w-8 h-8 text-primary" />, label: "Digital Wallets" },
  { icon: <LineChart className="w-8 h-8 text-primary" />, label: "Technical Analysis" },
  { icon: <ShieldCheck className="w-8 h-8 text-primary" />, label: "Crypto Security" },
  { icon: <Cpu className="w-8 h-8 text-primary" />, label: "DeFi Ecosystem" },
  { icon: <Coins className="w-8 h-8 text-primary" />, label: "NFTs & GameFi" },
];

const cryptoSteps = [
  {
    title: "01. Kiến thức nền tảng",
    description: "Khám phá thế giới Blockchain, cách thức hoạt động của Bitcoin và sự tiến hóa của tiền tệ kỹ thuật số.",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
    color: "bg-primary"
  },
  {
    title: "02. Ví & Bảo mật tài sản",
    description: "Làm chủ cách sử dụng ví nóng, ví lạnh và các nguyên tắc bảo mật tối thượng để bảo vệ tài sản của bạn.",
    image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop",
    color: "bg-primary/95"
  },
  {
    title: "03. Phân tích kỹ thuật",
    description: "Đọc hiểu biểu đồ, các chỉ báo quan trọng và mô hình giá để xác định điểm mua/bán tối ưu.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop",
    color: "bg-primary/90"
  },
  {
    title: "04. Hệ sinh thái DeFi",
    description: "Tìm hiểu về tài chính phi tập trung, Staking, Farming và cách tạo thu nhập thụ động bền vững.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop",
    color: "bg-primary/80"
  },
  {
    title: "05. Chiến thuật đầu tư",
    description: "Xây dựng danh mục đầu tư đa dạng, quản trị rủi ro và tâm lý giao dịch trong thị trường đầy biến động.",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=2064&auto=format&fit=crop",
    color: "bg-primary/75"
  },
  {
    title: "06. Thực chiến & Lợi nhuận",
    description: "Áp dụng toàn bộ kiến thức vào giao dịch thực tế dưới sự dẫn dắt trực tiếp từ các chuyên gia VICTEACH.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2000&auto=format&fit=crop",
    color: "bg-primary/70"
  }
];

const testimonials = [
  {
    name: "Nguyễn Văn A",
    handle: "@vanya",
    review: "VICTEACH đã giúp mình thay đổi lộ trình học tập hoàn toàn. Các khóa học rất thực tế và dễ hiểu.",
    avatar: "https://i.pravatar.cc/150?u=a"
  },
  {
    name: "Trần Thị B",
    handle: "@thib",
    review: "Nền tảng học trực tuyến tuyệt vời nhất mình từng tham gia. Hỗ trợ từ giảng viên cực kỳ tận tâm.",
    avatar: "https://i.pravatar.cc/150?u=b"
  },
  {
    name: "Lê Văn C",
    handle: "@vanc",
    review: "Kiến thức được hệ thống bài bản, giúp mình từ một người mới bắt đầu có thể tự tin làm dự án.",
    avatar: "https://i.pravatar.cc/150?u=c"
  },
  {
    name: "Phạm Thị D",
    handle: "@thid",
    review: "Giao diện mượt mà, bài giảng chất lượng cao. Rất đáng đồng tiền bát gạo!",
    avatar: "https://i.pravatar.cc/150?u=d"
  },
  {
    name: "Hoàng Văn E",
    handle: "@vane",
    review: "Cộng đồng học viên năng động, mình đã học hỏi được rất nhiều từ các bạn cùng khóa.",
    avatar: "https://i.pravatar.cc/150?u=e"
  },
  {
    name: "Đặng Thị F",
    handle: "@thif",
    review: "Cảm ơn VICTEACH đã mang lại những giá trị thiết thực. Chúc nền tảng ngày càng phát triển!",
    avatar: "https://i.pravatar.cc/150?u=f"
  }
];

const HomePageContent = observer(() => {
  const { freeCourses, featuredCourses, isLoading } = useHomeData();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <HeroSection />
      
      <div className="bg-muted/5 border-b border-border/50">
        <div className="max-w-8xl mx-auto px-6">
          <LogoStepper logos={homeLogos} visibleCount={5} />
        </div>
      </div>

      <OurServicesSection />

      <div className="py-20 bg-muted/5">
        <div className="max-w-8xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">
                    Lộ trình <span className="text-primary">Chinh phục Crypto</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                    Từ người mới bắt đầu đến nhà đầu tư chuyên nghiệp cùng VICTEACH
                </p>
            </div>
            
            <LayerStack cardWidth={350} stageHeight={440} cardGap={20} lastCardFullWidth={true}>
                {cryptoSteps.map((step, idx) => {
                    const isLast = idx === cryptoSteps.length - 1;
                    return (
                        <StackCard key={idx} className="bg-card/80 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-2xl group overflow-hidden transition-all duration-300">
                            <div className={`relative h-full flex flex-col ${isLast ? "md:flex-row" : ""}`}>
                                {/* Framed Image Container */}
                                <div className={`relative ${isLast ? "h-1/2 md:h-full md:w-1/2 p-4" : "h-[180px] p-4"}`}>
                                    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg border border-white/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-60" />
                                        <Image
                                            src={step.image} 
                                            alt={step.title}
                                            width={700}
                                            height={440}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            sizes="(max-width: 640px) 100vw, 350px"
                                        />
                                        {/* Step Badge - Enhanced Glassmorphism */}
                                        <div className={`absolute top-3 left-3 z-20 overflow-hidden rounded-full p-[1px] bg-gradient-to-br from-white/20 to-transparent shadow-xl`}>
                                            <div className={`px-3 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${step.color} shadow-[0_0_8px_currentColor]`} />
                                                Phase {idx + 1}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className={`p-6 md:p-8 flex-1 flex flex-col justify-start relative ${isLast ? "md:w-1/2 bg-card/10 md:justify-center" : "bg-gradient-to-b from-transparent to-card/5"}`}>
                                    {/* Decorative background element */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none blur-3xl rounded-full -mr-16 -mt-16 ${step.color}`} />
                                    
                                    <div className="relative z-10">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${step.color.replace('bg-', 'text-')} opacity-80 mb-1 block`}>
                                            VICTEACH Roadmap
                                        </span>
                                        <h3 className={`font-black mb-3 tracking-tighter uppercase leading-tight ${isLast ? "text-2xl md:text-3xl" : "text-xl"}`}>
                                            {step.title.split('. ')[1]} <span className="text-primary italic">.</span>
                                        </h3>
                                        <div className={`w-10 h-1 ${step.color} rounded-full mb-4 opacity-60`} />
                                        <p className={`text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-2 ${isLast ? "md:text-lg md:max-w-xs md:line-clamp-3" : "text-xs md:text-sm opacity-80"}`}>
                                            {step.description}
                                        </p>
                                        
                                        <Link href="/course" className="flex items-center gap-2 group/link">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary group-hover/link:underline transition-all">
                                                Khám phá chi tiết
                                            </span>
                                            <div className="w-4 h-[1px] bg-primary" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </StackCard>
                    );
                })}
            </LayerStack>
        </div>
      </div>

      <CTAHeroBlock />
      
      <div className="py-6">
        <CardsSlider title="Khóa học miễn phí" courses={freeCourses} isLoading={isLoading} />
        <CardsSlider title="Khóa học nổi bật" courses={featuredCourses} isLoading={isLoading} />
      </div>

      <KineticTestimonial 
        title="Học viên nói gì về chúng tôi"
        subtitle="Hàng ngàn học viên đã và đang thay đổi sự nghiệp cùng VICTEACH"
        testimonials={testimonials}
      />

      <FAQAccordionBlock />

      {/* 
        Trang chủ được tối giản hóa, tập trung vào giới thiệu nền tảng.
        Phần bảng tin và bài viết đã được loại bỏ theo yêu cầu.
      */}
      <FooterBlock />
    </div>
  );
});

export default HomePageContent;