import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Languages,
  ArrowRightLeft,
  Volume2,
  Sparkles,
  Check,
  Globe2,
  Mic,
  Radio,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { SupportedLanguage, AssistantVoice, LanguageSettings, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    greeting: 'Hello! How can I help you today?',
    samplePrompt: '“Myraa, set a 5-minute timer and play rain sound.”',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    greeting: 'नमस्ते! मैं आपकी कैसे मदद कर सकती हूँ?',
    samplePrompt: '“मायरा, 3 मिनट का चाय का टाइमर लगाओ और एक शायरी सुनाओ।”',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    greeting: '¡Hola! ¿Cómo puedo ayudarte hoy?',
    samplePrompt: '“Myraa, pon un temporizador de 5 minutos y cambia el tema a aurora.”',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    greeting: 'Привет! Чем я могу помочь тебе сегодня?',
    samplePrompt: '“Майра, включи звуки дождя и посчитай 25% от 840.”',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    greeting: 'こんにちは！今日はどのようなご用件でしょうか？',
    samplePrompt: '“マイラ、3分間のタイマーをセットして、リラックス音楽をかけて。”',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文 (普通话)',
    flag: '🇨🇳',
    greeting: '你好！今天有什么我可以帮你的吗？',
    samplePrompt: '“Myraa，帮我定一个5分钟的倒计时，播放雨声。”',
  },
];

export const VOICE_OPTIONS: Array<{
  id: AssistantVoice;
  name: string;
  tone: string;
  gender: string;
}> = [
  { id: 'Aoede', name: 'Aoede', tone: 'Warm, Confident & Charming', gender: 'Female' },
  { id: 'Puck', name: 'Puck', tone: 'Playful, Energetic & Bright', gender: 'Dynamic' },
  { id: 'Charon', name: 'Charon', tone: 'Calm, Deep & Reassuring', gender: 'Male' },
  { id: 'Kore', name: 'Kore', tone: 'Gentle, Serene & Mindful', gender: 'Female' },
  { id: 'Fenrir', name: 'Fenrir', tone: 'Bold, Resonant & Clear', gender: 'Male' },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LanguageSettings;
  onSaveSettings: (newSettings: LanguageSettings) => void;
  isSessionActive: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  isSessionActive,
}) => {
  const [activeTab, setActiveTab] = useState<'language' | 'translator' | 'voice' | 'guide'>('language');
  const [localSettings, setLocalSettings] = useState<LanguageSettings>(settings);
  const [justSaved, setJustSaved] = useState(false);

  // Sync state when opened
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleApply = () => {
    onSaveSettings(localSettings);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleQuickPreset = (source: SupportedLanguage, target: SupportedLanguage) => {
    setLocalSettings((prev) => ({
      ...prev,
      translationMode: true,
      sourceLanguage: source,
      targetLanguage: target,
    }));
  };

  const currentPrimary =
    SUPPORTED_LANGUAGES.find((l) => l.code === localSettings.primaryLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-slate-950/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-wide">
                    Settings & Language Configuration
                  </h2>
                  <p className="text-xs text-white/50">
                    Configure Gemini Live multilingual voice & real-time translation
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center px-6 pt-3 border-b border-white/10 gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('language')}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'language'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <Languages className="w-4 h-4" />
                <span>Primary Language</span>
              </button>

              <button
                onClick={() => setActiveTab('translator')}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'translator'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Real-Time Voice Translator</span>
                {localSettings.translationMode && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'voice'
                    ? 'border-purple-400 text-purple-300'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Voice Persona</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'guide'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Voice Guide</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {/* TAB 1: Primary Language */}
              {activeTab === 'language' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white/90">
                        Choose Conversational Language
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Active: {currentPrimary.name} ({currentPrimary.nativeName})
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Gemini Live will speak and interact natively in your chosen language with
                      authentic cultural idioms and vocal cadence.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected =
                        localSettings.primaryLanguage === lang.code &&
                        !localSettings.translationMode;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocalSettings((prev) => ({
                              ...prev,
                              primaryLanguage: lang.code,
                              translationMode: false,
                            }));
                          }}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl mt-0.5">{lang.flag}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-white">{lang.name}</h4>
                              {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <p className="text-xs text-cyan-300/80 font-medium">
                              {lang.nativeName}
                            </p>
                            <p className="text-[11px] text-white/40 italic mt-1.5 truncate">
                              {lang.greeting}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3">
                    <Globe2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-cyan-200/90 leading-relaxed">
                      <strong className="text-cyan-100">Polyglot Voice AI:</strong> Even with a
                      primary language set, Myraa seamlessly understands and responds if you switch
                      between English, Hindi, Spanish, Russian, Japanese, and Chinese mid-conversation!
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Real-time Live Voice Translator */}
              {activeTab === 'translator' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-amber-200">
                          Live Two-Way Voice Interpreter Mode
                        </h3>
                        <p className="text-xs text-amber-200/70">
                          Instantaneous spoken translation between speakers
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          translationMode: !prev.translationMode,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localSettings.translationMode ? 'bg-amber-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localSettings.translationMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Language Pair Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Source Language */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/70 block">
                        Language A (Speaker 1)
                      </label>
                      <select
                        value={localSettings.sourceLanguage}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            sourceLanguage: e.target.value as SupportedLanguage,
                          }))
                        }
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {SUPPORTED_LANGUAGES.map((l) => (
                          <option key={`source-${l.code}`} value={l.code}>
                            {l.flag} {l.name} ({l.nativeName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Target Language */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/70 block">
                        Language B (Speaker 2)
                      </label>
                      <select
                        value={localSettings.targetLanguage}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            targetLanguage: e.target.value as SupportedLanguage,
                          }))
                        }
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {SUPPORTED_LANGUAGES.map((l) => (
                          <option key={`target-${l.code}`} value={l.code}>
                            {l.flag} {l.name} ({l.nativeName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick Translation Presets */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 block">
                      Popular Translation Pairs:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { s: 'en', t: 'hi', label: '🇺🇸 English ↔ 🇮🇳 Hindi' },
                        { s: 'en', t: 'es', label: '🇺🇸 English ↔ 🇪🇸 Spanish' },
                        { s: 'en', t: 'ja', label: '🇺🇸 English ↔ 🇯🇵 Japanese' },
                        { s: 'en', t: 'zh', label: '🇺🇸 English ↔ 🇨🇳 Chinese' },
                        { s: 'en', t: 'ru', label: '🇺🇸 English ↔ 🇷🇺 Russian' },
                        { s: 'es', t: 'hi', label: '🇪🇸 Spanish ↔ 🇮🇳 Hindi' },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            handleQuickPreset(
                              preset.s as SupportedLanguage,
                              preset.t as SupportedLanguage
                            )
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                            localSettings.translationMode &&
                            localSettings.sourceLanguage === preset.s &&
                            localSettings.targetLanguage === preset.t
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white/70 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/60 space-y-1">
                    <p className="font-semibold text-white/80">How Live Translation Works:</p>
                    <p>
                      Speak freely in Language A or B. Gemini Live instantly detects who is speaking
                      and outputs the audio translation into the corresponding language without
                      clunky preambles.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: Voice Persona */}
              {activeTab === 'voice' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">
                      Select Spoken Voice Persona
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      Choose the acoustic delivery and pitch for Gemini 2.0 Live voice synthesis.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {VOICE_OPTIONS.map((voice) => {
                      const isSelected = localSettings.voice === voice.id;
                      return (
                        <button
                          key={voice.id}
                          onClick={() =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              voice: voice.id,
                            }))
                          }
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-purple-500/15 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30'
                              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                  : 'bg-white/5 border-white/10 text-white/50'
                              }`}
                            >
                              <Volume2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-white">{voice.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                                  {voice.gender}
                                </span>
                              </div>
                              <p className="text-xs text-purple-300/80 mt-0.5">{voice.tone}</p>
                            </div>
                          </div>

                          {isSelected && <Check className="w-5 h-5 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: Voice Prompts Guide */}
              {activeTab === 'guide' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">
                      Multilingual Spoken Prompts Guide
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      Try asking Myraa any of these voice commands in your selected language:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <div
                        key={`guide-${l.code}`}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{l.flag}</span>
                          <span className="text-xs font-semibold text-white">
                            {l.name} ({l.nativeName})
                          </span>
                        </div>
                        <p className="text-xs text-cyan-300 font-medium pl-6">{l.samplePrompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Apply Bar */}
            <div className="px-6 py-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/50">
                {isSessionActive ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live voice session connected
                  </span>
                ) : (
                  <span className="text-white/40">Voice session idle</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={handleApply}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all active:scale-95 ${
                    justSaved
                      ? 'bg-emerald-500 shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
                  }`}
                >
                  {justSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Applied to Session!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Update Session Config</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
