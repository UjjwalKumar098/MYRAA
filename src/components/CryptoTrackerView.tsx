import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CryptoAsset,
  CryptoPortfolioPosition,
  CryptoPriceSpikeAlert,
  CryptoCategory,
  CryptoUserSpikeConfig,
  ContrastMode,
} from '../types';
import {
  INITIAL_CRYPTO_ASSETS,
  DEFAULT_CRYPTO_PORTFOLIO,
  DEFAULT_CRYPTO_SPIKES,
  INITIAL_NETWORK_METRICS,
  DEFAULT_USER_SPIKE_CONFIGS,
  calculateCryptoPortfolioSummary,
  calculateDcaReturns,
} from '../utils/cryptoTradingData';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  BellRing,
  PieChart,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  CheckCircle2,
  Flame,
  Shield,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Cpu,
  Globe,
  Sliders,
  Volume2,
  VolumeX,
  Radio,
  ExternalLink,
  Target,
  Sparkles,
  Percent,
  ArrowRight,
} from 'lucide-react';

interface CryptoTrackerViewProps {
  contrastMode?: ContrastMode;
  onSelectCryptoForResearch?: (symbol: string) => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
}

export const CryptoTrackerView: React.FC<CryptoTrackerViewProps> = ({
  contrastMode = 'cosmic',
  onSelectCryptoForResearch,
  onLogVoiceCommand,
}) => {
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [portfolio, setPortfolio] = useState<CryptoPortfolioPosition[]>(DEFAULT_CRYPTO_PORTFOLIO);
  const [spikeAlerts, setSpikeAlerts] = useState<CryptoPriceSpikeAlert[]>(DEFAULT_CRYPTO_SPIKES);
  const [activeSubTab, setActiveSubTab] = useState<'prices' | 'portfolio' | 'spikes' | 'dca' | 'network'>('prices');
  const [selectedCategory, setSelectedCategory] = useState<CryptoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyUnit, setCurrencyUnit] = useState<'USD' | 'INR'>('USD');
  const [spikeConfigs, setSpikeConfigs] = useState<CryptoUserSpikeConfig[]>(DEFAULT_USER_SPIKE_CONFIGS);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active flash spike banner state
  const [latestActiveSpike, setLatestActiveSpike] = useState<CryptoPriceSpikeAlert | null>(DEFAULT_CRYPTO_SPIKES[0]);
  const [showSpikeBanner, setShowSpikeBanner] = useState(true);

  // Add / Edit Position Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const [formSymbol, setFormSymbol] = useState('BTC');
  const [formHoldings, setFormHoldings] = useState('0.15');
  const [formAvgPrice, setFormAvgPrice] = useState('61500');
  const [formTargetPrice, setFormTargetPrice] = useState('72000');
  const [formStopLoss, setFormStopLoss] = useState('58000');
  const [formNotes, setFormNotes] = useState('');

  // DCA Calculator State
  const [dcaSymbol, setDcaSymbol] = useState('BTC');
  const [dcaMonthlyAmount, setDcaMonthlyAmount] = useState(250);
  const [dcaMonths, setDcaMonths] = useState(12);

  const isTrueBlack = contrastMode === 'true-black';
  const inrRate = 83.8;

  // Real-time live price ticks simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoAssets((prevAssets) => {
        return prevAssets.map((asset) => {
          // Dynamic crypto volatility (-0.45% to +0.55%)
          const tickDeltaPercent = (Math.random() - 0.46) * 0.9;
          const tickChange = (asset.priceUsd * tickDeltaPercent) / 100;
          const newPrice = Math.max(0.0001, parseFloat((asset.priceUsd + tickChange).toFixed(asset.priceUsd < 1 ? 4 : 2)));
          const change24h = parseFloat((asset.change24h + tickDeltaPercent * 0.3).toFixed(2));
          const change1h = parseFloat((asset.change1h + tickDeltaPercent * 0.5).toFixed(2));

          // Mini sparkline update
          const newSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            priceUsd: newPrice,
            change24h,
            change1h,
            high24h: Math.max(asset.high24h, newPrice),
            low24h: Math.min(asset.low24h, newPrice),
            sparkline: newSparkline,
          };
        });
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Periodic simulated price spike trigger
  useEffect(() => {
    const spikeInterval = setInterval(() => {
      const luckyAsset = cryptoAssets[Math.floor(Math.random() * cryptoAssets.length)];
      if (!luckyAsset) return;

      const isSurge = Math.random() > 0.25; // 75% surge bias
      const spikeMagnitude = parseFloat(((Math.random() * 4 + 3.2) * (isSurge ? 1 : -1)).toFixed(2));
      const prevPrice = luckyAsset.priceUsd;
      const spikedPrice = parseFloat((prevPrice * (1 + spikeMagnitude / 100)).toFixed(luckyAsset.priceUsd < 1 ? 4 : 2));

      const newSpike: CryptoPriceSpikeAlert = {
        id: `spike-${Date.now()}`,
        cryptoSymbol: luckyAsset.symbol,
        cryptoName: luckyAsset.name,
        spikePercent: Math.abs(spikeMagnitude),
        currentPrice: spikedPrice,
        previousPrice: prevPrice,
        timeframe: '5m',
        direction: isSurge ? 'surge' : 'dump',
        volumeMultiplier: `${(Math.random() * 3.5 + 2.5).toFixed(1)}x normal volume`,
        timestamp: Date.now(),
        triggeredBy: isSurge
          ? `Massive market buy order & short liquidation cascade on ${luckyAsset.name}`
          : `High volume profit-taking wave detected across exchanges`,
        urgency: Math.abs(spikeMagnitude) > 6 ? 'urgent' : 'elevated',
        isRead: false,
      };

      setSpikeAlerts((prev) => [newSpike, ...prev].slice(0, 15));
      setLatestActiveSpike(newSpike);
      setShowSpikeBanner(true);

      // Play audio chime if enabled
      if (soundEnabled && typeof window !== 'undefined' && window.AudioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = isSurge ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(isSurge ? 659.25 : 329.63, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(isSurge ? 880 : 220, ctx.currentTime + 0.25);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        } catch {}
      }
    }, 28000);

    return () => clearInterval(spikeInterval);
  }, [cryptoAssets, soundEnabled]);

  // Trigger manual instant spike simulation
  const handleSimulateInstantSpike = () => {
    const sample = cryptoAssets[Math.floor(Math.random() * cryptoAssets.length)];
    const surge = parseFloat((Math.random() * 5 + 4.5).toFixed(2));
    const newSpike: CryptoPriceSpikeAlert = {
      id: `spike-manual-${Date.now()}`,
      cryptoSymbol: sample.symbol,
      cryptoName: sample.name,
      spikePercent: surge,
      currentPrice: parseFloat((sample.priceUsd * (1 + surge / 100)).toFixed(2)),
      previousPrice: sample.priceUsd,
      timeframe: '5m',
      direction: 'surge',
      volumeMultiplier: '5.6x normal volume',
      timestamp: Date.now(),
      triggeredBy: `⚡ Instant Whale breakout alert triggered for ${sample.symbol} (+${surge}%)`,
      urgency: 'urgent',
      isRead: false,
    };

    setSpikeAlerts((prev) => [newSpike, ...prev]);
    setLatestActiveSpike(newSpike);
    setShowSpikeBanner(true);
    onLogVoiceCommand?.(
      `Price Spike Triggered: ${sample.symbol} +${surge}%`,
      'trading',
      `Live price spike detected on ${sample.name} with 5.6x volume surge`,
      'quick_prompt'
    );
  };

  // Filtered crypto list
  const filteredAssets = useMemo(() => {
    return cryptoAssets.filter((asset) => {
      const matchCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [cryptoAssets, selectedCategory, searchQuery]);

  // Portfolio summary
  const portfolioSummary = useMemo(() => {
    return calculateCryptoPortfolioSummary(portfolio, cryptoAssets);
  }, [portfolio, cryptoAssets]);

  // DCA calculation
  const dcaResult = useMemo(() => {
    return calculateDcaReturns(dcaSymbol, dcaMonthlyAmount, dcaMonths, cryptoAssets);
  }, [dcaSymbol, dcaMonthlyAmount, dcaMonths, cryptoAssets]);

  // Handle Add or Edit Position Form
  const handleSavePosition = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = cryptoAssets.find((a) => a.symbol === formSymbol) || cryptoAssets[0];
    const holdings = parseFloat(formHoldings) || 0.1;
    const avgBuyPrice = parseFloat(formAvgPrice) || asset.priceUsd;
    const targetPrice = parseFloat(formTargetPrice) || asset.resistanceLevel;
    const stopLoss = parseFloat(formStopLoss) || asset.supportLevel;

    if (editingPositionId) {
      setPortfolio((prev) =>
        prev.map((pos) =>
          pos.id === editingPositionId
            ? {
                ...pos,
                cryptoId: asset.id,
                symbol: asset.symbol,
                name: asset.name,
                holdings,
                avgBuyPriceUsd: avgBuyPrice,
                stopLossUsd: stopLoss,
                notes: formNotes || pos.notes,
                takeProfitTargets: [
                  { targetPrice, sellPercent: 50, note: 'Scaled exit target' },
                  { targetPrice: targetPrice * 1.2, sellPercent: 50, note: 'Cycle expansion target' },
                ],
              }
            : pos
        )
      );
      onLogVoiceCommand?.(
        `Updated Crypto Position: ${asset.symbol}`,
        'trading',
        `Adjusted holdings to ${holdings} ${asset.symbol} @ $${avgBuyPrice}`,
        'quick_prompt'
      );
    } else {
      const newPos: CryptoPortfolioPosition = {
        id: `cpos-${Date.now()}`,
        cryptoId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        holdings,
        avgBuyPriceUsd: avgBuyPrice,
        currentPriceUsd: asset.priceUsd,
        totalInvestedUsd: holdings * avgBuyPrice,
        currentValueUsd: holdings * asset.priceUsd,
        unrealizedPnLUsd: holdings * (asset.priceUsd - avgBuyPrice),
        unrealizedPnLPercent: ((asset.priceUsd - avgBuyPrice) / avgBuyPrice) * 100,
        takeProfitTargets: [
          { targetPrice, sellPercent: 40, note: 'Primary resistance take-profit' },
          { targetPrice: targetPrice * 1.25, sellPercent: 60, note: 'Moonbag expansion target' },
        ],
        stopLossUsd: stopLoss,
        notes: formNotes || 'Custom position added via Trading Studio',
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setPortfolio((prev) => [newPos, ...prev]);
      onLogVoiceCommand?.(
        `Added Crypto Position: ${asset.symbol}`,
        'trading',
        `Logged ${holdings} ${asset.symbol} with target $${targetPrice}`,
        'quick_prompt'
      );
    }

    setIsAddModalOpen(false);
    setEditingPositionId(null);
  };

  const handleOpenEditPosition = (pos: CryptoPortfolioPosition) => {
    setEditingPositionId(pos.id);
    setFormSymbol(pos.symbol);
    setFormHoldings(pos.holdings.toString());
    setFormAvgPrice(pos.avgBuyPriceUsd.toString());
    setFormTargetPrice(pos.takeProfitTargets[0]?.targetPrice.toString() || (pos.currentPriceUsd * 1.25).toFixed(2));
    setFormStopLoss(pos.stopLossUsd.toString());
    setFormNotes(pos.notes || '');
    setIsAddModalOpen(true);
  };

  const handleDeletePosition = (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
  };

  const formatPrice = (valUsd: number) => {
    if (currencyUnit === 'INR') {
      const inrVal = valUsd * inrRate;
      return inrVal >= 1000 ? `₹${inrVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : `₹${inrVal.toFixed(2)}`;
    }
    return valUsd >= 1000
      ? `$${valUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      : valUsd < 1
      ? `$${valUsd.toFixed(4)}`
      : `$${valUsd.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Global Market Metric Header */}
      <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-white/50">Market Cap:</span>
            <span className="font-bold text-white font-mono">{INITIAL_NETWORK_METRICS.totalCryptoMarketCap}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-white/50">BTC Dominance:</span>
            <span className="font-bold text-amber-400 font-mono">{INITIAL_NETWORK_METRICS.btcDominance}%</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-white/50">Fear & Greed:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {INITIAL_NETWORK_METRICS.fearAndGreedIndex} • {INITIAL_NETWORK_METRICS.fearAndGreedLabel}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-medium">
            <span className="text-white/50">ETH Gas:</span>
            <span className="font-bold text-cyan-400 font-mono">
              ⚡ {INITIAL_NETWORK_METRICS.ethGasGwei.standard} Gwei
            </span>
          </div>
        </div>

        {/* Currency Switcher & Spike Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Spike Sound Alerts Active' : 'Spike Sounds Muted'}
            className={`p-1.5 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-white/5 text-white/40 border-white/10'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/10">
            <button
              onClick={() => setCurrencyUnit('USD')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                currencyUnit === 'USD' ? 'bg-cyan-600 text-white shadow' : 'text-white/60 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrencyUnit('INR')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                currencyUnit === 'INR' ? 'bg-cyan-600 text-white shadow' : 'text-white/60 hover:text-white'
              }`}
            >
              INR (₹)
            </button>
          </div>

          <button
            onClick={handleSimulateInstantSpike}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>Test Spike Alert</span>
          </button>
        </div>
      </div>

      {/* Floating Active Spike Notification Flash Banner */}
      <AnimatePresence>
        {showSpikeBanner && latestActiveSpike && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`px-5 py-2.5 border-b flex items-center justify-between gap-3 text-xs transition-all ${
              latestActiveSpike.direction === 'surge'
                ? 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-black border-emerald-500/40 text-emerald-200'
                : 'bg-gradient-to-r from-rose-950/80 via-rose-900/50 to-black border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    latestActiveSpike.direction === 'surge' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    latestActiveSpike.direction === 'surge' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </span>
              <span className="font-extrabold uppercase tracking-wider text-[11px] px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
                {latestActiveSpike.direction === 'surge' ? '🚀 PRICE SPIKE' : '🔻 FLASH DUMP'}
              </span>
              <span className="font-bold font-mono">
                {latestActiveSpike.cryptoSymbol} {formatPrice(latestActiveSpike.currentPrice)} (
                {latestActiveSpike.direction === 'surge' ? '+' : '-'}
                {latestActiveSpike.spikePercent}% in {latestActiveSpike.timeframe})
              </span>
              <span className="text-white/70 truncate hidden md:inline">• {latestActiveSpike.triggeredBy}</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setActiveSubTab('spikes');
                  setShowSpikeBanner(false);
                }}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-all"
              >
                View Radar
              </button>
              <button
                onClick={() => setShowSpikeBanner(false)}
                className="text-white/60 hover:text-white p-0.5"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-white/10 bg-black/30 text-xs overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('prices')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'prices'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Price Tracker ({cryptoAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('portfolio')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'portfolio'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Crypto Portfolio ({portfolio.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('spikes')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'spikes'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>Price Spike Radar ({spikeAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('dca')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'dca'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
            <span>DCA & Staking Yields</span>
          </button>

          <button
            onClick={() => setActiveSubTab('network')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'network'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>On-Chain & Gas</span>
          </button>
        </div>

        {activeSubTab === 'portfolio' && (
          <button
            onClick={() => {
              setEditingPositionId(null);
              setFormSymbol('BTC');
              setFormHoldings('0.25');
              setFormAvgPrice('62000');
              setFormTargetPrice('75000');
              setFormStopLoss('58500');
              setFormNotes('');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* 1. LIVE PRICES TAB */}
        {activeSubTab === 'prices' && (
          <div className="space-y-4">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coins (BTC, Solana, Render, Sui)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['all', 'layer1', 'layer2', 'ai_depin', 'defi', 'meme', 'infrastructure'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-white/50 hover:text-white bg-white/5'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Crypto Assets Grid Table */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="grid grid-cols-12 px-4 py-3 border-b border-white/10 text-[11px] font-bold text-white/50 uppercase tracking-wider bg-black/40">
                <div className="col-span-4 sm:col-span-3">Asset</div>
                <div className="col-span-3 sm:col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">24h Change</div>
                <div className="hidden sm:block sm:col-span-2 text-right">24h Range</div>
                <div className="hidden md:block md:col-span-2 text-right">Market Cap</div>
                <div className="col-span-3 sm:col-span-1 text-right">Action</div>
              </div>

              <div className="divide-y divide-white/5">
                {filteredAssets.map((asset) => {
                  const isGain = asset.change24h >= 0;
                  const pricePos =
                    asset.high24h > asset.low24h
                      ? Math.min(100, Math.max(0, ((asset.priceUsd - asset.low24h) / (asset.high24h - asset.low24h)) * 100))
                      : 50;

                  return (
                    <motion.div
                      key={asset.id}
                      layout
                      className="grid grid-cols-12 px-4 py-3.5 items-center hover:bg-white/[0.04] transition-all text-xs"
                    >
                      {/* Asset Identity */}
                      <div className="col-span-4 sm:col-span-3 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center font-bold font-mono text-cyan-300 text-xs">
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{asset.name}</span>
                            <span className="text-[10px] text-white/50 font-mono">{asset.symbol}</span>
                            {asset.spikeDetected && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40">
                                ⚡ Spike
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-white/40">
                            <span className="capitalize">{asset.category.replace('_', ' ')}</span>
                            {asset.stakingApy && (
                              <span className="text-emerald-400 font-bold">APY {asset.stakingApy}%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Live Price */}
                      <div className="col-span-3 sm:col-span-2 text-right font-mono font-bold text-white">
                        {formatPrice(asset.priceUsd)}
                        <div className="text-[10px] text-white/40 font-normal">
                          1h: {asset.change1h >= 0 ? '+' : ''}
                          {asset.change1h}%
                        </div>
                      </div>

                      {/* 24h Change */}
                      <div className="col-span-2 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                            isGain
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isGain ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isGain ? '+' : ''}
                          {asset.change24h}%
                        </span>
                      </div>

                      {/* 24h Range Bar */}
                      <div className="hidden sm:block sm:col-span-2 text-right px-2">
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mb-1">
                          <span>{formatPrice(asset.low24h)}</span>
                          <span>{formatPrice(asset.high24h)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                            style={{ width: `${pricePos}%` }}
                          />
                        </div>
                      </div>

                      {/* Market Cap */}
                      <div className="hidden md:block md:col-span-2 text-right font-mono text-white/80">
                        {asset.marketCap}
                        <div className="text-[10px] text-white/40">Vol: {asset.volume24h}</div>
                      </div>

                      {/* Action */}
                      <div className="col-span-3 sm:col-span-1 text-right flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setFormSymbol(asset.symbol);
                            setFormAvgPrice(asset.priceUsd.toString());
                            setFormTargetPrice(asset.resistanceLevel.toString());
                            setFormStopLoss(asset.supportLevel.toString());
                            setIsAddModalOpen(true);
                          }}
                          title="Add to My Crypto Portfolio"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/70 hover:text-cyan-300 border border-white/10 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectCryptoForResearch?.(asset.symbol)}
                          title="Research Technicals & Sell Strategy"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white/70 hover:text-emerald-300 border border-white/10 transition-all"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. PORTFOLIO TAB */}
        {activeSubTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Top Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                <div className="text-white/50 text-xs mb-1">Total Crypto Net Worth</div>
                <div className="text-2xl font-black font-mono text-white">
                  {currencyUnit === 'INR'
                    ? `₹${portfolioSummary.totalCurrentValueInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                    : `$${portfolioSummary.totalCurrentValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  Invested: {formatPrice(portfolioSummary.totalInvestedUsd)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                <div className="text-white/50 text-xs mb-1">Total Unrealized PnL</div>
                <div
                  className={`text-2xl font-black font-mono flex items-center gap-1.5 ${
                    portfolioSummary.isProfit ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {portfolioSummary.isProfit ? '+' : ''}
                  {currencyUnit === 'INR'
                    ? `₹${portfolioSummary.totalPnLInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                    : `$${portfolioSummary.totalPnLUsd.toFixed(2)}`}
                </div>
                <div
                  className={`text-[11px] font-bold mt-1 ${
                    portfolioSummary.isProfit ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {portfolioSummary.isProfit ? '+' : ''}
                  {portfolioSummary.totalPnLPercent.toFixed(2)}% Overall Return
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                <div className="text-white/50 text-xs mb-1">Top Performer</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="font-mono">{portfolioSummary.bestPerformer?.symbol || 'BTC'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    +{portfolioSummary.bestPerformer?.unrealizedPnLPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  Gain: +${portfolioSummary.bestPerformer?.unrealizedPnLUsd.toFixed(2)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                <div className="text-white/50 text-xs mb-1">Staking & Yield Assets</div>
                <div className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span>SOL & ETH Active</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 font-medium">Avg Passive Yield ~5.8% APY</div>
              </div>
            </div>

            {/* Asset Allocation Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white/70 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                  Portfolio Asset Allocation
                </span>
                <span className="text-white/40 text-[11px]">{portfolio.length} Active Coins</span>
              </div>

              <div className="h-3 w-full rounded-full overflow-hidden flex bg-white/5">
                {portfolioSummary.positions.map((pos, idx) => {
                  const pct =
                    portfolioSummary.totalCurrentValueUsd > 0
                      ? (pos.currentValueUsd / portfolioSummary.totalCurrentValueUsd) * 100
                      : 0;
                  const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500'];
                  return (
                    <div
                      key={pos.id}
                      className={`${colors[idx % colors.length]} h-full transition-all`}
                      style={{ width: `${pct}%` }}
                      title={`${pos.symbol}: ${pct.toFixed(1)}%`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
                {portfolioSummary.positions.map((pos, idx) => {
                  const pct =
                    portfolioSummary.totalCurrentValueUsd > 0
                      ? (pos.currentValueUsd / portfolioSummary.totalCurrentValueUsd) * 100
                      : 0;
                  const colors = ['text-cyan-400', 'text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400'];
                  return (
                    <div key={pos.id} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length].replace('text-', 'bg-')}`} />
                      <span className="font-bold text-white">{pos.symbol}:</span>
                      <span className="text-white/60 font-mono">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Holdings Detailed List */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  Your Crypto Holdings & Profit Taking Ladder
                </h3>
              </div>

              <div className="divide-y divide-white/5">
                {portfolioSummary.positions.map((pos) => {
                  const isGain = pos.unrealizedPnLUsd >= 0;
                  return (
                    <div key={pos.id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center font-bold font-mono text-cyan-300">
                            {pos.symbol}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-white">{pos.name}</span>
                              <span className="text-xs text-white/40 font-mono">
                                {pos.holdings} {pos.symbol}
                              </span>
                            </div>
                            <div className="text-xs text-white/50">
                              Avg Buy: {formatPrice(pos.avgBuyPriceUsd)} • Current: {formatPrice(pos.currentPriceUsd)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-right">
                            <div className="text-base font-bold font-mono text-white">
                              {formatPrice(pos.currentValueUsd)}
                            </div>
                            <div
                              className={`text-xs font-bold font-mono flex items-center justify-end gap-1 ${
                                isGain ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {isGain ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {isGain ? '+' : ''}
                              {formatPrice(pos.unrealizedPnLUsd)} ({isGain ? '+' : ''}
                              {pos.unrealizedPnLPercent.toFixed(2)}%)
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditPosition(pos)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePosition(pos.id)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 border border-white/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Staged Take-Profit Ladder */}
                      {pos.takeProfitTargets && pos.takeProfitTargets.length > 0 && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1.5">
                          <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                            <Target className="w-3 h-3" />
                            <span>Recommended Staged Exit Strategy:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/70 text-[11px]">
                            {pos.takeProfitTargets.map((tp, idx) => (
                              <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-white/5">
                                <span>
                                  Target {idx + 1}: <strong className="text-white font-mono">{formatPrice(tp.targetPrice)}</strong> (Sell {tp.sellPercent}%)
                                </span>
                                <span className="text-white/40 truncate text-[10px]">{tp.note}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. PRICE SPIKE RADAR TAB */}
        {activeSubTab === 'spikes' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  Real-Time Crypto Price Spike Radar & Whale Alerter
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Continuously scans for abnormal volume bursts, sudden whale market purchases & liquidation breakouts
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateInstantSpike}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate Real-Time Spike</span>
                </button>
              </div>
            </div>

            {/* Spike Alerts Stream */}
            <div className="space-y-3">
              {spikeAlerts.map((spike) => {
                const isSurge = spike.direction === 'surge';
                return (
                  <motion.div
                    key={spike.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSurge
                        ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                        : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                            isSurge
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {isSurge ? '🚀' : '🔻'}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{spike.cryptoName}</span>
                            <span className="text-xs text-white/50 font-mono">({spike.cryptoSymbol})</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono uppercase ${
                                isSurge ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {isSurge ? '+' : '-'}
                              {spike.spikePercent}% in {spike.timeframe}
                            </span>
                            <span className="text-[10px] text-white/40">
                              {new Date(spike.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-xs text-white/70 mt-1">{spike.triggeredBy}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                        <div className="text-sm font-bold font-mono text-white">{formatPrice(spike.currentPrice)}</div>
                        <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {spike.volumeMultiplier}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. DCA & STAKING YIELDS TAB */}
        {activeSubTab === 'dca' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: DCA Calculator */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  DCA (Dollar-Cost-Averaging) Accumulator Simulator
                </h3>
              </div>

              {/* Coin Select */}
              <div className="space-y-2">
                <label className="text-xs text-white/60">Target Crypto Asset:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['BTC', 'ETH', 'SOL', 'RENDER'].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => setDcaSymbol(sym)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        dcaSymbol === sym
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Amount Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Monthly Investment:</span>
                  <span className="font-bold text-white font-mono">${dcaMonthlyAmount} / month</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1500"
                  step="25"
                  value={dcaMonthlyAmount}
                  onChange={(e) => setDcaMonthlyAmount(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Horizon Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Time Horizon:</span>
                  <span className="font-bold text-white font-mono">{dcaMonths} Months ({dcaMonths / 12} yrs)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 24, 36].map((m) => (
                    <button
                      key={m}
                      onClick={() => setDcaMonths(m)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        dcaMonths === m ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {m} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Projection Result Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-black border border-emerald-500/30 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-white/50">Total Capital Contributed</div>
                    <div className="text-base font-bold font-mono text-white">${dcaResult.totalInvested}</div>
                  </div>
                  <div>
                    <div className="text-white/50">Projected Portfolio Worth</div>
                    <div className="text-lg font-black font-mono text-emerald-400">
                      ${dcaResult.projectedFutureValue.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-bold">
                    Projected Profit: +${dcaResult.projectedProfit.toLocaleString()} (+{dcaResult.projectedRoi}%)
                  </span>
                  <span className="text-white/60 font-mono">
                    ~{dcaResult.totalTokensAccumulated} {dcaResult.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Staking Yields Overview */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                Proof-of-Stake Yield Radar
              </h3>

              <div className="space-y-2.5">
                {[
                  { name: 'Solana', symbol: 'SOL', apy: 7.2, lockup: '3 Days', risk: 'Low' },
                  { name: 'Ethereum', symbol: 'ETH', apy: 3.8, lockup: 'Liquid', risk: 'Lowest' },
                  { name: 'NEAR Protocol', symbol: 'NEAR', apy: 8.4, lockup: '2 Days', risk: 'Low' },
                  { name: 'Polkadot', symbol: 'DOT', apy: 11.5, lockup: '28 Days', risk: 'Medium' },
                  { name: 'Avalanche', symbol: 'AVAX', apy: 6.8, lockup: '14 Days', risk: 'Low' },
                ].map((stk) => (
                  <div key={stk.symbol} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{stk.name}</span>
                        <span className="text-[10px] text-white/40 font-mono">({stk.symbol})</span>
                      </div>
                      <div className="text-[10px] text-white/50">Lockup: {stk.lockup}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-400">{stk.apy}% APY</div>
                      <div className="text-[10px] text-white/40">Risk: {stk.risk}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. ON-CHAIN & GAS TAB */}
        {activeSubTab === 'network' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs text-white/50 font-bold uppercase">Ethereum Gas Tracker</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white/5">
                  <div className="text-[10px] text-white/40">Low</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">{INITIAL_NETWORK_METRICS.ethGasGwei.low} Gwei</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-cyan-500/30">
                  <div className="text-[10px] text-white/40">Standard</div>
                  <div className="text-sm font-bold font-mono text-cyan-400">{INITIAL_NETWORK_METRICS.ethGasGwei.standard} Gwei</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <div className="text-[10px] text-white/40">Fast</div>
                  <div className="text-sm font-bold font-mono text-amber-400">{INITIAL_NETWORK_METRICS.ethGasGwei.fast} Gwei</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="text-xs text-white/50 font-bold uppercase">Solana TPS Speedometer</div>
              <div className="text-2xl font-black font-mono text-cyan-300">
                {INITIAL_NETWORK_METRICS.solanaTps.toLocaleString()} TPS
              </div>
              <div className="text-xs text-emerald-400 font-medium">99.98% Network Uptime Active</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="text-xs text-white/50 font-bold uppercase">Bitcoin Mempool Fee</div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {INITIAL_NETWORK_METRICS.btcMempoolSatVb} Sat/vB
              </div>
              <div className="text-xs text-white/50">Next Block Confirmation Priority</div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Position Modal Drawer */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-[#09111e] border border-cyan-500/30 p-5 space-y-4 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  {editingPositionId ? 'Edit Crypto Holding' : 'Add Crypto to Portfolio'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-white/60 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePosition} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-white/60 mb-1">Select Asset</label>
                  <select
                    value={formSymbol}
                    onChange={(e) => {
                      const sym = e.target.value;
                      setFormSymbol(sym);
                      const asset = cryptoAssets.find((a) => a.symbol === sym);
                      if (asset) {
                        setFormAvgPrice(asset.priceUsd.toString());
                        setFormTargetPrice(asset.resistanceLevel.toString());
                        setFormStopLoss(asset.supportLevel.toString());
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {cryptoAssets.map((a) => (
                      <option key={a.id} value={a.symbol} className="bg-slate-900">
                        {a.name} ({a.symbol}) - ${a.priceUsd}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 mb-1">Holdings Quantity</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formHoldings}
                      onChange={(e) => setFormHoldings(e.target.value)}
                      placeholder="e.g. 0.5"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Avg Buy Price (USD $)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formAvgPrice}
                      onChange={(e) => setFormAvgPrice(e.target.value)}
                      placeholder="e.g. 62000"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 mb-1">Take-Profit Target ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={formTargetPrice}
                      onChange={(e) => setFormTargetPrice(e.target.value)}
                      placeholder="e.g. 74000"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Stop-Loss Boundary ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={formStopLoss}
                      onChange={(e) => setFormStopLoss(e.target.value)}
                      placeholder="e.g. 58000"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Notes / Thesis (Optional)</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Hardware wallet cold storage, cycle target $85k"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md"
                  >
                    {editingPositionId ? 'Save Changes' : 'Add to Portfolio'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
