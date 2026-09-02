import React, { useState, useEffect } from 'react';
import { ContrastMode } from '../types';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

interface LiveTradingTickerPillProps {
  contrastMode?: ContrastMode;
  onClick: () => void;
}

const TICKER_ITEMS = [
  { symbol: 'BTC', price: '$64,850', change: '+3.85%', isUp: true, isCrypto: true },
  { symbol: 'SOL', price: '$156.80', change: '+7.64% ⚡', isUp: true, isCrypto: true },
  { symbol: 'NVDA', price: '$128.45', change: '+3.92%', isUp: true, isCrypto: false },
  { symbol: 'RENDER', price: '$6.42', change: '+11.4% 🚀', isUp: true, isCrypto: true },
  { symbol: 'ETH', price: '$2,785.4', change: '+4.12%', isUp: true, isCrypto: true },
  { symbol: 'AAPL', price: '$224.80', change: '+0.97%', isUp: true, isCrypto: false },
  { symbol: 'TSLA', price: '$218.50', change: '-1.71%', isUp: false, isCrypto: false },
  { symbol: 'RELIANCE', price: '₹2,980.5', change: '+1.30%', isUp: true, isCrypto: false },
  { symbol: 'SUI', price: '$1.04', change: '+9.85% ⚡', isUp: true, isCrypto: true },
  { symbol: 'SPY', price: '$562.40', change: '+0.55%', isUp: true, isCrypto: false },
];

export const LiveTradingTickerPill: React.FC<LiveTradingTickerPillProps> = ({
  contrastMode = 'cosmic',
  onClick,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [flash, setFlash] = useState<boolean>(false);
  const isTrueBlack = contrastMode === 'true-black';

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  const current = TICKER_ITEMS[index];

  return (
    <button
      id="live-trading-ticker-pill"
      onClick={onClick}
      title="Open Live Trading & Stocks Research Hub"
      className={`group relative flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border text-xs font-mono select-none transition-all active:scale-95 shadow-md ${
        isTrueBlack
          ? 'bg-black border-cyan-500/40 text-white hover:border-cyan-400 hover:bg-neutral-900 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : 'bg-white/[0.04] hover:bg-white/[0.08] border-cyan-500/30 text-white hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
      }`}
    >
      <div className="flex items-center gap-1">
        <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-bold text-white tracking-wider">{current.symbol}</span>
      </div>

      <span className="text-white/80 font-medium">{current.price}</span>

      <span
        className={`flex items-center gap-0.5 font-bold ${
          current.isUp ? 'text-emerald-400' : 'text-red-400'
        } ${flash ? 'scale-110 transition-transform' : ''}`}
      >
        {current.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{current.change}</span>
      </span>

      <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
    </button>
  );
};
