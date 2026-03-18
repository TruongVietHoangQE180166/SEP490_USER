'use client';

import { useState } from 'react';
import { observer } from '@legendapp/state/react';
import { tradingState$, tradingActions } from '../store';
import { cn } from '@/lib/utils';
import { OrderType, PositionType, ClosedPositionType } from '../types';

type DashboardTab = 'orders' | 'orderHistory' | 'positions' | 'positionHistory';

export const TradeDashboard = observer(function TradeDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('positions');

  const pendingOrders = tradingState$.pendingOrders.get();
  const orderHistory = tradingState$.orderHistory.get();
  const openPositions = tradingState$.openPositions.get();
  const closedPositions = tradingState$.closedPositions.get();
  const currentPrice = tradingState$.currentPrice.get();

  const tabs: { id: DashboardTab; label: string; count?: number }[] = [
    { id: 'positions', label: 'Vị thế mở', count: openPositions.length },
    { id: 'orders', label: 'Lệnh chờ khớp', count: pendingOrders.length },
    { id: 'orderHistory', label: 'Lịch sử lệnh' },
    { id: 'positionHistory', label: 'Lịch sử vị thế' },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-card rounded-md border border-border overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-border bg-muted/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 px-6 py-3 text-xs font-bold transition-all relative',
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

      {/* Tab Content */}
      <div className="flex-1 overflow-auto min-h-[200px]">
        {activeTab === 'positions' && <OpenPositionsTable positions={openPositions} currentPrice={currentPrice} />}
        {activeTab === 'orders' && <PendingOrdersTable orders={pendingOrders} />}
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

const PendingOrdersTable = observer(({ orders }: { orders: OrderType[] }) => {
  if (orders.length === 0) return <EmptyState message="Không có lệnh chờ" />;

  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="text-muted-foreground border-b border-border/50 bg-muted/5">
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Thời gian</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Cặp</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Loại</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Trạng thái</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter text-right">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-border/30 hover:bg-muted/5">
            <td className="px-4 py-4 text-muted-foreground font-mono">
              {new Date(order.createdAt).toLocaleTimeString()}
            </td>
            <td className="px-4 py-4 font-bold">{order.symbol}</td>
            <td className="px-4 py-4 text-[10px] font-black">
              <span className={order.side === 'LONG' ? 'text-emerald-500' : 'text-rose-500'}>{order.side}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span>{order.kind}</span>
            </td>
            <td className="px-4 py-4 font-mono">${order.price.toLocaleString()}</td>
            <td className="px-4 py-4 font-mono">{order.quantity}</td>
            <td className="px-4 py-4 font-bold text-amber-500 text-[10px] italic">PENDING</td>
            <td className="px-4 py-4 text-right">
              <button 
                onClick={() => tradingActions.cancelOrder(order.id)}
                className="text-rose-500 hover:text-rose-600 font-bold transition-colors uppercase text-[10px]"
              >
                Hủy lệnh
              </button>
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
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Giá khớp</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Số lượng</th>
          <th className="px-4 py-3 font-medium uppercase tracking-tighter">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-border/30 hover:bg-muted/5 opacity-80">
            <td className="px-4 py-4 text-muted-foreground font-mono">
              {order.filledAt ? new Date(order.filledAt).toLocaleTimeString() : '-'}
            </td>
            <td className="px-4 py-4 font-bold">{order.symbol}</td>
            <td className="px-4 py-4 text-[10px] font-black uppercase">
              <span className={order.side === 'LONG' ? 'text-emerald-500' : 'text-rose-500'}>{order.side}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span>{order.kind}</span>
            </td>
            <td className="px-4 py-4 font-mono">${order.filledPrice?.toLocaleString() || order.price.toLocaleString()}</td>
            <td className="px-4 py-4 font-mono">{order.quantity}</td>
            <td className="px-4 py-4">
              <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded', order.status === 'FILLED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground')}>
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
