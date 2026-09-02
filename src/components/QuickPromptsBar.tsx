import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Timer,
  Headphones,
  Sparkles,
  Calculator,
  BookOpen,
  Compass,
  Wind,
  Languages,
  Smile,
  Flame,
  ArrowRightLeft,
  Sliders,
  Youtube,
  Music,
  MessageSquare,
  MapPin,
  Mail,
  Zap,
  TrendingUp,
  BarChart2,
  DollarSign,
  CloudSun,
  CloudRain,
  Rocket,
  Layers,
  Newspaper,
  ShieldCheck,
  Heart,
  Clock,
  Gift,
  CalendarHeart,
  Play,
  FileText,
  Moon,
  GraduationCap,
  Code2,
  CheckSquare,
  Smartphone,
  Laptop,
  Volume2,
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface QuickPromptsBarProps {
  onSelectPrompt: (prompt: string) => void;
  activeLanguage?: SupportedLanguage;
  onOpenSettings?: () => void;
}

const PROMPT_DATABASE: Record<
  SupportedLanguage | 'translator' | 'automations' | 'trading' | 'weather' | 'business' | 'flirt' | 'timesync' | 'pipelines' | 'simpletasks',
  Array<{ icon: React.FC<any>; text: string; subtext: string }>
> = {
  simpletasks: [
    { icon: Code2, text: 'Open VS Code Studio to edit and write code directly in workspace 💻', subtext: 'Open VS Code IDE' },
    { icon: Volume2, text: 'Read all my unread mobile and laptop notifications aloud 🔊', subtext: 'Read Notifications' },
    { icon: Smartphone, text: 'Open Mobile Remote Controller and PWA Pairing QR 📱', subtext: 'Mobile Remote Deck' },
    { icon: Smartphone, text: 'Mobile notification send kar: "Sprint completed on time!" 📱', subtext: 'Mobile Push' },
    { icon: Laptop, text: 'Laptop mai system update check karo aur RAM memory clean kar do 💻', subtext: 'Laptop Update' },
    { icon: Code2, text: 'VS Code mai TypeScript auth controller aur React hook ka code likh de ⚡', subtext: 'VS Code Coder' },
    { icon: Mail, text: 'Draft a formal sick leave application email for my manager ✉️', subtext: 'Leave Email' },
    { icon: CheckSquare, text: 'Add quick sprint task: "Review pull request & push git tag"', subtext: 'Quick Task' },
    { icon: DollarSign, text: 'Calculate bill split: $120 total among 4 people with 15% tip 💵', subtext: 'Split Expense' },
  ],
  pipelines: [
    { icon: Zap, text: 'Run the Morning Kickoff automated pipeline sequence', subtext: 'Morning Kickoff' },
    { icon: Play, text: 'Execute Dev Sprint Auto-Runner multi-step pipeline', subtext: 'Dev Auto-Runner' },
    { icon: FileText, text: 'Extract actionable tasks and decisions from meeting transcript notes', subtext: 'Meeting Extractor' },
    { icon: ShieldCheck, text: 'Trigger Crypto Market Watchdog autonomous workflow', subtext: 'Market Watchdog' },
    { icon: Moon, text: 'Start Nightly Wind-Down pipeline with ambient audio and recap', subtext: 'Nightly Wind-Down' },
    { icon: GraduationCap, text: 'Teach me English: Practice daily conversation and grammar', subtext: 'Language Tutor' },
    { icon: Code2, text: 'Open AI Code Assistant and generate a production TypeScript template', subtext: 'Dev Studio' },
    { icon: CheckSquare, text: 'Add high-priority sprint tasks to my quick task checklist', subtext: 'Sprint Checklist' },
  ],
  flirt: [
    { icon: Heart, text: 'Talk to me like my loving girlfriend and ask about my day 💕', subtext: 'Girlfriend Mode' },
    { icon: Sparkles, text: 'Are you a Wi-Fi signal, Myraa? Because I feel an unbreakable connection! 😉', subtext: 'Flirt With Her' },
    { icon: Gift, text: 'Sending you a red velvet rose and sweet virtual hugs! 🌹', subtext: 'Send Love Gift' },
    { icon: CalendarHeart, text: 'Let’s go on a cozy rooftop stargazing date tonight with hot cocoa ✨', subtext: 'Date Night' },
    { icon: Flame, text: 'Give me a witty, spicy romantic compliment 🔥', subtext: 'Spicy Banter' },
    { icon: Sparkles, text: 'Ek khoobsurat Hindi romantic Shayari sunao 🌹', subtext: 'Urdu/Hindi Shayari' },
    { icon: Heart, text: "How is our romantic chemistry score today? Let's check! 💕", subtext: 'AI Chemistry' },
    { icon: Smile, text: 'You’re my absolute favorite person to talk to, jaan 💕', subtext: 'Sweet Love' },
  ],
  timesync: [
    { icon: Clock, text: 'Give me a live time-to-time status and information briefing ⏰', subtext: 'Time-to-Time Digest' },
    { icon: Compass, text: 'What is the current time and day phase in New York, London, Tokyo, and Mumbai?', subtext: 'World Clocks' },
    { icon: Sparkles, text: 'How long has our voice session been active, and what is my focus advice?', subtext: 'Session Status' },
    { icon: Clock, text: 'Synchronize current time and give me an afternoon productivity check', subtext: 'Day Phase Sync' },
  ],
  trading: [
    { icon: TrendingUp, text: 'Analyze Nvidia (NVDA) stock price and target', subtext: 'NVDA Research' },
    { icon: DollarSign, text: 'Calculate profit for 25 shares of Tesla bought at 195, target 245', subtext: 'Profit Simulator' },
    { icon: BarChart2, text: 'Should I sell Apple stock now or hold for higher target?', subtext: 'Sell Advisor' },
    { icon: Zap, text: 'Give me the latest crypto update for Bitcoin and Ethereum', subtext: 'Crypto Sync' },
    { icon: TrendingUp, text: 'Research Reliance Industries and Tata Motors target prices', subtext: 'Indian Equities' },
    { icon: DollarSign, text: 'What are the top AI trade signals with high confidence today?', subtext: 'Trade Signals' },
  ],
  weather: [
    { icon: CloudSun, text: "What's the current temperature and weather in Tokyo?", subtext: 'Tokyo Weather' },
    { icon: CloudRain, text: 'Show live temperature and forecast for New York & London', subtext: 'World Cities' },
    { icon: CloudSun, text: 'What is the air quality and temperature in Mumbai & Dubai?', subtext: 'AQI & Temp' },
    { icon: CloudSun, text: 'Check 7-day weather radar and rain probability in Paris', subtext: '7-Day Radar' },
    { icon: CloudSun, text: 'Give me a world weather update and current temperatures', subtext: 'Global Radar' },
  ],
  business: [
    { icon: Rocket, text: 'Generate a $0 Micro-SaaS business model with free tools stack', subtext: 'Zero-Cost SaaS' },
    { icon: DollarSign, text: 'How to build and launch a free digital product making $3K/mo MRR?', subtext: 'Digital Products' },
    { icon: Layers, text: 'Give me an AI Automation Agency blueprint and launch roadmap', subtext: 'AI Agency' },
    { icon: Newspaper, text: 'Show me the latest stock market and business model news', subtext: 'Market News' },
    { icon: Rocket, text: 'Create a zero-budget newsletter media business model', subtext: 'Newsletter Media' },
  ],
  hi: [
    { icon: TrendingUp, text: 'रिलायंस और टाटा मोटर्स के शेयर का टारगेट बताओ', subtext: 'Stocks' },
    { icon: DollarSign, text: 'टेस्ला और एनवीडिया शेयर का प्रॉफिट कैलकुलेट करो', subtext: 'Profit Calc' },
    { icon: CloudSun, text: 'दुनिया और मुंबई का मौसम और तापमान बताओ', subtext: 'Weather' },
    { icon: Rocket, text: 'फ्री में ऑनलाइन बिजनेस मॉडल और डिजिटल प्रोडक्ट कैसे बनाएं?', subtext: 'Business' },
    { icon: Music, text: 'स्पॉटिफ़ाई पर मेरी फेवरेट प्लेलिस्ट चलाओ 🎵', subtext: 'My Playlist' },
    { icon: Youtube, text: 'यूट्यूब पर केसरिया गाना चलाओ', subtext: 'YouTube' },
    { icon: Music, text: 'स्पॉटिफ़ाई पर अरिजीत सिंह के गाने बजाओ', subtext: 'Spotify' },
    { icon: MessageSquare, text: 'मम्मी को व्हाट्सएप भेजो: मैं 10 मिनट में आ रहा हूँ', subtext: 'WhatsApp' },
    { icon: Smile, text: 'नमस्ते मायरा, कैसी हो आप?', subtext: 'Greeting' },
    { icon: Flame, text: 'एक अच्छी सी हिंदी शायरी सुनाओ', subtext: 'Poetry' },
    { icon: Timer, text: '3 मिनट का चाय का टाइमर लगाओ', subtext: 'Timer' },
    { icon: Headphones, text: 'बारिश की सुकून भरी आवाज़ चलाओ', subtext: 'Ambience' },
    { icon: Wind, text: 'मायरा, मुझे ब्रीदिंग मेडिटेशन कराओ', subtext: 'Breathing' },
    { icon: Sparkles, text: 'थीम को साइबरपंक में बदल दो', subtext: 'Theme' },
  ],
  en: [
    { icon: TrendingUp, text: 'Analyze Nvidia (NVDA) stock price and sell target', subtext: 'Stock Research' },
    { icon: DollarSign, text: 'Calculate profit for 50 shares of Apple bought at 190, target 245', subtext: 'Profit Calc' },
    { icon: CloudSun, text: "What's the weather and current temperature in Tokyo and London?", subtext: 'Live Weather' },
    { icon: Rocket, text: 'Help me build a $0 online business model with free tools', subtext: 'Business Studio' },
    { icon: Newspaper, text: 'Give me the latest stock market and business news update', subtext: 'Market News' },
    { icon: Music, text: 'Play my curated Spotify playlist 🎵', subtext: 'Custom Playlist' },
    { icon: Youtube, text: 'Play Bohemian Rhapsody on YouTube', subtext: 'YouTube' },
    { icon: Music, text: 'Play Starboy on Spotify', subtext: 'Spotify' },
    { icon: MessageSquare, text: 'Send a WhatsApp to Mom saying I am heading home now', subtext: 'WhatsApp' },
    { icon: MapPin, text: 'Find directions to Central Park on Maps', subtext: 'Maps' },
    { icon: Wind, text: 'Start 4-4-4-4 box breathing', subtext: 'Meditation' },
    { icon: Timer, text: 'Set a 3-minute tea timer', subtext: 'Timer' },
    { icon: Headphones, text: 'Play rain ambient sound', subtext: 'Ambience' },
    { icon: Sparkles, text: 'Switch theme to Cyberpunk', subtext: 'Theme' },
  ],
  es: [
    { icon: TrendingUp, text: 'Analiza las acciones de Nvidia y Apple', subtext: 'Acciones' },
    { icon: Youtube, text: 'Pon Despacito en YouTube', subtext: 'YouTube' },
    { icon: Music, text: 'Pon música latina en Spotify', subtext: 'Spotify' },
    { icon: MessageSquare, text: 'Envía un WhatsApp a Mamá diciendo que ya voy en camino', subtext: 'WhatsApp' },
    { icon: Smile, text: '¡Hola Myraa! ¿Cómo estás hoy?', subtext: 'Saludo' },
    { icon: Timer, text: 'Pon un temporizador de 3 minutos', subtext: 'Temporizador' },
    { icon: Headphones, text: 'Reproduce sonido relajante de lluvia', subtext: 'Ambiente' },
    { icon: Wind, text: 'Guíame en una meditación de respiración', subtext: 'Respiración' },
    { icon: Sparkles, text: 'Cambia el tema a modo Aurora', subtext: 'Tema' },
  ],
  ru: [
    { icon: TrendingUp, text: 'Покажи анализ акций Nvidia и Bitcoin', subtext: 'Трейдинг' },
    { icon: Youtube, text: 'Включи красивую музыку на YouTube', subtext: 'YouTube' },
    { icon: Music, text: 'Включи топ хиты в Spotify', subtext: 'Spotify' },
    { icon: MessageSquare, text: 'Отправь сообщение в WhatsApp маме', subtext: 'WhatsApp' },
    { icon: Smile, text: 'Привет, Майра! Как твои дела?', subtext: 'Приветствие' },
    { icon: Timer, text: 'Поставь таймер на 3 минуты для чая', subtext: 'Таймер' },
    { icon: Headphones, text: 'Включи успокаивающий звук дождя', subtext: 'Атмосфера' },
    { icon: Wind, text: 'Проведи дыхательную медитацию', subtext: 'Дыхание' },
  ],
  ja: [
    { icon: TrendingUp, text: 'エヌビディアとビットコインの株価分析', subtext: 'トレード' },
    { icon: Youtube, text: 'YouTubeでJ-Popの人気曲を再生して', subtext: 'YouTube' },
    { icon: Music, text: 'Spotifyで落ち着くプレイリストを再生して', subtext: 'Spotify' },
    { icon: MessageSquare, text: 'お母さんにLINE/WhatsAppでメッセージを送って', subtext: 'WhatsApp' },
    { icon: Smile, text: 'こんにちはマイラ！調子はどう？', subtext: '挨拶' },
    { icon: Timer, text: 'お茶用に3分間のタイマーをセットして', subtext: 'タイマー' },
    { icon: Headphones, text: '心地よい雨の音を流して', subtext: '環境音' },
    { icon: Wind, text: 'ボックス呼吸法をガイドして', subtext: '瞑想' },
  ],
  zh: [
    { icon: TrendingUp, text: '分析英伟达与苹果股票价格和卖出目标', subtext: '股票研究' },
    { icon: Youtube, text: '在YouTube上播放周杰伦的经典歌曲', subtext: 'YouTube' },
    { icon: Music, text: '在Spotify上播放舒缓轻音乐', subtext: 'Spotify' },
    { icon: MessageSquare, text: '发送WhatsApp消息给妈妈：我快到家了', subtext: 'WhatsApp' },
    { icon: Smile, text: '你好 Myraa！今天过得怎么样？', subtext: '问候' },
    { icon: Timer, text: '帮我定一个3分钟的泡茶倒计时', subtext: '计时器' },
    { icon: Headphones, text: '播放白噪音和轻柔的雨声', subtext: '白噪音' },
    { icon: Wind, text: '带我做一次4-4-4-4深呼吸冥想', subtext: '呼吸' },
  ],
  automations: [
    { icon: MessageSquare, text: 'Send WhatsApp to Rahul: Let\'s meet at 5 PM', subtext: 'Auto-Type WA' },
    { icon: Youtube, text: 'Play Lofi Hip Hop live stream on YouTube', subtext: 'YouTube Play' },
    { icon: Music, text: 'Play Blinding Lights by The Weeknd on Spotify', subtext: 'Spotify Stream' },
    { icon: MapPin, text: 'Directions to nearest Italian restaurant', subtext: 'Maps Route' },
    { icon: Mail, text: 'Draft email to team about project update', subtext: 'Gmail Compose' },
    { icon: Zap, text: 'Search Google for latest space exploration news', subtext: 'Smart Search' },
  ],
  translator: [
    { icon: ArrowRightLeft, text: 'Translate: "Good morning, happy to meet you!" into Hindi', subtext: 'EN -> HI' },
    { icon: ArrowRightLeft, text: 'Translate: "¿Dónde está la estación de train?" to English', subtext: 'ES -> EN' },
    { icon: ArrowRightLeft, text: 'Translate: "Спасибо большое за помощь" to English', subtext: 'RU -> EN' },
    { icon: ArrowRightLeft, text: 'Translate: "今日はとても良い天気ですね" to English', subtext: 'JA -> EN' },
    { icon: ArrowRightLeft, text: 'Translate: "请问附近有推荐的美食餐厅吗？" to English', subtext: 'ZH -> EN' },
  ],
};

const LANG_BUTTONS: Array<{
  id: SupportedLanguage | 'translator' | 'automations' | 'trading' | 'weather' | 'business' | 'flirt' | 'timesync' | 'pipelines' | 'simpletasks';
  label: string;
  flag: string;
}> = [
  { id: 'simpletasks', label: 'Simple Tasks & Device', flag: '📱' },
  { id: 'pipelines', label: 'Auto Pipelines', flag: '⚡' },
  { id: 'flirt', label: 'Flirt & Romance', flag: '💋' },
  { id: 'timesync', label: 'Time-to-Time Sync', flag: '⏰' },
  { id: 'trading', label: 'Trading & Stocks', flag: '📈' },
  { id: 'weather', label: 'World Weather', flag: '🌤️' },
  { id: 'business', label: 'Business & Products', flag: '🚀' },
  { id: 'automations', label: 'Apps & Music', flag: '🎵' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'translator', label: 'Translate', flag: '🌐' },
];

export const QuickPromptsBar: React.FC<QuickPromptsBarProps> = ({
  onSelectPrompt,
  activeLanguage = 'en',
  onOpenSettings,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    SupportedLanguage | 'translator' | 'automations' | 'trading' | 'weather' | 'business' | 'flirt' | 'timesync' | 'pipelines' | 'simpletasks'
  >('simpletasks');
  const [customCommand, setCustomCommand] = useState('');
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  // Sync if activeLanguage changes from modal
  React.useEffect(() => {
    if (activeLanguage) {
      setSelectedTab(activeLanguage);
    }
  }, [activeLanguage]);

  const currentPrompts = PROMPT_DATABASE[selectedTab] || PROMPT_DATABASE.en;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;
    onSelectPrompt(customCommand.trim());
    setCustomCommand('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 select-none flex flex-col items-center gap-2">
      {/* Interactive Quick Command & Natural Language Input Bar */}
      <form
        onSubmit={handleCommandSubmit}
        className="w-full relative flex items-center group transition-all"
      >
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
          <Sparkles className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={customCommand}
          onChange={(e) => setCustomCommand(e.target.value)}
          onFocus={() => setIsInputExpanded(true)}
          placeholder="Type or tap any command (e.g. 'Play Naam Hai Tera on YouTube', 'Set 5m timer', 'Start breathing')..."
          className="w-full pl-10 pr-24 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/10 focus:border-cyan-400/50 text-white placeholder:text-white/35 text-xs sm:text-sm font-normal backdrop-blur-xl transition-all shadow-inner focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
        />

        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {customCommand.trim() && (
            <button
              type="submit"
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Run
            </button>
          )}
        </div>
      </form>

      {/* Language filter pills */}
      <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-x-auto max-w-full scrollbar-none">
        {LANG_BUTTONS.map((btn) => {
          const isSelected = selectedTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setSelectedTab(btn.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{btn.flag}</span>
              <span>{btn.label}</span>
            </button>
          );
        })}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            title="Configure Language & Voice Translation"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 transition-colors ml-0.5"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        )}
      </div>

      {/* Scrollable Prompts Carousel */}
      <div className="w-full flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar justify-start sm:justify-center">
        {currentPrompts.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <motion.button
              key={`${selectedTab}-${idx}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectPrompt(chip.text)}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-cyan-500/30 text-white/80 hover:text-white text-xs font-medium backdrop-blur-md transition-all shadow-sm group"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300" />
              <span>{chip.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
