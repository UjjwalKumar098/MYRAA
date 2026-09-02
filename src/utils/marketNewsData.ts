import { MarketNewsArticle, NewsCategory } from '../types';

export const INITIAL_MARKET_NEWS: MarketNewsArticle[] = [
  {
    id: 'news-1',
    title: 'Nvidia Blackwell Ultra AI Chips Demand Surges 300% Among Hyperscalers',
    summary: 'Cloud providers increase capital expenditure for next-generation generative AI infrastructure, driving bullish momentum across semiconductor supply chains.',
    source: 'Bloomberg Markets',
    category: 'stocks',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 12,
    timeAgo: '12m ago',
    relatedSymbol: 'NVDA',
    impactScore: 9,
    keyTakeaway: 'High target upgrades across Wall Street; buy dips with $165 target.',
  },
  {
    id: 'news-2',
    title: 'Zero-Capital Micro-SaaS Boom: How Solo Founders Hit $10K MRR Using Free Stacks',
    summary: 'New developer cohort leverages Next.js, Supabase free tier, Cloudflare, and Vercel to launch profitable AI niche tools with zero upfront server expenses.',
    source: 'TechCrunch / IndieHackers',
    category: 'business_models',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 35,
    timeAgo: '35m ago',
    impactScore: 8,
    keyTakeaway: 'Zero-cost product development is at an all-time peak for bootstrapped entrepreneurs.',
  },
  {
    id: 'news-3',
    title: 'Bitcoin Consolidates Near $68,000 as Institutional ETF Inflows Rebound',
    summary: 'Spot ETF volume picks up following macro rate pause signals from central banks, creating a strong floor above $65,500 support level.',
    source: 'CoinDesk',
    category: 'crypto',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 55,
    timeAgo: '55m ago',
    relatedSymbol: 'BTC',
    impactScore: 7,
    keyTakeaway: 'Short-term consolidation with upside breakout target of $74,000.',
  },
  {
    id: 'news-4',
    title: 'Federal Reserve Policy Shift: Rate Cuts Projected to Spur Tech Growth & Angel Investments',
    summary: 'Cooling inflation metrics give policymakers room to loosen monetary policy, elevating small-cap valuations and early-stage startup liquidity.',
    source: 'Financial Times',
    category: 'economy',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 90,
    timeAgo: '1.5h ago',
    impactScore: 8,
    keyTakeaway: 'Favorable borrowing conditions and stronger equity market risk appetite.',
  },
  {
    id: 'news-5',
    title: 'Tesla Robotaxi & Full Self-Driving Version 13 Rollout Gains Regulatory Traction',
    summary: 'Autonomous miles logged jump past 2 billion with enhanced end-to-end neural net models, improving fleet safety metrics.',
    source: 'Reuters Business',
    category: 'stocks',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 130,
    timeAgo: '2h ago',
    relatedSymbol: 'TSLA',
    impactScore: 8,
    keyTakeaway: 'Key resistance at $250; support holds strong at $215.',
  },
  {
    id: 'news-6',
    title: 'India Tech & Manufacturing Boom: NSE Nifty Crosses New Milestones on Auto & Energy Gains',
    summary: 'Domestic retail participation and sustained capital investments power Reliance Industries and Tata Motors to fresh quarterly highs.',
    source: 'Economic Times',
    category: 'stocks',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 180,
    timeAgo: '3h ago',
    relatedSymbol: 'RELIANCE',
    impactScore: 7,
    keyTakeaway: 'Long-term structural bull cycle in Indian consumer and infrastructure equities.',
  },
  {
    id: 'news-7',
    title: 'AI Automation Agencies (AAA) Surpass Traditional Marketing in Client ROI',
    summary: 'Businesses pivot from static websites to intelligent workflow automations (WhatsApp AI CRM, automated invoices, voice booking agents).',
    source: 'Forbes Tech Council',
    category: 'business_models',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 240,
    timeAgo: '4h ago',
    impactScore: 8,
    keyTakeaway: 'High-ticket retainer service model ideal for solo tech founders and agencies.',
  },
  {
    id: 'news-8',
    title: 'Apple AI Apple Intelligence Features Expand to 15 New Global Languages',
    summary: 'On-device Siri capabilities and photo editing tools roll out across international markets, bolstering iPhone 16 replacement cycles.',
    source: 'Wall Street Journal',
    category: 'ai_tech',
    sentiment: 'bullish',
    timestamp: Date.now() - 1000 * 60 * 300,
    timeAgo: '5h ago',
    relatedSymbol: 'AAPL',
    impactScore: 7,
    keyTakeaway: 'Services revenue growth cushions hardware margins; hold for $245.',
  },
];

export function getFilteredNews(category: NewsCategory | 'all', query?: string): MarketNewsArticle[] {
  return INITIAL_MARKET_NEWS.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase()) ||
      (item.relatedSymbol && item.relatedSymbol.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });
}
