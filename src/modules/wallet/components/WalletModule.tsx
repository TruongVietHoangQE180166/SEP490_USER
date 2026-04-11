'use client';

import React from 'react';
import { observer } from '@legendapp/state/react';
import { useWallet } from '../hooks/useWallet';
import {
  WalletHero,
  WalletStats,
  TradeOrderHistory,
  WalletModuleSkeleton,
  PointExchangeBanner
} from './sections';
import { pct } from '../utils';

export const WalletModule = observer(function WalletModule() {
  const {
    walletInfo,
    pointDetail,
    assets,
    tradeOrders,
    isLoading,
    availableBalance,
    lockedBalance,
    totalDisplayBalance,
    totalEquity,
    dailyPnl,
    dailyPnlPercent,
    handleExchangePoints,
  } = useWallet();

  if (isLoading && !walletInfo) return <WalletModuleSkeleton />;

  const xautAsset = assets.find((a) => a.assetSymbol === 'XAUT');
  // xautValue = giá trị XAUT = totalEquity - USDT (hoặc dùng totalEquity trực tiếp)
  const xautValue = Math.max(0, totalEquity - availableBalance);
  const usdtPct = pct(availableBalance, totalDisplayBalance);
  const xautPct  = pct(xautValue, totalDisplayBalance);
  const lockPct  = pct(lockedBalance, totalDisplayBalance);
  // isPnlConnected: socket đang hoạt động nếu server đã đẩy > 0
  const isPnlConnected = totalEquity > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ROW 1 — Hero balance (full width) */}
      <WalletHero
        walletInfo={walletInfo}
        dailyPnl={dailyPnl}
        dailyPnlPercent={dailyPnlPercent}
        totalDisplayBalance={totalDisplayBalance}
        isPnlConnected={isPnlConnected}
        usdtPct={usdtPct}
        xautPct={xautPct}
        lockPct={lockPct}
      />

      {/* ROW 1.5 — Banner Hướng Dẫn Đổi Điểm (Nổi bật) */}
      <PointExchangeBanner
        pointDetail={pointDetail}
        availableBalance={availableBalance}
        onExchangePoints={handleExchangePoints}
      />

      {/* ROW 2 — 3 stat cards nằm ngang */}
      <WalletStats
        availableBalance={availableBalance}
        lockedBalance={lockedBalance}
        xautValue={xautValue}
        xautAsset={xautAsset}
        usdtPct={usdtPct}
        xautPct={xautPct}
        lockPct={lockPct}
      />

      {/* ROW 3 — Trade Order history */}
      <TradeOrderHistory orders={tradeOrders} />
    </div>
  );

});

