'use client';

import { useState, useCallback } from 'react';
import { tradingState$, tradingActions } from '../store';
import { OrderSide, OrderKind, PlaceOrderRequest, PlaceFutureOrderRequest } from '../types';
import { placeTradeOrder, placeFutureOrder } from '../services';
import { toast } from '@/components/ui/toast';

export function useOrderPanel() {
  // XAU-USDT-SWAP là symbol chính thức
  const symbol = 'XAU-USDT-SWAP';
  const [marketType, _setMarketType] = useState<'SPOT' | 'FUTURE'>('SPOT');
  const [leverage, setLeverage] = useState<number>(10);
  const [side, _setSide] = useState<OrderSide>('LONG');
  const [kind, setKind] = useState<OrderKind>('MARKET');

  const setMarketType = useCallback((type: 'SPOT' | 'FUTURE') => {
    _setMarketType(type);
    if (type === 'FUTURE' && kind === 'TP/SL') {
      setKind('MARKET');
    }
  }, [kind]);

  const setSide = useCallback((newSide: OrderSide) => {
    _setSide(newSide);
    if (newSide === 'LONG' && kind === 'TP/SL') {
      setKind('MARKET');
    }
  }, [kind]);
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('0.01');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const placeOrder = useCallback(async () => {
    const inputValue = parseFloat(quantity);
    if (isNaN(inputValue) || inputValue <= 0) {
      toast.error(marketType === 'SPOT' && side === 'LONG' ? 'Số tiền không hợp lệ' : 'Số lượng/Margin không hợp lệ');
      return;
    }

    const isBuy = side === 'LONG';
    const isLimit = kind === 'LIMIT';

    if (marketType === 'FUTURE') {
      const payload: PlaceFutureOrderRequest = {
        side: side,
        orderCategory: isLimit ? 'LIMIT' : 'MARKET',
        margin: inputValue,
        leverage: leverage,
        entryPrice: null,
        takeProfit: null,
        stopLoss: null,
      };

      if (isLimit) {
        const limitP = parseFloat(price);
        if (isNaN(limitP) || limitP <= 0) {
          toast.error('Giá Limit không hợp lệ');
          return;
        }
        payload.entryPrice = limitP;
      }

      if (takeProfit && takeProfit.trim() !== '') {
        const parsedTP = parseFloat(takeProfit);
        if (!isNaN(parsedTP)) payload.takeProfit = parsedTP;
      }

      if (stopLoss && stopLoss.trim() !== '') {
        const parsedSL = parseFloat(stopLoss);
        if (!isNaN(parsedSL)) payload.stopLoss = parsedSL;
      }

      try {
        setIsLoading(true);
        const res = await placeFutureOrder(payload);
        if (res && res.success) {
          toast.success(`Đã đặt lệnh Future ${payload.side} thành công`);
          // Fetch lần 1: để lệnh PENDING xuất hiện ngay trong danh sách
          setTimeout(() => {
            tradingActions.fetchAndSetOrders();
            tradingActions.refreshWalletData();
          }, 1000);
          // Fetch lần 2: bắt trường hợp lệnh LIMIT Future khớp ngay
          // và backend đã chuyển trạng thái PENDING → OPEN
          if (isLimit) {
            setTimeout(() => {
              tradingActions.fetchAndSetOrders();
            }, 3000);
            // Fetch lần 3: safety net nếu backend cần thêm thời gian
            setTimeout(() => {
              tradingActions.fetchAndSetOrders();
            }, 6000);
          }
        } else {
          toast.error(res?.message?.messageDetail || 'Đặt lệnh Future thất bại');
        }
      } catch (err: any) {
        toast.error(err?.message || 'Lỗi khi đặt lệnh Future');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const payload: PlaceOrderRequest = {
      type: isBuy ? 'BUY' : 'SELL',
      category: isLimit ? 'LIMIT' : 'MARKET',
      limitPrice: null,
      quantity: null,
      totalMoney: null,
      takeProfit: null,
      stopLoss: null,
    };

    // Construct request payload fields based on side and category
    if (isLimit) {
      const limitP = parseFloat(price);
      if (isNaN(limitP) || limitP <= 0) {
        toast.error('Giá Limit không hợp lệ');
        return;
      }
      payload.limitPrice = limitP;
    }

    if (isBuy) {
      // Đối với lệnh BUY: truyền totalMoney, quantity = null, không TP/SL
      payload.totalMoney = inputValue;
      payload.quantity = null;
      payload.takeProfit = null;
      payload.stopLoss = null;
    } else {
      // Đối với lệnh SELL: truyền quantity, totalMoney = null
      payload.quantity = inputValue;
      payload.totalMoney = null;

      // Cho lệnh SELL có thể truyền thêm TP/SL
      if (takeProfit && takeProfit.trim() !== '') {
        const parsedTP = parseFloat(takeProfit);
        if (!isNaN(parsedTP)) payload.takeProfit = parsedTP;
      }
      if (stopLoss && stopLoss.trim() !== '') {
        const parsedSL = parseFloat(stopLoss);
        if (!isNaN(parsedSL)) payload.stopLoss = parsedSL;
      }
      
      // Validation nhỏ nếu kind là TP/SL mà không điền gì
      if (kind === 'TP/SL' && payload.takeProfit === null && payload.stopLoss === null) {
        toast.error('Vui lòng nhập ít nhất Chốt lời hoặc Cắt lỗ');
        return;
      }
    }

    try {
      setIsLoading(true);
      const res = await placeTradeOrder(payload);
      if (res && res.success) {
        toast.success(`Đã đặt lệnh ${payload.type} thành công`);
        // Cho Backend chút thời gian để ổn định DB trước khi fetch lại danh sách
        setTimeout(() => {
          tradingActions.fetchAndSetOrders();
          tradingActions.refreshWalletData();
        }, 2000);
      } else {
        toast.error(res?.message?.messageDetail || 'Đặt lệnh thất bại');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi đặt lệnh');
    } finally {
      setIsLoading(false);
    }
  }, [marketType, side, kind, price, quantity, takeProfit, stopLoss, leverage]);

  return {
    marketType, setMarketType,
    leverage, setLeverage,
    side, setSide,
    kind, setKind,
    price, setPrice,
    quantity, setQuantity,
    takeProfit, setTakeProfit,
    stopLoss, setStopLoss,
    placeOrder,
    isLoading
  };
}
