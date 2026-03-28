'use client';

import { useEffect, useRef, useCallback } from 'react';
import { tradingState$, tradingActions } from '../store';
import { CandleType } from '../types';

/**
 * Hook that drives the replay mode.
 * Replays `fullHistory` candle-by-candle at the selected speed.
 */
export function useReplay(fullHistory: CandleType[]) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (intervalRef.current) return;
    const state = tradingState$.get();
    const speed = state.replayState.speed;
    // Tick every (1000 / speed) ms
    const delay = Math.max(50, Math.floor(1000 / speed));

    intervalRef.current = setInterval(() => {
      const s = tradingState$.get();
      if (!s.replayState.isPlaying) return;

      const idx = s.replayState.currentIndex;
      if (idx >= fullHistory.length) {
        tradingActions.pauseReplay();
        stop();
        return;
      }

      const candle = fullHistory[idx];
      const currentData = s.chartData;
      // If candle already in chart, update; otherwise append
      const exists = currentData.find(c => c.time === candle.time);
      if (exists) {
        tradingActions.updateLastCandle(candle);
      } else {
        tradingActions.appendCandle(candle);
      }
      tradingActions.setCurrentPrice(candle.close);
      tradingActions.advanceReplayIndex();

      // Side-effects (Handled by backend in realtime, replay might not simulate accurately without backend mock)
    }, delay);
  }, [fullHistory, stop]);

  // Watch isPlaying
  useEffect(() => {
    const state = tradingState$.replayState.get();
    if (state.isActive && state.isPlaying) {
      play();
    } else {
      stop();
    }
  });

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  const handleStart = useCallback((history: CandleType[]) => {
    // Reset chart to first candle only
    tradingActions.setChartData([history[0]]);
    tradingActions.startReplay();
  }, []);

  const handlePause = useCallback(() => {
    tradingActions.pauseReplay();
  }, []);

  const handleResume = useCallback(() => {
    tradingActions.resumeReplay();
  }, []);

  const handleStop = useCallback(() => {
    stop();
    tradingActions.stopReplay();
  }, [stop]);

  return { handleStart, handlePause, handleResume, handleStop };
}
