import {
  StockQuote,
  TradeProfitCalculation,
  TradingSignalAlert,
  UserPortfolioPosition,
  PricePoint,
} from '../types';

// Helper to generate simulated historical candlestick/line chart points
function generateHistoryPoints(basePrice: number, count: number, volatility: number): PricePoint[] {
  const points: PricePoint[] = [];
  let current = basePrice * (1 - volatility * (count / 2) * 0.01);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const timeDelta = (count - i) * 15 * 60 * 1000;
    const date = new Date(now - timeDelta);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const open = current;
    const change = (Math.random() - 0.48) * (basePrice * volatility * 0.02);
    const close = Math.max(basePrice * 0.5, open + change);
    const high = Math.max(open, close) + Math.random() * (basePrice * volatility * 0.01);
    const low = Math.min(open, close) - Math.random() * (basePrice * volatility * 0.01);
    const volume = Math.floor(Math.random() * 50000 + 10000);

    points.push({
      time: timeStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    current = close;
  }
  return points;
}

export const INITIAL_STOCKS: StockQuote[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    category: 'tech',
    price: 128.45,
    change: 4.85,
    changePercent: 3.92,
    dayHigh: 130.2,
    dayLow: 124.1,
    yearHigh52: 140.76,
    yearLow52: 40.85,
    volume: '54.2M',
    marketCap: '$3.15T',
    peRatio: 48.6,
    rsi: 68.4,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'STRONG_BUY',
    confidence: 92,
    targetPrice: 148.0,
    targetPriceHigh: 165.0,
    stopLoss: 118.5,
    supportLevel: 122.0,
    resistanceLevel: 135.0,
    currency: '$',
    catalysts: [
      'Blackwell B200 AI GPU enterprise demand surge',
      'Record data center gross margins expanding to 78%',
      'Massive hyperscaler capex commitment from Microsoft, Meta, and Google',
    ],
    sellAdvice:
      'Strong upward momentum. If holding short-term, take 30% partial profit at $138 resistance. Keep trailing stop-loss at $121 to lock in gains.',
    history1D: generateHistoryPoints(128.45, 16, 1.2),
    history1M: generateHistoryPoints(128.45, 30, 2.5),
    history1Y: generateHistoryPoints(128.45, 52, 4.0),
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    category: 'tech',
    price: 224.8,
    change: 2.15,
    changePercent: 0.97,
    dayHigh: 226.5,
    dayLow: 222.9,
    yearHigh52: 237.23,
    yearLow52: 164.08,
    volume: '42.1M',
    marketCap: '$3.44T',
    peRatio: 33.4,
    rsi: 58.2,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'BUY',
    confidence: 84,
    targetPrice: 245.0,
    targetPriceHigh: 260.0,
    stopLoss: 212.0,
    supportLevel: 218.0,
    resistanceLevel: 232.0,
    currency: '$',
    catalysts: [
      'Apple Intelligence rollout driving iPhone 16 supercycle',
      'Services revenue all-time high with 1B+ paid subscriptions',
      'Massive $110B stock buyback authorization underway',
    ],
    sellAdvice:
      'Holding above 50-day EMA ($219). Hold for target $245. Consider trimming position if RSI exceeds 75 near $236 resistance.',
    history1D: generateHistoryPoints(224.8, 16, 0.8),
    history1M: generateHistoryPoints(224.8, 30, 1.5),
    history1Y: generateHistoryPoints(224.8, 52, 2.2),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    category: 'ev_energy',
    price: 218.5,
    change: -3.8,
    changePercent: -1.71,
    dayHigh: 224.9,
    dayLow: 215.2,
    yearHigh52: 271.0,
    yearLow52: 138.8,
    volume: '68.4M',
    marketCap: '$698B',
    peRatio: 61.2,
    rsi: 46.1,
    macd: 'neutral',
    trend: 'sideways',
    recommendation: 'HOLD',
    confidence: 68,
    targetPrice: 245.0,
    targetPriceHigh: 280.0,
    stopLoss: 198.0,
    supportLevel: 205.0,
    resistanceLevel: 235.0,
    currency: '$',
    catalysts: [
      'Robotaxi unveiling & Full Self-Driving v13 milestone',
      'Energy storage Megapack deployments up 157% YoY',
      'Next-gen low-cost vehicle platform entry timeline',
    ],
    sellAdvice:
      'High volatility zone. If holding in profit, lock in 50% gains above $230. Tighten stop-loss to $204 if support at $210 breaks.',
    history1D: generateHistoryPoints(218.5, 16, 2.2),
    history1M: generateHistoryPoints(218.5, 30, 3.8),
    history1Y: generateHistoryPoints(218.5, 52, 5.0),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    category: 'tech',
    price: 418.2,
    change: 3.4,
    changePercent: 0.82,
    dayHigh: 421.0,
    dayLow: 415.5,
    yearHigh52: 468.35,
    yearLow52: 309.45,
    volume: '22.8M',
    marketCap: '$3.11T',
    peRatio: 35.8,
    rsi: 54.0,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'BUY',
    confidence: 88,
    targetPrice: 480.0,
    targetPriceHigh: 510.0,
    stopLoss: 398.0,
    supportLevel: 410.0,
    resistanceLevel: 440.0,
    currency: '$',
    catalysts: [
      'Azure Cloud AI workloads growing at 29% annualized',
      'Copilot enterprise monetization scaling across Microsoft 365',
      'OpenAI partnership reinforcing market leadership',
    ],
    sellAdvice:
      'Solid defensive growth compounder. No urgent sell signal. Maintain position for long-term target $480. Sell covered calls if looking for extra yield.',
    history1D: generateHistoryPoints(418.2, 16, 0.7),
    history1M: generateHistoryPoints(418.2, 30, 1.4),
    history1Y: generateHistoryPoints(418.2, 52, 2.0),
  },
  {
    symbol: 'BTC-USD',
    name: 'Bitcoin (Crypto)',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 64250.0,
    change: 1820.0,
    changePercent: 2.92,
    dayHigh: 65100.0,
    dayLow: 62150.0,
    yearHigh52: 73750.0,
    yearLow52: 25400.0,
    volume: '$28.4B',
    marketCap: '$1.26T',
    rsi: 62.5,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'STRONG_BUY',
    confidence: 89,
    targetPrice: 72000.0,
    targetPriceHigh: 85000.0,
    stopLoss: 58500.0,
    supportLevel: 61200.0,
    resistanceLevel: 68500.0,
    currency: '$',
    catalysts: [
      'Institutional Spot ETF net inflows accelerating',
      'Post-halving supply squeeze tightening exchange reserves',
      'Global rate cut cycle beginning in major central banks',
    ],
    sellAdvice:
      'Bullish structural breakout above $63.5k. Target 1: $68.5k (take 25% profit). Target 2: $73.5k (take 35% profit). Trail stop-loss at $60.5k.',
    history1D: generateHistoryPoints(64250, 16, 2.8),
    history1M: generateHistoryPoints(64250, 30, 4.5),
    history1Y: generateHistoryPoints(64250, 52, 6.0),
  },
  {
    symbol: 'ETH-USD',
    name: 'Ethereum (Crypto)',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 2740.0,
    change: 85.0,
    changePercent: 3.2,
    dayHigh: 2795.0,
    dayLow: 2640.0,
    yearHigh52: 4090.0,
    yearLow52: 1520.0,
    volume: '$14.2B',
    marketCap: '$329B',
    rsi: 59.4,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'BUY',
    confidence: 82,
    targetPrice: 3250.0,
    targetPriceHigh: 3800.0,
    stopLoss: 2450.0,
    supportLevel: 2580.0,
    resistanceLevel: 2950.0,
    currency: '$',
    catalysts: [
      'Spot Ethereum ETF trading liquidity deepening',
      'Layer-2 rollup TVL crossing $45B with reduced gas fees',
      'Staking yields offering attractive decentralized cash flow',
    ],
    sellAdvice:
      'Gaining momentum towards $3,000 psychological barrier. Sell 30% at $2,950 resistance, trail remaining position with $2,580 stop-loss.',
    history1D: generateHistoryPoints(2740, 16, 3.1),
    history1M: generateHistoryPoints(2740, 30, 4.8),
    history1Y: generateHistoryPoints(2740, 52, 6.5),
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    category: 'indian_bluechip',
    price: 2980.5,
    change: 38.2,
    changePercent: 1.3,
    dayHigh: 3010.0,
    dayLow: 2945.0,
    yearHigh52: 3217.9,
    yearLow52: 2221.0,
    volume: '7.8M',
    marketCap: '₹20.1T',
    peRatio: 28.2,
    rsi: 61.2,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'BUY',
    confidence: 86,
    targetPrice: 3350.0,
    targetPriceHigh: 3600.0,
    stopLoss: 2820.0,
    supportLevel: 2890.0,
    resistanceLevel: 3120.0,
    currency: '₹',
    catalysts: [
      'Jio 5G monetization & upcoming separate listing valuation boost',
      'Reliance Retail expansion with rapid grocery delivery footprint',
      'Green energy gigafactory commissioning timeline in Jamnagar',
    ],
    sellAdvice:
      'Approaching ₹3,050 breakout hurdle. Hold existing longs with ₹2,880 stop-loss. Book 40% profit near ₹3,200.',
    history1D: generateHistoryPoints(2980.5, 16, 1.1),
    history1M: generateHistoryPoints(2980.5, 30, 2.0),
    history1Y: generateHistoryPoints(2980.5, 52, 3.2),
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    category: 'indian_bluechip',
    price: 4320.0,
    change: 45.0,
    changePercent: 1.05,
    dayHigh: 4360.0,
    dayLow: 4280.0,
    yearHigh52: 4592.0,
    yearLow52: 3313.0,
    volume: '2.1M',
    marketCap: '₹15.6T',
    peRatio: 31.4,
    rsi: 57.8,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'BUY',
    confidence: 81,
    targetPrice: 4750.0,
    targetPriceHigh: 5000.0,
    stopLoss: 4120.0,
    supportLevel: 4220.0,
    resistanceLevel: 4480.0,
    currency: '₹',
    catalysts: [
      'Large deal total contract value (TCV) surpassing $10B quarterly',
      'GenAI transformation pipeline with Fortune 500 enterprises',
      'Consistent dividend yield and robust operating margins at 26%',
    ],
    sellAdvice:
      'Steady compounder. If trading short-term, sell half at ₹4,480. Long-term investors can hold comfortably with target ₹4,800.',
    history1D: generateHistoryPoints(4320, 16, 0.9),
    history1M: generateHistoryPoints(4320, 30, 1.8),
    history1Y: generateHistoryPoints(4320, 52, 2.6),
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    exchange: 'NSE',
    category: 'indian_bluechip',
    price: 1085.4,
    change: 18.6,
    changePercent: 1.74,
    dayHigh: 1098.0,
    dayLow: 1062.0,
    yearHigh52: 1179.0,
    yearLow52: 593.0,
    volume: '11.4M',
    marketCap: '₹3.98T',
    peRatio: 16.8,
    rsi: 65.3,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'STRONG_BUY',
    confidence: 88,
    targetPrice: 1250.0,
    targetPriceHigh: 1380.0,
    stopLoss: 995.0,
    supportLevel: 1040.0,
    resistanceLevel: 1140.0,
    currency: '₹',
    catalysts: [
      'Jaguar Land Rover (JLR) EBIT margin hitting multi-year highs',
      'Demerger of Commercial & Passenger Vehicle businesses unlocking value',
      'Dominant 70%+ market share in Indian passenger Electric Vehicles',
    ],
    sellAdvice:
      'Strong uptrend channel. Take 35% profit at ₹1,140 resistance. Move trailing stop-loss to ₹1,035 to protect accumulated profits.',
    history1D: generateHistoryPoints(1085.4, 16, 1.4),
    history1M: generateHistoryPoints(1085.4, 30, 2.8),
    history1Y: generateHistoryPoints(1085.4, 52, 4.2),
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    exchange: 'INDEX',
    category: 'indices',
    price: 562.4,
    change: 3.1,
    changePercent: 0.55,
    dayHigh: 564.2,
    dayLow: 559.8,
    yearHigh52: 565.16,
    yearLow52: 410.0,
    volume: '38.6M',
    marketCap: '$580B',
    rsi: 60.1,
    macd: 'bullish_crossover',
    trend: 'bullish',
    recommendation: 'BUY',
    confidence: 85,
    targetPrice: 590.0,
    targetPriceHigh: 610.0,
    stopLoss: 542.0,
    supportLevel: 550.0,
    resistanceLevel: 568.0,
    currency: '$',
    catalysts: [
      'Broadening market breadth beyond Mega-Cap tech',
      'Corporate earnings growth tracking above consensus expectations',
      'Soft-landing economic data with steady consumer spending',
    ],
    sellAdvice:
      'Trading near all-time high channel. Dollar-cost average or hold. If overleveraged in call options, take profit near $566 resistance.',
    history1D: generateHistoryPoints(562.4, 16, 0.6),
    history1M: generateHistoryPoints(562.4, 30, 1.2),
    history1Y: generateHistoryPoints(562.4, 52, 1.8),
  },
];

export const DEFAULT_TRADING_ALERTS: TradingSignalAlert[] = [
  {
    id: 'sig-1',
    timestamp: Date.now() - 12 * 60 * 1000,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'BUY',
    price: 128.45,
    targetPrice: 148.0,
    stopLoss: 118.5,
    title: 'Bullish Flag Breakout with Volume Confirmation',
    description:
      'NVDA crossed above $127.5 resistance on 1.4x average volume. MACD histogram turned green. Target $148.',
    confidence: 92,
    urgency: 'high',
  },
  {
    id: 'sig-2',
    timestamp: Date.now() - 35 * 60 * 1000,
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'TAKE_PROFIT',
    price: 218.5,
    targetPrice: 235.0,
    stopLoss: 205.0,
    title: 'Resistance Test at $225 - Consider Scaling Out 50%',
    description:
      'Approaching upper Bollinger band. Stochastics showing short-term overbought divergence. Lock in partial profit.',
    confidence: 76,
    urgency: 'medium',
  },
  {
    id: 'sig-3',
    timestamp: Date.now() - 55 * 60 * 1000,
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    type: 'BREAKOUT',
    price: 64250.0,
    targetPrice: 72000.0,
    stopLoss: 60500.0,
    title: 'Daily Bullish Engulfing Candle Above 200-Day EMA',
    description:
      'Bitcoin recovered $63,800 key trendline. Massive short liquidations detected. Upside target $72,000.',
    confidence: 89,
    urgency: 'high',
  },
  {
    id: 'sig-4',
    timestamp: Date.now() - 90 * 60 * 1000,
    symbol: 'TATAMOTORS',
    name: 'Tata Motors',
    type: 'BUY',
    price: 1085.4,
    targetPrice: 1250.0,
    stopLoss: 995.0,
    title: 'All-Time High Base Consolidation Finished',
    description:
      'Institutional accumulation detected. JLR margin expansion fueling multiple re-rating.',
    confidence: 88,
    urgency: 'medium',
  },
];

export const DEFAULT_USER_PORTFOLIO: UserPortfolioPosition[] = [
  {
    id: 'pos-1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 40,
    buyPrice: 112.5,
    currentPrice: 128.45,
    totalCost: 4500.0,
    currentValue: 5138.0,
    unrealizedPnL: 638.0,
    unrealizedPnLPercent: 14.18,
    targetPrice: 145.0,
    stopLossPrice: 120.0,
    recommendation: 'HOLD',
    exitGuidance: 'Hold for Target $145. Raise trailing stop to $121 to guarantee +$340 profit.',
    currency: '$',
  },
  {
    id: 'pos-2',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    shares: 25,
    buyPrice: 195.0,
    currentPrice: 218.5,
    totalCost: 4875.0,
    currentValue: 5462.5,
    unrealizedPnL: 587.5,
    unrealizedPnLPercent: 12.05,
    targetPrice: 235.0,
    stopLossPrice: 208.0,
    recommendation: 'TAKE_PROFIT',
    exitGuidance: 'Consider selling 12 shares (50%) to lock in +$282 gain. Let remainder run with $208 stop.',
    currency: '$',
  },
  {
    id: 'pos-3',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    shares: 30,
    buyPrice: 2780.0,
    currentPrice: 2980.5,
    totalCost: 83400.0,
    currentValue: 89415.0,
    unrealizedPnL: 6015.0,
    unrealizedPnLPercent: 7.21,
    targetPrice: 3300.0,
    stopLossPrice: 2880.0,
    recommendation: 'BUY',
    exitGuidance: 'Solid buffer. Target ₹3,300. Hold position through upcoming AGM announcements.',
    currency: '₹',
  },
];

// Calculation & Sell Advisory Engine
export function calculateTradeProfitAndStrategy(
  stock: StockQuote,
  buyPrice: number,
  quantity: number,
  customExitPrice?: number,
  customStopLossPrice?: number
): TradeProfitCalculation {
  const exitPrice = customExitPrice && customExitPrice > 0 ? customExitPrice : stock.targetPrice;
  const stopLossPrice = customStopLossPrice && customStopLossPrice > 0 ? customStopLossPrice : stock.stopLoss;

  const investedCapital = buyPrice * quantity;
  const currentValue = stock.price * quantity;
  const targetValue = exitPrice * quantity;
  const grossProfit = targetValue - investedCapital;
  const currentUnrealized = currentValue - investedCapital;
  const roiPercent = investedCapital > 0 ? (grossProfit / investedCapital) * 100 : 0;
  const currentRoi = investedCapital > 0 ? (currentUnrealized / investedCapital) * 100 : 0;
  const profitPerUnit = exitPrice - buyPrice;

  const maxRiskPerUnit = Math.max(0.1, buyPrice - stopLossPrice);
  const potentialRewardPerUnit = Math.max(0.1, exitPrice - buyPrice);
  const ratio = (potentialRewardPerUnit / maxRiskPerUnit).toFixed(2);
  const riskRewardRatio = `1 : ${ratio}`;
  const maxRiskAmount = maxRiskPerUnit * quantity;

  // Smart action & sell reasoning
  let recommendedAction: TradeProfitCalculation['recommendedAction'] = 'HOLD_FOR_TARGET';
  let actionReasoning = '';
  const strategySteps: string[] = [];

  if (stock.price <= stopLossPrice) {
    recommendedAction = 'EXIT_STOP_LOSS';
    actionReasoning = `Price has breached your stop-loss boundary (${stock.currency}${stopLossPrice.toFixed(
      2
    )}). Cut losses immediately to preserve capital.`;
    strategySteps.push(`Execute market sell order for all ${quantity} units`);
    strategySteps.push(`Limit portfolio drawdown to ${stock.currency}${maxRiskAmount.toFixed(2)}`);
    strategySteps.push('Re-evaluate entry at lower major support');
  } else if (stock.rsi >= 75 || stock.price >= stock.resistanceLevel) {
    recommendedAction = 'TAKE_PARTIAL_50';
    actionReasoning = `Overbought RSI (${stock.rsi.toFixed(1)}) and immediate resistance test. High probability of pullback. Lock in 50% profits now.`;
    strategySteps.push(`Sell ${Math.ceil(quantity * 0.5)} units at market price (${stock.currency}${stock.price.toFixed(2)})`);
    strategySteps.push(`Move stop-loss for remaining ${Math.floor(quantity * 0.5)} units to Break-Even (${stock.currency}${buyPrice.toFixed(2)})`);
    strategySteps.push(`Let remaining 50% position ride risk-free toward ${stock.currency}${exitPrice.toFixed(2)} target`);
  } else if (currentRoi >= 25) {
    recommendedAction = 'TAKE_FULL_PROFIT';
    actionReasoning = `Target ROI of +${currentRoi.toFixed(1)}% achieved. Secure profits and re-allocate into fresh high-probability setups.`;
    strategySteps.push(`Sell 100% position to realize ${stock.currency}${currentUnrealized.toFixed(2)} net gain`);
    strategySteps.push('Avoid round-tripping winning trades into pullbacks');
  } else if (stock.price > buyPrice && currentRoi > 5) {
    recommendedAction = 'TRAIL_STOP_LOSS';
    actionReasoning = `Trade is in profit (+${currentRoi.toFixed(1)}%). Protect gains by trailing your stop-loss just below recent swing lows.`;
    const trailingStop = stock.price * 0.95;
    strategySteps.push(`Raise stop-loss from ${stock.currency}${stopLossPrice.toFixed(2)} to ${stock.currency}${trailingStop.toFixed(2)}`);
    strategySteps.push(`Target 1: Sell 35% at ${stock.currency}${stock.resistanceLevel.toFixed(2)}`);
    strategySteps.push(`Target 2: Sell 65% at final objective ${stock.currency}${exitPrice.toFixed(2)}`);
  } else {
    recommendedAction = 'HOLD_FOR_TARGET';
    actionReasoning = `Structure remains intact with ${stock.trend} momentum. Maintain position toward target ${stock.currency}${exitPrice.toFixed(
      2
    )}.`;
    strategySteps.push(`Hold existing position with defined stop at ${stock.currency}${stopLossPrice.toFixed(2)}`);
    strategySteps.push(`Risk to Reward is favorable at ${riskRewardRatio}`);
    strategySteps.push(`Next catalyst review upon approaching ${stock.currency}${stock.resistanceLevel.toFixed(2)}`);
  }

  return {
    symbol: stock.symbol,
    currency: stock.currency,
    buyPrice,
    quantity,
    currentPrice: stock.price,
    exitPrice,
    stopLossPrice,
    investedCapital: parseFloat(investedCapital.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    roiPercent: parseFloat(roiPercent.toFixed(2)),
    profitPerUnit: parseFloat(profitPerUnit.toFixed(2)),
    riskRewardRatio,
    breakEvenPrice: buyPrice,
    maxRiskAmount: parseFloat(maxRiskAmount.toFixed(2)),
    recommendedAction,
    actionReasoning,
    strategySteps,
  };
}

export function findStockOrCrypto(query: string, currentList: StockQuote[] = INITIAL_STOCKS): StockQuote {
  const q = query.trim().toUpperCase();
  const directMatch = currentList.find(
    (s) =>
      s.symbol.toUpperCase() === q ||
      s.name.toUpperCase().includes(q) ||
      q.includes(s.symbol.toUpperCase()) ||
      q.includes(s.name.toUpperCase())
  );

  if (directMatch) return directMatch;

  // Fuzzy category matches
  if (q.includes('CRYPTO') || q.includes('BITCOIN') || q.includes('BTC')) {
    return currentList.find((s) => s.symbol === 'BTC-USD') || currentList[4];
  }
  if (q.includes('ETH') || q.includes('ETHEREUM')) {
    return currentList.find((s) => s.symbol === 'ETH-USD') || currentList[5];
  }
  if (q.includes('NVIDIA') || q.includes('NVDA') || q.includes('AI CHIP')) {
    return currentList.find((s) => s.symbol === 'NVDA') || currentList[0];
  }
  if (q.includes('TESLA') || q.includes('TSLA') || q.includes('ELON')) {
    return currentList.find((s) => s.symbol === 'TSLA') || currentList[2];
  }
  if (q.includes('APPLE') || q.includes('AAPL') || q.includes('IPHONE')) {
    return currentList.find((s) => s.symbol === 'AAPL') || currentList[1];
  }
  if (q.includes('RELIANCE') || q.includes('JIO') || q.includes('MUKESH')) {
    return currentList.find((s) => s.symbol === 'RELIANCE') || currentList[6];
  }
  if (q.includes('TATA') || q.includes('TCS') || q.includes('TATAMOTORS')) {
    return currentList.find((s) => s.symbol === 'TATAMOTORS' || s.symbol === 'TCS') || currentList[8];
  }

  return currentList[0];
}
