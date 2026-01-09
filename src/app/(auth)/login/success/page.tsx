'use client';

import { useGoogleCallback } from '@/modules/auth/hooks/useGoogleCallback';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { GridBackground } from '@/components/ui/grid-background';

const GoogleCallbackPage = () => {
  const { isProcessing } = useGoogleCallback();

  return (
    <GridBackground
      gridSize="12:12"
      colors={{
        background: 'bg-background',
        borderColor: 'border-border',
        borderSize: '1px',
        borderStyle: 'solid',
      }}
      beams={{
        count: 8,
        colors: [
          'bg-primary/60',
          'bg-primary/40',
          'bg-chart-1/60',
          'bg-chart-2/60',
          'bg-accent/60',
        ],
        shadow: 'shadow-lg shadow-primary/30 rounded-full',
        speed: 5,
      }}
      className="fixed inset-0"
    >
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">Đang xử lý đăng nhập Google...</p>
      </div>
    </GridBackground>
  );
};

export default GoogleCallbackPage;
