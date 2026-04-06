'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  RefreshCw,
  Loader2,
  History,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Activity,
  DollarSign,
  Hash,
  Clock,
  ChevronDown,
  ChevronUp,
  Minus,
  Target,
  ReceiptText,
} from 'lucide-react';
import { useAnswerDemoByChart } from '../hooks/useAnswerDemoByChart';
import { AnswerDemoByChartItem } from '../types';
import { cn } from '@/lib/utils';

interface AnswerDemoHistoryProps {
  chartId: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, decimals = 2) {
  return (n ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function pnlPercent(pnl: number, total: number) {
  if (!total) return '0.00';
  return ((pnl / total) * 100).toFixed(2);
}

// ── Stat Tile ─────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: 'blue' | 'emerald' | 'rose' | 'amber' | 'purple';
}) {
  const colors = {
    blue:    { bg: 'bg-blue-500/8',    border: 'border-blue-500/20',    icon: 'text-blue-400',    val: 'text-blue-300' },
    emerald: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/20', icon: 'text-emerald-400', val: 'text-emerald-300' },
    rose:    { bg: 'bg-rose-500/8',    border: 'border-rose-500/20',    icon: 'text-rose-400',    val: 'text-rose-300' },
    amber:   { bg: 'bg-amber-500/8',   border: 'border-amber-500/20',   icon: 'text-amber-400',   val: 'text-amber-300' },
    purple:  { bg: 'bg-purple-500/8',  border: 'border-purple-500/20',  icon: 'text-purple-400',  val: 'text-purple-300' },
  }[accent];

  return (
    <div className={cn('flex-1 min-w-[120px] rounded-2xl border p-3.5 flex flex-col gap-2', colors.bg, colors.border)}>
      <div className={cn('flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.12em]', colors.icon)}>
        <Icon size={11} />
        {label}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={cn('text-lg font-black font-mono leading-none', colors.val)}>{value}</span>
        {sub && <span className="text-[10px] text-muted-foreground/60 font-medium">{sub}</span>}
      </div>
    </div>
  );
}

// ── Order Type Badge ──────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: 'BUY' | 'SELL' | null }) {
  if (!type) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-muted/30 text-muted-foreground/50 border border-border/20">
      <Minus size={9} /> N/A
    </span>
  );
  const isBuy = type === 'BUY';
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border',
      isBuy
        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
        : 'bg-rose-500/15 text-rose-400 border-rose-500/25',
    )}>
      {isBuy ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      {type}
    </span>
  );
}

// ── PnL Badge ─────────────────────────────────────────────────────────────────

function PnlBadge({ pnl }: { pnl: number }) {
  const pos = pnl >= 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-sm font-black font-mono',
      pos ? 'text-emerald-400' : 'text-rose-400',
    )}>
      {pos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {pos ? '+' : ''}${fmt(pnl)}
    </span>
  );
}

// ── Table Row ─────────────────────────────────────────────────────────────────

function TradeRow({
  order,
  index,
  isEven,
}: {
  order: AnswerDemoByChartItem;
  index: number;
  isEven: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isBuy = order.orderType === 'BUY';
  const isPnlPos = (order.pnl ?? 0) >= 0;
  const priceDiff = order.closePrice - order.entryPrice;
  const priceDiffPct = order.entryPrice ? ((priceDiff / order.entryPrice) * 100).toFixed(2) : '0.00';

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.025, duration: 0.2 }}
        onClick={() => setExpanded(v => !v)}
        className={cn(
          'group cursor-pointer transition-colors',
          isEven ? 'bg-white/[0.02]' : 'bg-transparent',
          expanded ? 'bg-primary/5' : 'hover:bg-white/[0.04]',
        )}
      >
        {/* # */}
        <td className="px-4 py-3 text-[11px] font-black text-muted-foreground/40 w-8">
          {index + 1}
        </td>

        {/* Time */}
        <td className="px-3 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-foreground/80 whitespace-nowrap">
              {fmtDate(order.createdDate)}
            </span>
          </div>
        </td>

        {/* Type */}
        <td className="px-3 py-3">
          <TypeBadge type={order.orderType} />
        </td>

        {/* Entry → Close */}
        <td className="px-3 py-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[9px] text-muted-foreground/50 font-black">Vào</span>
              <span className="font-bold text-foreground/90">{fmt(order.entryPrice)}</span>
              <span className="text-muted-foreground/30 text-[10px]">→</span>
              <span className="text-[9px] text-muted-foreground/50 font-black">Ra</span>
              <span className={cn('font-bold', isPnlPos ? 'text-emerald-400' : 'text-rose-400')}>
                {fmt(order.closePrice)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn(
                'text-[10px] font-bold font-mono',
                priceDiff >= 0 ? 'text-emerald-500/70' : 'text-rose-500/70',
              )}>
                {priceDiff >= 0 ? '+' : ''}{fmt(priceDiff)} ({priceDiff >= 0 ? '+' : ''}{priceDiffPct}%)
              </span>
            </div>
          </div>
        </td>

        {/* Qty & Total */}
        <td className="px-3 py-3">
          <div className="flex flex-col gap-0.5 font-mono">
            <span className="text-xs font-bold text-foreground/80">{fmt(order.quantity, 4)}</span>
            <span className="text-[10px] text-muted-foreground/50">${fmt(order.totalMoney)}</span>
          </div>
        </td>

        {/* PnL */}
        <td className="px-3 py-3">
          <div className="flex flex-col gap-0.5">
            <PnlBadge pnl={order.pnl} />
            <span className="text-[10px] text-muted-foreground/50 font-mono font-medium">
              {pnlPercent(order.pnl, order.totalMoney)}%
            </span>
          </div>
        </td>

        {/* Wallet after */}
        <td className="px-3 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-black font-mono text-blue-300">${fmt(order.walletMoney)}</span>
            <span className={cn(
              'text-[10px] font-mono font-bold',
              (order.totalPnl ?? 0) >= 0 ? 'text-emerald-500/60' : 'text-rose-500/60',
            )}>
              ΣPnL {(order.totalPnl ?? 0) >= 0 ? '+' : ''}${fmt(order.totalPnl)}
            </span>
          </div>
        </td>

        {/* Expand toggle */}
        <td className="px-3 py-3 text-right">
          <span className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </td>
      </motion.tr>

      {/* Expanded candles row */}
      <AnimatePresence>
        {expanded && (
          <tr className="bg-primary/[0.03]">
            <td colSpan={8} className="px-0 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 border-t border-primary/10">
                  {order.candles && order.candles.length > 0 ? (
                    <>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">
                        Nến tại thời điểm lệnh ({order.candles.length} nến)
                      </p>
                      <div className="overflow-x-auto rounded-xl border border-border/20">
                        <table className="w-full text-[11px] font-mono">
                          <thead>
                            <tr className="bg-muted/40 text-muted-foreground/60">
                              {[
                                { k: 'Symbol', align: 'left' },
                                { k: 'Timeframe', align: 'left' },
                                { k: 'Open', align: 'right' },
                                { k: 'High ↑', align: 'right' },
                                { k: 'Low ↓', align: 'right' },
                                { k: 'Close', align: 'right' },
                                { k: 'Volume', align: 'right' },
                              ].map(({ k, align }) => (
                                <th
                                  key={k}
                                  className={cn(
                                    'px-3 py-2 font-black uppercase tracking-[0.1em] text-[9px]',
                                    align === 'left' ? 'text-left' : 'text-right',
                                  )}
                                >
                                  {k}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {order.candles.map((c, ci) => {
                              const up = c.close >= c.open;
                              return (
                                <tr
                                  key={c.id}
                                  className={cn(
                                    'border-t border-border/10 transition-colors hover:bg-muted/10',
                                    ci % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]',
                                  )}
                                >
                                  <td className="px-3 py-2 text-left font-bold text-foreground/80">
                                    {c.symbol}
                                  </td>
                                  <td className="px-3 py-2 text-left">
                                    <span className="bg-muted/40 rounded px-1.5 py-0.5 text-muted-foreground font-bold">
                                      {c.timeframe}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-right text-foreground/70">{fmt(c.open)}</td>
                                  <td className="px-3 py-2 text-right text-emerald-400 font-bold">{fmt(c.high)}</td>
                                  <td className="px-3 py-2 text-right text-rose-400 font-bold">{fmt(c.low)}</td>
                                  <td className={cn('px-3 py-2 text-right font-black', up ? 'text-emerald-400' : 'text-rose-400')}>
                                    {fmt(c.close)}
                                    <span className="ml-1 text-[9px] opacity-60">{up ? '▲' : '▼'}</span>
                                  </td>
                                  <td className="px-3 py-2 text-right text-muted-foreground/60">{fmt(c.volume, 0)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground/40 italic text-center py-2">Không có dữ liệu nến cho lệnh này.</p>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const AnswerDemoHistory: React.FC<AnswerDemoHistoryProps> = ({ chartId }) => {
  const { items, isLoading, error, refetch } = useAnswerDemoByChart(chartId);
  const [collapsed, setCollapsed] = useState(false);

  const stats = useMemo(() => {
    if (!items.length) return { walletMoney: 0, totalPnl: 0, wins: 0, losses: 0, winRate: 0, bestPnl: 0, worstPnl: 0 };
    const latest = items[0];
    const pnls = items.filter(i => i.orderType).map(i => i.pnl ?? 0);
    const wins = pnls.filter(p => p > 0).length;
    const losses = pnls.filter(p => p < 0).length;
    const total = wins + losses;
    return {
      walletMoney: latest.walletMoney,
      totalPnl: latest.totalPnl,
      wins,
      losses,
      winRate: total ? Math.round((wins / total) * 100) : 0,
      bestPnl: pnls.length ? Math.max(...pnls) : 0,
      worstPnl: pnls.length ? Math.min(...pnls) : 0,
    };
  }, [items]);

  const totalPnlPos = (stats.totalPnl ?? 0) >= 0;
  const ordersWithType = items.filter(i => i.orderType !== null);

  return (
    <div className="border-t-2 border-border/20 bg-background">

      {/* ── Section Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20 bg-muted/10">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
          <ReceiptText size={15} className="text-amber-400" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-black text-foreground">Lịch sử giao dịch demo</span>
          {items.length > 0 && (
            <span className="ml-2 text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
              {items.length} bản ghi
            </span>
          )}
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all disabled:opacity-30"
          title="Làm mới"
        >
          <RefreshCw size={13} className={cn(isLoading && 'animate-spin')} />
        </button>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all"
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >

            {/* ── Loading ───────────────────────────────────────────────────── */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2.5 py-14 text-muted-foreground text-xs font-medium">
                <Loader2 size={18} className="animate-spin text-amber-400" />
                <span>Đang tải lịch sử giao dịch...</span>
              </div>
            )}

            {/* ── Error ─────────────────────────────────────────────────────── */}
            {!isLoading && error && (
              <div className="mx-5 my-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-5 py-4 text-sm text-rose-400 font-medium flex items-center gap-3">
                <Activity size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* ── Empty ─────────────────────────────────────────────────────── */}
            {!isLoading && !error && items.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-muted-foreground/40">
                <BarChart2 size={36} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-sm font-bold">Chưa có giao dịch nào</p>
                  <p className="text-xs mt-1">Hãy bắt đầu thực hành trên biểu đồ phía trên</p>
                </div>
              </div>
            )}

            {/* ── Content ───────────────────────────────────────────────────── */}
            {!isLoading && !error && items.length > 0 && (
              <div>

                {/* Stat tiles row */}
                <div className="px-5 pt-4 pb-3 flex flex-wrap gap-3">
                  <StatTile
                    label="Số dư ví"
                    value={`$${fmt(stats.walletMoney)}`}
                    sub="Hiện tại"
                    icon={Wallet}
                    accent="blue"
                  />
                  <StatTile
                    label="Tổng PnL"
                    value={`${totalPnlPos ? '+' : ''}$${fmt(stats.totalPnl)}`}
                    sub={totalPnlPos ? 'Có lãi ▲' : 'Lỗ ▼'}
                    icon={totalPnlPos ? TrendingUp : TrendingDown}
                    accent={totalPnlPos ? 'emerald' : 'rose'}
                  />
                  <StatTile
                    label="Win rate"
                    value={`${stats.winRate}%`}
                    sub={`${stats.wins}W · ${stats.losses}L`}
                    icon={Target}
                    accent={stats.winRate >= 50 ? 'emerald' : 'rose'}
                  />
                  <StatTile
                    label="Lệnh tốt nhất"
                    value={`+$${fmt(stats.bestPnl)}`}
                    sub="PnL cao nhất"
                    icon={TrendingUp}
                    accent="emerald"
                  />
                  <StatTile
                    label="Lệnh tệ nhất"
                    value={`$${fmt(stats.worstPnl)}`}
                    sub="PnL thấp nhất"
                    icon={TrendingDown}
                    accent="rose"
                  />
                  <StatTile
                    label="Tổng lệnh"
                    value={String(ordersWithType.length)}
                    sub={`${items.length} bản ghi`}
                    icon={Hash}
                    accent="amber"
                  />
                </div>

                {/* Win-rate progress bar */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1.5">
                    <span className="text-emerald-500/70">Thắng · {stats.wins}</span>
                    <span>Tỉ lệ lệnh thắng</span>
                    <span className="text-rose-500/70">Thua · {stats.losses}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-rose-500/20 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.winRate}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="border-t border-border/20 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border/20 bg-muted/20">
                        {[
                          { label: '#',             w: 'w-8'    },
                          { label: 'Thời gian',     icon: Clock },
                          { label: 'Loại lệnh',     icon: DollarSign },
                          { label: 'Giá vào → Ra',  icon: Activity },
                          { label: 'Khối lượng',    icon: Hash },
                          { label: 'PnL',           icon: TrendingUp },
                          { label: 'Ví / Tổng PnL', icon: Wallet },
                          { label: '',              w: 'w-8' },
                        ].map((h, i) => (
                          <th
                            key={i}
                            className={cn(
                              'px-3 py-2.5 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground/50',
                              h.w,
                            )}
                          >
                            {h.icon ? (
                              <span className="flex items-center gap-1.5">
                                <h.icon size={10} />
                                {h.label}
                              </span>
                            ) : h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <TradeRow
                          key={item.id}
                          order={item}
                          index={i}
                          isEven={i % 2 === 0}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer note */}
                <div className="px-5 py-3 border-t border-border/10 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/40 font-medium">
                    Nhấn vào từng hàng để xem chi tiết nến · Dữ liệu được sắp xếp theo thời gian mới nhất
                  </span>
                  <span className="text-[10px] text-muted-foreground/40 font-mono">
                    {items.length} records
                  </span>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
