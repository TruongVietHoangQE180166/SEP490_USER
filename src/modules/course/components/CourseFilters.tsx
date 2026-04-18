'use client';

import { Card } from '@/components/ui/card';
import { Filter, Star, Sparkles, BookOpen, Clock, Target, Banknote, Tag, Layers, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface CourseFiltersProps {
  activeAssets: string[];
  toggleAsset: (asset: string) => void;
  activeLevels: string[];
  toggleLevel: (level: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  statusFilter: 'all' | 'free' | 'enrolled' | 'not-enrolled';
  setStatusFilter: (status: 'all' | 'free' | 'enrolled' | 'not-enrolled') => void;
  clearFilters: () => void;
}

export const CourseFilters = ({
  activeAssets,
  toggleAsset,
  activeLevels,
  toggleLevel,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  statusFilter,
  setStatusFilter,
  clearFilters
}: CourseFiltersProps) => {
  const assets = [
    { name: 'All', icon: Sparkles },
    { name: 'CRYPTO', icon: Sparkles },
    { name: 'SPOT', icon: Sparkles },
    { name: 'FUTURES', icon: Sparkles },
    { name: 'OPTIONS', icon: Sparkles },
    { name: 'PERPETUAL', icon: Sparkles },
    { name: 'MARGIN', icon: Sparkles },
    { name: 'LEVERAGE', icon: Sparkles },
    { name: 'DERIVATIVES', icon: Sparkles },
    { name: 'STABLECOIN', icon: Sparkles },
    { name: 'DEFI', icon: Sparkles },
    { name: 'NFT', icon: Sparkles },
    { name: 'STAKING', icon: Sparkles },
    { name: 'YIELD', icon: Sparkles },
    { name: 'LIQUIDITY', icon: Sparkles },
    { name: 'VOLATILITY', icon: Sparkles },
    { name: 'INDEX', icon: Sparkles },
    { name: 'FOREX', icon: Sparkles },
    { name: 'GOLD', icon: Sparkles },
    { name: 'SILVER', icon: Sparkles },
    { name: 'COMMODITIES', icon: Sparkles },
  ];

  const statuses = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Miễn phí', value: 'free' },
    { label: 'Đã mua', value: 'enrolled' },
    { label: 'Chưa mua', value: 'not-enrolled' },
  ] as const;

  const levels = [
    { name: 'Level 1', label: 'Nhập môn', colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white', activeClass: 'bg-emerald-500 text-white shadow-emerald-500/30 font-black' },
    { name: 'Level 2', label: 'Nền tảng', colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500 hover:text-white', activeClass: 'bg-blue-500 text-white shadow-blue-500/30 font-black' },
    { name: 'Level 3', label: 'Trung cấp', colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-white', activeClass: 'bg-amber-500 text-white shadow-amber-500/30 font-black' },
    { name: 'Level 4', label: 'Thực hành', colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500 hover:text-white', activeClass: 'bg-orange-500 text-white shadow-orange-500/30 font-black' },
    { name: 'Level 5', label: 'Nâng cao', colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500 hover:text-white', activeClass: 'bg-rose-500 text-white shadow-rose-500/30 font-black' },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-8 shadow-sm">
        {/* Status Filter - Compact Pills */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
             <Target className="h-4 w-4" /> Trạng thái
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((status) => {
              const isActive = statusFilter === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`
                    w-full px-3 py-2 rounded-xl border transition-all font-black text-[10px] uppercase tracking-wider
                    ${isActive 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20' 
                      : 'bg-muted/40 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'}
                  `}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between gap-2">
             <div className="flex items-center gap-2">
               <Layers className="h-4 w-4" /> Trình độ
             </div>
             {activeLevels.length > 0 && !activeLevels.includes('All') && (
               <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                 Đã chọn {activeLevels.length}
               </span>
             )}
          </h3>
          <div className="space-y-2.5">
            <button
              onClick={() => toggleLevel('All')}
              className={`
                px-5 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] w-full text-left flex items-center justify-between group
                ${activeLevels.includes('All') 
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'}
              `}
            >
              <span>Phân loại tất cả</span>
              <div className={`h-1.5 w-1.5 rounded-full ${activeLevels.includes('All') ? 'bg-primary-foreground animate-pulse' : 'bg-muted-foreground/30'}`} />
            </button>

            <div className="space-y-2">
              {levels.map((level, idx) => {
                const isActive = activeLevels.includes(level.name);
                const levelNum = idx + 1;
                
                return (
                  <button
                    key={level.name}
                    onClick={() => toggleLevel(level.name)}
                    className={`
                      relative px-5 py-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group w-full overflow-hidden
                      ${isActive 
                        ? cn("border-transparent shadow-xl scale-[1.02] z-10", 
                            levelNum === 1 && "bg-emerald-500 text-white shadow-emerald-500/30",
                            levelNum === 2 && "bg-blue-500 text-white shadow-blue-500/30",
                            levelNum === 3 && "bg-amber-500 text-white shadow-amber-500/30",
                            levelNum === 4 && "bg-orange-500 text-white shadow-orange-500/30",
                            levelNum === 5 && "bg-rose-500 text-white shadow-rose-500/30"
                          )
                        : "bg-muted/10 border-border/30 text-muted-foreground hover:border-border/60 hover:bg-muted/20"}
                    `}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`
                        h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors
                        ${isActive ? 'bg-white/20 text-white' : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                      `}>
                        {levelNum}
                      </div>
                      <div className="flex flex-col items-start gap-0">
                        <span className="text-xs font-black uppercase tracking-wider">{level.label}</span>
                        <span className={`text-[9px] font-bold uppercase transition-opacity ${isActive ? 'opacity-70' : 'opacity-40'}`}>
                          {level.name.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      {isActive && <Check className="h-4 w-4 text-white animate-in zoom-in duration-300" />}
                    </div>

                    {/* Decorative Background for unselected items */}
                    {!isActive && (
                       <div className={`absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
                          <Layers size={60} />
                       </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Asset Filter - Tag Style */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
             <Tag className="h-4 w-4" /> Tag nội dung
          </h3>
          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => {
              const isActive = activeAssets.includes(asset.name);
              return (
                <button
                  key={asset.name}
                  onClick={() => toggleAsset(asset.name)}
                  className={`
                    px-4 py-2 rounded-xl border transition-all font-bold text-xs whitespace-nowrap
                    ${isActive 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105' 
                      : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'}
                  `}
                >
                  #{asset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <Banknote className="h-4 w-4" /> Khoảng giá
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
            </span>
          </div>
          
          <div className="px-2">
            <Slider 
              min={0} 
              max={10000000} 
              step={100000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase">
                <span>0đ</span>
                <span>10tr+</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Star className="h-4 w-4" /> Đánh giá
          </h3>
          <div className="space-y-2">
              {[4, 3, 2].map((rating) => (
                  <button 
                    key={rating} 
                    onClick={() => setMinRating(rating)}
                    className={`flex items-center gap-2 p-2 rounded-xl transition-all w-full group ${minRating === rating ? 'bg-primary/5' : 'hover:bg-muted'}`}
                  >
                      <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-3 w-3 ${s <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted/30'} group-hover:scale-110 transition-transform`} />
                          ))}
                      </div>
                      <span className={`text-xs font-bold transition-colors ${minRating === rating ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>Từ {rating} sao</span>
                  </button>
              ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
            <Button
                variant="ghost"
                className="w-full h-10 rounded-xl font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                onClick={clearFilters}
            >
                Xóa tất cả bộ lọc
            </Button>
        </div>
      </div>
    </div>
  );
};
