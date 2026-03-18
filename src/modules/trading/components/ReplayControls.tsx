'use client';

import { tradingState$, tradingActions } from '../store';
import { ReplaySpeed } from '../types';
import { cn } from '@/lib/utils';
import { Play, Pause, Square, History } from 'lucide-react';

interface ReplayControlsProps {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const SPEEDS: { label: string; value: ReplaySpeed }[] = [
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '5×', value: 5 },
  { label: '10×', value: 10 },
];

export function ReplayControls({ onStart, onPause, onResume, onStop }: ReplayControlsProps) {
  const replayState = tradingState$.replayState.get();
  const { isActive, isPlaying, currentIndex, speed } = replayState;
  const totalCandles = tradingState$.chartData.get().length;
  const progress = totalCandles > 0 ? (currentIndex / totalCandles) * 100 : 0;

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-card">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2">
        <History className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">Chế độ Replay</span>
        {isActive && (
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
            isPlaying
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-muted text-muted-foreground border border-border'
          )}>
            {isPlaying ? '▶ Đang chạy' : '⏸ Tạm dừng'}
          </span>
        )}
      </div>

      {/* Nút điều khiển */}
      <div className="flex items-center gap-1">
        {!isActive ? (
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            Bắt đầu Replay
          </button>
        ) : (
          <>
            {isPlaying ? (
              <button
                onClick={onPause}
                title="Tạm dừng"
                className="flex items-center p-1.5 bg-accent hover:bg-muted text-accent-foreground rounded-lg transition-all"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onResume}
                title="Tiếp tục"
                className="flex items-center p-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all border border-emerald-500/30"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onStop}
              title="Dừng & trở về realtime"
              className="flex items-center p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-all border border-destructive/20"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Tốc độ */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground mr-0.5">Tốc độ</span>
        {SPEEDS.map(s => (
          <button
            key={s.value}
            onClick={() => tradingActions.setReplaySpeed(s.value)}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all',
              speed === s.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Thanh tiến trình */}
      {isActive && (
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
            {currentIndex}/{totalCandles}
          </span>
        </div>
      )}

      {/* Chú thích khi không active */}
      {!isActive && (
        <span className="ml-auto text-[10px] text-muted-foreground italic">
          Replay dữ liệu lịch sử mô phỏng
        </span>
      )}
    </div>
  );
}
