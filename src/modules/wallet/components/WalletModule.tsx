'use client';

import React from 'react';
import { observer } from '@legendapp/state/react';
import { useWallet } from '../hooks/useWallet';
import {
  WalletHero,
  WalletStats,
  TradeOrderHistory,
  WalletModuleSkeleton
} from './sections';
import { pct } from '../utils';

export const WalletModule = observer(function WalletModule() {
  const {
    walletInfo,
    assets,
    pnl,
    transactions,
    tradeOrders,
    isLoading,
    isPnlConnected,
    availableBalance,
    lockedBalance,
    xautValue,
    totalDisplayBalance,
  } = useWallet();

  if (isLoading && !walletInfo) return <WalletModuleSkeleton />;

  const xautAsset = assets.find((a) => a.assetSymbol === 'XAUT');
  const usdtPct = pct(availableBalance, totalDisplayBalance);
  const xautPct = pct(xautValue, totalDisplayBalance);
  const lockPct = pct(lockedBalance, totalDisplayBalance);

  return (
    <div className="flex flex-col gap-6">
      {/* ROW 1 — Hero balance + Stats strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <WalletHero
          walletInfo={walletInfo}
          pnl={pnl}
          totalDisplayBalance={totalDisplayBalance}
          isPnlConnected={isPnlConnected}
          usdtPct={usdtPct}
          xautPct={xautPct}
          lockPct={lockPct}
        />
        <WalletStats
          availableBalance={availableBalance}
          lockedBalance={lockedBalance}
          xautValue={xautValue}
          xautAsset={xautAsset}
          usdtPct={usdtPct}
          xautPct={xautPct}
          lockPct={lockPct}
        />
      </div>

      {/* ROW 3 — Trade Order history */}
      <TradeOrderHistory orders={tradeOrders} />
    </div>
  );
});
