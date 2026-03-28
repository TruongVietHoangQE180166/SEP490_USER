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
import { observer } from '@legendapp/state/react';
import { tradingState$ } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { CandleType, PositionType, Timeframe } from '../types';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface TradingChartProps {
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

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: '1s', value: '1s' },
  { label: '1m', value: '1m' },
  { label: '1h', value: '1h' },
  { label: '1D', value: '1d' },
  { label: '1M', value: '1month' },
];

export const TradingChart = observer(function TradingChart({ positions, currentPrice, timeframe = '1m', onTimeframeChange }: TradingChartProps & { onTimeframeChange?: (tf: Timeframe) => void }) {
  // Read chartData directly inside observer() — observer() auto-tracks this subscription
  const candles = tradingState$.chartData.get();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const priceLinesRef = useRef<Map<string, PositionLines>>(new Map());

  // State để hiển thị thông tin nến đang hover (OHLCV)
  const [hoveredCandle, setHoveredCandle] = useState<CandleType | null>(null);
  // Vị trí con trỏ + giá thực tế tại con trỏ (theo tỏa độ Y)
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; price: number } | null>(null);
  // Toggle hiển thị đường lệnh trên chart
  const [showPositions, setShowPositions] = useState(true);

  // Flag để cuộn chart đến cây nến mới nhất khi thay đổi timeframe
  const shouldScrollToLatest = useRef<boolean>(true);

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
        mode: 0, // Normal — horizontal line tracks exact cursor Y (shows price at any point)
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
        alignLabels: false, // Tắt tự động sắp xếp nhãn để đường nối bị chéo, nhãn luôn thẳng hàng với line (dù có đè lên nhau xíu)
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: timeframe === '1s',
        barSpacing: 10,
        rightOffset: 30,    // khoảng trống bên phải cây nến cuối
        fixLeftEdge: true,
        // fixRightEdge: false (bỏ để có thể cuộn vượt chậu nến mới nhất)
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false, // Set false to capture vertical drag on touch devices instead of scrolling the page
      },
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
        if (param.point) {
          // coordinateToPrice: lấy giá thực tế tại toạ độ Y của con trỏ (thay đổi khi kéo dọc)
          const price = candleSeries.coordinateToPrice(param.point.y) ?? 0;
          setHoverPoint({ x: param.point.x, y: param.point.y, price });
        }
      } else {
        setHoveredCandle(null);
        setHoverPoint(null);
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
    // Đánh dấu cần cuộn lại sau khi tải xong mẻ dữ liệu mới
    shouldScrollToLatest.current = true;
  }, [timeframe]);

  // ──────────────────────────────────────────────
  // Feed candle data
  // ──────────────────────────────────────────────
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!candleSeries || !volumeSeries) return;

    if (candles.length === 0) {
      candleSeries.setData([]);
      volumeSeries.setData([]);
      return;
    }

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
    
    if (shouldScrollToLatest.current) {
      // Temporarily enable autoScale to perfectly fit the incoming data height
      chartRef.current?.priceScale('right').applyOptions({ autoScale: true });
      
      // Dùng setTimeout nhỏ để đảm bảo Lightweight Charts đã render xong mẻ data mới
      setTimeout(() => {
        chartRef.current?.timeScale().scrollToRealTime();
        // Turn autoScale back off so user can freely drag the chart vertically
        chartRef.current?.priceScale('right').applyOptions({ autoScale: false });
      }, 50);
      shouldScrollToLatest.current = false;
    }
  }, [candles]);

  // ──────────────────────────────────────────────
  // Position price lines
  // ──────────────────────────────────────────────
  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series) return;

    // Clear and recreate so title stays fresh with latest PnL
    priceLinesRef.current.forEach(pl => {
      if (pl.entryLine) series.removePriceLine(pl.entryLine);
      if (pl.tpLine) series.removePriceLine(pl.tpLine);
      if (pl.slLine) series.removePriceLine(pl.slLine);
    });
    priceLinesRef.current.clear();

    // Don't recreate if toggled off
    if (!showPositions) return;

    positions.forEach(pos => {
      // Distinct colors: blue for LONG, purple for SHORT
      const sideColor = pos.side === 'LONG' ? '#3b82f6' : '#a855f7';

      // Create base prefix for identification: "LONG x20 @4976"
      const prefix = `${pos.side === 'LONG' ? 'LONG' : 'SHORT'}${pos.leverage ? ` x${pos.leverage}` : ''} @${pos.entryPrice}`;

      // Build main title: "LONG x20 +123.45$ (+5.67%)"
      const parts: string[] = [prefix];
      if (pos.unrealizedPnl !== undefined) {
        const sign = pos.unrealizedPnl >= 0 ? '+' : '';
        parts.push(`${sign}${pos.unrealizedPnl.toFixed(2)}$`);
        if (pos.pnlPercentage !== undefined) {
          const pctSign = pos.pnlPercentage >= 0 ? '+' : '';
          parts.push(`(${pctSign}${pos.pnlPercentage.toFixed(2)}%)`);
        }
      }

      const entryLine = series.createPriceLine({
        price: pos.entryPrice,
        color: sideColor,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: parts.join(' '),
      });

      const pl: PositionLines = { positionId: pos.id ?? '', entryLine };

      if (pos.takeProfit != null) {
        pl.tpLine = series.createPriceLine({
          price: pos.takeProfit,
          color: '#22d3ee',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: `${prefix} TP`,
        });
      }

      if (pos.stopLoss != null) {
        pl.slLine = series.createPriceLine({
          price: pos.stopLoss,
          color: '#f97316',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: `${prefix} SL`,
        });
      }

      priceLinesRef.current.set(pos.id ?? '', pl);
    });
  }, [positions, showPositions]);

  // Lấy nến hiện tại hoặc nến cuối cùng để hiển thị legend
  const currentCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);
  const isUp = currentCandle && currentCandle.close >= currentCandle.open;
  const isLoading = tradingState$.isChartLoading.get();

  return (
    <div className="relative w-full h-full group font-sans overflow-hidden flex flex-col bg-card">
      {/* Loading Overlay */}
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                Đang tải dữ liệu...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeframe Toolbar */}
      <div id="tut-chart-timeframes" className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-border/40 bg-muted/5 h-9 shrink-0 px-3">
         {TIMEFRAMES.map(t => (
           <button
             key={t.value}
             onClick={() => onTimeframeChange?.(t.value)}
             className={cn(
               "px-3 h-6 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
               timeframe === t.value 
                 ? "bg-primary text-primary-foreground shadow-sm"
                 : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
             )}
           >
             {t.label}
           </button>
         ))}
         <div className="h-4 w-px bg-border/40 mx-2" />
         {/* Toggle switch: Ẩn / Hiện lệnh */}
         <button
           onClick={() => setShowPositions(v => !v)}
           className="flex items-center gap-2 h-6 group select-none outline-none"
         >
           {/* Label */}
           <span className={cn(
             'text-[10px] font-black tracking-wide transition-all duration-300 whitespace-nowrap',
             showPositions ? 'text-primary' : 'text-muted-foreground/60'
           )}>
             {showPositions ? 'Ẩn lệnh' : 'Hiện lệnh'}
           </span>

           {/* Pill track */}
           <div className={cn(
             'relative w-10 h-[22px] rounded-full transition-all duration-300 flex-shrink-0',
             showPositions
               ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary)/0.4)]'
               : 'bg-muted-foreground/20'
           )}>
             {/* Thumb */}
             <div className={cn(
               'absolute top-[3px] w-4 h-4 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center shadow-md',
               showPositions
                 ? 'left-[22px] bg-white shadow-primary/30'
                 : 'left-[3px] bg-white/70'
             )}>
               {showPositions
                 ? <Eye className="w-2.5 h-2.5 text-primary" />
                 : <EyeOff className="w-2.5 h-2.5 text-muted-foreground" />
               }
             </div>
           </div>
         </button>
      </div>

      <div className="flex-1 relative min-h-0">
        {/* Legend: OHLCV Info - Moved slightly down to compensate for toolbar */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap items-center gap-2.5 text-[9px] pointer-events-none p-1.5 rounded bg-background/40 backdrop-blur-md border border-border/10 shadow-sm">
          {/* Symbol Name & Gold Dot */}
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span className="font-black text-foreground uppercase tracking-widest text-[10px]">XAUT/USDT</span>
          </div>

          <div className="h-3 w-px bg-border/20 mx-0.5" />

          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">O</span>
            <span className="font-mono font-bold text-foreground">
              {currentCandle ? currentCandle.open.toFixed(2) : '-'}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">H</span>
            <span className="font-mono font-bold text-foreground">
              {currentCandle ? currentCandle.high.toFixed(2) : '-'}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">L</span>
            <span className="font-mono font-bold text-foreground">
              {currentCandle ? currentCandle.low.toFixed(2) : '-'}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">C</span>
            <span className={cn('font-mono font-bold', isUp ? 'text-emerald-500' : 'text-rose-500')}>
              {currentCandle ? currentCandle.close.toFixed(2) : '-'}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground uppercase font-black opacity-50">Vol</span>
            <span className="font-mono font-bold text-foreground/80">
              {currentCandle ? currentCandle.volume.toFixed(0) : '-'}
            </span>
          </div>
        </div>

        {/* The Chart Container */}
        <div
          ref={containerRef}
          className="w-full h-full absolute inset-0"
        />
        
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.02] select-none">
          <span className="text-6xl font-black tracking-tighter uppercase transform -rotate-12 translate-y-[-10%]">
            XAUT / USDT
          </span>
        </div>

        {/* Pane Divider Hint */}
        <div className="absolute left-2.5 bottom-[18%] pointer-events-none z-10 opacity-30">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] select-none">Volume</span>
        </div>

        {/* Floating OHLCV tooltip khi hover cây nến */}
        <AnimatePresence>
          {hoveredCandle && hoverPoint && (() => {
            const c = hoveredCandle;
            const cp = hoverPoint.price;
            // Xác định giá nào trong OHLC gần con trỏ nhất
            const diffs = [
              { label: 'O', val: c.open },
              { label: 'H', val: c.high },
              { label: 'L', val: c.low },
              { label: 'C', val: c.close },
            ];
            const closest = diffs.reduce((a, b) =>
              Math.abs(a.val - cp) < Math.abs(b.val - cp) ? a : b
            );
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
                  transform: hoverPoint.x > 260 ? 'translateX(-110%)' : 'translateX(0)',
                }}
              >
                <div className="bg-background/95 backdrop-blur-md border border-border/40 rounded-lg shadow-xl overflow-hidden min-w-[148px]">
                  {/* Giá tại con trỏ (thay đổi khi kéo dọc) */}
                  <div className="px-3 py-1.5 bg-primary/10 border-b border-border/30 flex items-center justify-between gap-3">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Giá con trỏ</span>
                    <span className="text-[12px] font-mono font-black text-primary">{cp.toFixed(2)}</span>
                  </div>
                  {/* Thời gian */}
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                      {new Date((c.time as number) * 1000).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  {/* OHLCV rows */}
                  <div className="px-3 pb-2 flex flex-col gap-0.5 text-[11px] font-mono">
                    {[
                      { label: 'O', val: c.open, color: 'text-foreground' },
                      { label: 'H', val: c.high, color: 'text-emerald-500' },
                      { label: 'L', val: c.low,  color: 'text-rose-500' },
                      { label: 'C', val: c.close, color: c.close >= c.open ? 'text-emerald-500' : 'text-rose-500' },
                    ].map(row => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex justify-between gap-4 px-1 rounded transition-colors',
                          closest.label === row.label ? 'bg-primary/10' : ''
                        )}
                      >
                        <span className={cn('font-black', closest.label === row.label ? 'text-primary' : 'text-muted-foreground')}>
                          {row.label}
                        </span>
                        <span className={cn('font-bold', row.color)}>{row.val.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 px-1 border-t border-border/20 pt-0.5 mt-0.5">
                      <span className="font-black text-muted-foreground">Vol</span>
                      <span className="font-bold text-foreground/60">{c.volume.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
});
