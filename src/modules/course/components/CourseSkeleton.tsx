'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseSkeleton() {
  return (
    <Card className="overflow-hidden h-full border-border/50 bg-card flex flex-col py-0 gap-0">
      {/* Thumbnail Skeleton */}
      <Skeleton className="aspect-video w-full rounded-none" />
      
      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Badges Skeleton */}
        <div className="flex items-center gap-3 mb-2 px-0.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-2/3 mb-3" />
        
        {/* Chips Skeleton */}
        <div className="mt-auto flex gap-1.5 mb-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Footer Skeleton */}
        <div className="pt-3 flex items-center justify-between border-t border-border/50">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
