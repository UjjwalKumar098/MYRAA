import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StockQuote,
  TradeProfitCalculation,
  TradingSignalAlert,
  UserPortfolioPosition,
  ContrastMode,
  AssetMarketCategory,
  MarketNewsArticle,
  NewsCategory,
} from '../types';
import {
  INITIAL_STOCKS,
  DEFAULT_TRADING_ALERTS,
  DEFAULT_USER_PORTFOLIO,
  calculateTradeProfitAndStrategy,
  findStockOrCrypto,
} from '../utils/tradingData';
import { INITIAL_MARKET_NEWS, getFilteredNews } from '../utils/marketNewsData';
import { CryptoTrackerView } from './CryptoTrackerView';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Sliders,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart2,
  PieChart,
  Percent,
  CheckCircle2,
  X,
  RefreshCw,
  BellRing,
  Layers,
  Zap,
  Target,
  ArrowRight,
  Flame,
  LineChart,
  Newspaper,
  Radio,
  ExternalLink,
  Coins,
} from 'lucide-react';

interface TradingHubModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialStockSymbol?: string;
  initialTab?: 'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news';
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
}

export const TradingHubModal: React.FC<TradingHubModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialStockSymbol = 'NVDA',
  initialTab = 'research',
  onClose,
  onLogVoiceCommand,
}) => {
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialStockSymbol);
  const [activeTab, setActiveTab] = useState<'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news'>(initialTab);

  const [selectedCategory, setSelectedCategory] = useState<AssetMarketCategory | 'all'>('all');
  const [newsCategory, setNewsCategory] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1M' | '1Y'>('1D');
  const [chartMode, setChartMode] = useState<'line' | 'candlestick'>('line');
  const [portfolio, setPortfolio] = useState<UserPortfolioPosition[]>(DEFAULT_USER_PORTFOLIO);
  const [alerts, setAlerts] = useState<TradingSignalAlert[]>(DEFAULT_TRADING_ALERTS);
  const [marketNews, setMarketNews] = useState<MarketNewsArticle[]>(INITIAL_MARKET_NEWS);

  // Profit Calculator state
  const [calcBuyPrice, setCalcBuyPrice] = useState<number>(115.0);
  const [calcQuantity, setCalcQuantity] = useState<number>(25);
  const [calcTargetPrice, setCalcTargetPrice] = useState<number>(148.0);
  const [calcStopLoss, setCalcStopLoss] = useState<number>(118.5);

  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const isTrueBlack = contrastMode === 'true-black';

  // Find active stock
  const activeStock = useMemo(() => {
    return stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];
  }, [stocks, selectedSymbol]);

  // Sync calculator defaults when active stock changes
  useEffect(() => {
    if (activeStock) {
      setCalcBuyPrice(parseFloat((activeStock.price * 0.92).toFixed(2)));
      setCalcTargetPrice(activeStock.targetPrice);
      setCalcStopLoss(activeStock.stopLoss);
    }
  }, [activeStock.symbol]);

  // Handle external symbol request
  useEffect(() => {
    if (initialStockSymbol) {
      setSelectedSymbol(initialStockSymbol);
    }
  }, [initialStockSymbol]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Live price tick simulation (real-time fluctuations)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Slight micro tick -0.15% to +0.18%
          const tickDeltaPercent = (Math.random() - 0.47) * 0.3;
          const tickChange = (stock.price * tickDeltaPercent) / 100;
          const newPrice = Math.max(1, parseFloat((stock.price + tickChange).toFixed(2)));
          const totalChange = parseFloat((stock.change + tickChange).toFixed(2));
          const totalChangePercent = parseFloat(((totalChange / (stock.price - stock.change)) * 100).toFixed(2));

          return {
            ...stock,
            price: newPrice,
            change: totalChange,
            changePercent: totalChangePercent,
            dayHigh: Math.max(stock.dayHigh, newPrice),
            dayLow: Math.min(stock.dayLow, newPrice),
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Filtered stocks list
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchCat = selectedCategory === 'all' || stock.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stocks, selectedCategory, searchQuery]);

  // Profit calculation object
  const profitCalcResult: TradeProfitCalculation = useMemo(() => {
    return calculateTradeProfitAndStrategy(
      activeStock,
      calcBuyPrice,
      calcQuantity,
      calcTargetPrice,
      calcStopLoss
    );
  }, [activeStock, calcBuyPrice, calcQuantity, calcTargetPrice, calcStopLoss]);

  // Total Portfolio Metrics
  const portfolioMetrics = useMemo(() => {
    let totalInvested = 0;
    let totalCurrent = 0;
    portfolio.forEach((pos) => {
      const currentStock = stocks.find((s) => s.symbol === pos.symbol);
      const curPrice = currentStock ? currentStock.price : pos.currentPrice;
      const cost = pos.buyPrice * pos.shares;
      const val = curPrice * pos.shares;
      totalInvested += cost;
      totalCurrent += val;
    });
    const totalPnL = totalCurrent - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return {
      totalInvested: totalInvested.toFixed(2),
      totalCurrent: totalCurrent.toFixed(2),
      totalPnL: totalPnL.toFixed(2),
      totalPnLPercent: totalPnLPercent.toFixed(2),
      isProfit: totalPnL >= 0,
    };
  }, [portfolio, stocks]);

  const handleStockSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = findStockOrCrypto(searchQuery.trim(), stocks);
    setSelectedSymbol(match.symbol);
    setActiveTab('research');
    onLogVoiceCommand?.(
      `Research Stock: ${match.symbol}`,
      'trading',
      `Loaded in-depth research for ${match.name} (${match.currency}${match.price})`,
      'quick_prompt'
    );
  };

  const handleApplySignalToCalculator = (alert: TradingSignalAlert) => {
    setSelectedSymbol(alert.symbol);
    setCalcTargetPrice(alert.targetPrice);
    setCalcStopLoss(alert.stopLoss);
    setActiveTab('calculator');
    setCopiedNotice(`Signal for ${alert.symbol} loaded into Profit Calculator & Exit Advisor`);
    setTimeout(() => setCopiedNotice(null), 3500);
  };

  if (!isOpen) return null;

  // Chart data selection
  const chartData =
    chartTimeframe === '1D'
      ? activeStock.history1D
      : chartTimeframe === '1M'
      ? activeStock.history1M
      : activeStock.history1Y;

  const minPrice = Math.min(...chartData.map((d) => d.low)) * 0.99;
  const maxPrice = Math.max(...chartData.map((d) => d.high)) * 1.01;
  const priceRange = Math.max(1, maxPrice - minPrice);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className={`w-full max-w-6xl max-h-[94vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all ${
            isTrueBlack
              ? 'bg-black border-white/30 shadow-[0_0_70px_rgba(255,255,255,0.1)] text-white'
              : 'bg-[#060c14] border-cyan-500/25 shadow-[0_0_80px_rgba(6,182,212,0.18)] text-white'
          }`}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <BarChart2 className="w-5 h-5 text-black font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold tracking-wide">
                    Trading & Stocks Intelligence Terminal
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-emerald-400 animate-pulse" />
                    Live Market Updates & Sell Advisor
                  </span>
                </div>
                <p className="text-xs text-white/50 hidden sm:block">
                  AI-driven stock research, real-time buy/sell indicators, profit taking simulator & exit strategies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-white/50">Market Status:</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync Active
                </span>
              </div>
              <button
                onClick={onClose}
                title="Close Trading Terminal"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Header Navigation Tabs */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-white/5 bg-black/40 text-xs overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('research')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'research'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Deep Stock Research ({selectedSymbol})</span>
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Profit Calculator & Sell Advisor</span>
              </button>

              <button
                onClick={() => setActiveTab('market')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'market'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Market Watchlist ({stocks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('signals')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'signals'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>AI Trade Signals ({alerts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'portfolio'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Stock Positions ({portfolio.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('crypto')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'crypto'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-md'
                    : 'text-amber-300/80 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Crypto & Price Spikes</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'news'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Market & Business News ({marketNews.length})</span>
              </button>
            </div>

            {/* Quick Active Ticker Snapshot */}
            <div className="flex items-center gap-2 pl-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono font-bold">
                <span>{activeStock.symbol}</span>
                <span>
                  {activeStock.currency}
                  {activeStock.price.toFixed(2)}
                </span>
                <span className={activeStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {activeStock.change >= 0 ? '+' : ''}
                  {activeStock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Main Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Notice Toast */}
            {copiedNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{copiedNotice}</span>
                </div>
              </motion.div>
            )}

            {/* TAB 1: DEEP TECHNICAL & FUNDAMENTAL RESEARCH */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                {/* Search Bar & Quick Tickers Strip */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <form onSubmit={handleStockSearch} className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search symbol or company (e.g. NVDA, Apple, Tesla, Reliance, Bitcoin)..."
                      className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.08] transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-md transition-all"
                    >
                      Analyze
                    </button>
                  </form>

                  {/* Quick Select Symbols */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                    {['NVDA', 'AAPL', 'TSLA', 'MSFT', 'BTC-USD', 'RELIANCE', 'TATAMOTORS'].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setSelectedSymbol(sym)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                          selectedSymbol === sym
                            ? 'bg-cyan-500 text-black shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Overview Header HUD */}
                <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-6 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-black text-white tracking-wide">
                        {activeStock.symbol}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-xs font-mono">
                        {activeStock.exchange}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          activeStock.recommendation === 'STRONG_BUY'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : activeStock.recommendation === 'BUY'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : activeStock.recommendation === 'TAKE_PROFIT' || activeStock.recommendation === 'SELL'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {activeStock.recommendation.replace('_', ' ')} ({activeStock.confidence}% Conf.)
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white/80">{activeStock.name}</h3>

                    <div className="flex items-baseline gap-3 pt-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                        {activeStock.currency}
                        {activeStock.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-bold font-mono flex items-center gap-0.5 ${
                          activeStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {activeStock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {activeStock.change >= 0 ? '+' : ''}
                        {activeStock.change.toFixed(2)} ({activeStock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Target Price & Risk Assessment */}
                  <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                      <span className="text-white/40 block text-[10px]">Analyst Target</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">
                        {activeStock.currency}
                        {activeStock.targetPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-400/80 block">
                        +
                        {(
                          ((activeStock.targetPrice - activeStock.price) / activeStock.price) *
                          100
                        ).toFixed(1)}
                        % Upside
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                      <span className="text-white/40 block text-[10px]">Stop-Loss (Risk)</span>
                      <span className="font-bold text-red-400 font-mono text-sm">
                        {activeStock.currency}
                        {activeStock.stopLoss.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-red-400/80 block">
                        {(
                          ((activeStock.stopLoss - activeStock.price) / activeStock.price) *
                          100
                        ).toFixed(1)}
                        % Limit
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                      <span className="text-white/40 block text-[10px]">14-Day RSI</span>
                      <span
                        className={`font-bold font-mono text-sm ${
                          activeStock.rsi >= 70
                            ? 'text-amber-400'
                            : activeStock.rsi <= 30
                            ? 'text-emerald-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {activeStock.rsi.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-white/50 block">
                        {activeStock.rsi >= 70 ? 'Overbought' : activeStock.rsi <= 30 ? 'Oversold' : 'Neutral'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                      <span className="text-white/40 block text-[10px]">Market Cap</span>
                      <span className="font-bold text-white font-mono text-sm">{activeStock.marketCap}</span>
                      <span className="text-[10px] text-white/50 block">Vol: {activeStock.volume}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Chart Visualizer */}
                <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Price Action & Technical Levels: {activeStock.symbol}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mode toggle */}
                      <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10 text-xs">
                        <button
                          onClick={() => setChartMode('line')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            chartMode === 'line' ? 'bg-cyan-500 text-black font-bold' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Area
                        </button>
                        <button
                          onClick={() => setChartMode('candlestick')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            chartMode === 'candlestick'
                              ? 'bg-cyan-500 text-black font-bold'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Candles
                        </button>
                      </div>

                      {/* Timeframe selector */}
                      <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10 text-xs">
                        {(['1D', '1M', '1Y'] as const).map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setChartTimeframe(tf)}
                            className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                              chartTimeframe === tf
                                ? 'bg-white/20 text-white shadow-sm'
                                : 'text-white/50 hover:text-white'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="relative h-[220px] sm:h-[260px] w-full bg-black/50 rounded-2xl p-4 overflow-hidden border border-white/5">
                    {/* Support and Resistance horizontal guide lines */}
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-emerald-500/40 z-10 flex justify-between px-3 text-[10px] text-emerald-400 font-mono"
                      style={{
                        top: `${Math.max(
                          5,
                          Math.min(95, 100 - ((activeStock.targetPrice - minPrice) / priceRange) * 100))}%`,
                      }}
                    >
                      <span>Target: {activeStock.currency}{activeStock.targetPrice}</span>
                      <span>Exit Zone</span>
                    </div>

                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-red-500/40 z-10 flex justify-between px-3 text-[10px] text-red-400 font-mono"
                      style={{
                        top: `${Math.max(
                          5,
                          Math.min(95, 100 - ((activeStock.stopLoss - minPrice) / priceRange) * 100))}%`,
                      }}
                    >
                      <span>Stop Loss: {activeStock.currency}{activeStock.stopLoss}</span>
                      <span>Risk Zone</span>
                    </div>

                    {/* SVG Curve / Candles */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                      <defs>
                        <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {chartMode === 'line' ? (
                        <>
                          {/* Filled Area */}
                          <path
                            d={`M 0 200 ${chartData
                              .map((d, i) => {
                                const x = (i / (chartData.length - 1)) * 500;
                                const y = 200 - ((d.close - minPrice) / priceRange) * 180;
                                return `L ${x} ${y}`;
                              })
                              .join(' ')} L 500 200 Z`}
                            fill="url(#stockAreaGrad)"
                          />
                          {/* Stroke Line */}
                          <path
                            d={chartData
                              .map((d, i) => {
                                const x = (i / (chartData.length - 1)) * 500;
                                const y = 200 - ((d.close - minPrice) / priceRange) * 180;
                                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                              })
                              .join(' ')}
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </>
                      ) : (
                        // Candlestick view
                        chartData.map((d, i) => {
                          const x = (i / (chartData.length - 1)) * 480 + 10;
                          const yHigh = 200 - ((d.high - minPrice) / priceRange) * 180;
                          const yLow = 200 - ((d.low - minPrice) / priceRange) * 180;
                          const yOpen = 200 - ((d.open - minPrice) / priceRange) * 180;
                          const yClose = 200 - ((d.close - minPrice) / priceRange) * 180;
                          const isGreen = d.close >= d.open;

                          return (
                            <g key={i}>
                              {/* Wick */}
                              <line
                                x1={x}
                                y1={yHigh}
                                x2={x}
                                y2={yLow}
                                stroke={isGreen ? '#10b981' : '#ef4444'}
                                strokeWidth="1.5"
                              />
                              {/* Body */}
                              <rect
                                x={x - 4}
                                y={Math.min(yOpen, yClose)}
                                width={8}
                                height={Math.max(2, Math.abs(yClose - yOpen))}
                                fill={isGreen ? '#10b981' : '#ef4444'}
                                rx={1}
                              />
                            </g>
                          );
                        })
                      )}
                    </svg>
                  </div>
                </div>

                {/* AI Sell & Profit Guidance Box */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/30 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>AI Profit & Selling Guidance for {activeStock.symbol}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCalcTargetPrice(activeStock.targetPrice);
                        setCalcStopLoss(activeStock.stopLoss);
                        setActiveTab('calculator');
                      }}
                      className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <span>Simulate in Calculator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                    {activeStock.sellAdvice}
                  </p>

                  {/* Catalysts Bullet Points */}
                  <div className="pt-2 space-y-1.5 border-t border-white/10">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-white/50">
                      Key Growth Catalysts & News Drivers:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-white/80">
                      {activeStock.catalysts.map((cat, cIdx) => (
                        <li
                          key={cIdx}
                          className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-start gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFIT CALCULATOR & SMART SELL ADVISOR */}
            {activeTab === 'calculator' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Left Column */}
                <div className="lg:col-span-5 p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      Trade Parameters & Position Sizing
                    </h3>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {activeStock.symbol} ({activeStock.currency})
                    </span>
                  </div>

                  {/* Stock Selector Pill */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Asset / Stock</label>
                    <select
                      value={selectedSymbol}
                      onChange={(e) => setSelectedSymbol(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                    >
                      {stocks.map((s) => (
                        <option key={s.symbol} value={s.symbol}>
                          {s.symbol} - {s.name} ({s.currency}{s.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buy Price Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Entry / Buy Price ({activeStock.currency})</span>
                      <span className="text-white/40">Current: {activeStock.currency}{activeStock.price.toFixed(2)}</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={calcBuyPrice}
                      onChange={(e) => setCalcBuyPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Shares / Units Quantity</span>
                      <span className="text-cyan-400 font-mono font-bold">
                        Cost: {activeStock.currency}{(calcBuyPrice * calcQuantity).toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex items-center gap-1.5 pt-1">
                      {[10, 25, 50, 100, 500].map((qty) => (
                        <button
                          key={qty}
                          onClick={() => setCalcQuantity(qty)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                            calcQuantity === qty ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exit Target Price Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-medium">Exit / Target Sell Price ({activeStock.currency})</span>
                      <span className="text-emerald-400 font-mono">
                        +{(calcTargetPrice > calcBuyPrice ? ((calcTargetPrice - calcBuyPrice) / calcBuyPrice) * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={calcTargetPrice}
                      onChange={(e) => setCalcTargetPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 font-mono text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Stop Loss Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400 font-medium">Stop-Loss Exit Price ({activeStock.currency})</span>
                      <span className="text-red-400 font-mono">
                        {(calcStopLoss < calcBuyPrice ? ((calcStopLoss - calcBuyPrice) / calcBuyPrice) * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={calcStopLoss}
                      onChange={(e) => setCalcStopLoss(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 font-mono text-sm focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>

                {/* Profit Projections & Action Guidance Right Column */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Big Number Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-1">
                      <span className="text-white/50 text-xs">Total Capital Invested</span>
                      <div className="text-lg sm:text-xl font-bold font-mono text-white">
                        {profitCalcResult.currency}
                        {profitCalcResult.investedCapital.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">
                        {calcQuantity} units @ {profitCalcResult.currency}{calcBuyPrice}
                      </span>
                    </div>

                    <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                      <span className="text-emerald-300 text-xs font-semibold">Projected Net Profit</span>
                      <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                        +{profitCalcResult.currency}
                        {profitCalcResult.grossProfit.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-300 font-mono font-bold">
                        +{profitCalcResult.roiPercent.toFixed(1)}% Return on Investment
                      </span>
                    </div>

                    <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-1">
                      <span className="text-white/50 text-xs">Risk-to-Reward Ratio</span>
                      <div className="text-lg sm:text-xl font-bold font-mono text-cyan-300">
                        {profitCalcResult.riskRewardRatio}
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">
                        Max Risk: {profitCalcResult.currency}{profitCalcResult.maxRiskAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* AI Action Execution Checklist */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-cyan-950/20 border border-cyan-500/30 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
                            Smart Exit & Selling Protocol
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
                            {profitCalcResult.recommendedAction.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-0.5">{profitCalcResult.actionReasoning}</p>
                      </div>
                    </div>

                    {/* Step-by-Step Selling Roadmap */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase text-white/50 tracking-wider">
                        Recommended Selling Execution Steps:
                      </span>
                      <div className="space-y-2">
                        {profitCalcResult.strategySteps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold font-mono shrink-0">
                              {sIdx + 1}
                            </span>
                            <span className="text-white/90 font-medium pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakeven Safety Tip */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-200">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Breakeven threshold: {profitCalcResult.currency}{profitCalcResult.breakEvenPrice.toFixed(2)}. Once
                        the asset reaches 50% of your target, shift stop-loss to breakeven for zero-risk execution.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MARKET WATCHLIST & ALL STOCKS */}
            {activeTab === 'market' && (
              <div className="space-y-5">
                {/* Categories Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Assets' },
                    { id: 'tech', label: 'Tech Giants' },
                    { id: 'crypto', label: 'Crypto' },
                    { id: 'indian_bluechip', label: 'Indian Equities' },
                    { id: 'ev_energy', label: 'EV & Energy' },
                    { id: 'indices', label: 'Indices & ETFs' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Stock Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredStocks.map((stock) => {
                    const isSelected = selectedSymbol === stock.symbol;
                    const isUp = stock.change >= 0;
                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          setSelectedSymbol(stock.symbol);
                          setActiveTab('research');
                        }}
                        className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-cyan-600/20 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-white text-base">{stock.symbol}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-xs text-white/50 line-clamp-1">{stock.name}</p>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              stock.recommendation === 'STRONG_BUY'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : stock.recommendation === 'BUY'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {stock.recommendation.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Price & Sparkline */}
                        <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
                          <div>
                            <span className="text-lg font-bold font-mono text-white">
                              {stock.currency}
                              {stock.price.toFixed(2)}
                            </span>
                            <div
                              className={`text-xs font-bold font-mono flex items-center gap-0.5 ${
                                isUp ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {isUp ? '+' : ''}
                              {stock.changePercent.toFixed(2)}%
                            </div>
                          </div>

                          <div className="text-right text-[11px] text-white/50">
                            <div>Target: {stock.currency}{stock.targetPrice}</div>
                            <div>RSI: {stock.rsi.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: AI TRADE SIGNALS */}
            {activeTab === 'signals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-cyan-400" />
                      Live AI Trading Alerts & Breakout Triggers
                    </h3>
                    <p className="text-xs text-white/50">
                      Algorithmic momentum alerts, resistance tests, and profit-taking alerts
                    </p>
                  </div>
                  <span className="text-xs font-mono text-white/50">Updated in real time</span>
                </div>

                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">{alert.symbol}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              alert.type === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : alert.type === 'TAKE_PROFIT' || alert.type === 'SELL'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            {alert.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            {alert.confidence}% Confidence
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white/90">{alert.title}</h4>
                        <p className="text-xs text-white/60">{alert.description}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right font-mono text-xs">
                          <span className="text-emerald-400 font-bold">Target: ${alert.targetPrice}</span>
                          <span className="text-white/40 block text-[10px]">Stop: ${alert.stopLoss}</span>
                        </div>
                        <button
                          onClick={() => handleApplySignalToCalculator(alert)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-md active:scale-95 transition-all"
                        >
                          Calculate Profit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: MY PORTFOLIO POSITIONS & EXIT PLANNER */}
            {activeTab === 'portfolio' && (
              <div className="space-y-5">
                {/* Summary Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-cyan-950/30 border border-cyan-500/30 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div>
                    <span className="text-xs text-white/50 block">Total Portfolio Value</span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                      ${portfolioMetrics.totalCurrent}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Total Capital Invested</span>
                    <span className="text-lg font-bold font-mono text-white/80">
                      ${portfolioMetrics.totalInvested}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Total Unrealized P&L</span>
                    <span
                      className={`text-lg font-bold font-mono ${
                        portfolioMetrics.isProfit ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {portfolioMetrics.isProfit ? '+' : ''}${portfolioMetrics.totalPnL} (
                      {portfolioMetrics.isProfit ? '+' : ''}
                      {portfolioMetrics.totalPnLPercent}%)
                    </span>
                  </div>
                  <div className="flex sm:justify-end">
                    <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                      3 Active Positions
                    </span>
                  </div>
                </div>

                {/* Positions Cards */}
                <div className="space-y-3">
                  {portfolio.map((pos) => {
                    const currentStock = stocks.find((s) => s.symbol === pos.symbol);
                    const curPrice = currentStock ? currentStock.price : pos.currentPrice;
                    const pnl = (curPrice - pos.buyPrice) * pos.shares;
                    const pnlPct = (pnl / (pos.buyPrice * pos.shares)) * 100;
                    const isProfit = pnl >= 0;

                    return (
                      <div
                        key={pos.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-white text-base">{pos.symbol}</span>
                              <span className="text-xs text-white/60">{pos.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-white/70">
                                {pos.shares} shares @ {pos.currency}{pos.buyPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-xs text-white/50 block">Current Price</span>
                              <span className="font-mono font-bold text-white text-sm">
                                {pos.currency}{curPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-white/50 block">PnL</span>
                              <span
                                className={`font-mono font-bold text-sm ${
                                  isProfit ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {isProfit ? '+' : ''}{pos.currency}{pnl.toFixed(2)} ({isProfit ? '+' : ''}
                                {pnlPct.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Exit Advice for this specific holding */}
                        <div className="flex items-center justify-between text-xs bg-black/40 p-2.5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="text-white/80 font-medium">{pos.exitGuidance}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedSymbol(pos.symbol);
                              setCalcBuyPrice(pos.buyPrice);
                              setCalcQuantity(pos.shares);
                              setCalcTargetPrice(pos.targetPrice);
                              setCalcStopLoss(pos.stopLossPrice);
                              setActiveTab('calculator');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-cyan-500 hover:text-black text-white text-xs font-semibold transition-all"
                          >
                            Exit Planner
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 6: MARKET NEWS & BUSINESS TRENDS */}
            {activeTab === 'news' && (
              <div className="space-y-5">
                {/* News Header & Category Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-cyan-400" />
                      <span>Live Financial, Business & Stock Market News</span>
                    </h3>
                    <p className="text-xs text-white/60">
                      Real-time market movers, macro updates, online business booms & buy/sell sentiment
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {(['all', 'stocks', 'crypto', 'business_models', 'economy', 'ai_tech'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewsCategory(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
                          newsCategory === cat
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* News Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredNews(newsCategory, searchQuery).map((article) => (
                    <div
                      key={article.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-400">{article.source}</span>
                            <span className="text-white/40">•</span>
                            <span className="text-white/50">{article.timeAgo}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              article.sentiment === 'bullish'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : article.sentiment === 'bearish'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-white/10 text-white/70'
                            }`}
                          >
                            {article.sentiment}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">{article.title}</h4>
                        <p className="text-xs text-white/70 leading-relaxed">{article.summary}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-white/50 font-medium">Key Takeaway:</span>
                          <span className="text-cyan-300 font-semibold">{article.keyTakeaway}</span>
                        </div>

                        {article.relatedSymbol && (
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-white/50">Related Asset:</span>
                            <button
                              onClick={() => {
                                setSelectedSymbol(article.relatedSymbol!);
                                setActiveTab('research');
                              }}
                              className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-mono font-bold transition-all"
                            >
                              Analyze {article.relatedSymbol} →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: CRYPTOCURRENCY PORTFOLIO & LIVE PRICE SPIKE TRACKER */}
            {activeTab === 'crypto' && (
              <CryptoTrackerView
                contrastMode={contrastMode}
                onSelectCryptoForResearch={(sym) => {
                  setSelectedSymbol(sym === 'BTC' ? 'BTC-USD' : sym === 'ETH' ? 'ETH-USD' : sym);
                  setActiveTab('research');
                }}
                onLogVoiceCommand={onLogVoiceCommand}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
