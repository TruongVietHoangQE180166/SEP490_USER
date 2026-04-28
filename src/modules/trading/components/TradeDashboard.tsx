'use client';

import { useState } from 'react';
import { observer } from '@legendapp/state/react';
import { tradingState$, tradingActions } from '../store';
import { cancelTradeOrder } from '../services';
import { cn } from '@/lib/utils';
import { OrderType, PositionType, ClosedPositionType, FutureOrderType } from '../types';
import { toast } from '@/components/ui/toast';
import { RefreshCcw, X, Plus, Minus } from 'lucide-react';
import { useAddMargin } from '../hooks/useAddMargin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type DashboardTab = 'orders' | 'orderHistory' | 'positions' | 'positionHistory' | 'futureOrders';

export const TradeDashboard = observer(function TradeDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('positions');
  const [isReloading, setIsReloading] = useState(false);

  const pendingOrders = tradingState$.pendingOrders.get();
  const pendingFutureOrders = tradingState$.pendingFutureOrders.get();
  const orderHistory = tradingState$.orderHistory.get();
  const openPositions = tradingState$.openPositions.get();
  const closedPositions = tradingState$.closedPositions.get();
  const currentPrice = tradingState$.currentPrice.get();
  const ticker = tradingState$.marketTicker.get();
  const isUp = ticker.change24hPct >= 0;

  const tabs: { id: DashboardTab; label: string; count?: number }[] = [
    { id: 'positions', label: 'Vị thế mở', count: openPositions.length },
    { id: 'futureOrders', label: 'Lệnh chờ khớp Future', count: pendingFutureOrders.length },
    { id: 'orders', label: 'Lệnh chờ khớp Spot', count: pendingOrders.length },
    { id: 'orderHistory', label: 'Lịch sử lệnh' },
    { id: 'positionHistory', label: 'Lịch sử vị thế' },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-card rounded-md border border-border overflow-hidden">
      {/* Tab Header */}
      <div className="flex w-full border-b border-border bg-muted/20 items-center justify-between overflow-hidden">
        <div className="flex flex-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tut-dashboard-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 px-6 py-3 text-xs font-bold transition-all relative whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px]">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
        
        {/* Reload Button */}
        <button
          disabled={isReloading}
          onClick={async () => {
            if (isReloading) return;
            setIsReloading(true);
            try {
              await Promise.all([
                tradingActions.fetchAndSetOrders(),
                tradingActions.refreshWalletData()
              ]);
              toast.success('Dữ liệu đã được làm mới');
            } catch (error) {
              toast.error('Lỗi khi làm mới dữ liệu');
            } finally {
              setIsReloading(false);
            }
          }}
          className={cn(
            "mr-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex flex-shrink-0 items-center gap-1.5 group",
            isReloading && "opacity-50 pointer-events-none"
          )}
        >
          <RefreshCcw className={cn("w-4 h-4 transition-transform duration-300", isReloading ? "animate-spin" : "group-active:-rotate-180")} />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Làm mới</span>
        </button>
      </div>


      {/* Tab Content */}
      <div className="flex-1 overflow-auto min-h-[200px]">
        {activeTab === 'positions' && <OpenPositionsTable positions={openPositions} currentPrice={currentPrice} isUp={isUp} />}
        {activeTab === 'futureOrders' && <FuturePendingOrdersTable orders={pendingFutureOrders} currentPrice={currentPrice} isUp={isUp} />}
        {activeTab === 'orders' && <PendingOrdersTable orders={pendingOrders} currentPrice={currentPrice} isUp={isUp} />}
        {activeTab === 'orderHistory' && <OrderHistoryTable orders={orderHistory} />}
        {activeTab === 'positionHistory' && <ClosedPositionsTable positions={closedPositions} />}
      </div>
    </div>
  );
});

// ─── Sub-components for Tables ──────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground opacity-50">
      <svg viewBox="0 0 24 24" className="w-8 h-8 mb-3 fill-none stroke-current" strokeWidth="1.5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-xs uppercase tracking-widest font-bold">{message}</p>
    </div>
  );
}

const OpenPositionsTable = observer(({ positions, currentPrice, isUp }: { positions: PositionType[], currentPrice: number, isUp: boolean }) => {
  const [closingId, setClosingId] = useState<string | null>(null);

  const {
    addMarginPosId,
    setAddMarginPosId,
    addMarginAmount,
    setAddMarginAmount,
    isAddingMargin,
    handleAddMarginSubmit,
    toggleAddMargin
  } = useAddMargin();

  const handleClose = async (positionId: string, currentPrice: number) => {
    try {
      setClosingId(positionId);
      const res = await tradingActions.closePosition(positionId, currentPrice);
      if (res && res.success) {
        toast.success(res.message || 'Đã đóng vị thế thành công');
      } else {
        toast.error(res?.message || 'Đóng vị thế thất bại');
      }
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi đóng vị thế');
    } finally {
      setClosingId(null);
    }
  };

  if (positions.length === 0) return <EmptyState message="Không có vị thế mở" />;

  return (
    <table className="w-full text-left text-xs min-w-max whitespace-nowrap">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Cặp / Chiều</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Giá vào</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Giá thị trường</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Ký quỹ</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter text-orange-500/80">Giá thanh lý</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">PnL (ROE%)</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">TP / SL</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((pos, i) => {
          const isLong = pos.side === 'LONG';
          // Ưu tiên dữ liệu từ WS; nếu chưa có thì tính local
          const pnl = pos.unrealizedPnl ?? (
            isLong
              ? (currentPrice - pos.entryPrice) * pos.quantity
              : (pos.entryPrice - currentPrice) * pos.quantity
          );
          const pnlPct = pos.pnlPercentage ?? (
            pos.margin ? (pnl / pos.margin) * 100 : 0
          );
          const markPx = pos.markPrice || currentPrice;
          const isProfit = pnl >= 0;

          return (
            <tr key={pos.id ?? i} className="border-b border-border/30 hover:bg-muted/5 transition-colors">
              {/* Cặp / Chiều / Đòn bẩy */}
              <td className="px-3 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-foreground">{pos.symbol ?? 'XAUT'}/USDT</span>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-black',
                      isLong ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    )}>
                      {pos.side}
                    </span>
                    {pos.leverage && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-muted/40 text-muted-foreground">
                        x{pos.leverage}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Giá vào */}
              <td className="px-3 py-3 font-mono font-medium">
                ${pos.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>

              {/* Giá thị trường */}
              <td className={cn(
                'px-3 py-3 font-mono font-semibold',
                isUp ? 'text-emerald-500' : 'text-rose-500'
              )}>
                ${markPx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>

              {/* Số lượng */}
              <td className="px-3 py-3 font-mono">{pos.quantity} oz</td>

              {/* Ký quỹ */}
              <td className="px-3 py-3 font-mono whitespace-nowrap">
                {pos.margin != null
                  ? `$${pos.margin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : <span className="text-muted-foreground italic text-[10px]">Chưa có</span>
                }
              </td>

              {/* Giá thanh lý */}
              <td className="px-3 py-3 font-mono text-orange-500/90 whitespace-nowrap">
                {pos.liquidationPrice != null && pos.liquidationPrice >= 0
                  ? `$${pos.liquidationPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : <span className="text-muted-foreground italic text-[10px]">N/A</span>
                }
              </td>

              {/* PnL */}
              <td className="px-3 py-3">
                <div className={cn('font-mono font-bold flex flex-col', isProfit ? 'text-emerald-500' : 'text-rose-500')}>
                  <span>{isProfit ? '+' : ''}{pnl.toFixed(2)} $</span>
                  <span className="text-[10px] opacity-70">({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                </div>
              </td>

              {/* TP / SL */}
              <td className="px-3 py-3">
                <div className="flex flex-col gap-0.5 text-[10px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-emerald-500/70 w-5">TP</span>
                    {pos.takeProfit != null
                      ? <span className="font-bold text-emerald-500">
                          ${pos.takeProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      : <span className="text-muted-foreground/50 italic">Chưa có</span>
                    }
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-black text-rose-500/70 w-5">SL</span>
                    {pos.stopLoss != null
                      ? <span className="font-bold text-rose-500">
                          ${pos.stopLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      : <span className="text-muted-foreground/50 italic">Chưa có</span>
                    }
                  </div>
                </div>
              </td>

              {/* Hành động */}
              <td className="px-3 py-3 text-right">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3">
                    <AlertDialog open={addMarginPosId === pos.id} onOpenChange={(open) => {
                      if (!open) {
                        setAddMarginPosId(null);
                        setAddMarginAmount('');
                      }
                    }}>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => toggleAddMargin(pos.id ?? '')}
                          className="text-primary hover:text-primary/80 font-bold transition-colors uppercase text-[10px]"
                        >
                          Thêm KQ
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Thêm Ký Quỹ (USDT)</AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="flex flex-col gap-3 mt-4">
                              <p className="text-sm text-muted-foreground text-center">
                                Nạp thêm ký quỹ cho <span className="font-bold text-foreground">{pos.symbol} ({pos.side})</span>
                              </p>
                              <div className="flex w-full items-center bg-muted/20 border border-border rounded-lg overflow-hidden transition-all duration-200 focus-within:border-primary/50 focus-within:bg-background/50 h-12">
                                <button
                                  onClick={() => {
                                    const current = parseFloat(addMarginAmount) || 0;
                                    setAddMarginAmount(Math.max(0, current - 10).toString());
                                  }}
                                  className="px-4 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  value={addMarginAmount}
                                  onChange={(e) => setAddMarginAmount(e.target.value)}
                                  className="flex-1 bg-transparent text-center text-lg font-mono font-bold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0.00"
                                />
                                <button
                                  onClick={() => {
                                    const current = parseFloat(addMarginAmount) || 0;
                                    setAddMarginAmount((current + 10).toString());
                                  }}
                                  className="px-4 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.preventDefault(); // Giữ dialog mở để hiển thị loading nếu cần
                              handleAddMarginSubmit(pos.id ?? '');
                            }}
                            disabled={isAddingMargin || !addMarginAmount}
                          >
                            {isAddingMargin ? 'Đang xử lý...' : 'Xác nhận'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={closingId === pos.id}
                          className="text-rose-500 hover:text-rose-600 font-bold transition-colors uppercase text-[10px] disabled:opacity-50"
                        >
                          {closingId === pos.id ? 'Đang đóng...' : 'Đóng vị thế'}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận đóng vị thế</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn đóng vị thế {pos.symbol ?? 'XAUT'}/USDT ({pos.side}) ở giá thị trường không? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleClose(pos.id ?? '', currentPrice)}>
                            Xác nhận đóng
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

const formatValue = (val: number | string | null | undefined, prefix = '', suffix = '') => {
  if (val === null || val === undefined) return <span className="text-muted-foreground italic text-[10px]">Chưa có</span>;
  if (typeof val === 'number') return `${prefix}${val.toLocaleString()}${suffix}`;
  return `${prefix}${val}${suffix}`;
};

const PendingOrdersTable = observer(({ orders, currentPrice, isUp }: { orders: OrderType[], currentPrice: number, isUp: boolean }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (orders.length === 0) return <EmptyState message="Không có lệnh chờ" />;

  const handleCancel = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      const res = await cancelTradeOrder(orderId);
      if (res && res.success) {
        tradingActions.cancelOrder(orderId);
        tradingActions.fetchAndSetOrders();
        tradingActions.refreshWalletData();
        toast.success(res.message?.messageDetail || 'Đã hủy lệnh thành công');
      } else {
        toast.error('Hủy lệnh thất bại');
      }
    } catch (err: any) {
      toast.error('Lỗi khi hủy lệnh');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <table className="w-full text-left text-xs min-w-max whitespace-nowrap">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Thời gian</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Cặp</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Loại lệnh</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá Đặt</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá Hiện Tại</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">TP/SL</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Trạng thái</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-border/30 hover:bg-muted/5">
            <td className="px-4 py-4 text-muted-foreground font-mono">
              {new Date(order.createdDate).toLocaleTimeString()}
            </td>
            <td className="px-4 py-4 font-bold">{order.symbol}</td>
            <td className="px-4 py-4 text-[10px] font-black">
              <span className={order.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}>{order.type}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span>{order.category}</span>
            </td>
            <td className="px-4 py-4 font-mono font-bold text-[10px]">
              {formatValue(order.limitPrice, '$')}
            </td>
            <td className={cn(
              "px-4 py-4 font-mono text-[10px]",
              isUp ? "text-emerald-400" : "text-rose-400"
            )}>
              {formatValue(currentPrice, '$')}
            </td>
            <td className="px-4 py-4 font-mono">{order.quantity}</td>
            <td className="px-4 py-4 font-mono text-[10px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-emerald-500">TP: {formatValue(order.takeProfit)}</span>
                <span className="text-rose-500">SL: {formatValue(order.stopLoss)}</span>
              </div>
            </td>
            <td className="px-4 py-4 font-bold text-amber-500 text-[10px] italic">PENDING</td>
            <td className="px-4 py-4 text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    disabled={cancellingId === order.id}
                    className="text-rose-500 hover:text-rose-600 font-bold transition-colors uppercase text-[10px] disabled:opacity-50"
                  >
                    {cancellingId === order.id ? 'Đang hủy...' : 'Hủy lệnh'}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận hủy lệnh</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn hủy lệnh chờ này không? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Không</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancel(order.id)}>
                      Xác nhận hủy
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

const FuturePendingOrdersTable = observer(({ orders, currentPrice, isUp }: { orders: FutureOrderType[], currentPrice: number, isUp: boolean }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (orderId: string) => {
    try {
      const { cancelFutureOrder } = await import('../services');
      setCancellingId(orderId);
      const res = await cancelFutureOrder(orderId);
      if (res && res.success) {
        tradingActions.fetchAndSetOrders();
        tradingActions.refreshWalletData();
        toast.success(res.message?.messageDetail || 'Đã hủy lệnh Future thành công');
      } else {
        toast.error('Hủy lệnh Future thất bại');
      }
    } catch (err: any) {
      toast.error('Lỗi khi hủy lệnh Future');
    } finally {
      setCancellingId(null);
    }
  };

  if (orders.length === 0) return <EmptyState message="Không có lệnh Future chờ" />;

  return (
    <table className="w-full text-left text-xs min-w-max whitespace-nowrap">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Thời gian</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Cặp / Chiều / Loại</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Đòn bẩy / Ký quỹ</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Giá Đặt</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Giá Hiện Tại</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">TP / SL</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const isLong = order.side === 'LONG';
          return (
            <tr key={order.id} className="border-b border-border/30 hover:bg-muted/5 transition-colors">
              <td className="px-3 py-3 text-muted-foreground font-mono">
                {new Date(order.createdDate).toLocaleTimeString()}
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">{order.symbol}/USDT</span>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-black',
                      isLong ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    )}>
                      {order.side}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-muted text-muted-foreground opacity-70">
                      {order.orderCategory}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-mono leading-tight">
                <div className="flex flex-col">
                  <span className="font-bold">{order.leverage}x</span>
                  <span className="text-muted-foreground opacity-80">${order.margin?.toLocaleString()}</span>
                </div>
              </td>
              <td className="px-3 py-3 font-mono font-bold text-amber-500">
                ${order.entryPrice.toLocaleString()}
              </td>
              <td className={cn("px-3 py-3 font-mono", isUp ? "text-emerald-500" : "text-rose-500")}>
                ${currentPrice.toLocaleString()}
              </td>
              <td className="px-3 py-3 font-mono">{order.quantity} oz</td>
              <td className="px-3 py-3">
                <div className="flex flex-col gap-0.5 text-[9px] font-mono whitespace-nowrap opacity-70">
                  <span className="text-emerald-500">TP: {order.takeProfit ? `$${order.takeProfit}` : 'Chưa có'}</span>
                  <span className="text-rose-500">SL: {order.stopLoss ? `$${order.stopLoss}` : 'Chưa có'}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      disabled={cancellingId === order.id}
                      className="text-rose-500 hover:text-rose-600 font-bold transition-colors uppercase text-[10px] disabled:opacity-50"
                    >
                      {cancellingId === order.id ? 'Đang hủy...' : 'Hủy lệnh'}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận hủy lệnh Future</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn hủy lệnh {order.side} {order.symbol} ở giá {order.entryPrice} không?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Không</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleCancel(order.id)}>
                        Xác nhận hủy
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

const OrderHistoryTable = observer(({ orders }: { orders: OrderType[] }) => {
  if (orders.length === 0) return <EmptyState message="Lịch sử trống" />;

  return (
    <table className="w-full text-left text-xs min-w-max whitespace-nowrap">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Thời gian khớp</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Cặp</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Loại</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Limit Price</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Avg/Close Price</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">KHỚP/Tổng($)</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">TP/SL</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter text-right">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-border/30 hover:bg-muted/5 opacity-80">
            <td className="px-4 py-4 text-muted-foreground font-mono">
              {new Date(order.createdDate).toLocaleTimeString()}
            </td>
            <td className="px-4 py-4 font-bold">{order.symbol}</td>
            <td className="px-4 py-4 text-[10px] font-black uppercase">
              <span className={order.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}>{order.type}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span>{order.category}</span>
            </td>
            <td className="px-4 py-4 font-mono">{formatValue(order.limitPrice, '$')}</td>
            <td className="px-4 py-4 leading-tight">
              <div className="flex flex-col font-mono text-[10px]">
                <span className="text-muted-foreground">Avg: {formatValue(order.avgPrice, '$')}</span>
                <span className="font-bold">Close: {formatValue(order.closePrice, '$')}</span>
              </div>
            </td>
            <td className="px-4 py-4 leading-tight">
              <div className="flex flex-col font-mono text-[10px]">
                <span className="font-bold">SL: {order.quantity}</span>
                <span className="text-muted-foreground">Giá trị: {formatValue(order.totalMoney, '$')}</span>
              </div>
            </td>
            <td className="px-4 py-4 font-mono text-[10px] leading-tight">
              <div className="flex flex-col gap-0.5">
                <span className="text-emerald-500">TP: {formatValue(order.takeProfit)}</span>
                <span className="text-rose-500">SL: {formatValue(order.stopLoss)}</span>
              </div>
            </td>
            <td className="px-4 py-4 text-right">
              <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded', 
                order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 
                'bg-rose-500/10 text-rose-500'
              )}>
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

const ClosedPositionsTable = observer(({ positions }: { positions: ClosedPositionType[] }) => {
  if (positions.length === 0) return <EmptyState message="Lịch sử vị thế trống" />;

  return (
    <table className="w-full text-left text-xs min-w-max whitespace-nowrap">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Thời gian đóng</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Cặp / Chiều / Loại</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Trạng thái</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Đòn bẩy / Ký quỹ</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Giá vào / Giá đóng</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">Qty / Quy mô</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter text-orange-500/80">Giá thanh lý</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter">PnL (Thực tế)</th>
          <th className="px-3 py-3 font-medium uppercase tracking-tighter text-right">TP / SL</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((pos) => {
          const isLong = pos.side === 'LONG';
          const isProfit = (pos.pnl || 0) >= 0;
          
          return (
            <tr key={pos.id} className="border-b border-border/30 hover:bg-muted/5 transition-colors opacity-90">
              {/* Thời gian đóng */}
              <td className="px-3 py-3 text-muted-foreground font-mono">
                {new Date(pos.closedAt).toLocaleTimeString()}
                <span className="block text-[9px] opacity-60 font-sans">{new Date(pos.closedAt).toLocaleDateString()}</span>
              </td>

              {/* Cặp / Chiều / Loại */}
              <td className="px-3 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-foreground">{pos.symbol ?? 'XAUT'}/{pos.currency ?? 'USDT'}</span>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-black',
                      isLong ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    )}>
                      {pos.side}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-muted text-muted-foreground opacity-70">
                      {pos.orderCategory || 'MARKET'}
                    </span>
                  </div>
                </div>
              </td>

              {/* Trạng thái */}
              <td className="px-3 py-3">
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tight',
                  pos.status === 'CLOSED'     ? 'bg-primary/10 text-primary' :
                  pos.status === 'CANCELLED'  ? 'bg-zinc-500/15 text-zinc-400' :
                  pos.status === 'LIQUIDATED' ? 'bg-rose-500/15 text-rose-500' :
                  'bg-muted/30 text-muted-foreground'
                )}>
                  {pos.status}
                </span>
              </td>

              {/* Đòn bẩy / Ký quỹ */}
              <td className="px-3 py-3 font-mono leading-tight">
                <div className="flex flex-col">
                  <span className="text-foreground font-bold">{pos.leverage}x</span>
                  <span className="text-muted-foreground opacity-80">${pos.margin?.toLocaleString()}</span>
                </div>
              </td>

              {/* Giá vào / Giá đóng */}
              <td className="px-3 py-3 leading-tight">
                <div className="flex flex-col font-mono">
                  <span className="text-emerald-500/80 text-[10px] font-bold">In: ${pos.entryPrice.toLocaleString()}</span>
                  <span className={cn('text-[11px] font-black', isProfit ? 'text-emerald-500' : 'text-rose-500')}>
                    Out: ${pos.exitPrice.toLocaleString()}
                  </span>
                </div>
              </td>

              {/* Qty / Quy mô */}
              <td className="px-3 py-3 font-mono leading-tight">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{pos.quantity} oz</span>
                  <span className="text-[10px] text-muted-foreground font-medium opacity-70">Val: ${pos.positionValue?.toLocaleString()}</span>
                </div>
              </td>

              {/* Giá thanh lý */}
              <td className="px-3 py-3 font-mono text-orange-500/80 opacity-60">
                {pos.liquidationPrice != null && pos.liquidationPrice >= 0 ? `$${pos.liquidationPrice.toLocaleString()}` : <span className="italic text-muted-foreground/50">N/A</span>}
              </td>

              {/* PnL */}
              <td className="px-3 py-3 whitespace-nowrap">
                <span className={cn('font-mono font-black', isProfit ? 'text-emerald-500' : 'text-rose-500')}>
                  {isProfit ? '+' : ''}{pos.pnl?.toFixed(2)} USDT
                </span>
              </td>

              {/* TP / SL */}
              <td className="px-3 py-3 text-right whitespace-nowrap">
                <div className="flex flex-col gap-0.5 text-[9px] font-mono opacity-60">
                  <span className="text-emerald-500">TP: {pos.takeProfit != null ? `$${pos.takeProfit}` : 'Chưa có'}</span>
                  <span className="text-rose-500">SL: {pos.stopLoss != null ? `$${pos.stopLoss}` : 'Chưa có'}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
