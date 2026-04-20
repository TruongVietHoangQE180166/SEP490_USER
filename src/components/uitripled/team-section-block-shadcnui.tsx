"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Twitter,
} from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    name: "Nguyễn Văn Thương",
    role: "Backend Developer",
    bio: "Chuyên gia xây dựng hệ thống lõi và tối ưu hóa cơ sở dữ liệu.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thuong",
    location: "Viet Nam",
    skills: ["Node.js", "Java", "PostgreSQL", "System Architecture"],
    gradient: "from-white/10 via-white/5 to-transparent",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
      email: "thuong@victeach.io.vn",
    },
  },
  {
    name: "Trương Việt Hoàng",
    role: "Frontend Developer",
    bio: "Người thổi hồn vào giao diện với trải nghiệm người dùng mượt mà.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang",
    location: "Viet Nam",
    skills: ["React", "Next.js", "Tailwind CSS", "Animation"],
    gradient: "from-white/12 via-white/5 to-transparent",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
      email: "hoang@victeach.io.vn",
    },
  },
  {
    name: "Võ Xuân Ý",
    role: "Business Analytic",
    bio: "Cầu nối giữa giải pháp kỹ thuật và nhu cầu thực tế của thị trường.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Y",
    location: "Viet Nam",
    skills: ["Business Analysis", "Strategy", "Data Insights", "Market Research"],
    gradient: "from-white/12 via-white/5 to-transparent",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
      email: "y@victeach.io.vn",
    },
  },
  {
    name: "Lê Quang Minh Đà",
    role: "Software Tester",
    bio: "Đảm bảo chất lượng tuyệt đối cho từng sản phẩm trước khi đến tay người dùng.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Da",
    location: "Viet Nam",
    skills: ["Automation Testing", "Quality Assurance", "UI/UX Testing", "Bug Tracking"],
    gradient: "from-foreground/12 via-foreground/5 to-transparent",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
      email: "da@victeach.io.vn",
    },
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

function TeamMemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div variants={itemVariants} className="perspective-1000 h-full">
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full"
      >
        <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl transition-shadow duration-500 shadow-2xl h-full flex flex-col">
          {/* Animated gradient overlay */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            animate={
              isHovered
                ? { opacity: 1 }
                : { opacity: shouldReduceMotion ? 0.05 : 0 }
            }
          />

          {/* Sparkle effect on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isHovered
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.6 }
            }
            className="absolute right-4 top-4 z-10"
          >
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          </motion.div>

          <div className="relative z-10 p-6 flex flex-col flex-grow">
            {/* Avatar Section */}
            <div className="mb-4 flex justify-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-primary/20 bg-card/80 p-1 group-hover:border-primary/50 transition-colors">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full rounded-full object-cover bg-primary/5"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="text-center flex flex-col flex-grow">
              <div className="min-h-[3.5rem] flex items-center justify-center">
                <motion.h3
                  className="text-xl md:text-2xl font-black tracking-tight text-foreground font-cinzel leading-tight"
                  animate={isHovered ? { scale: 1.02, color: "var(--primary)" } : { scale: 1, color: "inherit" }}
                  transition={{ duration: 0.2 }}
                >
                  {member.name}
                </motion.h3>
              </div>
              
              <div className="mb-3 h-6 flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur font-montserrat"
                >
                  {member.role}
                </Badge>
              </div>

              <div className="h-4 mb-4 flex items-center justify-center">
                <motion.div
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-foreground/50 font-montserrat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <MapPin className="h-3 w-3 text-primary" aria-hidden />
                  <span>{member.location}</span>
                </motion.div>
              </div>

              <div className="min-h-[5rem] flex items-start justify-center flex-grow mb-6">
                <p className="text-sm text-foreground/70 font-montserrat leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>

              {/* Skills */}
              <motion.div
                className="mb-6 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isHovered ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 0 }
                }
                transition={{ duration: 0.3 }}
              >
                {member.skills.map((skill, idx) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * idx, type: "spring" }}
                  >
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-primary/5 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary/80 transition-colors hover:bg-primary/10 hover:text-primary font-montserrat"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center gap-3 mt-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Github, label: "GitHub" },
                  { icon: Mail, label: "Email" },
                ].map((social, idx) => (
                  <motion.div
                    key={social.label}
                    whileHover={{ y: -5, scale: 1.1 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-full border-primary/20 bg-primary/5 text-primary/70 transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                    >
                      <social.icon className="h-4 w-4" aria-hidden />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function TeamSectionBlock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="team-section-heading"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-10 bg-transparent"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: shouldReduceMotion ? 1 : [1, 1.18, 1],
            rotate: shouldReduceMotion ? 0 : [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: shouldReduceMotion ? 0.6 : 18,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: shouldReduceMotion ? 1 : [1.1, 1, 1.1],
            rotate: shouldReduceMotion ? 0 : [0, -90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: shouldReduceMotion ? 0.6 : 16,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px]"
        />
      </div>

      <div className="mx-auto max-w-[1850px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="mb-20 text-center"
        >
          <motion.div className="mb-6 inline-block">
            <Badge
              className="gap-2 bg-primary/10 text-primary border-primary/20 backdrop-blur font-montserrat font-black uppercase tracking-widest text-[10px] px-4 py-1.5"
              variant="secondary"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Đội Ngũ Sáng Lập
            </Badge>
          </motion.div>

          <motion.h2
            id="team-section-heading"
            className="mb-8 text-4xl font-black tracking-tight text-foreground md:text-6xl font-cinzel leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Gặp Gỡ Những Người Sáng Tạo
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Phía Sau VicTeach
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-3xl text-lg text-foreground/70 font-montserrat font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Hợp tác cùng những chuyên gia hàng đầu, chúng tôi cùng nhau xây dựng 
            một hệ sinh thái giáo dục hiện đại và định hướng tương lai.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </motion.div>


      </div>
    </section>
  );
}
