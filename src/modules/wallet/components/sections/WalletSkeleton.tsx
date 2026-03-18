'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const WalletModuleSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Skeleton className="h-[320px] w-full rounded-3xl" />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Skeleton className="flex-1 w-full rounded-3xl h-[95px]" />
          <Skeleton className="flex-1 w-full rounded-3xl h-[95px]" />
          <Skeleton className="flex-1 w-full rounded-3xl h-[95px]" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full rounded-3xl" />
      <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">
        <div className="p-10 border-b border-border/40 flex justify-between">
          <Skeleton className="h-10 w-52 rounded-2xl" />
          <Skeleton className="h-10 w-64 rounded-2xl" />
        </div>
        <div className="p-10 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
