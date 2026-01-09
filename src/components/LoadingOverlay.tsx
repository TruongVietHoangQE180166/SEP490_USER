'use client';

import { observer } from '@legendapp/state/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThunderLoader } from './thunder-loader';
import { loadingState$ } from '@/stores/loadingStore';

const LoadingOverlay = observer(() => {
  const isLoading = loadingState$.isLoading.get();
  const message = loadingState$.message.get();
  const type = loadingState$.type.get();
  const isPageTransitioning = loadingState$.isPageTransitioning.get();

  // Don't show overlay during page transitions or when not loading
  if (isPageTransitioning || !isLoading) {
    return null;
  }

  // Use a single consistent color variant
  const getLoaderVariant = () => {
    return 'default';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card/90 shadow-xl border border-border">
          <ThunderLoader
            className="w-24 h-24"
            variant="default"
            animate="thunder"
            showGlow={true}
            showFill={true}
          />
          {message && (
            <p className="text-lg font-medium text-foreground text-center">
              {message}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export { LoadingOverlay };