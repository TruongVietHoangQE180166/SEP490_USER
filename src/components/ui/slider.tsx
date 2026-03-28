'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  className?: string;
}

export const Slider = ({ min, max, step = 1, value, onValueChange, className }: SliderProps) => {
  const minVal = value[0];
  const maxVal = value[1];
  
  const minPos = ((minVal - min) / (max - min)) * 100;
  const maxPos = ((maxVal - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), maxVal - step);
    onValueChange([v, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), minVal + step);
    onValueChange([minVal, v]);
  };

  return (
    <div className={cn("relative w-full h-10 flex items-center group", className)}>
      {/* Track Background */}
      <div className="absolute w-full h-1.5 bg-muted rounded-full" />
      
      {/* Active Range Fill */}
      <div 
        className="absolute h-1.5 bg-primary rounded-full"
        style={{ 
          left: `${minPos}%`, 
          width: `${maxPos - minPos}%` 
        }}
      />

      {/* Inputs */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        className={cn(
          "absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20",
          "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-125",
          minVal > max - (max - min) / 20 && "z-30" // Bring to front when high
        )}
      />
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className={cn(
          "absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20",
          "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-125"
        )}
      />
    </div>
  );
};

export const SingleSlider = ({ min, max, step = 1, value, onValueChange, className }: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
}) => {
  const pos = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full h-6 flex items-center group", className)}>
      <div className="absolute w-full h-1 bg-muted rounded-full" />
      <div 
        className="absolute h-1 bg-primary rounded-full transition-all duration-300"
        style={{ width: `${pos}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className={cn(
          "absolute w-full h-1 appearance-none bg-transparent cursor-pointer z-20",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-125 active:[&::-webkit-slider-thumb]:scale-110"
        )}
      />
      {/* 4 dots for 25, 50, 75, 100% */}
      <div className="absolute w-full flex justify-between px-0.5 pointer-events-none">
        {[0, 25, 50, 75, 100].map(p => (
          <div key={p} className={cn("w-1 h-1 rounded-full", value >= (p/100)*max ? "bg-primary" : "bg-muted-foreground/30")} />
        ))}
      </div>
    </div>
  );
};
