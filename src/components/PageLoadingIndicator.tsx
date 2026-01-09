'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThunderLoader } from './thunder-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { loadingActions } from '@/stores/loadingStore';

export const PageLoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading when pathname changes
    setIsLoading(true);
    
    // Set flag to prevent LoadingOverlay from showing
    loadingActions.setPageTransitioning(true);

    // Hide loading after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Clear the flag to allow LoadingOverlay to show again
      loadingActions.setPageTransitioning(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      // Ensure flag is cleared on cleanup
      loadingActions.setPageTransitioning(false);
    };
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-background via-muted to-background backdrop-blur-sm"
        >
          <ThunderLoader
            className="w-64 h-64"
            variant="default"
            animate="thunder"
            showGlow={true}
            showFill={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
