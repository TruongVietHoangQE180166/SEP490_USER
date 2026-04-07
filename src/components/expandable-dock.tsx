"use client";

import React, { useState, ReactNode, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { cn } from "@/utils/cn"

interface ExpandableDockProps {
  headerContent: ReactNode;
  children: ReactNode;
  className?: string;
}

const ExpandableDock = ({
  headerContent,
  children,
  className,
}: ExpandableDockProps) => {
  const [animationStage, setAnimationStage] = useState<
    | "collapsed"
    | "widthExpanding"
    | "heightExpanding"
    | "fullyExpanded"
    | "contentFadingOut"
    | "heightCollapsing"
    | "widthCollapsing"
  >("collapsed");

  const containerRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    setAnimationStage("widthExpanding");
    setTimeout(() => setAnimationStage("heightExpanding"), 400);
    setTimeout(() => setAnimationStage("fullyExpanded"), 850);
  };

  const handleCollapse = () => {
    setAnimationStage("contentFadingOut");
    setTimeout(() => setAnimationStage("heightCollapsing"), 250);
    setTimeout(() => setAnimationStage("widthCollapsing"), 650);
    setTimeout(() => setAnimationStage("collapsed"), 1050);
  };

  const isCollapsed = animationStage === "collapsed";
  const isExpanded = animationStage === "fullyExpanded";

  const pathname = usePathname();

  useEffect(() => {
    handleCollapse();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isExpanded
      ) {
        handleCollapse();
      }
    };
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleCollapse();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isExpanded]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full px-4 sm:px-0">
      <motion.div
        ref={containerRef}
        initial={{
          width: "min(90vw, 360px)",
          height: 68,
          borderRadius: 999,
        }}
        animate={{
          width:
            animationStage === "collapsed" ||
            animationStage === "widthCollapsing"
              ? "min(90vw, 360px)"
              : "min(90vw, 720px)",
          height:
            animationStage === "collapsed" ||
            animationStage === "widthExpanding" ||
            animationStage === "widthCollapsing"
              ? 68
              : "min(80vh, 500px)",
          borderRadius: isCollapsed ? 999 : 20,
        }}
        transition={{
          width: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
          height: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
          borderRadius: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        }}
        className={cn(
          "bg-background border border-border backdrop-blur-md shadow-2xl overflow-hidden flex flex-col-reverse mx-auto",
          className
        )}
      >
        <div
          onClick={isCollapsed ? handleExpand : handleCollapse}
          className="flex items-center gap-4 px-4 sm:px-6 py-4 text-foreground w-full h-[68px] whitespace-nowrap cursor-pointer border-t border-border flex-shrink-0 hover:bg-accent/50 transition-colors"
        >
          {headerContent}
        </div>
        <motion.div
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 flex-1 flex flex-col overflow-hidden"
        >
          <div className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-muted-foreground/30 hover:scrollbar-thumb-muted-foreground/50">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExpandableDock;