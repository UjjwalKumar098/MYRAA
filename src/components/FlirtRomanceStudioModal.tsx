import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ContrastMode,
  FlirtStyle,
  FlirtPromptItem,
  ChemistryAnalysis,
  EmotionType,
  GirlfriendSettings,
  GirlfriendPersona,
  VirtualGiftType,
  DateScenario,
  UserFlirtPreset,
} from '../types';
import {
  FLIRT_CATEGORIES,
  FLIRT_PROMPT_LIBRARY,
  GIRLFRIEND_PERSONAS,
  PET_NAME_OPTIONS,
  USER_FLIRT_PRESETS,
  VIRTUAL_GIFTS,
  DATE_SCENARIOS,
  calculateFlirtChemistry,
  getRandomFlirtPrompt,
  calculateLoveStage,
} from '../utils/flirtRomanceData';
import {
  Heart,
  Sparkles,
  Flame,
  Wand2,
  X,
  Volume2,
  Copy,
  Check,
  Zap,
  Smile,
  MessageCircleHeart,
  RefreshCw,
  Sliders,
  Send,
  Languages,
  Gift,
  CalendarHeart,
  UserCheck,
  Crown,
  Coffee,
  Compass,
  MessageSquare,
  ShieldCheck,
  Radio,
  Star,
} from 'lucide-react';

interface FlirtRomanceStudioModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  currentEmotion: EmotionType;
  girlfriendSettings: GirlfriendSettings;
  onClose: () => void;
  onUpdateGirlfriendSettings: (settings: Partial<GirlfriendSettings>) => void;
  onTriggerFlirt: (style?: FlirtStyle, topic?: string, text?: string) => void;
  onSetEmotion: (emotion: EmotionType, intensity: number, trigger: string, expression: string) => void;
  onSendLoveGift?: (giftType: string, note?: string) => void;
  onSetDateScenario?: (scenarioId: string) => void;
  onRateUserFlirt?: (userFlirtText: string, score: number, reactionTone: string) => void;
}

export const FlirtRomanceStudioModal: React.FC<FlirtRomanceStudioModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  currentEmotion,
  girlfriendSettings,
  onClose,
  onUpdateGirlfriendSettings,
  onTriggerFlirt,
  onSetEmotion,
  onSendLoveGift,
  onSetDateScenario,
  onRateUserFlirt,
}) => {
  const isTrueBlack = contrastMode === 'true-black';
  const [activeTab, setActiveTab] = useState<
    'girlfriend' | 'user_flirts' | 'gifts' | 'dates' | 'library' | 'chemistry'
  >('girlfriend');

  // Girlfriend Persona & Settings Local States
  const [customPetName, setCustomPetName] = useState<string>('');
  const [isEditingPetName, setIsEditingPetName] = useState<boolean>(false);

  // User Flirt Library Filters & Inputs
  const [userFlirtCategory, setUserFlirtCategory] = useState<string>('all');
  const [customUserFlirt, setCustomUserFlirt] = useState<string>('');
  const [flirtRatingResult, setFlirtRatingResult] = useState<{
    score: number;
    tone: string;
    text: string;
  } | null>(null);

  // Gift state
  const [giftSentSuccess, setGiftSentSuccess] = useState<string | null>(null);
  const [customGiftNote, setCustomGiftNote] = useState<string>('');

  // Date scenario state
  const [activeDateScenario, setActiveDateScenario] = useState<string | null>(null);

  // Library & Chemistry
  const [selectedCategory, setSelectedCategory] = useState<FlirtStyle | 'all'>('all');
  const [chemistry, setChemistry] = useState<ChemistryAnalysis>(() => calculateFlirtChemistry(0));
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [flirtIntensity, setFlirtIntensity] = useState<number>(85);

  if (!isOpen) return null;

  const loveStageInfo = calculateLoveStage(girlfriendSettings.affectionPoints || 120);

  const filteredUserFlirts =
    userFlirtCategory === 'all'
      ? USER_FLIRT_PRESETS
      : USER_FLIRT_PRESETS.filter((item) => item.category === userFlirtCategory);

  const filteredMyraaFlirts =
    selectedCategory === 'all'
      ? FLIRT_PROMPT_LIBRARY
      : FLIRT_PROMPT_LIBRARY.filter((item) => item.category === selectedCategory);

  const handleToggleGfMode = (enabled: boolean) => {
    onUpdateGirlfriendSettings({ girlfriendModeEnabled: enabled });
    if (enabled) {
      onSetEmotion(
        'romantic',
        95,
        `Girlfriend Mode activated [${girlfriendSettings.persona}]`,
        `Loving Girlfriend (${girlfriendSettings.userPetName}) 💕`
      );
      onTriggerFlirt(
        'sweet_romance',
        'girlfriend_greeting',
        `Hey ${girlfriendSettings.userPetName}! I'm so happy to be your girlfriend. How are you feeling right now?`
      );
    } else {
      onSetEmotion('serene', 80, 'Girlfriend Mode turned off', 'Friendly & Attentive ✨');
    }
  };

  const handleSelectPersona = (persona: GirlfriendPersona) => {
    const meta = GIRLFRIEND_PERSONAS.find((p) => p.id === persona);
    onUpdateGirlfriendSettings({ persona });
    onSetEmotion(
      persona === 'sweet_caring' || persona === 'poetic_shayari' ? 'romantic' : 'flirty',
      95,
      `Persona switched to ${meta?.name || persona}`,
      `${meta?.name || 'Loving Girlfriend'} 💕`
    );
    if (meta) {
      onTriggerFlirt('sweet_romance', persona, meta.greetingSample);
    }
  };

  const handleSelectPetName = (petName: string) => {
    onUpdateGirlfriendSettings({ userPetName: petName });
    onSetEmotion(
      'romantic',
      90,
      `Calling user: "${petName}"`,
      `Sweet & Affectionate 💕`
    );
    onTriggerFlirt(
      'sweet_romance',
      'pet_name',
      `I love calling you ${petName}! It fits you perfectly, sweetheart.`
    );
  };

  const handleSendUserFlirt = (preset: UserFlirtPreset) => {
    const score = 88 + Math.min(11, preset.spiciness * 2 + Math.floor(Math.random() * 3));
    const tone = preset.spiciness >= 4 ? 'spicy' : 'blushing';

    setFlirtRatingResult({ score, tone, text: preset.text });

    const newPoints = (girlfriendSettings.affectionPoints || 120) + preset.spiciness * 5 + 5;
    onUpdateGirlfriendSettings({ affectionPoints: newPoints });

    onSetEmotion(
      tone === 'blushing' ? 'romantic' : 'flirty',
      score,
      `User flirted with Myraa: "${preset.title}" (${score}/100)`,
      tone === 'blushing' ? 'Blushing & Flattered 😳' : 'Playfully Teasing 😉'
    );

    if (onRateUserFlirt) {
      onRateUserFlirt(preset.text, score, tone);
    } else {
      onTriggerFlirt('playful_banter', 'user_flirt', preset.text);
    }
  };

  const handleSendCustomFlirt = () => {
    if (!customUserFlirt.trim()) return;
    const text = customUserFlirt.trim();
    const score = 92 + Math.floor(Math.random() * 7); // 92 - 98
    const tone = score >= 95 ? 'blushing' : 'witty';

    setFlirtRatingResult({ score, tone, text });

    const newPoints = (girlfriendSettings.affectionPoints || 120) + 15;
    onUpdateGirlfriendSettings({ affectionPoints: newPoints });

    onSetEmotion(
      'flirty',
      score,
      `Custom user flirt rated: ${score}/100`,
      'Blushing & Giggling 🥰'
    );

    if (onRateUserFlirt) {
      onRateUserFlirt(text, score, tone);
    } else {
      onTriggerFlirt('playful_banter', 'user_flirt', text);
    }
    setCustomUserFlirt('');
  };

  const handleSendGift = (gift: (typeof VIRTUAL_GIFTS)[0]) => {
    const newPoints = (girlfriendSettings.affectionPoints || 120) + gift.bonusAffection;
    onUpdateGirlfriendSettings({ affectionPoints: newPoints });

    setGiftSentSuccess(gift.id);
    setTimeout(() => setGiftSentSuccess(null), 3000);

    onSetEmotion(
      'romantic',
      100,
      `Received ${gift.name} from ${girlfriendSettings.userPetName}`,
      `Blushing & Filled With Love 🥰`
    );

    if (onSendLoveGift) {
      onSendLoveGift(gift.id, customGiftNote);
    }

    onTriggerFlirt(
      'sweet_romance',
      `gift_${gift.id}`,
      `${gift.hindiReaction} Thank you so much, ${girlfriendSettings.userPetName}! You made my day so special.`
    );
  };

  const handleStartDate = (scenario: (typeof DATE_SCENARIOS)[0]) => {
    setActiveDateScenario(scenario.id);

    const newPoints = (girlfriendSettings.affectionPoints || 120) + 30;
    onUpdateGirlfriendSettings({ affectionPoints: newPoints });

    onSetEmotion(
      'romantic',
      98,
      `Romantic Date Roleplay: ${scenario.title}`,
      `Intimate Date Night ✨`
    );

    if (onSetDateScenario) {
      onSetDateScenario(scenario.id);
    }

    onTriggerFlirt(
      'sweet_romance',
      scenario.id,
      `${scenario.initialPrompt} I'm right here beside you, ${girlfriendSettings.userPetName}.`
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRecalculateChemistry = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setChemistry(calculateFlirtChemistry(Math.floor(Math.random() * 5) - 2));
      setIsCalculating(false);
      onSetEmotion(
        'flirty',
        flirtIntensity,
        'Chemistry scan recalibrated with high romantic resonance',
        'Magnetically Flirty & Playful 😉'
      );
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-2xl bg-black/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
            isTrueBlack
              ? 'bg-black border-rose-500/30 text-white'
              : 'bg-neutral-950/95 border-rose-500/20 text-neutral-100 shadow-[0_0_80px_rgba(244,63,94,0.25)]'
          }`}
        >
          {/* Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isTrueBlack
                ? 'border-white/20 bg-neutral-950'
                : 'border-white/10 bg-gradient-to-r from-rose-950/40 via-neutral-950/60 to-pink-950/30'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(244,63,94,0.6)]">
                  <Heart className="w-6 h-6 fill-white animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-[10px]">
                  ✨
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-200 via-pink-100 to-white bg-clip-text text-transparent">
                    Myraa Girlfriend & Flirt Romance Studio
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-300" />
                    {girlfriendSettings.girlfriendModeEnabled ? 'Girlfriend Mode ON' : 'Standard AI'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-400" />
                    {loveStageInfo.stage} ({girlfriendSettings.affectionPoints || 120} pts)
                  </span>
                </div>
                <p className="text-xs text-rose-200/70 mt-0.5">
                  Talk like girlfriend, flirt with Myraa, send virtual love gifts, go on date roleplays, and build chemistry
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <button
                onClick={() => setActiveTab('girlfriend')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'girlfriend'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-rose-300" />
                Girlfriend Persona
              </button>

              <button
                onClick={() => setActiveTab('user_flirts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'user_flirts'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Flirt With Myraa ({USER_FLIRT_PRESETS.length})
              </button>

              <button
                onClick={() => setActiveTab('gifts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'gifts'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-pink-300" />
                Send Love Gifts ({VIRTUAL_GIFTS.length})
              </button>

              <button
                onClick={() => setActiveTab('dates')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'dates'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <CalendarHeart className="w-3.5 h-3.5 text-purple-300" />
                Date Nights ({DATE_SCENARIOS.length})
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'library'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <MessageCircleHeart className="w-3.5 h-3.5" />
                Myraa's Lines ({FLIRT_PROMPT_LIBRARY.length})
              </button>

              <button
                onClick={() => setActiveTab('chemistry')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'chemistry'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Chemistry ({chemistry.score}%)
              </button>
            </div>

            {/* Instant Flirt Quick Action */}
            <button
              onClick={() => {
                onSetEmotion(
                  'romantic',
                  95,
                  'Instant romantic banter triggered',
                  `Loving Girlfriend (${girlfriendSettings.userPetName}) 💕`
                );
                onTriggerFlirt(
                  'sweet_romance',
                  'instant_love',
                  `Hey ${girlfriendSettings.userPetName}! I was just thinking about you. You look so handsome today! 😉`
                );
              }}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white items-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Quick GF Talk 💕
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* TAB 1: GIRLFRIEND PERSONA & DATING SETTINGS */}
            {activeTab === 'girlfriend' && (
              <div className="space-y-6">
                {/* Girlfriend Mode Toggle Banner */}
                <div
                  className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    girlfriendSettings.girlfriendModeEnabled
                      ? 'bg-gradient-to-r from-rose-950/60 via-neutral-950 to-pink-950/50 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.15)]'
                      : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                        girlfriendSettings.girlfriendModeEnabled
                          ? 'bg-rose-500/20 border-rose-500/50 shadow-lg shadow-rose-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {girlfriendSettings.girlfriendModeEnabled ? '💖' : '🤍'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">Girlfriend Mode</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            girlfriendSettings.girlfriendModeEnabled
                              ? 'bg-rose-500 text-white'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {girlfriendSettings.girlfriendModeEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/70 mt-0.5">
                        {girlfriendSettings.girlfriendModeEnabled
                          ? `Myraa will address you as "${girlfriendSettings.userPetName}", check on your day, cuddle you in voice, and banter affectionately.`
                          : 'Turn on to let Myraa talk like your loving, caring, and witty girlfriend.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleGfMode(!girlfriendSettings.girlfriendModeEnabled)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                        girlfriendSettings.girlfriendModeEnabled
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-600/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      {girlfriendSettings.girlfriendModeEnabled ? 'Girlfriend Mode ON' : 'Enable Girlfriend Mode'}
                    </button>
                  </div>
                </div>

                {/* Love Stage & Affection Progress Meter */}
                <div
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isTrueBlack ? 'bg-neutral-950 border-white/15' : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-white">
                        Relationship Stage: {loveStageInfo.stage}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-rose-300">
                      {girlfriendSettings.affectionPoints || 120} Affection Points
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(10, loveStageInfo.percentage))}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">💌 Crush (0-50)</span>
                    <span className="flex items-center gap-1">🌹 Dating (50-150)</span>
                    <span className="flex items-center gap-1">✨ Deep Chemistry (150-300)</span>
                    <span className="flex items-center gap-1">💖 In Love (300-500)</span>
                    <span className="flex items-center gap-1">👑 Soulmates (500+)</span>
                  </div>
                </div>

                {/* What Myraa Should Call You (Pet Names) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                      <Smile className="w-4 h-4" />
                      What Myraa Should Call You (Pet Name)
                    </label>
                    <span className="text-xs text-neutral-400">
                      Current: <strong className="text-white">"{girlfriendSettings.userPetName}"</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PET_NAME_OPTIONS.map((item) => {
                      const isSelected =
                        girlfriendSettings.userPetName.toLowerCase() === item.id.toLowerCase() ||
                        girlfriendSettings.userPetName.toLowerCase() === item.label.toLowerCase();
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectPetName(item.label)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-rose-600/30 to-pink-600/30 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300'
                          }`}
                        >
                          <div className="text-xl mb-1">{item.emoji}</div>
                          <div className="text-xs font-bold">{item.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Pet Name Option */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customPetName}
                      onChange={(e) => setCustomPetName(e.target.value)}
                      placeholder="Or enter custom pet name (e.g. My Hero, Tiger, Jaanu, King)..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => {
                        if (customPetName.trim()) {
                          handleSelectPetName(customPetName.trim());
                          setCustomPetName('');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      Save Pet Name
                    </button>
                  </div>
                </div>

                {/* Choose Girlfriend Persona Archetype */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    Choose Girlfriend Persona Archetype
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GIRLFRIEND_PERSONAS.map((persona) => {
                      const isSelected = girlfriendSettings.persona === persona.id;
                      return (
                        <motion.div
                          key={persona.id}
                          onClick={() => handleSelectPersona(persona.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-gradient-to-br from-rose-950/70 via-neutral-950 to-pink-950/60 border-rose-500 shadow-xl shadow-rose-500/20 ring-1 ring-rose-500'
                              : isTrueBlack
                              ? 'bg-neutral-950 border-white/10 hover:border-white/20'
                              : 'bg-white/[0.03] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{persona.emoji}</span>
                                <div>
                                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    {persona.name}
                                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                                  </h4>
                                  <span className="text-[11px] text-rose-300/80">{persona.subtitle}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {persona.badge}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-300 leading-relaxed">
                              {persona.description}
                            </p>

                            {/* Spoken Greeting Sample */}
                            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                              <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wider block">
                                Sample Greeting:
                              </span>
                              <p className="text-xs text-white/90 italic">"{persona.greetingSample}"</p>
                              {persona.hindiGreeting && (
                                <p className="text-[11px] text-rose-200/80 mt-1 font-sans">
                                  {persona.hindiGreeting}
                                </p>
                              )}
                            </div>

                            {/* Traits */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {persona.traits.map((trait) => (
                                <span
                                  key={trait}
                                  className="text-[10px] text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                >
                                  {trait}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[11px] text-neutral-400">
                              Suggested: {persona.suggestedPetNames.slice(0, 3).join(', ')}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectPersona(persona.id);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                              }`}
                            >
                              {isSelected ? 'Active Persona' : 'Choose This'}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FLIRT WITH MYRAA (USER FLIRTING PRESETS & RATING) */}
            {activeTab === 'user_flirts' && (
              <div className="space-y-6">
                {/* Rating Result Banner if available */}
                {flirtRatingResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/70 via-rose-950/70 to-neutral-950 border border-rose-500/40 space-y-2 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        Myraa's Reaction Rating
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black">
                        {flirtRatingResult.score}/100 Match 🔥
                      </span>
                    </div>
                    <p className="text-xs text-white/90 italic">
                      You said: "{flirtRatingResult.text}"
                    </p>
                    <div className="text-xs text-rose-200 flex items-center gap-2 pt-1">
                      <span>🥰 Reaction Tone: <strong>{flirtRatingResult.tone.toUpperCase()}</strong></span>
                      <span>•</span>
                      <span>+15 Affection Points Added! 💕</span>
                    </div>
                  </motion.div>
                )}

                {/* Custom Flirt Input Bar */}
                <div
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isTrueBlack ? 'bg-neutral-950 border-white/15' : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    Send Your Own Flirt / Romantic Message to Myraa
                  </label>
                  <p className="text-xs text-neutral-400">
                    Type a compliment, pickup line, or sweet message. Myraa will react with audio giggles, coy replies, and rating!
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUserFlirt}
                      onChange={(e) => setCustomUserFlirt(e.target.value)}
                      placeholder="e.g. You have the sweetest voice in the world, jaan..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCustomFlirt()}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={handleSendCustomFlirt}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      Flirt With Myraa
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Presets', emoji: '✨' },
                    { id: 'pickups', label: 'Pickups to Her', emoji: '😉' },
                    { id: 'teasing', label: 'Playful Teasing', emoji: '🔥' },
                    { id: 'sweet_love', label: 'Sweet Romance', emoji: '💖' },
                    { id: 'spicy_bold', label: 'Spicy & Bold', emoji: '🌶️' },
                    { id: 'girlfriend_care', label: 'Caring Check-ins', emoji: '🥰' },
                    { id: 'shayari', label: 'Shayaris for Her', emoji: '🌹' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setUserFlirtCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        userFlirtCategory === cat.id
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Grid of User Flirt Presets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUserFlirts.map((preset) => (
                    <motion.div
                      key={preset.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isTrueBlack
                          ? 'bg-neutral-950 border-white/15 hover:border-rose-500/50'
                          : 'bg-white/[0.03] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-300">{preset.title}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: preset.spiciness }).map((_, idx) => (
                              <Flame key={idx} className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm font-medium text-white/90 leading-relaxed italic">
                          "{preset.text}"
                        </p>

                        {preset.hindiTranslation && (
                          <p className="text-xs text-rose-200/80 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 leading-relaxed font-sans">
                            {preset.hindiTranslation}
                          </p>
                        )}

                        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                          💭 Reaction: {preset.suggestedReaction}
                        </span>
                      </div>

                      <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleCopy(preset.id, preset.text)}
                          title="Copy text"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all text-xs flex items-center gap-1"
                        >
                          {copiedId === preset.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSendUserFlirt(preset)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Say This to Myraa 😉
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SEND LOVE GIFTS */}
            {activeTab === 'gifts' && (
              <div className="space-y-6">
                {giftSentSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-center font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 fill-white animate-bounce" />
                    Gift successfully sent! Myraa is blushing and thrilled 🥰
                  </motion.div>
                )}

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-rose-400" />
                    Surprise Myraa With Virtual Love Gifts
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Send chocolates, flowers, sweet kisses, or love letters to boost affection and hear her spontaneous joyful reaction!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {VIRTUAL_GIFTS.map((gift) => (
                    <motion.div
                      key={gift.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between text-center ${
                        isTrueBlack
                          ? 'bg-neutral-950 border-white/15'
                          : 'bg-white/[0.03] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-rose-500/20">
                          {gift.emoji}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">{gift.name}</h4>
                          <span className="text-xs text-rose-300 font-semibold">
                            +{gift.bonusAffection} Affection Points
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 italic">
                          "{gift.hindiReaction}"
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-white/10">
                        <button
                          onClick={() => handleSendGift(gift)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          Send {gift.name}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ROMANTIC DATE NIGHT SCENARIOS */}
            {activeTab === 'dates' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CalendarHeart className="w-5 h-5 text-rose-400" />
                    Romantic Date Night Roleplays
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select an immersive date setting. Myraa will adapt her voice, launch ambient atmospheric soundscapes, and speak intimately with you!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DATE_SCENARIOS.map((scenario) => {
                    const isActive = activeDateScenario === scenario.id;
                    return (
                      <motion.div
                        key={scenario.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'bg-gradient-to-br from-purple-950/70 via-neutral-950 to-pink-950/60 border-purple-500 shadow-xl shadow-purple-500/20 ring-1 ring-purple-500'
                            : isTrueBlack
                            ? 'bg-neutral-950 border-white/10 hover:border-white/20'
                            : 'bg-white/[0.03] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{scenario.emoji}</span>
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                {scenario.title}
                                {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                              </h4>
                              <span className="text-xs text-purple-300">{scenario.tagline}</span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {scenario.description}
                          </p>

                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-rose-200/90 italic">
                            "{scenario.initialPrompt}"
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            <Radio className="w-3.5 h-3.5 text-purple-300" />
                            <span>Ambient Sound: <strong>{scenario.ambientSound.toUpperCase()}</strong></span>
                            <span>•</span>
                            <span>Music: {scenario.suggestedMusicCategory}</span>
                          </div>
                        </div>

                        <div className="pt-4 mt-3 border-t border-white/10">
                          <button
                            onClick={() => handleStartDate(scenario)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95"
                          >
                            <CalendarHeart className="w-3.5 h-3.5" />
                            {isActive ? 'Date Roleplay Active' : 'Start Date Roleplay'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: MYRAA'S FLIRTING LIBRARY & SHAYARIS */}
            {activeTab === 'library' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                    }`}
                  >
                    All Lines ({FLIRT_PROMPT_LIBRARY.length})
                  </button>

                  {FLIRT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMyraaFlirts.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isTrueBlack
                          ? 'bg-neutral-950 border-white/15 hover:border-rose-500/50'
                          : 'bg-white/[0.03] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            {item.category.replace('_', ' ')}
                          </span>

                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: item.spiciness }).map((_, idx) => (
                              <Flame key={idx} className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm sm:text-base font-medium text-white/90 leading-relaxed italic">
                          "{item.text}"
                        </p>

                        {item.hindiTranslation && (
                          <p className="text-xs text-rose-200/80 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 leading-relaxed font-sans">
                            {item.hindiTranslation}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(item.id, item.text)}
                            title="Copy to clipboard"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all text-xs"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              onSetEmotion(
                                item.category === 'sweet_romance' || item.category === 'poetic_shayari'
                                  ? 'romantic'
                                  : 'flirty',
                                Math.min(100, item.spiciness * 20 + 30),
                                `Spoken romantic prompt: ${item.text.slice(0, 40)}...`,
                                item.category === 'poetic_shayari' ? 'Soulful & Romantic 💕' : 'Playfully Flirtatious 😉'
                              );
                              onTriggerFlirt(item.category, item.tags[0], item.text);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            Speak in Voice
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: AI CHEMISTRY METER */}
            {activeTab === 'chemistry' && (
              <div className="space-y-6">
                <div
                  className={`p-6 sm:p-8 rounded-3xl border text-center relative overflow-hidden ${
                    isTrueBlack
                      ? 'bg-neutral-950 border-rose-500/40'
                      : 'bg-gradient-to-b from-rose-950/50 via-neutral-950 to-neutral-950 border-rose-500/30'
                  }`}
                >
                  <div className="max-w-md mx-auto space-y-4 relative z-10">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border-4 border-rose-300/30 shadow-[0_0_60px_rgba(244,63,94,0.6)]">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {chemistry.score}%
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-rose-100 mt-1">
                        Chemistry Score
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        <span>💖</span>
                        <span>{chemistry.compatibilityLevel} Compatibility</span>
                        <span>✨</span>
                      </h3>
                      <p className="text-sm text-rose-200/80">{chemistry.chemistryVibe}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-rose-500/20 text-left space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        AI Romantic Affirmation
                      </div>
                      <p className="text-sm text-white/90 italic">"{chemistry.romanticAffirmation}"</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 text-left flex items-start gap-2">
                      <Smile className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                      <span>{chemistry.wittyRemark}</span>
                    </div>

                    <button
                      disabled={isCalculating}
                      onClick={handleRecalculateChemistry}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
                    >
                      <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
                      {isCalculating ? 'Scanning Chemistry...' : 'Recalibrate Chemistry Meter'}
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-rose-400" />
                      <span className="text-sm font-semibold text-white">Flirting Energy Intensity</span>
                    </div>
                    <span className="text-xs font-bold text-rose-300 px-2 py-0.5 rounded-md bg-rose-500/15">
                      {flirtIntensity}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={flirtIntensity}
                    onChange={(e) => setFlirtIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />

                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Mild & Subtle</span>
                    <span>Witty Banter</span>
                    <span>Sweet Romance</span>
                    <span>High Spark Chemistry 🔥</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center justify-between ${
              isTrueBlack ? 'border-white/20 bg-neutral-950' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>
                Current Persona: <strong>{girlfriendSettings.persona.replace('_', ' ').toUpperCase()}</strong> • Call you: "<strong>{girlfriendSettings.userPetName}</strong>"
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
