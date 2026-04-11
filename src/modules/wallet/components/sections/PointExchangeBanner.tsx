'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PointDetail } from '../../types';
import { toast } from '@/components/ui/toast';
import { fmt } from '../../utils';

interface PointExchangeBannerProps {
  pointDetail: PointDetail | null | undefined;
  availableBalance: number;
  onExchangePoints?: (amount: number) => Promise<boolean>;
}

export const PointExchangeBanner: React.FC<PointExchangeBannerProps> = ({
  pointDetail,
  availableBalance,
  onExchangePoints,
}) => {
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);

  const handleExchange = async () => {
    const amount = Number(exchangeAmount);
    if (!amount || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (amount > availableBalance) {
      toast.error('Số dư khả dụng không đủ. 1 USDT = 1 Point.');
      return;
    }
    
    setIsExchanging(true);
    if (onExchangePoints) {
      const success = await onExchangePoints(amount);
      if (success) {
        toast.success(`Đổi ${amount} USDT thành ${amount} Points thành công!`);
        setExchangeAmount('');
      } else {
        toast.error('Giao dịch đổi điểm thất bại.');
      }
    }
    setIsExchanging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: 'circOut', duration: 0.5 }}
      className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-background p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="text-indigo-500" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground">Điểm Thưởng: {pointDetail?.currentPoints ?? 0} PTS</h3>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Dùng USDT để quy đổi điểm thưởng. Tỷ lệ: <strong className="text-primary">1 USDT = 1 PTS</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex items-center bg-background border border-border/60 hover:border-indigo-500/50 rounded-xl overflow-hidden transition-colors shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 h-10 w-full md:w-56">
          <button 
            type="button"
            className="h-full px-3 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
            onClick={() => setExchangeAmount(prev => String(Math.max(0, Number(prev) - 1)))}
          >
            -
          </button>
          
          <Input
            type="number"
            placeholder="Số lượng"
            value={exchangeAmount}
            onChange={(e) => setExchangeAmount(e.target.value)}
            min={0}
            max={availableBalance}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0 text-center font-bold text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
          
          <button 
            type="button"
            className="h-full px-3 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
            onClick={() => setExchangeAmount(prev => String(Math.min(availableBalance, Number(prev) + 1)))}
          >
            +
          </button>
          
          <div className="h-4 w-px bg-border/60 mx-1" />
          
          <button
            type="button"
            onClick={() => setExchangeAmount(String(Math.floor(availableBalance)))}
            className="h-full px-3 text-[10px] font-black uppercase text-indigo-500 hover:bg-indigo-500/10 transition-colors tracking-wider"
          >
            Max
          </button>
        </div>
        
        <Button 
          onClick={handleExchange}
          disabled={isExchanging || !exchangeAmount || Number(exchangeAmount) <= 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 rounded-xl shrink-0 h-10 px-5 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
        >
          {isExchanging ? 'Đang quy đổi...' : (
            <>
              <ArrowRightLeft size={16} /> Đổi Ngay
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
