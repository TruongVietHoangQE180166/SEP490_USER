'use client';

import { useEffect, useRef, useState } from 'react';
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
import { CandleType, PositionType, Timeframe } from '../types';
import { cn } from '@/lib/utils';

interface TradingChartProps {
  candles: CandleType[];
  positions: PositionType[];
  currentPrice: number;
  timeframe?: Timeframe;
}

interface PositionLines {
  positionId: string;
  entryLine?: any;
  tpLine?: any;
  slLine?: any;
}

/** Trả về bộ màu theo light/dark cho chart */
function getChartColors(isDark: boolean) {
  return {
    bg: isDark ? '#131415' : '#ffffff',
    grid: isDark ? 'rgba(42, 46, 57, 0.15)' : 'rgba(240, 243, 250, 0.3)',
    text: isDark ? '#9ca3af' : '#374151',
    border: isDark ? 'rgba(42, 46, 57, 0.4)' : 'rgba(224, 227, 235, 0.4)',
    crosshair: isDark ? '#758696' : '#95a5a6',
    watermark: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  };
}

export function TradingChart({ candles, positions, currentPrice, timeframe = '1m' }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const priceLinesRef = useRef<Map<string, PositionLines>>(new Map());

  // State để hiển thị thông tin nến đang hover (OHLCV)
  const [hoveredCandle, setHoveredCandle] = useState<CandleType | null>(null);

  // ──────────────────────────────────────────────
  // Init chart
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    const colors = getChartColors(isDark);

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.bg },
        textColor: colors.text,
        fontSize: 11,
        fontFamily: "'Inter', var(--font-sans), sans-serif",
        panes: {
          separatorColor: colors.grid,
          enableResize: true,
        },
      },
      grid: {
        vertLines: { color: colors.grid, style: LineStyle.Solid },
        horzLines: { color: colors.grid, style: LineStyle.Solid },
      },
      crosshair: {
        mode: 1, // Magnet
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
        scaleMargins: { top: 0.1, bottom: 0.1 },
        visible: true,
        alignLabels: true,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: timeframe === '1s',
        barSpacing: 10,
        rightOffset: 12,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: true,
      handleScale: true,
    });

    // Pane 0 — Candlestick
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Pane 1 — Volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
    }, 1);

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.1, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries as ISeriesApi<'Candlestick'>;
    volumeSeriesRef.current = volumeSeries as ISeriesApi<'Histogram'>;

    // ── Subscribe to Crosshair Movement ──
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
      } else {
        setHoveredCandle(null);
      }
    });

    // Responsive resize
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    // Watch for theme changes
    const mo = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      const c = getChartColors(dark);
      chart.applyOptions({
        layout: { 
          background: { type: ColorType.Solid, color: c.bg }, 
          textColor: c.text,
          panes: { separatorColor: c.grid }
        },
        grid: { vertLines: { color: c.grid }, horzLines: { color: c.grid } },
        rightPriceScale: { borderColor: c.border },
        timeScale: { borderColor: c.border },
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

  // ──────────────────────────────────────────────
  // Handle timeframe options update
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      timeScale: {
        secondsVisible: timeframe === '1s',
      },
    });
  }, [timeframe]);

  // ──────────────────────────────────────────────
  // Feed candle data
  // ──────────────────────────────────────────────
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!candleSeries || !volumeSeries || candles.length === 0) return;

    const cdData = candles.map(c => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volData = candles.map(c => ({
      time: c.time as Time,
      value: c.volume,
      color: c.close >= c.open
        ? 'rgba(38, 166, 154, 0.4)'   // TradingView Cyan
        : 'rgba(239, 83, 80, 0.4)',    // TradingView Red
    }));

    candleSeries.setData(cdData);
    volumeSeries.setData(volData);
    
    // Smooth scroll to end
    // chartRef.current?.timeScale().scrollToPosition(0, true);
  }, [candles]);

  // ──────────────────────────────────────────────
  // Position price lines
  // ──────────────────────────────────────────────
  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series) return;

    const existingIds = new Set(priceLinesRef.current.keys());

    positions.forEach(pos => {
      existingIds.delete(pos.id);
      if (priceLinesRef.current.has(pos.id)) return;

      const sideColor = pos.side === 'LONG' ? '#26a69a' : '#ef5350';

      const entryLine = series.createPriceLine({
        price: pos.entryPrice,
        color: sideColor,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: pos.side === 'LONG' ? 'ENTRY LONG' : 'ENTRY SHORT',
      });

      const pl: PositionLines = { positionId: pos.id, entryLine };

      if (pos.takeProfit) {
        pl.tpLine = series.createPriceLine({
          price: pos.takeProfit,
          color: '#26a69a',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: 'TP',
        });
      }

      if (pos.stopLoss) {
        pl.slLine = series.createPriceLine({
          price: pos.stopLoss,
          color: '#ef5350',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: 'SL',
        });
      }

      priceLinesRef.current.set(pos.id, pl);
    });

    existingIds.forEach(id => {
      const pl = priceLinesRef.current.get(id);
      if (!pl) return;
      if (pl.entryLine) series.removePriceLine(pl.entryLine);
      if (pl.tpLine) series.removePriceLine(pl.tpLine);
      if (pl.slLine) series.removePriceLine(pl.slLine);
      priceLinesRef.current.delete(id);
    });
  }, [positions]);

  // Lấy nến hiện tại hoặc nến cuối cùng để hiển thị legend
  const currentCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);
  const isUp = currentCandle && currentCandle.close >= currentCandle.open;

  return (
    <div className="relative w-full h-full group font-sans overflow-hidden">
      {/* Legend: OHLCV Info */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-3 text-[10px] pointer-events-none p-1.5 rounded bg-background/30 backdrop-blur-sm border border-border/10">
        {/* Symbol Name & Gold Dot */}
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          <span className="font-black text-foreground uppercase tracking-widest text-[10.5px]">XAUT / USDT</span>
        </div>

        <div className="h-3 w-px bg-border/30 mx-0.5" />

        <div className="flex gap-1 items-center">
          <span className="text-muted-foreground uppercase font-bold tracking-tighter opacity-70">O</span>
          <span className="font-mono font-bold text-foreground">
            {currentCandle ? currentCandle.open.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-muted-foreground uppercase font-bold tracking-tighter opacity-70">H</span>
          <span className="font-mono font-bold text-foreground">
            {currentCandle ? currentCandle.high.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-muted-foreground uppercase font-bold tracking-tighter opacity-70">L</span>
          <span className="font-mono font-bold text-foreground">
            {currentCandle ? currentCandle.low.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-muted-foreground uppercase font-bold tracking-tighter opacity-70">C</span>
          <span className={cn('font-mono font-bold', isUp ? 'text-emerald-500' : 'text-rose-500')}>
            {currentCandle ? currentCandle.close.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-muted-foreground uppercase font-bold tracking-tighter opacity-70">Vol</span>
          <span className="font-mono font-bold text-foreground opacity-90">
            {currentCandle ? currentCandle.volume.toLocaleString('en-US') : '-'}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full"
      />
      
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] select-none">
        <span className="text-7xl font-black tracking-tighter uppercase transform -rotate-12 translate-y-[-10%]">
          XAUT / USDT
        </span>
      </div>

      {/* Pane divider label helper */}
      <div className="absolute left-3 bottom-[21%] md:bottom-[15%] pointer-events-none z-10">
          <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest select-none">Pane 1: Volume</span>
      </div>
    </div>
  );
}
