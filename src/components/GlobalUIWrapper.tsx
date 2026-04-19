"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface GlobalUIWrapperProps {
  children: React.ReactNode;
}

export function GlobalUIWrapper({ children }: GlobalUIWrapperProps) {
  const pathname = usePathname();

  // Danh sách các route không hiển thị Header, Footer, Bubbles...
  const hiddenRoutes = ["/onboarding"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
