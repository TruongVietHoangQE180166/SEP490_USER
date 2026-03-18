'use client';

import { useState, useCallback } from 'react';
import { tradingState$, tradingActions } from '../store';
import { OrderSide, OrderKind } from '../types';
import { executeMarketOrder, executeLimitOrder } from '../services';

export function useOrderPanel() {
  // XAUT/USDT là symbol duy nhất
  const symbol = 'XAUT/USDT';
  const [side, setSide] = useState<OrderSide>('LONG');
  const [kind, setKind] = useState<OrderKind>('MARKET');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('0.01');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const flashMessage = (setter: (v: string | null) => void, msg: string) => {
    setter(msg);
    setTimeout(() => setter(null), 3000);
  };

  const placeOrder = useCallback(() => {
    setError(null);
    setSuccess(null);
    const state = tradingState$.get();
    const qty = parseFloat(quantity);

    if (isNaN(qty) || qty <= 0) {
      flashMessage(setError, 'Số lượng không hợp lệ');
      return;
    }

    try {
      if (kind === 'MARKET') {
        executeMarketOrder({
          symbol,
          side,
          quantity: qty,
          currentPrice: state.currentPrice,
          balance: state.balance,
          takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
          stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        });
        flashMessage(setSuccess, `✓ Market ${side} ${qty} ${symbol} @ $${state.currentPrice.toFixed(2)}`);
      } else {
        const limitPrice = parseFloat(price);
        if (isNaN(limitPrice) || limitPrice <= 0) {
          flashMessage(setError, 'Giá limit không hợp lệ');
          return;
        }
        executeLimitOrder({
          symbol,
          side,
          quantity: qty,
          limitPrice,
          takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
          stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        });
        flashMessage(setSuccess, `✓ Limit ${side} ${qty} ${symbol} @ $${limitPrice.toFixed(2)} đặt thành công`);
      }
    } catch (err: any) {
      flashMessage(setError, err.message || 'Lỗi khi đặt lệnh');
    }
  }, [symbol, side, kind, price, quantity, takeProfit, stopLoss]);

  return {
    side, setSide,
    kind, setKind,
    price, setPrice,
    quantity, setQuantity,
    takeProfit, setTakeProfit,
    stopLoss, setStopLoss,
    placeOrder,
    error,
    success,
  };
}
