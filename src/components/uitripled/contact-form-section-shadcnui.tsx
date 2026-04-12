"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, type Variants } from "framer-motion";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <section className="relative overflow-hidden bg-transparent px-6 pt-24 pb-10 sm:px-8 md:pt-32 md:pb-12">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-6 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary/3 blur-[130px]" />
      </div>

      <div className="mx-auto flex max-w-8xl px-6 flex-col items-center gap-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 font-montserrat">
            Liên hệ với chúng tôi
          </span>
          <h2 className="text-4xl font-black tracking-tight text-foreground md:text-6xl font-cinzel leading-tight">
            Cùng Nhau Kiến Tạo <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent italic">
              Những Giá Trị Khác Biệt
            </span>
          </h2>
          <p className="max-w-4xl text-foreground/70 font-montserrat font-medium leading-relaxed mx-auto text-lg">
            Hãy chia sẻ ý tưởng của bạn, đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc. 
            VicTeach luôn sẵn sàng đồng hành cùng bạn trên con đường tri thức.
          </p>
        </motion.div>

        <Card className="group relative w-full max-w-7xl overflow-hidden rounded-[40px] border border-primary/20 bg-background/40 p-0 backdrop-blur-3xl transition-all hover:border-primary/40 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative grid gap-16 px-8 py-12 md:grid-cols-2 lg:gap-24 md:px-16 md:py-20"
            aria-label="Contact form"
          >
            <motion.div
              variants={itemVariants}
              className="space-y-10 text-left text-foreground/70"
            >
              <motion.div
                variants={iconVariants}
                className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur font-montserrat"
                aria-hidden="true"
              >
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                Phản hồi trong 24 giờ
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-foreground font-cinzel">
                  Bắt Đầu Hành Trình Của Bạn
                </h3>
                <p className="text-sm text-foreground/70 font-montserrat leading-relaxed font-medium">
                  Chúng tôi sẽ trao đổi để hiểu rõ hơn về mục tiêu và kỳ vọng của bạn. 
                  Hoặc gửi email trực tiếp cho chúng tôi tại:{" "}
                  <a
                    href="mailto:admin@victeach.io.vn"
                    className="text-primary font-bold underline decoration-primary/30 underline-offset-4 transition-all hover:decoration-primary"
                  >
                    admin@victeach.io.vn
                  </a>
                </p>
              </div>

              <div className="grid gap-4 text-sm text-foreground/70">
                <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/50 font-montserrat">Email</p>
                    <p className="font-bold text-foreground">admin@victeach.io.vn</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/50 font-montserrat">Điện thoại</p>
                    <p className="font-bold text-foreground">+84 (0) 123 456 789</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 text-left">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 font-montserrat"
                  >
                    Họ và Tên
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-primary/20 bg-background/40 px-4 text-sm text-foreground transition-all focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 font-montserrat font-medium"
                    aria-required="true"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 font-montserrat"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@vidu.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 rounded-xl border border-primary/20 bg-background/40 pl-11 text-sm text-foreground transition-all focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 font-montserrat font-medium"
                      autoComplete="email"
                      aria-required="true"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-left">
                <Label
                  htmlFor="phone"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 font-montserrat"
                >
                  Số Điện Thoại
                </Label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50"
                    aria-hidden="true"
                  />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-primary/20 bg-background/40 pl-11 text-sm text-foreground transition-all focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 font-montserrat font-medium"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <Label
                  htmlFor="message"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 font-montserrat"
                >
                  Nội dung lời nhắn
                </Label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-4 top-4 h-4 w-4 text-primary/50"
                    aria-hidden="true"
                  />
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Hãy cho chúng tôi biết về ý tưởng hoặc thắc mắc của bạn..."
                    value={formData.message}
                    onChange={handleChange}
                    className="min-h-[160px] rounded-2xl border border-primary/20 bg-background/40 pl-11 pt-4 text-sm text-foreground transition-all focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 font-montserrat font-medium leading-relaxed"
                    aria-required="true"
                    required
                  />
                </div>
              </div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  size="lg"
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-7 text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary hover:shadow-primary/40"
                >
                  <span className="text-xs font-black uppercase tracking-[0.3em] font-montserrat">Gửi Thông Tin</span>
                  <Send
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </Button>
              </motion.div>

              <p className="text-[10px] text-foreground/50 font-montserrat font-bold uppercase tracking-widest leading-loose">
                Bằng cách gửi biểu mẫu, bạn đồng ý với các{" "}
                <a
                  href="#"
                  className="text-primary hover:underline underline-offset-4"
                >
                  điều khoản bảo mật
                </a>{" "}
                của chúng tôi.
              </p>
            </motion.div>
          </motion.form>
        </Card>
      </div>
    </section>
  );
}
