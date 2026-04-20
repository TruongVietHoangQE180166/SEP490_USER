"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

const benefits = [
  "Không yêu cầu thẻ tín dụng",
  "Truy cập trọn đời",
  "Hỗ trợ 24/7 từ chuyên gia",
];

export function CTAHeroBlock() {
  const [email, setEmail] = useState("");
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 pt-16 md:pt-24 lg:pt-32 pb-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute -right-1/4 -top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl md:h-[600px] md:w-[600px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl md:h-[600px] md:w-[600px]"
        />
      </div>

      <div className="mx-auto max-w-8xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-4 md:mb-6 rounded-full px-4 py-1.5 font-bold" variant="secondary">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
                Ưu đãi có hạn
              </Badge>
            </motion.div>

            <motion.h2
              className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-black tracking-tight text-transparent md:mb-6 md:text-5xl lg:text-6xl uppercase leading-tight py-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Nâng Tầm Sự Nghiệp{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent italic">
                Của Bạn
              </span>
            </motion.h2>

            <motion.p
              className="mb-6 text-base font-medium text-muted-foreground md:mb-8 md:text-lg lg:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Hãy tham gia cùng hàng ngàn học viên tại VIC Teach để bắt đầu hành trình biến ước mơ thành hiện thực thông qua những kiến thức thực chiến.
            </motion.p>

            {/* Email signup form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 md:mb-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 text-base md:h-14 rounded-2xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all px-6 font-medium"
                />
                <Button size="lg" className="group h-12 md:h-14 rounded-2xl bg-primary text-primary-foreground font-black px-8 shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform">
                  Bắt đầu ngay
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </div>
            </motion.div>

            {/* Benefits list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 md:gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground md:text-base">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 flex flex-wrap items-center gap-4 md:mt-12"
            >
              <div className="flex -space-x-2" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.1, type: "spring" }}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="font-black text-foreground">10,000+</span>
                <span className="text-muted-foreground text-xs uppercase tracking-widest ml-1"> học viên hài lòng</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Video/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="flex items-center justify-center"
          >
            <motion.div
              onHoverStart={() => setIsVideoHovered(true)}
              onHoverEnd={() => setIsVideoHovered(false)}
              className="relative w-full max-w-lg"
            >
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 p-4 shadow-2xl md:p-6">
                <motion.div
                  className="relative aspect-video overflow-hidden rounded-lg bg-black group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {isPlaying ? (
                    <iframe
                      src="https://www.youtube.com/embed/Vsq1_kewchQ?autoplay=1"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {/* Video thumbnail from YouTube */}
                      <div className="absolute inset-0 h-full w-full">
                        <img 
                          src="https://img.youtube.com/vi/Vsq1_kewchQ/maxresdefault.jpg" 
                          alt="Video Thumbnail"
                          className="h-full w-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 mix-blend-overlay" />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setIsPlaying(true)}
                          aria-label="Xem video giới thiệu khóa học"
                          className="cursor-pointer relative"
                        >
                          <motion.div
                            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg md:h-20 md:w-20 ring-4 ring-white/20 transition-all hover:ring-white/40">
                            <Play className="ml-1 h-8 w-8 text-primary-foreground md:h-10 md:w-10 fill-current" />
                          </div>
                        </button>
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        className="absolute right-4 top-4 rounded-lg bg-background/80 p-2 shadow-lg backdrop-blur-sm md:p-3 border border-white/10"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Zap className="h-4 w-4 text-primary md:h-5 md:w-5 fill-current" />
                      </motion.div>

                      <motion.div
                        className="absolute bottom-4 left-4 rounded-lg bg-background/80 p-2 shadow-lg backdrop-blur-sm md:p-3 border border-white/10"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary md:h-5 md:w-5" />
                      </motion.div>
                    </>
                  )}
                </motion.div>

                {/* Stats overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-4 grid grid-cols-3 gap-2 md:gap-4"
                >
                  {[
                    { label: "Học viên", value: "50K+" },
                    { label: "Đánh giá", value: "4.9★" },
                    { label: "Quốc gia", value: "120+" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1.3 + index * 0.1,
                        type: "spring",
                      }}
                      className="rounded-2xl bg-secondary/30 p-2 text-center backdrop-blur-sm md:p-3 border border-border/50"
                    >
                      <div className="text-base font-black md:text-xl tracking-tighter">
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
