"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

const timelineEvents = [
  {
    year: "Tháng 1, 2026",
    title: "Khởi Đầu Hành Trình",
    description:
      "Ra mắt phiên bản VicTeach Beta với sứ mệnh dân chủ hóa tri thức thông qua công nghệ.",
    icon: CheckCircle2,
  },
  {
    year: "Tháng 3, 2026",
    title: "Trợ Lý Học Tập AI",
    description:
      "Triển khai hệ thống AI thông minh giúp cá nhân hóa lộ trình học tập cho từng học viên.",
    icon: CheckCircle2,
  },
  {
    year: "Tháng 6, 2026",
    title: "Cộng Đồng Sáng Tạo",
    description:
      "Cán mốc 10.000 học viên đầu tiên tham gia vào hệ sinh thái giáo dục VicTeach.",
    icon: CheckCircle2,
  },
  {
    year: "Tháng 9, 2026",
    title: "Chứng Chỉ Xác Thực",
    description:
      "Ra mắt hệ thống chứng chỉ bảo mật cao cấp, khẳng định giá trị tri thức của học viên.",
    icon: CheckCircle2,
  },
];

export function TimelineBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="w-full bg-transparent py-20 md:py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="mx-auto max-w-[1850px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:mb-24"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1 font-montserrat font-bold uppercase tracking-widest text-[10px]" variant="secondary">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            Lộ trình phát triển
          </Badge>
          <h2 className="mb-6 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl font-cinzel text-foreground">
            Hành Trình Kiến Tạo <span className="text-primary">Tri Thức</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg font-montserrat leading-relaxed">
            Chúng tôi không ngừng chuyển mình để mang lại những giá trị tốt nhất cho cộng đồng giáo dục.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line with gradient glow */}
          <motion.div
            className="absolute left-4 top-0 h-full w-1 bg-gradient-to-b from-primary via-primary/40 to-transparent md:left-1/2 md:-translate-x-1/2"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            style={{ transformOrigin: "top" }}
          />

          <div className="space-y-16 md:space-y-24">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }
                  }
                  transition={{
                    delay: index * 0.2,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline node with pulse effect */}
                  <div className="absolute left-4 flex h-10 w-10 items-center justify-center md:left-1/2 md:-translate-x-1/2 z-20">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-16 w-full md:ml-0 md:w-[45%] ${
                      isEven ? "md:pr-12 text-left md:text-right" : "md:pl-12 text-left"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -8 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                    >
                      <Card className="group relative overflow-hidden border-border/40 bg-background/60 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 rounded-3xl">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10">
                          <Badge className="mb-4 bg-primary/5 text-primary border-primary/20 font-montserrat font-black text-[10px] tracking-widest px-3 py-0.5" variant="outline">
                            {event.year}
                          </Badge>
                          <h3 className="mb-3 text-xl font-black md:text-2xl font-cinzel text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground md:text-base font-montserrat leading-relaxed font-medium">
                            {event.description}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden w-[45%] md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: timelineEvents.length * 0.2 + 0.5, type: "spring" }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-8 py-4 backdrop-blur-sm shadow-inner group cursor-default">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
            />
            <span className="text-sm font-black uppercase tracking-[0.3em] text-primary group-hover:tracking-[0.4em] transition-all font-montserrat">
              Hành trình vẫn đang tiếp diễn
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
