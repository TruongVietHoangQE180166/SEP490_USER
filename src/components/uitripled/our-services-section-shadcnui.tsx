"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, type Variants } from "framer-motion";
import {
  Code,
  Palette,
  Rocket,
  Search,
  Shield,
  Smartphone,
} from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Học tập Linh hoạt",
    description:
      "Tiếp cận kho tàng kiến thức mọi lúc, mọi nơi trên mọi thiết bị di động và máy tính.",
    badge: "Phổ biến",
  },
  {
    icon: Palette,
    title: "Lộ trình Bài bản",
    description:
      "Các khóa học được thiết kế khoa học, logic, giúp bạn nắm vững kiến thức từ gốc đến ngọn.",
    badge: null,
  },
  {
    icon: Smartphone,
    title: "Trải nghiệm Đa nền tảng",
    description:
      "Ứng dụng học tập mượt mà trên cả iOS và Android, tối ưu cho việc học tập di động.",
    badge: "Mới",
  },
  {
    icon: Search,
    title: "Cộng đồng Khổng lồ",
    description:
      "Tham gia thảo luận và giải đáp thắc mắc cùng hàng ngàn học viên và chuyên gia hàng đầu.",
    badge: null,
  },
  {
    icon: Rocket,
    title: "Cập nhật Công nghệ",
    description:
      "Nội dung bài giảng luôn được cập nhật theo những xu hướng công nghệ mới nhất hiện nay.",
    badge: null,
  },
  {
    icon: Shield,
    title: "Chứng chỉ Uy tín",
    description:
      "Cấp chứng chỉ hoàn thành khóa học, giúp khẳng định năng lực và nâng tầm sự nghiệp của bạn.",
    badge: "Nổi bật",
  },
];

export function OurServicesSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-background px-4 py-20 md:py-24">
      <div className="mx-auto max-w-8xl px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <Badge className="mb-4 w-fit">Dịch vụ của chúng tôi</Badge>
          <h2 className="mb-4 text-3xl font-black md:text-4xl lg:text-5xl tracking-tight">
            Giá trị VIC Teach đem lại
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
            Chúng tôi cung cấp giải pháp học tập toàn diện, giúp bạn khai phá 
            tiềm năng và đạt được những thành công đột phá.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={itemVariants}>
                <Card className="group relative h-full border-2 border-border/50 p-8 transition-all hover:border-primary hover:shadow-2xl hover:shadow-primary/5 rounded-[32px] flex flex-col items-start text-left">
                  {service.badge && (
                    <Badge className="absolute -right-2 -top-2 rounded-full px-3 py-1 font-black">
                      {service.badge}
                    </Badge>
                  )}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-black tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-base font-medium text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <Button variant="ghost" size="sm" className="group/btn mt-auto -ml-3 font-black text-primary hover:bg-primary/5 h-12 px-5 rounded-xl">
                    Tìm hiểu thêm
                    <motion.span
                      className="ml-2 inline-block"
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.span>
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
