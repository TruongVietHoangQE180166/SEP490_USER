'use client';

import { useMemo } from 'react';
import { tradingState$ } from '../store';
import { calculatePnL, closePosition } from '../services';
import { PositionType } from '../types';

export function usePositions() {
  const currentPrice = tradingState$.currentPrice.get();
  const openPositions = tradingState$.openPositions.get();

  const positionsWithPnL = useMemo(() => {
    return openPositions.map(pos => ({
      ...pos,
      ...calculatePnL(pos, currentPrice),
    }));
  }, [openPositions, currentPrice]);

  const totalPnL = useMemo(() => {
    return positionsWithPnL.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  }, [positionsWithPnL]);

  const handleClose = (position: PositionType) => {
    closePosition(position, currentPrice);
  };

  return {
    positionsWithPnL,
    totalPnL,
    currentPrice,
    handleClose,
  };
}
