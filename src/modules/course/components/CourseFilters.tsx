'use client';

import { Card } from '@/components/ui/card';
import { Filter, Star, Sparkles, BookOpen, Clock, Target, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface CourseFiltersProps {
  activeAssets: string[];
  toggleAsset: (asset: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  clearFilters: () => void;
}

export const CourseFilters = ({
  activeAssets,
  toggleAsset,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  clearFilters
}: CourseFiltersProps) => {
  const assets = [
    { name: 'All', icon: Sparkles },
    { name: 'GOLD', icon: Sparkles },
    { name: 'SILVER', icon: Sparkles },
    { name: 'REACT', icon: BookOpen },
    { name: 'UI/UX', icon: Target },
    { name: 'FIGMA', icon: Target },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-10 shadow-sm">
        {/* Asset Filter - Tag Style */}
        <div className="space-y-5">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
             <Filter className="h-4 w-4" /> Tài sản (Assets)
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

          <div className="flex flex-wrap gap-2 pt-2">
            {[500000, 2000000, 5000000].map((val) => (
                <button 
                  key={val} 
                  onClick={() => setPriceRange([0, val])}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                >
                  Dưới {val/1000}k
                </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Star className="h-4 w-4" /> Đánh giá
          </h3>
          <div className="space-y-3">
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
