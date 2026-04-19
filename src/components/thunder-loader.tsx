"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const thunderLoaderVariants = cva("inline-block overflow-visible", {
  variants: {
    size: {
      xs: "w-4 h-4",
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
      "2xl": "w-20 h-20",
    },
    variant: {
      default: "",
      electric: "",
      fire: "",
      ice: "",
      rainbow: "",
      subtle: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface ThunderLoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof thunderLoaderVariants> {
  fillDuration?: number;
  glowDuration?: number;
  animateDuration?: number;
  fillColor?: string;
  glowColor?: string;
  baseColor?: string;
  strokeWidth?: number;
  showGlow?: boolean;
  showFill?: boolean;
  animate?: boolean | "thunder";
  viewBox?: string;
  customPath?: string;
}

const variantColors = {
  default: {
    shimmer: "oklch(0.6723 0.1606 244.9955)",
    glow: "oklch(0.6692 0.1607 245.0110)",
    base: "oklch(0.5800 0.1550 244.0000)",
  },
  fire: {
    shimmer: "#fbbf24",
    glow: "#f59e0b",
    base: "#d97706",
  },
  electric: {
    shimmer: "#fb7185",
    glow: "#f43f5e",
    base: "#e11d48",
  },
  ice: {
    shimmer: "#67e8f9",
    glow: "#06b6d4",
    base: "#0891b2",
  },
  rainbow: {
    shimmer: "#a855f7",
    glow: "#8b5cf6",
    base: "#7c3aed",
  },
  subtle: {
    shimmer: "#94a3b8",
    glow: "#64748b",
    base: "#475569",
  },
};

// Coin SVG (viewBox 0 0 24 24) — all 5 paths combined into one d string.
// The tiny sub-paths (dollar bar ends) are still present but the static base
// layer (opacity=1) ensures the full icon is always clearly visible.
const defaultThunderPath =
  "M8 11.4C8 12.17 8.6 12.8 9.33 12.8H10.83C11.47 12.8 11.99 12.25 11.99 11.58C11.99 10.85 11.67 10.59 11.2 10.42L8.8 9.57995C8.32 9.40995 8 9.14995 8 8.41995C8 7.74995 8.52 7.19995 9.16 7.19995H10.66C11.4 7.20995 12 7.82995 12 8.59995 " +
  "M10 12.8501V13.5901 " +
  "M10 6.40991V7.18991 " +
  "M9.99 17.98C14.4028 17.98 17.98 14.4028 17.98 9.99C17.98 5.57724 14.4028 2 9.99 2C5.57724 2 2 5.57724 2 9.99C2 14.4028 5.57724 17.98 9.99 17.98Z " +
  "M12.98 19.88C13.88 21.15 15.35 21.98 17.03 21.98C19.76 21.98 21.98 19.76 21.98 17.03C21.98 15.37 21.16 13.9 19.91 13";

const ThunderLoader = React.forwardRef<HTMLDivElement, ThunderLoaderProps>(
  (
    {
      className,
      size,
      variant = "default",
      fillDuration = 2,
      glowDuration = 3,
      animateDuration = 2,
      fillColor,
      glowColor,
      baseColor,
      strokeWidth = 1.5,
      showGlow = false,
      showFill = false,
      animate = false,
      viewBox = "0 0 24 24",
      customPath,
      ...props
    },
    ref
  ) => {
    const colors = variantColors[variant!] || variantColors.default;
    const finalFillColor = fillColor || colors.shimmer;
    const finalGlowColor = glowColor || colors.glow;
    const thunderPath = customPath || defaultThunderPath;
    const isThunderAnimation = animate === "thunder";

    const gradientId = React.useMemo(
      () => `thunder-gradient-${Math.random().toString(36).substr(2, 9)}`,
      []
    );
    const filterId = React.useMemo(
      () => `thunder-filter-${Math.random().toString(36).substr(2, 9)}`,
      []
    );

    const pathRef = React.useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = React.useState(0);
    const [fillProgress, setFillProgress] = React.useState(0);

    React.useEffect(() => {
      if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength());
      }
    }, [thunderPath]);

    React.useEffect(() => {
      if (!showFill) return;
      let frame: number;
      let start: number | null = null;
      function animateFill(ts: number) {
        if (start === null) start = ts;
        const elapsed = (ts - start) / 1000;
        const fillTime = fillDuration;
        const unfillTime = fillDuration * 1.5;
        const total = fillTime + unfillTime;
        const t = elapsed % total;
        let progress;
        if (t < fillTime) {
          progress = t / fillTime;
        } else {
          progress = 1 - (t - fillTime) / unfillTime;
        }
        setFillProgress(progress);
        frame = requestAnimationFrame(animateFill);
      }
      frame = requestAnimationFrame(animateFill);
      return () => cancelAnimationFrame(frame);
    }, [fillDuration, showFill]);

    const vbW = Number(viewBox.split(" ")[2]) || 24;
    const vbH = Number(viewBox.split(" ")[3]) || 24;

    return (
      <div
        ref={ref}
        className={cn(thunderLoaderVariants({ size, variant }), className)}
        {...props}
      >
        <motion.svg
          className="w-full h-full"
          viewBox={viewBox}
          fill="none"
          initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <defs>
            {showFill && (
              <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={finalFillColor} stopOpacity="0.7" />
                <stop offset="100%" stopColor={finalFillColor} stopOpacity="0.1" />
              </linearGradient>
            )}
            {showGlow && (
              <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* ── Glow layer ── */}
          {showGlow && (
            <motion.path
              d={thunderPath}
              stroke={finalGlowColor}
              strokeWidth={strokeWidth + 0.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${filterId})`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0.5 }}
            >
              <animate
                attributeName="opacity"
                values="0.2;0.7;0.2"
                dur={`${glowDuration}s`}
                repeatCount="indefinite"
              />
            </motion.path>
          )}

          {/* ── Static base layer — always fully visible at 100% opacity ── */}
          <path
            d={thunderPath}
            stroke={finalFillColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={1}
          />

          {/* ── Animated shimmer layer on top ── */}
          <motion.path
            ref={pathRef}
            d={thunderPath}
            stroke={finalFillColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={
              isThunderAnimation
                ? false
                : animate
                ? { pathLength: 0, opacity: 0 }
                : undefined
            }
            animate={
              isThunderAnimation
                ? {
                    strokeDasharray: pathLength * 0.35,
                    strokeDashoffset: [pathLength, -pathLength],
                  }
                : animate
                ? { pathLength: 1, opacity: 1 }
                : undefined
            }
            transition={
              isThunderAnimation
                ? { repeat: Infinity, duration: animateDuration, ease: "linear" }
                : animate
                ? { duration: animateDuration, delay: 0.5, ease: "easeInOut" }
                : undefined
            }
          />

          {/* ── Fill effect (liquid fill from bottom) ── */}
          {showFill && (
            <mask id={`fill-mask-${gradientId}`}>
              <rect
                x="0"
                y={vbH - fillProgress * vbH}
                width={vbW}
                height={fillProgress * vbH}
                fill="white"
              />
            </mask>
          )}
          {showFill && (
            <path
              d={thunderPath}
              fill={`url(#${gradientId})`}
              stroke="none"
              mask={`url(#fill-mask-${gradientId})`}
            />
          )}

          {/* ── Rainbow sparkle ── */}
          {variant === "rainbow" && (
            <motion.circle
              cx={vbW / 2}
              cy={vbH / 2}
              r="0.5"
              fill={finalFillColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 1 }}
            />
          )}
        </motion.svg>
      </div>
    );
  }
);

ThunderLoader.displayName = "ThunderLoader";

export { ThunderLoader, thunderLoaderVariants, type ThunderLoaderProps };
