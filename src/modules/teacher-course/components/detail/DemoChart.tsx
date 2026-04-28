import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  LineStyle,
  Time,
  ColorType,
  MouseEventParams,
} from 'lightweight-charts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChartDemoCandle } from '../../types';

interface DemoChartProps {
  candles: ChartDemoCandle[];
  isLoading?: boolean;
  themeVariant?: 'default' | 'result';
  /** Unix ms timestamp of the current (last visible) candle before the order */
  closeTs?: number;
  /** Unix ms timestamp of the order closing date chosen by the user */
  orderTs?: number;
}

function getChartColors(isDark: boolean, themeVariant?: 'default' | 'result') {
  if (themeVariant === 'result') {
    return {
      bg: isDark ? '#022c22' : '#f0fdf4', // Very dark emerald or very light emerald
      grid: isDark ? 'rgba(52, 211, 153, 0.1)' : 'rgba(52, 211, 153, 0.2)',
      text: isDark ? '#a7f3d0' : '#065f46',
      border: isDark ? 'rgba(52, 211, 153, 0.3)' : 'rgba(52, 211, 153, 0.4)',
      crosshair: isDark ? '#6ee7b7' : '#10b981',
      watermark: isDark ? 'rgba(52, 211, 153, 0.05)' : 'rgba(16, 185, 129, 0.05)',
      upCandle: '#34d399',
      downCandle: '#fb7185',
    };
  }
  return {
    bg: isDark ? '#131415' : '#ffffff',
    grid: isDark ? 'rgba(42, 46, 57, 0.15)' : 'rgba(240, 243, 250, 0.3)',
    text: isDark ? '#9ca3af' : '#374151',
    border: isDark ? 'rgba(42, 46, 57, 0.4)' : 'rgba(224, 227, 235, 0.4)',
    crosshair: isDark ? '#758696' : '#95a5a6',
    watermark: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    upCandle: '#26a69a',
    downCandle: '#ef5350',
  };
}

export const DemoChart: React.FC<DemoChartProps> = ({ candles, isLoading, themeVariant = 'default', closeTs, orderTs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [hoveredCandle, setHoveredCandle] = useState<any | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; price: number } | null>(null);
  const [forecastLeft, setForecastLeft] = useState<number | null>(null);

  const shouldScrollToLatest = useRef<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    const colors = getChartColors(isDark, themeVariant);

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.bg },
        textColor: colors.text,
        fontSize: 11,
        fontFamily: "'Inter', var(--font-sans), sans-serif",
      },
      grid: {
        vertLines: { color: colors.grid, style: LineStyle.Solid },
        horzLines: { color: colors.grid, style: LineStyle.Solid },
      },
      crosshair: {
        mode: 0,
        vertLine: { 
          color: colors.crosshair, 
          width: 1, 
          style: LineStyle.Dashed,
          labelBackgroundColor: isDark ? '#2a2e39' : '#374151',
        },
        horzLine: { 
          color: colors.crosshair, 
          width: 1, 
          style: LineStyle.Dashed,
          labelBackgroundColor: isDark ? '#2a2e39' : '#374151',
        },
      },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: { top: 0.15, bottom: 0.1 },
        visible: true,
        alignLabels: false,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        barSpacing: 10,
        rightOffset: 10,
        fixLeftEdge: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: colors.upCandle,
      downColor: colors.downCandle,
      borderUpColor: colors.upCandle,
      borderDownColor: colors.downCandle,
      wickUpColor: colors.upCandle,
      wickDownColor: colors.downCandle,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
    }, 1);

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.1, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries as ISeriesApi<'Candlestick'>;
    volumeSeriesRef.current = volumeSeries as ISeriesApi<'Histogram'>;

    chart.subscribeCrosshairMove((param: MouseEventParams) => {
      if (!param.time || param.point === undefined || !param.seriesData) {
        setHoveredCandle(null);
        return;
      }
      
      const candleData = param.seriesData.get(candleSeries) as any;
      const volData = param.seriesData.get(volumeSeries) as any;
      
      if (candleData) {
        setHoveredCandle({
          time: param.time as number,
          open: candleData.open,
          high: candleData.high,
          low: candleData.low,
          close: candleData.close,
          volume: volData ? volData.value : 0,
        });
        if (param.point) {
          const price = candleSeries.coordinateToPrice(param.point.y) ?? 0;
          setHoverPoint({ x: param.point.x, y: param.point.y, price });
        }
      } else {
        setHoveredCandle(null);
        setHoverPoint(null);
      }
    });

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    const mo = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      const c = getChartColors(dark, themeVariant);
      chart.applyOptions({
        layout: { 
          background: { type: ColorType.Solid, color: c.bg }, 
          textColor: c.text,
        },
        grid: { vertLines: { color: c.grid }, horzLines: { color: c.grid } },
        rightPriceScale: { borderColor: c.border },
        timeScale: { borderColor: c.border },
        crosshair: {
          vertLine: { labelBackgroundColor: dark ? '#2a2e39' : '#374151' },
          horzLine: { labelBackgroundColor: dark ? '#2a2e39' : '#374151' },
        },
      });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      ro.disconnect();
      mo.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // ── Update forecast overlay position when closeTs / chart viewport changes ──────
  const updateForecastLeft = useCallback(() => {
    if (!chartRef.current || !closeTs) {
      setForecastLeft(null);
      return;
    }
    const tsInSeconds = Math.floor(closeTs / 1000) as Time;
    const x = chartRef.current.timeScale().timeToCoordinate(tsInSeconds);
    setForecastLeft(x !== null ? x : null);
  }, [closeTs]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    chart.timeScale().subscribeVisibleTimeRangeChange(updateForecastLeft);
    // Initial calculation after a short delay to ensure chart has laid out
    const t = setTimeout(updateForecastLeft, 120);
    return () => {
      chart.timeScale().unsubscribeVisibleTimeRangeChange(updateForecastLeft);
      clearTimeout(t);
    };
  }, [updateForecastLeft]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!candleSeries || !volumeSeries) return;

    if (!candles || candles.length === 0) {
      candleSeries.setData([]);
      volumeSeries.setData([]);
      return;
    }

    // sort from oldest to newest if they aren't sorted
    const sortedCandles = [...candles].sort((a, b) => a.openTime - b.openTime);

    const cdData = sortedCandles.map(c => ({
      _timeNum: Math.floor(c.openTime / 1000),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volData = sortedCandles.map(c => ({
      _timeNum: Math.floor(c.openTime / 1000),
      value: c.volume,
      color: c.close >= c.open
        ? 'rgba(38, 166, 154, 0.4)'
        : 'rgba(239, 83, 80, 0.4)',
    }));

    // Deduplicate data points based on time by filtering out exact same times
    const uniqueCdData: any[] = [];
    const uniqueVolData: any[] = [];
    let lastTime = -1;
    
    // sortedCandles was already sorted by openTime at line 194.
    for (let i = 0; i < cdData.length; i++) {
        let t = cdData[i]._timeNum;
        if (t <= lastTime) {
            t = lastTime + 1; // force strictly ascending if duplicates exist
        }
        lastTime = t;
        const finalTime = t as Time;
        uniqueCdData.push({ ...cdData[i], time: finalTime });
        uniqueVolData.push({ ...volData[i], time: finalTime });
    }

    candleSeries.setData(uniqueCdData);
    volumeSeries.setData(uniqueVolData);
    
    if (shouldScrollToLatest.current) {
      chartRef.current?.priceScale('right').applyOptions({ autoScale: true });
      setTimeout(() => {
        chartRef.current?.timeScale().scrollToRealTime();
        chartRef.current?.priceScale('right').applyOptions({ autoScale: false });
        // Recalculate forecast overlay after chart finishes scrolling
        updateForecastLeft();
      }, 80);
      shouldScrollToLatest.current = false;
    } else {
      // Still recalculate in case candles changed
      setTimeout(updateForecastLeft, 80);
    }
  }, [candles, updateForecastLeft]);

  const currentCandle = hoveredCandle || (candles?.length > 0 ? candles[candles.length - 1] : null);
  const isUp = currentCandle && currentCandle.close >= currentCandle.open;

  return (
    <div className="relative w-full h-full group font-sans overflow-hidden flex flex-col bg-card rounded-md">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative min-h-0 min-h-[300px]">
        {/* Forecast zone overlay — blue tint from closeTs to right edge */}
        {forecastLeft !== null && closeTs && (
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{
              left: Math.max(0, forecastLeft),
              right: 0,
              background: 'rgba(59, 130, 246, 0.18)',
              borderLeft: '2px solid rgba(59, 130, 246, 0.6)',
            }}
          />
        )}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap items-center gap-2.5 text-[9px] pointer-events-none p-1.5 rounded bg-background/80 backdrop-blur-md border border-border/10 shadow-sm">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="font-black text-foreground uppercase tracking-widest text-[10px]">Lịch sử Nến Demo</span>
          </div>
          <div className="h-3 w-px bg-border/20 mx-0.5" />
          {closeTs && orderTs && (
            <>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30">
                <div className="w-2 h-2 rounded-sm bg-blue-500" />
                <span className="font-black text-blue-500 text-[9px] uppercase tracking-wider">Vùng dự kiến</span>
              </div>
              <div className="h-3 w-px bg-border/20 mx-0.5" />
            </>
          )}
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">O</span>
            <span className="font-mono font-bold text-foreground">{currentCandle ? currentCandle.open.toFixed(2) : '-'}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">H</span>
            <span className="font-mono font-bold text-foreground">{currentCandle ? currentCandle.high.toFixed(2) : '-'}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">L</span>
            <span className="font-mono font-bold text-foreground">{currentCandle ? currentCandle.low.toFixed(2) : '-'}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">C</span>
            <span className={cn('font-mono font-bold', isUp ? 'text-emerald-500' : 'text-rose-500')}>{currentCandle ? currentCandle.close.toFixed(2) : '-'}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">Vol</span>
            <span className="font-mono font-bold text-foreground/80">{currentCandle?.volume ? currentCandle.volume.toFixed(0) : '-'}</span>
          </div>
        </div>

        <div ref={containerRef} className="w-full h-full absolute inset-0" />
        
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.02] select-none">
          <span className="text-6xl font-black tracking-tighter uppercase transform -rotate-12 translate-y-[-10%]">Demo Chart</span>
        </div>

        <AnimatePresence>
          {hoveredCandle && hoverPoint && (() => {
            const c = hoveredCandle;
            const cp = hoverPoint.price;
            const diffs = [
              { label: 'O', val: c.open },
              { label: 'H', val: c.high },
              { label: 'L', val: c.low },
              { label: 'C', val: c.close },
            ];
            const closest = diffs.reduce((a, b) => Math.abs(a.val - cp) < Math.abs(b.val - cp) ? a : b);
            return (
              <motion.div
                key="hover-tooltip"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.08 }}
                className="absolute z-30 pointer-events-none"
                style={{
                  left: hoverPoint.x + 16,
                  top: Math.max(4, hoverPoint.y - 60),
                  transform: hoverPoint.x > ((containerRef.current?.clientWidth || 500) - 200) ? 'translateX(-110%)' : 'translateX(0)',
                }}
              >
                <div className="bg-background/95 backdrop-blur-md border border-border/40 rounded-lg shadow-xl overflow-hidden min-w-[148px]">
                  <div className="px-3 py-1.5 bg-primary/10 border-b border-border/30 flex items-center justify-between gap-3">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Giá</span>
                    <span className="text-[12px] font-mono font-black text-primary">{cp.toFixed(2)}</span>
                  </div>
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                      {new Date((c.time as number) * 1000).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  <div className="px-3 pb-2 flex flex-col gap-0.5 text-[11px] font-mono">
                    {[
                      { label: 'O', val: c.open, color: 'text-foreground' },
                      { label: 'H', val: c.high, color: 'text-emerald-500' },
                      { label: 'L', val: c.low,  color: 'text-rose-500' },
                      { label: 'C', val: c.close, color: c.close >= c.open ? 'text-emerald-500' : 'text-rose-500' },
                    ].map(row => (
                      <div key={row.label} className={cn('flex justify-between gap-4 px-1 rounded transition-colors', closest.label === row.label ? 'bg-primary/10' : '')}>
                        <span className={cn('font-black', closest.label === row.label ? 'text-primary' : 'text-muted-foreground')}>{row.label}</span>
                        <span className={cn('font-bold', row.color)}>{row.val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
};
