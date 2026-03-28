'use client';

import { useState } from 'react';
import { observer } from '@legendapp/state/react';
import { tradingState$, tradingActions } from '../store';
import { cancelTradeOrder } from '../services';
import { cn } from '@/lib/utils';
import { OrderType, PositionType, ClosedPositionType } from '../types';
import { toast } from '@/components/ui/toast';
import { RefreshCcw } from 'lucide-react';
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

type DashboardTab = 'orders' | 'orderHistory' | 'positions' | 'positionHistory';

export const TradeDashboard = observer(function TradeDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('positions');
  const [isReloading, setIsReloading] = useState(false);

  const pendingOrders = tradingState$.pendingOrders.get();
  const orderHistory = tradingState$.orderHistory.get();
  const openPositions = tradingState$.openPositions.get();
  const closedPositions = tradingState$.closedPositions.get();
  const currentPrice = tradingState$.currentPrice.get();
  const ticker = tradingState$.marketTicker.get();
  const isUp = ticker.change24hPct >= 0;

  const tabs: { id: DashboardTab; label: string; count?: number }[] = [
    { id: 'positions', label: 'Vị thế mở', count: openPositions.length },
    { id: 'orders', label: 'Lệnh chờ khớp', count: pendingOrders.length },
    { id: 'orderHistory', label: 'Lịch sử lệnh' },
    { id: 'positionHistory', label: 'Lịch sử vị thế' },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-card rounded-md border border-border overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-border bg-muted/20 items-center justify-between">
        <div className="flex">
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
        {activeTab === 'positions' && <OpenPositionsTable positions={openPositions} currentPrice={currentPrice} />}
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

const OpenPositionsTable = observer(({ positions, currentPrice }: { positions: PositionType[], currentPrice: number }) => {
  if (positions.length === 0) return <EmptyState message="Không có vị thế mở" />;

  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Cặp giao dịch</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Loại</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá vào</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá hiện tại</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">PnL (ROE%)</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((pos) => {
          const pnl = pos.side === 'LONG' 
            ? (currentPrice - pos.entryPrice) * pos.quantity 
            : (pos.entryPrice - currentPrice) * pos.quantity;
          const roe = (pnl / (pos.entryPrice * pos.quantity)) * 100 * 10; // Giả định margin 10x
          const isProfit = pnl >= 0;

          return (
            <tr key={pos.id} className="border-b border-border/30 hover:bg-muted/5">
              <td className="px-4 py-4 font-bold">{pos.symbol}</td>
              <td className="px-4 py-4">
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-black', pos.side === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')}>
                  {pos.side}
                </span>
              </td>
              <td className="px-4 py-4 font-mono font-medium">${pos.entryPrice.toLocaleString()}</td>
              <td className="px-4 py-4 font-mono font-medium text-muted-foreground">${currentPrice.toLocaleString()}</td>
              <td className="px-4 py-4 font-mono">{pos.quantity}</td>
              <td className="px-4 py-4">
                <div className={cn('font-mono font-bold flex flex-col', isProfit ? 'text-emerald-500' : 'text-rose-500')}>
                  <span>{isProfit ? '+' : ''}{pnl.toFixed(2)} USDT</span>
                  <span className="text-[10px] opacity-70">({isProfit ? '+' : ''}{roe.toFixed(2)}%)</span>
                </div>
              </td>
              <td className="px-4 py-4 text-right">
                <button 
                  onClick={() => {
                    tradingActions.closePosition(pos.id, currentPrice);
                    toast.success('Đã đóng vị thế thành công');
                  }}
                  className="px-3 py-1 rounded bg-secondary text-[10px] font-black hover:bg-secondary/80 transition-colors uppercase"
                >
                  Đóng nhanh
                </button>
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
    <table className="w-full text-left text-xs">
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

const OrderHistoryTable = observer(({ orders }: { orders: OrderType[] }) => {
  if (orders.length === 0) return <EmptyState message="Lịch sử trống" />;

  return (
    <table className="w-full text-left text-xs">
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
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Thời gian đóng</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Cặp</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá vào/ra</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Lợi nhuận (PnL)</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((pos) => (
          <tr key={pos.id} className="border-b border-border/30 hover:bg-muted/5">
            <td className="px-4 py-4 text-muted-foreground font-mono">
              {new Date(pos.closedAt).toLocaleTimeString()}
            </td>
            <td className="px-4 py-4 font-bold">{pos.symbol}</td>
            <td className="px-4 py-4 leading-tight">
              <div className="flex flex-col font-mono">
                <span className="text-emerald-500 text-[10px] font-bold">In: ${pos.entryPrice.toLocaleString()}</span>
                <span className="text-rose-500 text-[10px] font-bold">Out: ${pos.exitPrice.toLocaleString()}</span>
              </div>
            </td>
            <td className="px-4 py-4 font-mono">{pos.quantity}</td>
            <td className="px-4 py-4">
              <span className={cn('font-mono font-black', pos.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
                {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)} USDT
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
