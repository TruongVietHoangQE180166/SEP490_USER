'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  XCircle,
  TrendingUp,
  Tag,
  Target,
  ShieldAlert,
  ChevronDown,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TradeOrder } from '../../types';
import { fmt } from '../../utils';

import { FutureOrderType } from '@/modules/trading/types';

interface TradeOrderHistoryProps {
  tradeOrders: TradeOrder[];
  futureOrders?: FutureOrderType[];
}

const PAGE_SIZE = 10;

export const TradeOrderHistory: React.FC<TradeOrderHistoryProps> = ({ tradeOrders = [], futureOrders = [] }) => {
  const [activeTab, setActiveTab] = React.useState<'SPOT' | 'FUTURE'>('SPOT');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [filterStatus, setFilterStatus] = React.useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredOrders = React.useMemo(() => {
    if (activeTab === 'SPOT') {
      return tradeOrders.filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.status.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = filterType === 'ALL' || order.type === filterType;
        const matchesStatus =
          filterStatus === 'ALL' ||
          (filterStatus === 'COMPLETED' && (order.status === 'COMPLETED' || order.completed)) ||
          (filterStatus === 'PENDING' && order.status === 'PENDING') ||
          (filterStatus === 'CANCELLED' && order.status === 'CANCELLED');

        return matchesSearch && matchesType && matchesStatus;
      });
    } else {
      return futureOrders.filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.side.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.status.toLowerCase().includes(searchQuery.toLowerCase());

        // For future, map filterType 'BUY' to 'LONG', 'SELL' to 'SHORT' if needed
        const mappedType = filterType === 'BUY' ? 'LONG' : filterType === 'SELL' ? 'SHORT' : 'ALL';
        const matchesType = mappedType === 'ALL' || order.side === mappedType;
        const matchesStatus =
          filterStatus === 'ALL' ||
          (filterStatus === 'COMPLETED' && (order.status === 'COMPLETED' || order.status === 'CLOSED')) ||
          (filterStatus === 'PENDING' && order.status === 'OPEN') ||
          (filterStatus === 'CANCELLED' && order.status === 'CANCELLED');

        return matchesSearch && matchesType && matchesStatus;
      });
    }
  }, [tradeOrders, futureOrders, activeTab, searchQuery, filterType, filterStatus]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterStatus, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  const renderValue = (val: number | string | null | undefined, format?: boolean) => {
    if (val === null || val === undefined || val === 0)
      return <span className="text-muted-foreground/40 italic">Chưa có</span>;
    if (format && typeof val === 'number') return fmt(val);
    return val;
  };

  const typeOptions = [
    { label: 'Tất cả lệnh', value: 'ALL' },
    { label: activeTab === 'SPOT' ? 'Lệnh MUA' : 'Vị thế LONG', value: 'BUY' },
    { label: activeTab === 'SPOT' ? 'Lệnh BÁN' : 'Vị thế SHORT', value: 'SELL' },
  ];

  const statusOptions = [
    { label: 'Tất cả Trạng thái', value: 'ALL' },
    { label: activeTab === 'SPOT' ? 'Khớp lệnh' : 'Đã đóng (Closed)', value: 'COMPLETED' },
    { label: activeTab === 'SPOT' ? 'Đang chờ' : 'Đang mở (Open)', value: 'PENDING' },
    { label: 'Đã hủy/Lỗi', value: 'CANCELLED' },
  ];

  const currentTypeLabel = typeOptions.find(opt => opt.value === filterType)?.label;
  const currentStatusLabel = statusOptions.find(opt => opt.value === filterStatus)?.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl md:rounded-3xl bg-card border border-border/40 shadow-2xl overflow-hidden"
    >
      {/* Header and Tabs */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end border-b border-border/40 bg-muted/10">
        <div className="px-5 md:px-10 pt-6 md:pt-8 pb-2 md:pb-4 flex flex-col space-y-5 md:space-y-6 flex-1">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground italic flex items-center gap-2 md:gap-3">
              <TrendingUp size={18} className="text-amber-400" />
              Lịch sử giao dịch Vàng
            </h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium opacity-70">
              Chi tiết các lệnh Spot XAUT và Vị thế Future
            </p>
          </div>
          
          <div className="flex items-center gap-6 md:gap-8 -mb-px pt-2 border-b border-transparent">
             <button 
               onClick={() => setActiveTab('SPOT')} 
               className={cn("pb-3 text-xs md:text-sm font-black uppercase tracking-wider transition-all border-b-2", activeTab === 'SPOT' ? "border-amber-400 text-amber-400" : "border-transparent text-muted-foreground hover:text-foreground")}
             >
               Giao dịch Spot
             </button>
             <button 
               onClick={() => setActiveTab('FUTURE')} 
               className={cn("pb-3 text-xs md:text-sm font-black uppercase tracking-wider transition-all border-b-2", activeTab === 'FUTURE' ? "border-amber-400 text-amber-400" : "border-transparent text-muted-foreground hover:text-foreground")}
             >
               Lịch sử Future
             </button>
          </div>
        </div>

        <div className="px-5 md:px-10 py-5 lg:py-8 lg:bg-transparent flex flex-col md:flex-row items-center gap-3 md:gap-4 border-t lg:border-t-0 border-border/20">
          <div className="relative group w-full md:w-[320px]">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-amber-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 md:h-12 pl-11 md:pl-12 pr-4 bg-muted/40 border-none rounded-xl md:rounded-2xl focus-visible:ring-2 focus-visible:ring-amber-400/20 focus-visible:bg-background transition-all font-bold text-[11px] md:text-xs shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 md:h-12 flex-1 md:flex-none px-4 md:px-5 rounded-xl md:rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center justify-between md:justify-start gap-2 md:gap-3 transition-all">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
                    <div className="flex flex-col items-start gap-0">
                      <span className="text-[7px] md:text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Loại lệnh</span>
                      <span className="text-[10px] md:text-[11px] font-bold text-foreground leading-tight truncate max-w-[60px] md:max-w-none">{currentTypeLabel?.split(' ')[0]}...</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl">
                {typeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterType(option.value as any)}
                    className="rounded-xl h-10 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-amber-400/5 focus:text-amber-500"
                  >
                    <span className="font-bold text-xs">{option.label}</span>
                    {filterType === option.value && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 md:h-12 flex-1 md:flex-none px-4 md:px-5 rounded-xl md:rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center justify-between md:justify-start gap-2 md:gap-3 transition-all">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-amber-400" />
                    <div className="flex flex-col items-start gap-0">
                      <span className="text-[7px] md:text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Trạng thái</span>
                      <span className="text-[10px] md:text-[11px] font-bold text-foreground leading-tight truncate max-w-[60px] md:max-w-none">{currentStatusLabel?.split(' ')[0]}...</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterStatus(option.value as any)}
                    className="rounded-xl h-10 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-amber-400/5 focus:text-amber-500"
                  >
                    <span className="font-bold text-xs">{option.label}</span>
                    {filterStatus === option.value && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto no-scrollbar">
        {paginatedOrders.length > 0 ? (
          <>
            <table className="w-full text-left border-separate border-spacing-0 min-w-[700px] md:min-w-0">
              <thead>
                <tr className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-muted-foreground font-black bg-muted/5">
                  <th className="px-5 md:px-10 py-4 md:py-5 border-b border-border/40">Lệnh/Vị thế</th>
                  <th className="px-5 md:px-10 py-4 md:py-5 border-b border-border/40">Loại/Vào lệnh</th>
                  <th className="px-5 md:px-10 py-4 md:py-5 border-b border-border/40">Khối lượng</th>
                  <th className="px-5 md:px-10 py-4 md:py-5 border-b border-border/40">TP/SL</th>
                  <th className="px-5 md:px-10 py-4 md:py-5 border-b border-border/40 text-right">{activeTab === 'SPOT' ? 'Tổng' : 'Margin/PnL'}</th>
                  <th className="px-5 md:px-10 py-4 md:py-5 border-b border-border/40 text-center">Trực quan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <AnimatePresence mode="popLayout">
                  {paginatedOrders.map((itm, idx) => {
                    const id = activeTab === 'SPOT' ? (itm as TradeOrder).id : (itm as FutureOrderType).id;
                    const type = activeTab === 'SPOT' ? (itm as TradeOrder).type : (itm as FutureOrderType).side === 'LONG' ? 'BUY' : 'SELL';
                    const symbol = itm.symbol;
                    const createdDate = itm.createdDate;
                    const category = activeTab === 'SPOT' ? (itm as TradeOrder).category : (itm as FutureOrderType).orderCategory;
                    const quantity = itm.quantity;
                    const takeProfit = itm.takeProfit;
                    const stopLoss = itm.stopLoss;
                    const status = activeTab === 'SPOT' ? (itm as TradeOrder).status : (itm as FutureOrderType).status === 'CLOSED' ? 'COMPLETED' : itm.status === 'OPEN' ? 'PENDING' : 'CANCELLED';
                    const completed = activeTab === 'SPOT' ? (itm as TradeOrder).completed : itm.status === 'CLOSED';

                    return (
                  <motion.tr
                    key={id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 + 0.5 }}
                    className="hover:bg-amber-400/5 transition-colors group cursor-default"
                  >
                    <td className="px-5 md:px-10 py-5 md:py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <OrderIcon type={type} />
                        <div>
                          <span className={cn(
                            "text-[11px] md:text-xs font-black uppercase tracking-tighter block leading-tight group-hover:text-amber-500 transition-colors",
                            type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                          )}>
                            {(itm as any).side || type} {symbol}
                          </span>
                          <span className="text-[8px] md:text-[9px] text-muted-foreground/60 font-mono tracking-widest uppercase">
                            ID:{id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 md:px-10 py-5 md:py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Tag size={10} className="text-muted-foreground/40" />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-foreground/80">{category}</span>
                        </div>
                        <p className="text-[11px] md:text-xs font-bold text-foreground/90">
                          {activeTab === 'SPOT' ? (
                            category === 'LIMIT' ? (
                              <><span className="text-amber-400">${renderValue((itm as TradeOrder).limitPrice, true)}</span></>
                            ) : (
                              <span className="text-muted-foreground font-medium italic text-[10px]">Market</span>
                            )
                          ) : (
                            <><span className="text-amber-400">${renderValue((itm as FutureOrderType).entryPrice, true)}</span></>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 md:px-10 py-5 md:py-6">
                      <div className="space-y-0.5">
                        <p className="text-xs md:text-sm font-black text-foreground/80 tabular-nums">
                          {fmt(quantity, 4)} <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold italic">XAUT</span>
                        </p>
                        <p className="text-[9px] md:text-[10px] text-muted-foreground/50 font-mono italic">
                          {createdDate ? new Date(createdDate).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }) + ' ' + new Date(createdDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 md:px-10 py-5 md:py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <Target size={10} className="text-emerald-400/60" />
                          <span className="text-[9px] md:text-[10px] font-bold text-emerald-400/80 tracking-tighter uppercase whitespace-nowrap">{renderValue(takeProfit, true)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <ShieldAlert size={10} className="text-rose-400/60" />
                          <span className="text-[9px] md:text-[10px] font-bold text-rose-400/80 tracking-tighter uppercase whitespace-nowrap">{renderValue(stopLoss, true)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 md:px-10 py-5 md:py-6 whitespace-nowrap text-right">
                      {activeTab === 'SPOT' ? (
                        <div className="space-y-0.5">
                          <p className="text-sm md:text-base font-black font-mono tracking-tighter text-foreground italic">
                            ${renderValue((itm as TradeOrder).totalMoney, true)}
                          </p>
                          <span className="text-[9px] font-bold text-amber-400/60 font-mono italic block tracking-tighter">{renderValue((itm as TradeOrder).avgPrice, true)}</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-xs md:text-sm font-black font-mono tracking-tighter text-foreground italic">
                            M: <span className="text-amber-400">${renderValue((itm as FutureOrderType).margin, true)}</span>
                          </p>
                          <span className={cn("text-[9px] md:text-[10px] font-bold font-mono tracking-tighter block", ((itm as FutureOrderType).realizedPnl || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                             {((itm as FutureOrderType).realizedPnl || 0) >= 0 ? '+' : ''}{renderValue((itm as FutureOrderType).realizedPnl, true)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 md:px-10 py-5 md:py-6 text-center">
                      <StatusBadge status={status as any} completed={completed} />
                    </td>
                  </motion.tr>
                  );
                })}
                </AnimatePresence>
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-5 md:px-10 py-5 md:py-6 border-t border-border/10 bg-muted/5">
                <Pagination>
                  <PaginationContent className="gap-1 md:gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50 px-3 md:px-4" : "cursor-pointer px-3 md:px-4 hover:bg-amber-400/10 hover:text-amber-500"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (totalPages > 5) {
                        if (page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return <PaginationItem key={page} className="text-muted-foreground/30 font-black px-1">...</PaginationItem>;
                          }
                          return null;
                        }
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer font-bold text-[10px] md:text-sm h-8 w-8 md:h-10 md:w-10"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50 px-3 md:px-4" : "cursor-pointer px-3 md:px-4 hover:bg-amber-400/10 hover:text-amber-500"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 md:py-28 text-muted-foreground/20 italic">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 shadow-inner">
              <History size={32} strokeWidth={1} />
            </div>
            <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 italic text-center px-6">
              Không tìm thấy lệnh giao dịch nào
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

function OrderIcon({ type }: { type: 'BUY' | 'SELL' }) {
  if (type === 'BUY') {
    return (
      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
        <ArrowDownLeft className="text-emerald-400 w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0 shadow-inner group-hover:-rotate-12 transition-transform">
      <ArrowUpRight className="text-rose-400 w-5 h-5" />
    </div>
  );
}

function StatusBadge({ status, completed }: { status: TradeOrder['status']; completed: boolean }) {
  if (status === 'COMPLETED' || completed) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Khớp lệnh
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-400/20 shadow-sm">
        <Clock size={10} className="animate-spin-slow" /> Đang chờ
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-400/20 shadow-sm">
      <XCircle size={10} /> Đã hủy
    </span>
  );
}
