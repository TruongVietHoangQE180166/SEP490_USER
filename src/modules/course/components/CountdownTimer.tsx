"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CountdownTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = deadline.getTime() - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-border/40 bg-background/80 backdrop-blur"
      >
        <span className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">
          {String(value).padStart(2, "0")}
        </span>
      </motion.div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <TimeUnit value={timeLeft.days} label="Ngày" />
      <span className="text-2xl font-bold text-foreground/40">:</span>
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <span className="text-2xl font-bold text-foreground/40">:</span>
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <span className="text-2xl font-bold text-foreground/40">:</span>
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
}
