import {
  CryptoAsset,
  CryptoPortfolioPosition,
  CryptoPriceSpikeAlert,
  CryptoNetworkMetric,
  CryptoUserSpikeConfig,
} from '../types';

export const INITIAL_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'layer1',
    priceUsd: 64850.0,
    change1h: 0.42,
    change24h: 3.85,
    change7d: 8.12,
    high24h: 65420.0,
    low24h: 62450.0,
    volume24h: '$32.8B',
    marketCap: '$1.28T',
    circulatingSupply: '19.75M BTC',
    allTimeHigh: 73750.0,
    sparkline: [62450, 62800, 63100, 62900, 63400, 63800, 64200, 64100, 64600, 64850],
    rsi: 64.2,
    trend: 'bullish',
    supportLevel: 61800.0,
    resistanceLevel: 68500.0,
    spikeDetected: true,
    spikeDetails: {
      percent: 3.85,
      direction: 'surge',
      timeframe: '15m',
      timestamp: Date.now() - 8 * 60 * 1000,
      reason: 'Institutional Spot ETF net inflow surge +$420M in single session',
    },
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'layer1',
    priceUsd: 2785.4,
    change1h: -0.15,
    change24h: 4.12,
    change7d: 6.45,
    high24h: 2840.0,
    low24h: 2660.0,
    volume24h: '$16.4B',
    marketCap: '$335.2B',
    circulatingSupply: '120.3M ETH',
    allTimeHigh: 4891.0,
    sparkline: [2660, 2690, 2710, 2680, 2730, 2750, 2770, 2760, 2795, 2785.4],
    rsi: 61.8,
    trend: 'bullish',
    supportLevel: 2620.0,
    resistanceLevel: 2980.0,
    stakingApy: 3.8,
    spikeDetected: false,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    category: 'layer1',
    priceUsd: 156.8,
    change1h: 1.25,
    change24h: 7.64,
    change7d: 18.3,
    high24h: 159.4,
    low24h: 144.2,
    volume24h: '$4.9B',
    marketCap: '$73.2B',
    circulatingSupply: '467.2M SOL',
    allTimeHigh: 260.06,
    sparkline: [144.2, 146.5, 148.0, 147.2, 150.8, 152.4, 154.0, 153.5, 158.2, 156.8],
    rsi: 71.4,
    trend: 'bullish',
    supportLevel: 142.0,
    resistanceLevel: 165.0,
    stakingApy: 7.2,
    spikeDetected: true,
    spikeDetails: {
      percent: 7.64,
      direction: 'surge',
      timeframe: '5m',
      timestamp: Date.now() - 4 * 60 * 1000,
      reason: 'Record DEX volume flip over Ethereum mainnet + Firedancer testnet throughput',
    },
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    category: 'layer1',
    priceUsd: 574.5,
    change1h: 0.08,
    change24h: 1.84,
    change7d: 4.1,
    high24h: 582.0,
    low24h: 561.0,
    volume24h: '$1.1B',
    marketCap: '$84.6B',
    circulatingSupply: '147.2M BNB',
    allTimeHigh: 720.67,
    sparkline: [561, 563, 566, 564, 568, 570, 573, 572, 576, 574.5],
    rsi: 54.6,
    trend: 'bullish',
    supportLevel: 545.0,
    resistanceLevel: 610.0,
    stakingApy: 4.2,
    spikeDetected: false,
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    category: 'layer1',
    priceUsd: 0.584,
    change1h: 0.62,
    change24h: 3.25,
    change7d: 5.9,
    high24h: 0.598,
    low24h: 0.562,
    volume24h: '$1.45B',
    marketCap: '$32.9B',
    circulatingSupply: '56.3B XRP',
    allTimeHigh: 3.84,
    sparkline: [0.562, 0.568, 0.571, 0.569, 0.575, 0.578, 0.581, 0.579, 0.586, 0.584],
    rsi: 57.2,
    trend: 'bullish',
    supportLevel: 0.54,
    resistanceLevel: 0.65,
    spikeDetected: false,
  },
  {
    id: 'render',
    symbol: 'RENDER',
    name: 'Render Network',
    category: 'ai_depin',
    priceUsd: 6.42,
    change1h: 1.85,
    change24h: 11.4,
    change7d: 26.5,
    high24h: 6.68,
    low24h: 5.72,
    volume24h: '$385M',
    marketCap: '$2.51B',
    circulatingSupply: '388.6M RENDER',
    allTimeHigh: 13.6,
    sparkline: [5.72, 5.85, 5.98, 6.1, 6.05, 6.22, 6.35, 6.28, 6.55, 6.42],
    rsi: 74.8,
    trend: 'bullish',
    supportLevel: 5.6,
    resistanceLevel: 7.2,
    spikeDetected: true,
    spikeDetails: {
      percent: 11.4,
      direction: 'surge',
      timeframe: '15m',
      timestamp: Date.now() - 14 * 60 * 1000,
      reason: 'AI compute cluster integration partnership with decentralized 3D rendering pipeline',
    },
  },
  {
    id: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    category: 'layer1',
    priceUsd: 4.88,
    change1h: 0.75,
    change24h: 6.8,
    change7d: 14.2,
    high24h: 5.04,
    low24h: 4.52,
    volume24h: '$420M',
    marketCap: '$5.48B',
    circulatingSupply: '1.12B NEAR',
    allTimeHigh: 20.42,
    sparkline: [4.52, 4.6, 4.68, 4.65, 4.75, 4.8, 4.84, 4.82, 4.92, 4.88],
    rsi: 66.1,
    trend: 'bullish',
    supportLevel: 4.35,
    resistanceLevel: 5.4,
    stakingApy: 8.4,
    spikeDetected: false,
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    category: 'infrastructure',
    priceUsd: 12.15,
    change1h: 0.3,
    change24h: 4.45,
    change7d: 9.8,
    high24h: 12.45,
    low24h: 11.55,
    volume24h: '$310M',
    marketCap: '$7.38B',
    circulatingSupply: '608.1M LINK',
    allTimeHigh: 52.88,
    sparkline: [11.55, 11.7, 11.82, 11.75, 11.95, 12.05, 12.12, 12.08, 12.25, 12.15],
    rsi: 59.4,
    trend: 'bullish',
    supportLevel: 10.8,
    resistanceLevel: 13.5,
    stakingApy: 4.5,
    spikeDetected: false,
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    category: 'layer1',
    priceUsd: 26.4,
    change1h: -0.4,
    change24h: 5.12,
    change7d: 11.7,
    high24h: 27.2,
    low24h: 24.9,
    volume24h: '$390M',
    marketCap: '$10.45B',
    circulatingSupply: '395.8M AVAX',
    allTimeHigh: 146.22,
    sparkline: [24.9, 25.2, 25.6, 25.4, 25.9, 26.1, 26.35, 26.2, 26.7, 26.4],
    rsi: 58.7,
    trend: 'bullish',
    supportLevel: 23.5,
    resistanceLevel: 29.5,
    stakingApy: 6.8,
    spikeDetected: false,
  },
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui Network',
    category: 'layer1',
    priceUsd: 1.04,
    change1h: 2.1,
    change24h: 9.85,
    change7d: 24.6,
    high24h: 1.08,
    low24h: 0.92,
    volume24h: '$560M',
    marketCap: '$2.85B',
    circulatingSupply: '2.68B SUI',
    allTimeHigh: 2.18,
    sparkline: [0.92, 0.94, 0.96, 0.98, 1.0, 0.99, 1.02, 1.01, 1.06, 1.04],
    rsi: 72.3,
    trend: 'bullish',
    supportLevel: 0.88,
    resistanceLevel: 1.22,
    stakingApy: 5.9,
    spikeDetected: true,
    spikeDetails: {
      percent: 9.85,
      direction: 'surge',
      timeframe: '5m',
      timestamp: Date.now() - 2 * 60 * 1000,
      reason: 'Total Value Locked (TVL) surges past $750M with native gaming bridge release',
    },
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    category: 'layer1',
    priceUsd: 0.365,
    change1h: 0.12,
    change24h: 2.15,
    change7d: 4.8,
    high24h: 0.375,
    low24h: 0.354,
    volume24h: '$260M',
    marketCap: '$13.1B',
    circulatingSupply: '35.6B ADA',
    allTimeHigh: 3.1,
    sparkline: [0.354, 0.357, 0.36, 0.358, 0.362, 0.364, 0.366, 0.363, 0.368, 0.365],
    rsi: 52.3,
    trend: 'sideways',
    supportLevel: 0.33,
    resistanceLevel: 0.42,
    stakingApy: 3.2,
    spikeDetected: false,
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    category: 'layer1',
    priceUsd: 4.45,
    change1h: -0.25,
    change24h: 1.6,
    change7d: 3.4,
    high24h: 4.58,
    low24h: 4.36,
    volume24h: '$180M',
    marketCap: '$6.38B',
    circulatingSupply: '1.43B DOT',
    allTimeHigh: 55.0,
    sparkline: [4.36, 4.39, 4.42, 4.4, 4.44, 4.46, 4.48, 4.46, 4.52, 4.45],
    rsi: 49.8,
    trend: 'sideways',
    supportLevel: 4.1,
    resistanceLevel: 5.1,
    stakingApy: 11.5,
    spikeDetected: false,
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    category: 'meme',
    priceUsd: 0.108,
    change1h: 0.95,
    change24h: 4.8,
    change7d: 10.2,
    high24h: 0.112,
    low24h: 0.102,
    volume24h: '$740M',
    marketCap: '$15.8B',
    circulatingSupply: '145.8B DOGE',
    allTimeHigh: 0.737,
    sparkline: [0.102, 0.104, 0.105, 0.104, 0.106, 0.107, 0.109, 0.108, 0.111, 0.108],
    rsi: 63.4,
    trend: 'bullish',
    supportLevel: 0.098,
    resistanceLevel: 0.125,
    spikeDetected: false,
  },
  {
    id: 'arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum One',
    category: 'layer2',
    priceUsd: 0.562,
    change1h: 0.45,
    change24h: 3.9,
    change7d: 7.8,
    high24h: 0.58,
    low24h: 0.535,
    volume24h: '$190M',
    marketCap: '$1.92B',
    circulatingSupply: '3.42B ARB',
    allTimeHigh: 2.4,
    sparkline: [0.535, 0.54, 0.548, 0.545, 0.552, 0.556, 0.56, 0.558, 0.568, 0.562],
    rsi: 56.8,
    trend: 'bullish',
    supportLevel: 0.51,
    resistanceLevel: 0.68,
    spikeDetected: false,
  },
];

export const DEFAULT_CRYPTO_PORTFOLIO: CryptoPortfolioPosition[] = [
  {
    id: 'cpos-1',
    cryptoId: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    holdings: 0.35,
    avgBuyPriceUsd: 57400.0,
    currentPriceUsd: 64850.0,
    totalInvestedUsd: 20090.0,
    currentValueUsd: 22697.5,
    unrealizedPnLUsd: 2607.5,
    unrealizedPnLPercent: 12.98,
    takeProfitTargets: [
      { targetPrice: 68500, sellPercent: 25, note: 'Take initial profit near previous range high' },
      { targetPrice: 74000, sellPercent: 40, note: 'Sell 40% at all-time high resistance' },
      { targetPrice: 85000, sellPercent: 35, note: 'Hold remaining moonbag for cycle expansion' },
    ],
    stopLossUsd: 59500.0,
    notes: 'Long-term core position, dollar-cost averaged after halving',
    dateAdded: '2026-06-15',
  },
  {
    id: 'cpos-2',
    cryptoId: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    holdings: 28.0,
    avgBuyPriceUsd: 132.0,
    currentPriceUsd: 156.8,
    totalInvestedUsd: 3696.0,
    currentValueUsd: 4390.4,
    unrealizedPnLUsd: 694.4,
    unrealizedPnLPercent: 18.79,
    takeProfitTargets: [
      { targetPrice: 175, sellPercent: 35, note: 'Lock in 35% profit on breakout' },
      { targetPrice: 210, sellPercent: 35, note: 'Scale out another 35% near $210' },
      { targetPrice: 250, sellPercent: 30, note: 'Ride remainder to previous ATH' },
    ],
    stopLossUsd: 140.0,
    notes: 'Staked on validator node for 7.2% APY passive yield',
    dateAdded: '2026-07-02',
  },
  {
    id: 'cpos-3',
    cryptoId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    holdings: 2.2,
    avgBuyPriceUsd: 2580.0,
    currentPriceUsd: 2785.4,
    totalInvestedUsd: 5676.0,
    currentValueUsd: 6127.88,
    unrealizedPnLUsd: 451.88,
    unrealizedPnLPercent: 7.96,
    takeProfitTargets: [
      { targetPrice: 3200, sellPercent: 40, note: 'Book profit at $3,200 psychological barrier' },
      { targetPrice: 3800, sellPercent: 60, note: 'Target $3.8k resistance zone' },
    ],
    stopLossUsd: 2520.0,
    notes: 'DeFi liquidity and layer-2 staking strategy',
    dateAdded: '2026-07-20',
  },
  {
    id: 'cpos-4',
    cryptoId: 'render',
    symbol: 'RENDER',
    name: 'Render Network',
    holdings: 250.0,
    avgBuyPriceUsd: 5.1,
    currentPriceUsd: 6.42,
    totalInvestedUsd: 1275.0,
    currentValueUsd: 1605.0,
    unrealizedPnLUsd: 330.0,
    unrealizedPnLPercent: 25.88,
    takeProfitTargets: [
      { targetPrice: 7.5, sellPercent: 50, note: 'Take 50% profit (2x original risk)' },
      { targetPrice: 9.8, sellPercent: 50, note: 'Let remainder run for AI compute expansion' },
    ],
    stopLossUsd: 5.6,
    notes: 'High-beta AI & DePIN narrative allocation',
    dateAdded: '2026-08-05',
  },
  {
    id: 'cpos-5',
    cryptoId: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    holdings: 180.0,
    avgBuyPriceUsd: 4.25,
    currentPriceUsd: 4.88,
    totalInvestedUsd: 765.0,
    currentValueUsd: 878.4,
    unrealizedPnLUsd: 113.4,
    unrealizedPnLPercent: 14.82,
    takeProfitTargets: [
      { targetPrice: 5.6, sellPercent: 40, note: 'Initial scale out' },
      { targetPrice: 7.2, sellPercent: 60, note: 'Longer term target' },
    ],
    stopLossUsd: 4.3,
    notes: 'User-owned AI & Chain Abstraction thesis',
    dateAdded: '2026-08-12',
  },
];

export const DEFAULT_CRYPTO_SPIKES: CryptoPriceSpikeAlert[] = [
  {
    id: 'spike-1',
    cryptoSymbol: 'SOL',
    cryptoName: 'Solana',
    spikePercent: 7.64,
    currentPrice: 156.8,
    previousPrice: 145.68,
    timeframe: '5m',
    direction: 'surge',
    volumeMultiplier: '4.8x normal volume',
    timestamp: Date.now() - 4 * 60 * 1000,
    triggeredBy: 'Whale market buy $18.4M on Binance & Coinbase + Breakout above $152 resistance',
    urgency: 'urgent',
    isRead: false,
  },
  {
    id: 'spike-2',
    cryptoSymbol: 'RENDER',
    cryptoName: 'Render Network',
    spikePercent: 11.4,
    currentPrice: 6.42,
    previousPrice: 5.76,
    timeframe: '15m',
    direction: 'surge',
    volumeMultiplier: '6.2x normal volume',
    timestamp: Date.now() - 14 * 60 * 1000,
    triggeredBy: 'AI Decentralized Compute benchmark release & High short liquidations ($4.2M wiped)',
    urgency: 'urgent',
    isRead: false,
  },
  {
    id: 'spike-3',
    cryptoSymbol: 'SUI',
    cryptoName: 'Sui Network',
    spikePercent: 9.85,
    currentPrice: 1.04,
    previousPrice: 0.946,
    timeframe: '5m',
    direction: 'surge',
    volumeMultiplier: '5.1x normal volume',
    timestamp: Date.now() - 2 * 60 * 1000,
    triggeredBy: 'Ecosystem TVL all-time high milestone ($750M+) + Upbit trading volume breakout',
    urgency: 'urgent',
    isRead: false,
  },
  {
    id: 'spike-4',
    cryptoSymbol: 'BTC',
    cryptoName: 'Bitcoin',
    spikePercent: 3.85,
    currentPrice: 64850.0,
    previousPrice: 62450.0,
    timeframe: '15m',
    direction: 'surge',
    volumeMultiplier: '3.4x normal volume',
    timestamp: Date.now() - 8 * 60 * 1000,
    triggeredBy: 'Institutional Spot ETF net inflow acceleration + Recovery above 200-day EMA',
    urgency: 'elevated',
    isRead: false,
  },
];

export const INITIAL_NETWORK_METRICS: CryptoNetworkMetric = {
  ethGasGwei: { fast: 16, standard: 11, low: 7 },
  btcMempoolSatVb: 14,
  solanaTps: 3450,
  fearAndGreedIndex: 73,
  fearAndGreedLabel: 'Greed',
  totalCryptoMarketCap: '$2.38 Trillion',
  btcDominance: 56.8,
};

export const DEFAULT_USER_SPIKE_CONFIGS: CryptoUserSpikeConfig[] = [
  { symbol: 'BTC', thresholdPercent: 2.5, alertOnSurge: true, alertOnDump: true, soundEnabled: true, isActive: true },
  { symbol: 'ETH', thresholdPercent: 3.0, alertOnSurge: true, alertOnDump: true, soundEnabled: true, isActive: true },
  { symbol: 'SOL', thresholdPercent: 4.0, alertOnSurge: true, alertOnDump: true, soundEnabled: true, isActive: true },
  { symbol: 'RENDER', thresholdPercent: 5.0, alertOnSurge: true, alertOnDump: true, soundEnabled: true, isActive: true },
  { symbol: 'SUI', thresholdPercent: 5.0, alertOnSurge: true, alertOnDump: true, soundEnabled: true, isActive: true },
];

// Helper to calculate total portfolio worth & metrics
export function calculateCryptoPortfolioSummary(
  positions: CryptoPortfolioPosition[],
  cryptoAssets: CryptoAsset[]
) {
  let totalInvestedUsd = 0;
  let totalCurrentValueUsd = 0;

  const enrichedPositions = positions.map((pos) => {
    const liveAsset = cryptoAssets.find((a) => a.symbol === pos.symbol || a.id === pos.cryptoId);
    const curPrice = liveAsset ? liveAsset.priceUsd : pos.currentPriceUsd;
    const cost = pos.avgBuyPriceUsd * pos.holdings;
    const val = curPrice * pos.holdings;
    const pnlUsd = val - cost;
    const pnlPercent = cost > 0 ? (pnlUsd / cost) * 100 : 0;

    totalInvestedUsd += cost;
    totalCurrentValueUsd += val;

    return {
      ...pos,
      currentPriceUsd: curPrice,
      totalInvestedUsd: parseFloat(cost.toFixed(2)),
      currentValueUsd: parseFloat(val.toFixed(2)),
      unrealizedPnLUsd: parseFloat(pnlUsd.toFixed(2)),
      unrealizedPnLPercent: parseFloat(pnlPercent.toFixed(2)),
      change24h: liveAsset ? liveAsset.change24h : 0,
    };
  });

  const totalPnLUsd = totalCurrentValueUsd - totalInvestedUsd;
  const totalPnLPercent = totalInvestedUsd > 0 ? (totalPnLUsd / totalInvestedUsd) * 100 : 0;

  // INR conversion rate approximation (~83.8 INR/USD)
  const inrRate = 83.8;
  const totalCurrentValueInr = totalCurrentValueUsd * inrRate;
  const totalPnLInr = totalPnLUsd * inrRate;

  // Best & worst performer
  const sortedByPnL = [...enrichedPositions].sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent);
  const bestPerformer = sortedByPnL[0] || null;
  const topHolding = [...enrichedPositions].sort((a, b) => b.currentValueUsd - a.currentValueUsd)[0] || null;

  return {
    totalInvestedUsd: parseFloat(totalInvestedUsd.toFixed(2)),
    totalCurrentValueUsd: parseFloat(totalCurrentValueUsd.toFixed(2)),
    totalPnLUsd: parseFloat(totalPnLUsd.toFixed(2)),
    totalPnLPercent: parseFloat(totalPnLPercent.toFixed(2)),
    totalCurrentValueInr: parseFloat(totalCurrentValueInr.toFixed(2)),
    totalPnLInr: parseFloat(totalPnLInr.toFixed(2)),
    isProfit: totalPnLUsd >= 0,
    positions: enrichedPositions,
    bestPerformer,
    topHolding,
  };
}

// Calculate DCA Returns Projection
export function calculateDcaReturns(
  symbol: string,
  monthlyInvestmentUsd: number,
  durationMonths: number,
  cryptoAssets: CryptoAsset[]
) {
  const asset = cryptoAssets.find((a) => a.symbol === symbol) || cryptoAssets[0];
  const totalInvested = monthlyInvestmentUsd * durationMonths;

  // Projected average historical monthly growth rate
  const monthlyRateMap: Record<string, number> = {
    BTC: 0.045, // 4.5% avg monthly compound
    ETH: 0.048,
    SOL: 0.072,
    RENDER: 0.085,
    NEAR: 0.065,
  };

  const rate = monthlyRateMap[asset.symbol] || 0.05;
  let futureValue = 0;
  for (let m = 1; m <= durationMonths; m++) {
    futureValue = (futureValue + monthlyInvestmentUsd) * (1 + rate);
  }

  const projectedProfit = futureValue - totalInvested;
  const projectedRoi = totalInvested > 0 ? (projectedProfit / totalInvested) * 100 : 0;
  const totalTokensAccumulated = totalInvested / (asset.priceUsd * 0.94);

  return {
    symbol: asset.symbol,
    name: asset.name,
    monthlyInvestmentUsd,
    durationMonths,
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    projectedFutureValue: parseFloat(futureValue.toFixed(2)),
    projectedProfit: parseFloat(projectedProfit.toFixed(2)),
    projectedRoi: parseFloat(projectedRoi.toFixed(1)),
    totalTokensAccumulated: parseFloat(totalTokensAccumulated.toFixed(4)),
  };
}

// Helper to find crypto by query
export function findCryptoAsset(query: string, currentList: CryptoAsset[] = INITIAL_CRYPTO_ASSETS): CryptoAsset {
  const q = query.trim().toUpperCase();
  const match = currentList.find(
    (a) =>
      a.symbol.toUpperCase() === q ||
      a.name.toUpperCase().includes(q) ||
      a.id.toUpperCase() === q.toLowerCase() ||
      q.includes(a.symbol.toUpperCase()) ||
      q.includes(a.name.toUpperCase())
  );

  if (match) return match;

  if (q.includes('BITCOIN') || q.includes('BTC')) return currentList[0];
  if (q.includes('ETH') || q.includes('ETHEREUM')) return currentList[1];
  if (q.includes('SOL') || q.includes('SOLANA')) return currentList[2];
  if (q.includes('RENDER') || q.includes('AI')) return currentList[5];
  if (q.includes('NEAR')) return currentList[6];
  if (q.includes('SUI')) return currentList[9];

  return currentList[0];
}
