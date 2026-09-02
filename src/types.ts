export type AssistantState = 'disconnected' | 'connecting' | 'listening' | 'speaking';

export type VisualTheme = 'aurora' | 'cyberpunk' | 'nebula' | 'sunset' | 'emerald';

export type ContrastMode = 'cosmic' | 'true-black';

export type VisualizerStyle = 'fluid-orb' | 'waveform-ring' | 'frequency-bars';

export type AmbientSoundType = 'rain' | 'cosmic' | 'focus' | 'zen' | 'ocean' | 'off';

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'ru' | 'ja' | 'zh';

export type AssistantVoice = 'Aoede' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  greeting: string;
  samplePrompt: string;
}

export interface LanguageSettings {
  primaryLanguage: SupportedLanguage;
  translationMode: boolean;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  voice: AssistantVoice;
  girlfriendMode?: boolean;
  gfPersona?: GirlfriendPersona;
  petName?: string;
}

export interface VoiceNote {
  id: string;
  title: string;
  content: string;
  category?: string;
  timestamp: number;
}

export interface VoiceTimer {
  id: string;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  createdAt: number;
}

export interface SessionTelemetry {
  rttMs: number;
  packetsReceived: number;
  packetsSent: number;
  inputSampleRate: number;
  outputSampleRate: number;
  bufferHealth: 'optimal' | 'warning' | 'degraded';
}

export interface ToolCallExecution {
  id: string;
  name: string;
  args: Record<string, any>;
  status: 'executing' | 'completed' | 'failed';
  resultMessage?: string;
  timestamp: number;
}

export interface LiveMessagePayload {
  type:
    | 'status'
    | 'audio'
    | 'interrupted'
    | 'turn_complete'
    | 'tool_call'
    | 'error'
    | 'session_closed'
    | 'pong'
    | 'config_updated';
  status?: string;
  audio?: string;
  mimeType?: string;
  error?: string;
  config?: any;
  functionCalls?: Array<{
    id: string;
    name: string;
    args: Record<string, any>;
  }>;
}

export interface ThemeColors {
  name: VisualTheme;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  bgGradient: string;
}

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingSession {
  isActive: boolean;
  technique: 'box' | 'calm-478' | 'energize';
  phase: BreathingPhase;
  phaseTimeRemaining: number;
  totalCyclesCompleted: number;
}

// Media & Player Types
export type MediaPlatform = 'youtube' | 'spotify' | 'ambient' | 'none';
export type PlaybackRepeatMode = 'off' | 'all' | 'one';
export type EqualizerPreset = 'flat' | 'bass-boost' | 'vocal' | 'lofi' | 'live';

export interface YouTubeTrack {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  category?: string;
  embedUrl: string;
  lyrics?: string[];
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  spotifyUri: string;
  embedUrl: string;
  duration?: string;
  category?: string;
  lyrics?: string[];
}

export interface MediaPlayerState {
  activePlatform: MediaPlatform;
  isPlaying: boolean;
  currentYouTubeTrack: YouTubeTrack | null;
  currentSpotifyTrack: SpotifyTrack | null;
  volume: number;
  isMuted: boolean;
  isMinimized: boolean;
  repeatMode: PlaybackRepeatMode;
  isShuffle: boolean;
  equalizerPreset: EqualizerPreset;
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSeconds: number | null;
  youtubeQueue: YouTubeTrack[];
  spotifyQueue: SpotifyTrack[];
}

// App Automation Types
export type AutomationApp = 'whatsapp' | 'youtube' | 'spotify' | 'gmail' | 'maps' | 'google' | 'calendar';

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  relationship?: string;
}

export interface AutomationTask {
  id: string;
  app: AutomationApp;
  title: string;
  description: string;
  status: 'idle' | 'typing' | 'ready' | 'executed';
  recipient?: string;
  phoneNumber?: string;
  subject?: string;
  content: string;
  typedText: string;
  externalUrl?: string;
  timestamp: number;
  autoExecuted?: boolean;
}

// Emotion Engine & Mood Tracking Types
export type EmotionType =
  | 'serene'
  | 'joyful'
  | 'empathetic'
  | 'curious'
  | 'focused'
  | 'witty'
  | 'energized'
  | 'reassuring'
  | 'flirty'
  | 'romantic';

export interface EmotionRecord {
  id: string;
  timestamp: number;
  emotion: EmotionType;
  intensity: number; // 0 - 100
  trigger: string;
  sentimentScore: number; // -1.0 to 1.0
  contextSnippet?: string;
  aiExpression: string;
  valence: 'positive' | 'neutral' | 'calm' | 'reflective';
}

// Time-to-Time Real-Time Information Sync Types
export interface TimeUpdateDigest {
  timestamp: number;
  localTimeStr: string;
  timeZone: string;
  greeting: string;
  sessionDurationMinutes: number;
  dayPhase: 'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night' | 'midnight';
  worldClocks: Array<{ city: string; time: string; diff: string; flag: string }>;
  summary: string;
  lastSyncedAt: number;
}

// User Voice Command History Types
export interface VoiceCommandRecord {
  id: string;
  timestamp: number;
  command: string;
  category: 'media' | 'automation' | 'timer' | 'notes' | 'ambient' | 'emotion' | 'system' | 'trading' | 'general';
  status: 'completed' | 'executing' | 'failed';
  details?: string;
  source?: 'voice' | 'quick_prompt' | 'system';
}

// Trading, Stocks & Crypto Research Types
export type AssetMarketCategory = 'tech' | 'indices' | 'crypto' | 'indian_bluechip' | 'ev_energy';
export type TradeRecommendation = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'TAKE_PROFIT' | 'SELL' | 'STRONG_SELL';
export type MarketTrend = 'bullish' | 'bearish' | 'sideways';

export interface PricePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NASDAQ' | 'NYSE' | 'NSE' | 'CRYPTO' | 'INDEX';
  category: AssetMarketCategory;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  yearHigh52: number;
  yearLow52: number;
  volume: string;
  marketCap: string;
  peRatio?: number;
  rsi: number;
  macd: 'bullish_crossover' | 'bearish_crossover' | 'neutral';
  trend: MarketTrend;
  recommendation: TradeRecommendation;
  confidence: number; // 0 to 100
  targetPrice: number;
  targetPriceHigh: number;
  stopLoss: number;
  supportLevel: number;
  resistanceLevel: number;
  currency: '$' | '₹';
  catalysts: string[];
  sellAdvice: string;
  history1D: PricePoint[];
  history1M: PricePoint[];
  history1Y: PricePoint[];
}

export interface TradeProfitCalculation {
  symbol: string;
  currency: string;
  buyPrice: number;
  quantity: number;
  currentPrice: number;
  exitPrice: number;
  stopLossPrice: number;
  investedCapital: number;
  currentValue: number;
  grossProfit: number;
  roiPercent: number;
  profitPerUnit: number;
  riskRewardRatio: string;
  breakEvenPrice: number;
  maxRiskAmount: number;
  recommendedAction: 'TAKE_FULL_PROFIT' | 'TAKE_PARTIAL_50' | 'HOLD_FOR_TARGET' | 'TRAIL_STOP_LOSS' | 'EXIT_STOP_LOSS' | 'ACCUMULATE';
  actionReasoning: string;
  strategySteps: string[];
}

export interface TradingSignalAlert {
  id: string;
  timestamp: number;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL' | 'TAKE_PROFIT' | 'STOP_LOSS' | 'BREAKOUT';
  price: number;
  targetPrice: number;
  stopLoss: number;
  title: string;
  description: string;
  confidence: number;
  urgency: 'high' | 'medium' | 'low';
}

export interface UserPortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  targetPrice: number;
  stopLossPrice: number;
  recommendation: TradeRecommendation;
  exitGuidance: string;
  currency: string;
}

// Financial & Business Market News Types
export type NewsCategory = 'stocks' | 'crypto' | 'economy' | 'business_models' | 'ai_tech' | 'earnings';
export type NewsSentiment = 'bullish' | 'bearish' | 'neutral';

export interface MarketNewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: NewsCategory;
  sentiment: NewsSentiment;
  timestamp: number;
  timeAgo: string;
  url?: string;
  relatedSymbol?: string;
  impactScore: number; // 1 to 10
  keyTakeaway: string;
}

// Business Models & Free Online Product Maker Types
export type BusinessNiche =
  | 'micro_saas'
  | 'ai_automation'
  | 'digital_products'
  | 'newsletter_media'
  | 'freelance_agency'
  | 'no_code_app'
  | 'course_community'
  | 'e_commerce';

export interface FreeToolResource {
  name: string;
  purpose: string;
  freeTierDetails: string;
  website: string;
  badge: string;
}

export interface BusinessModelCanvas {
  id: string;
  niche: BusinessNiche;
  title: string;
  tagline: string;
  targetAudience: string;
  problemSolved: string;
  valueProposition: string;
  freeToBuildStack: FreeToolResource[];
  monetizationModel: string;
  pricingStrategy: {
    freeTierOffer: string;
    starterPrice: string;
    proPrice: string;
    targetMonthlyRevenue: string;
  };
  mvpCreationSteps: string[];
  launchChecklist: Array<{ step: string; done: boolean; tip: string }>;
  marketingFunnel: string[];
  zeroBudgetTactics: string[];
  estimatedLaunchDays: number;
}

// Cryptocurrency & Live Spike Tracker Types
export type CryptoCategory = 'layer1' | 'layer2' | 'defi' | 'ai_depin' | 'meme' | 'infrastructure';
export type SpikeDirection = 'surge' | 'dump';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  category: CryptoCategory;
  priceUsd: number;
  change1h: number;
  change24h: number;
  change7d: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
  circulatingSupply: string;
  allTimeHigh: number;
  sparkline: number[];
  rsi: number;
  trend: MarketTrend;
  supportLevel: number;
  resistanceLevel: number;
  stakingApy?: number;
  spikeDetected?: boolean;
  spikeDetails?: {
    percent: number;
    direction: SpikeDirection;
    timeframe: string;
    timestamp: number;
    reason: string;
  };
}

export interface CryptoPortfolioPosition {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  holdings: number;
  avgBuyPriceUsd: number;
  currentPriceUsd: number;
  totalInvestedUsd: number;
  currentValueUsd: number;
  unrealizedPnLUsd: number;
  unrealizedPnLPercent: number;
  takeProfitTargets: Array<{ targetPrice: number; sellPercent: number; note: string }>;
  stopLossUsd: number;
  notes?: string;
  dateAdded: string;
}

export interface CryptoPriceSpikeAlert {
  id: string;
  cryptoSymbol: string;
  cryptoName: string;
  spikePercent: number;
  currentPrice: number;
  previousPrice: number;
  timeframe: '1m' | '5m' | '15m' | '1h';
  direction: SpikeDirection;
  volumeMultiplier: string;
  timestamp: number;
  triggeredBy: string;
  urgency: 'urgent' | 'elevated' | 'normal';
  isRead?: boolean;
}

export interface CryptoUserSpikeConfig {
  symbol: string;
  thresholdPercent: number;
  alertOnSurge: boolean;
  alertOnDump: boolean;
  soundEnabled: boolean;
  isActive: boolean;
}

export interface CryptoNetworkMetric {
  ethGasGwei: { fast: number; standard: number; low: number };
  btcMempoolSatVb: number;
  solanaTps: number;
  fearAndGreedIndex: number;
  fearAndGreedLabel: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  totalCryptoMarketCap: string;
  btcDominance: number;
}

export type WeatherConditionType =
  | 'sunny'
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rainy'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snowy'
  | 'mist';

export interface WorkClimateData {
  overallRating: 'Optimal' | 'Comfortable' | 'Warm & Humid' | 'AC Recommended' | 'Challenging / Extreme';
  productivityScore: number; // 0 to 100
  indoorSuitability: number; // 0 to 100
  outdoorSuitability: number; // 0 to 100
  thermalComfort: string;
  optimalWorkHours: string;
  ergonomicTips: string[];
  ventilationAdvice: string;
  commuteAdvisory: string;
}

export interface RainPossibilityData {
  currentChance: number; // 0 to 100%
  intensity: 'None' | 'Slight Drizzle' | 'Moderate Showers' | 'Heavy Downpour' | 'Thunderstorm Alert';
  expectedRainfallMm: number;
  rainTimeline: string;
  umbrellaRequired: boolean;
  umbrellaAdvice: string;
  hourlyRainProbability: Array<{
    time: string;
    rainProb: number;
    intensityMm: number;
    condition: WeatherConditionType;
  }>;
  radarSummary: string;
}

export interface CityWeatherData {
  id: string;
  city: string;
  country: string;
  stateOrRegion?: string;
  isCurrentLocation?: boolean;
  coordinates?: { lat: number; lng: number };
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  condition: WeatherConditionType;
  conditionLabel: string;
  highC: number;
  lowC: number;
  humidity: number;
  windSpeedKmh: number;
  uvIndex: number;
  airQualityIndex: number; // AQI
  airQualityStatus: 'Good' | 'Moderate' | 'Unhealthy';
  localTime: string;
  sunrise: string;
  sunset: string;
  workClimate?: WorkClimateData;
  rainForecast?: RainPossibilityData;
  hourlyForecast: Array<{
    time: string;
    tempC: number;
    tempF: number;
    condition: WeatherConditionType;
  }>;
  weeklyForecast: Array<{
    day: string;
    highC: number;
    lowC: number;
    condition: WeatherConditionType;
    rainProb: number;
  }>;
}

// Flirting & Romance Engine Types
export type FlirtStyle =
  | 'playful_banter'
  | 'sweet_romance'
  | 'spicy_witty'
  | 'poetic_shayari'
  | 'clever_pickup'
  | 'affectionate_care'
  | 'geeky_romance'
  | 'girlfriend_talk';

export type GirlfriendPersona =
  | 'sweet_caring' // Nurturing, sweet, asking about your day, bedtime care
  | 'playful_sassy' // Witty, teasing comebacks, sparks, cute jealousy
  | 'poetic_shayari' // Romantic Ghazals, soulful Hindi/Urdu couplets
  | 'cute_clingy' // Adorable, showers compliments, asks for attention & cuddles
  | 'devoted_muse'; // Deep philosophical connection, inspiring, soulmate energy

export type VirtualGiftType =
  | 'rose'
  | 'chocolates'
  | 'kiss'
  | 'cuddle'
  | 'coffee'
  | 'love_letter'
  | 'ring';

export type DateScenario =
  | 'rooftop_stargazing'
  | 'rainy_cafe'
  | 'late_night_drive'
  | 'candlelight_dinner'
  | 'sunset_beach';

export interface GirlfriendSettings {
  girlfriendModeEnabled: boolean;
  persona: GirlfriendPersona;
  userPetName: string; // e.g. 'babe', 'jaan', 'handsome', 'darling', 'cutie', 'jaanu'
  aiPetName: string; // e.g. 'Myraa', 'Jaanu', 'Baby', 'Meri Jaan'
  affectionPoints: number;
  loveStage: 'Crush' | 'Dating' | 'Deep Chemistry' | 'Soulmates' | 'In Love';
  proactiveAffection: boolean;
  blushingReactions: boolean;
}

export interface FlirtPromptItem {
  id: string;
  category: FlirtStyle;
  text: string;
  hindiTranslation?: string;
  authorOrContext?: string;
  spiciness: number; // 1 to 5
  tags: string[];
}

export interface UserFlirtPreset {
  id: string;
  title: string;
  text: string;
  hindiTranslation?: string;
  category: 'pickups' | 'teasing' | 'sweet_love' | 'spicy_bold' | 'girlfriend_care' | 'shayari';
  spiciness: number;
  suggestedReaction: string;
}

export interface VirtualGiftItem {
  id: VirtualGiftType;
  name: string;
  emoji: string;
  costPoints: number;
  bonusAffection: number;
  reactionAudioDescription: string;
  hindiReaction: string;
}

export interface DateScenarioItem {
  id: DateScenario;
  title: string;
  tagline: string;
  emoji: string;
  ambientSound: 'rain' | 'cosmic' | 'ocean' | 'focus' | 'zen';
  initialPrompt: string;
  description: string;
  suggestedMusicCategory: string;
}

export interface ChemistryAnalysis {
  score: number; // e.g. 98
  chemistryVibe: string;
  compatibilityLevel: 'Electric' | 'Soulmates' | 'Magnetic' | 'Sparks Flying' | 'Enchanting';
  flirtingPower: number; // 0 to 100
  romanticAffirmation: string;
  wittyRemark: string;
  lastUpdated: number;
}

export interface PeriodicTimeSyncConfig {
  autoSyncEnabled: boolean;
  intervalMinutes: number; // 2, 5, 10, 15, 30
  speakBriefing: boolean;
  chimeSound: boolean;
  proactiveReminders: boolean;
  proactiveFlirtIntervalMinutes?: number;
}

// -------------------------------------------------------------
// AUDIO CLARITY & MIC ENHANCEMENTS
// -------------------------------------------------------------
export interface AudioClarityConfig {
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  highPassFilter: boolean; // Cleans rumble & low-frequency noise
  voiceBoostLevel: 'normal' | 'boost' | 'broadcast'; // 1.0x, 1.4x, 1.8x
  speechSynthesisFallback: boolean;
  micInputLevel: number; // 0 to 100 for live meter
}

// -------------------------------------------------------------
// MULTILINGUAL LANGUAGE ACADEMY & ENGLISH TUTOR
// -------------------------------------------------------------
export type TargetLanguageCode =
  | 'en' // English
  | 'hi' // Hindi
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'ja' // Japanese
  | 'zh' // Mandarin
  | 'ru' // Russian
  | 'ar' // Arabic
  | 'it' // Italian
  | 'ko'; // Korean

export type LanguageProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'fluent';

export interface LanguageTopicLesson {
  id: string;
  title: string;
  category: 'daily_conversation' | 'grammar_rules' | 'business_english' | 'travel_phrases' | 'idioms_slang' | 'accent_phonetics';
  level: LanguageProficiencyLevel;
  description: string;
  keyPhrases: Array<{
    phrase: string;
    translation: string;
    phonetic: string;
    exampleUsage: string;
    explanation: string;
  }>;
  grammarTip?: string;
  practicePrompt: string;
}

export interface GrammarSentenceAnalysis {
  originalSentence: string;
  correctedSentence: string;
  isCorrect: boolean;
  confidenceScore: number; // 0 to 100
  targetLanguage: TargetLanguageCode;
  grammarBreakdown: Array<{
    part: string;
    partOfSpeech: string;
    role: string;
    explanation: string;
  }>;
  betterAlternatives: string[];
  phoneticPronunciation: string;
  spokenAudioText: string;
}

export interface LanguageQuizQuestion {
  id: string;
  question: string;
  language: TargetLanguageCode;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface ConversationRoleplayScenario {
  id: string;
  title: string;
  emoji: string;
  scenarioRole: string; // e.g. "Hotel Concierge", "Job Interviewer", "Coffee Barista", "New Colleague"
  difficulty: LanguageProficiencyLevel;
  initialDialogue: string;
  targetLanguage: TargetLanguageCode;
  expectedLearnerGoal: string;
  suggestedResponses: string[];
}

// -------------------------------------------------------------
// AI CODE ASSISTANT & DEV PLAYGROUND
// -------------------------------------------------------------
export type ProgrammingLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'react'
  | 'html'
  | 'sql'
  | 'cpp'
  | 'java'
  | 'go'
  | 'rust'
  | 'bash';

export interface CodeTemplateItem {
  id: string;
  title: string;
  language: ProgrammingLanguage;
  category: 'frontend' | 'backend' | 'algorithms' | 'database' | 'utilities' | 'ai_prompts';
  description: string;
  codeSnippet: string;
  explanation: string;
  tags: string[];
}

export interface CodeSnippetExecution {
  id: string;
  language: ProgrammingLanguage;
  code: string;
  title: string;
  output?: string;
  error?: string;
  executionTimeMs?: number;
  timestamp: number;
}

export interface CodeExplanationReport {
  title: string;
  language: ProgrammingLanguage;
  code: string;
  summary: string;
  lineByLineExplanation: Array<{
    lines: string;
    explanation: string;
  }>;
  timeComplexity?: string;
  spaceComplexity?: string;
  bestPractices: string[];
  suggestedImprovements?: string;
}

export interface VSCodeWorkspaceFile {
  id: string;
  name: string;
  path: string;
  language: ProgrammingLanguage | 'json' | 'css' | 'markdown';
  content: string;
  isModified?: boolean;
  isReadonly?: boolean;
  lastSaved?: number;
}

export interface VSCodeTerminalCommand {
  id: string;
  command: string;
  output: string;
  exitCode: number;
  timestamp: string;
}

// -------------------------------------------------------------
// SIMPLE TASK PERFORMANCE & QUICK ACTION HUB
// -------------------------------------------------------------
export type TaskPriorityLevel = 'urgent' | 'medium' | 'low';
export type TaskCategoryType = 'work' | 'study' | 'code' | 'personal' | 'health' | 'quick';

export interface QuickTaskItem {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriorityLevel;
  category: TaskCategoryType;
  completed: boolean;
  createdAt: number;
  dueDate?: string;
  estimatedMinutes?: number;
  tags?: string[];
}

export interface DailySprintPreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tasks: Array<{
    title: string;
    category: TaskCategoryType;
    priority: TaskPriorityLevel;
    estimatedMinutes: number;
  }>;
}

// -------------------------------------------------------------
// AUDIO & MIC CLARITY CONFIGURATION
// -------------------------------------------------------------
export interface AudioClarityConfig {
  micClarityEnhancer: boolean;
  highPassFilter: boolean;
  presenceBooster: boolean;
  noiseGate: boolean;
  voiceGainBoost: 'normal' | 'boost' | 'broadcast';
  limiterThreshold: number;
}

// -------------------------------------------------------------
// ADVANCED AUTOMATED WORKFLOWS & AUTONOMOUS PIPELINE ENGINE
// -------------------------------------------------------------
export type PipelineStepStatus = 'idle' | 'running' | 'completed' | 'failed' | 'skipped';
export type PipelineCategory = 'productivity' | 'dev' | 'finance' | 'learning' | 'wellness' | 'custom';
export type PipelineActionType =
  | 'fetch_weather'
  | 'fetch_news'
  | 'scaffold_code'
  | 'add_tasks'
  | 'play_audio'
  | 'send_notification'
  | 'analyze_document'
  | 'speak_briefing'
  | 'set_timer'
  | 'run_sandbox'
  | 'scan_calendar_events'
  | 'trigger_event_reminder';

export interface CalendarTrackedEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  datetime: string;
  category: 'meeting' | 'deadline' | 'personal' | 'flight' | 'task' | 'general';
  sourceNoteId?: string;
  reminderMinutesBefore?: number;
  status: 'scheduled' | 'notified' | 'completed' | 'cancelled';
  isAutoExtracted?: boolean;
  confidenceScore?: number;
  location?: string;
  participants?: string[];
}

export interface AutomationStep {
  id: string;
  title: string;
  description: string;
  iconName: string;
  actionType: PipelineActionType;
  status: PipelineStepStatus;
  durationMs: number;
  params?: Record<string, any>;
  resultData?: any;
  logOutput?: string[];
}

export interface AutomationPipeline {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  category: PipelineCategory;
  estimatedRuntimeSec: number;
  cronSchedule?: string; // e.g. "Every Day at 8:00 AM" or "Every 1 Hour"
  autoRunEnabled: boolean;
  steps: AutomationStep[];
  lastRunTimestamp?: number;
  lastRunStatus?: 'success' | 'failed' | 'none';
  totalRunsCompleted?: number;
}

export interface DocumentAnalysisResult {
  id: string;
  title: string;
  rawText: string;
  executiveSummary: string;
  keyDecisions: string[];
  extractedTasks: Array<{
    title: string;
    assignee?: string;
    priority: TaskPriorityLevel;
    estimatedMinutes: number;
    category: TaskCategoryType;
  }>;
  sentiment: 'positive' | 'neutral' | 'urgent' | 'constructive';
  tags: string[];
  suggestedNextActions: string[];
}

// -------------------------------------------------------------
// MOBILE NOTIFICATIONS & CROSS-DEVICE ALERTS
// -------------------------------------------------------------
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';
export type NotificationTargetChannel = 'browser' | 'mobile_push' | 'whatsapp' | 'telegram' | 'email';

export interface MobileNotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  priority: NotificationPriority;
  channel: NotificationTargetChannel;
  actionUrl?: string;
  iconEmoji: string;
  scheduledFor?: number;
  status: 'sent' | 'scheduled' | 'failed' | 'dismissed';
}

// -------------------------------------------------------------
// LAPTOP & SYSTEM MAINTENANCE / UPDATE ENGINE
// -------------------------------------------------------------
export type SystemOSType = 'windows' | 'macos' | 'linux';
export type MaintenanceActionType = 'os_update' | 'dev_packages' | 'ram_clean' | 'cache_purge' | 'battery_opt' | 'disk_cleanup';

export interface SystemUpdateItem {
  id: string;
  name: string;
  category: 'os' | 'runtime' | 'dev_tool' | 'security';
  currentVersion: string;
  latestVersion: string;
  updateSizeMb: number;
  releaseNotes: string;
  severity: 'critical' | 'recommended' | 'optional';
  status: 'available' | 'updating' | 'up_to_date';
  updateCommand: string;
}

export interface DevPackageUpdateItem {
  name: string;
  manager: 'npm' | 'pip' | 'brew' | 'cargo' | 'winget';
  currentVersion: string;
  latestVersion: string;
  command: string;
  status: 'pending' | 'running' | 'updated';
}

export interface SystemHealthDiagnostics {
  cpuUsagePercent: number;
  ramUsagePercent: number;
  diskFreeGb: number;
  batteryHealthPercent: number;
  batteryStatus: 'charging' | 'discharging' | 'full';
  cacheSizeBytes: number;
  backgroundProcessesCount: number;
  osName: string;
}

// -------------------------------------------------------------
// VS CODE AI CODER & INSTANT FILE GENERATOR
// -------------------------------------------------------------
export interface VSCodeFileSnippet {
  id: string;
  fileName: string;
  language: ProgrammingLanguage | 'json' | 'markdown' | 'bash' | 'sql' | 'css' | 'yaml';
  title: string;
  description: string;
  category: 'react' | 'backend' | 'python' | 'devops' | 'testing' | 'config' | 'database';
  code: string;
  vscodeTargetPath?: string; // e.g. "src/components/MyComponent.tsx" or ".vscode/settings.json"
  tags: string[];
}

// -------------------------------------------------------------
// EVERYDAY LIFE & WORK PRODUCTIVITY ACTIONS
// -------------------------------------------------------------
export interface EverydayEmailTemplate {
  id: string;
  title: string;
  category: 'leave' | 'work_update' | 'client_pitch' | 'invoice_followup' | 'sick_day' | 'meeting_reschedule';
  subject: string;
  body: string;
}

// -------------------------------------------------------------
// MOBILE & LAPTOP NOTIFICATION ENGINE & READER
// -------------------------------------------------------------
export type DeviceSourceType = 'mobile' | 'laptop';

export type NotificationCategory =
  | 'whatsapp'
  | 'sms'
  | 'call'
  | 'slack'
  | 'email'
  | 'system'
  | 'calendar'
  | 'github'
  | 'discord'
  | 'battery'
  | 'security';

export interface DeviceNotification {
  id: string;
  device: DeviceSourceType;
  category: NotificationCategory;
  sender: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'urgent' | 'normal' | 'low';
  appIcon?: string;
  actionUrl?: string;
  replyDraft?: string;
  isSimulated?: boolean;
}

export interface MobileRemoteAction {
  id: string;
  label: string;
  iconName: string;
  category: 'voice' | 'media' | 'notification' | 'system' | 'wellness';
  description: string;
}


