"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Sparkles, Binary, GraduationCap, Globe2, Cpu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const highlightItems = [
  { icon: Binary, label: "Kết nối công nghệ", color: "text-[#9B99FE]" },
  { icon: GraduationCap, label: "Đào tạo chuyên sâu", color: "text-[#2BC8B7]" },
  { icon: Globe2, label: "Cộng đồng toàn cầu", color: "text-[#9B99FE]" },
  { icon: Cpu, label: "Hệ thống thông minh", color: "text-[#2BC8B7]" },
];

export function GlowyWavesHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[90vh] md:min-h-screen w-full items-center justify-center overflow-hidden bg-background py-20"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-x-0 top-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        
        {/* Glow Spheres */}
        <motion.div 
            style={{ x: useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]), y: useTransform(mouseYSpring, [-0.5, 0.5], [-50, 50]) }}
            className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[#9B99FE]/10 blur-[120px] dark:bg-[#9B99FE]/20" 
        />
        <motion.div 
            style={{ x: useTransform(mouseXSpring, [-0.5, 0.5], [50, -50]), y: useTransform(mouseYSpring, [-0.5, 0.5], [50, -50]) }}
            className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#2BC8B7]/10 blur-[120px] dark:bg-[#2BC8B7]/20" 
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ 
            rotateX: isMobile ? 0 : rotateX, 
            rotateY: isMobile ? 0 : rotateY, 
            transformStyle: "preserve-3d" 
          }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Về VicTeach
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-20 mb-8 max-w-5xl text-4xl font-black leading-tight tracking-normal md:tracking-tight text-foreground md:text-7xl lg:text-8xl md:leading-[1.1] font-cinzel text-balance px-4 overflow-visible"
          >
            Khát Vọng <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#9B99FE] via-[#2BC8B7] to-[#9B99FE] bg-clip-text text-transparent italic pr-4">
              Nâng Tầm Tri Thức
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-12 max-w-3xl text-lg font-medium text-foreground/60 md:text-xl font-montserrat leading-relaxed"
          >
            Chúng tôi kiến tạo môi trường giáo dục thông minh vượt giới hạn, 
            kết nối hàng triệu học viên với công nghệ tương lai và những giá trị cốt lõi.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-14 rounded-full bg-primary px-10 text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.5)] transition-all hover:scale-105 active:scale-95"
            >
              Cùng bắt đầu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary/20 bg-background/50 px-10 text-xs font-black uppercase tracking-[0.2em] backdrop-blur transition-all hover:bg-primary/10"
            >
              Hành trình của chúng tôi
            </Button>
          </motion.div>

          {/* Feature Grid - Cinematic Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {highlightItems.map((item, idx) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/30"
              >
                <div className={`rounded-2xl bg-background/60 p-4 shadow-sm transition-transform group-hover:scale-110 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 font-montserrat">
                  {item.label}
                </span>
                
                {/* Decorative glow item */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Modern Decorator Elements */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}

