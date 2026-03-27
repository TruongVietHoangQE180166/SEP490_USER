'use client';

import { useMemo } from 'react';
import { tradingState$, tradingActions } from '../store';
import { calculatePnL } from '../services';
import { PositionType } from '../types';
import { toast } from '@/components/ui/toast';
import { useState } from 'react';

export function usePositions() {
  const currentPrice = tradingState$.currentPrice.get();
  const openPositions = tradingState$.openPositions.get();

  const positionsWithPnL = useMemo(() => {
    return openPositions.map(pos => {
      if (pos.unrealizedPnl !== undefined) {
        return {
          ...pos,
          unrealizedPnL: pos.unrealizedPnl, // Map to UI expected format if needed
          unrealizedPnLPercent: pos.pnlPercentage ?? 0,
          totalValue: pos.margin ? (pos.margin * (pos.leverage || 1)) : (pos.entryPrice * pos.quantity),
        };
      }
      return {
        ...pos,
        ...calculatePnL(pos, currentPrice),
      };
    });
  }, [openPositions, currentPrice]);

  const totalPnL = useMemo(() => {
    return positionsWithPnL.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  }, [positionsWithPnL]);

  const [closingId, setClosingId] = useState<string | null>(null);

  const handleClose = async (position: PositionType) => {
    if (!position.id) return;
    setClosingId(position.id);
    try {
      const res = await tradingActions.closePosition(position.id, currentPrice);
      if (res && res.success) {
        toast.success(res.message);
      } else {
        toast.error(res?.message || 'Đóng vị thế thất bại');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi đóng lệnh');
    } finally {
      setClosingId(null);
    }
  };

  return {
    positionsWithPnL,
    totalPnL,
    currentPrice,
    handleClose,
    closingId,
  };
}
