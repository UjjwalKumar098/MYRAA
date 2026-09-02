import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EmotionType, EmotionRecord, ContrastMode } from '../types';
import { EMOTION_METAS, calculateEmotionStats } from '../utils/emotionEngine';
import {
  Heart,
  Sparkles,
  Clock,
  Activity,
  Trash2,
  X,
  Smile,
  Zap,
  TrendingUp,
  RotateCcw,
  Check,
  Flame,
  Wind,
  Compass,
} from 'lucide-react';

interface EmotionHistoryModalProps {
  isOpen: boolean;
  currentEmotion: EmotionType;
  emotionIntensity: number;
  emotionExpression: string;
  history: EmotionRecord[];
  contrastMode?: ContrastMode;
  onSelectEmotion: (emotion: EmotionType, intensity?: number, trigger?: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const EmotionHistoryModal: React.FC<EmotionHistoryModalProps> = ({
  isOpen,
  currentEmotion,
  emotionIntensity,
  emotionExpression,
  history,
  contrastMode = 'cosmic',
  onSelectEmotion,
  onClearHistory,
  onClose,
}) => {
  const [filterEmotion, setFilterEmotion] = useState<EmotionType | 'all'>('all');
  const isTrueBlack = contrastMode === 'true-black';
  const currentMeta = EMOTION_METAS[currentEmotion] || EMOTION_METAS.serene;
  const stats = calculateEmotionStats(history);

  if (!isOpen) return null;

  const filteredHistory =
    filterEmotion === 'all'
      ? history
      : history.filter((item) => item.emotion === filterEmotion);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl bg-black/75">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
            isTrueBlack
              ? 'bg-black border-white/30 text-white'
              : 'bg-neutral-950/95 border-white/15 text-neutral-100 shadow-[0_0_60px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isTrueBlack ? 'border-white/20 bg-neutral-950' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-lg border"
                style={{
                  backgroundColor: currentMeta.colorHex + '22',
                  borderColor: currentMeta.colorHex + '55',
                  boxShadow: `0 0 20px ${currentMeta.glowRgba}`,
                }}
              >
                {currentMeta.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">Emotion Engine & Mood History</h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border"
                    style={{
                      backgroundColor: currentMeta.colorHex + '20',
                      borderColor: currentMeta.colorHex + '50',
                      color: currentMeta.colorHex,
                    }}
                  >
                    Active Resonance
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Real-time sentiment tracking, vocal resonance & chronological emotional timeline
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Top Cards Grid: Current Emotion + Mood Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Active Emotion Highlight */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
                  isTrueBlack ? 'border-white/25 bg-[#0a0a0a]' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40"
                  style={{ backgroundColor: currentMeta.colorHex }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Current Emotion</span>
                    <span className="text-2xl">{currentMeta.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold mt-2" style={{ color: currentMeta.colorHex }}>
                    {currentMeta.label}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 italic">"{emotionExpression || currentMeta.defaultExpression}"</p>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{currentMeta.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Resonance Intensity</span>
                    <span className="font-semibold text-white">{emotionIntensity}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${emotionIntensity}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: currentMeta.colorHex }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Sentiment Metrics */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isTrueBlack ? 'border-white/25 bg-[#0a0a0a]' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Session Resonance</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">
                      {(stats.averageSentiment * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">Positive Valence</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-2">
                    Dominant mood this session is{' '}
                    <span className="text-white font-semibold capitalize">
                      {EMOTION_METAS[stats.dominantEmotion]?.label || stats.dominantEmotion}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-neutral-400">Transitions</div>
                    <div className="text-base font-bold text-white mt-0.5">{stats.totalTransitions} logged</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-neutral-400">Avg Energy</div>
                    <div className="text-base font-bold text-cyan-300 mt-0.5">{stats.averageIntensity}%</div>
                  </div>
                </div>
              </div>

              {/* Card 3: Mood Distribution Bar */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isTrueBlack ? 'border-white/25 bg-[#0a0a0a]' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Mood Breakdown</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {(Object.keys(EMOTION_METAS) as EmotionType[]).slice(0, 4).map((emo) => {
                      const meta = EMOTION_METAS[emo];
                      const pct = stats.distribution[emo] || 0;
                      return (
                        <div key={emo} className="flex items-center gap-2">
                          <span className="w-4 text-center">{meta.emoji}</span>
                          <span className="w-16 text-neutral-400 truncate">{meta.type}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: meta.colorHex }}
                            />
                          </div>
                          <span className="w-8 text-right font-medium text-neutral-300">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>Adapts live with voice tone</span>
                  <span className="text-cyan-400 font-medium">Real-Time Sync</span>
                </div>
              </div>
            </div>

            {/* Quick Emotion Switcher / Preset Resonances */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Switch or Trigger Emotion Resonance
                </h4>
                <span className="text-xs text-neutral-400">Tap to instantly shift Myraa's tone</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(Object.keys(EMOTION_METAS) as EmotionType[]).map((emo) => {
                  const meta = EMOTION_METAS[emo];
                  const isActive = currentEmotion === emo;
                  return (
                    <button
                      key={emo}
                      onClick={() => onSelectEmotion(emo, 85, `Manual shift to ${meta.label}`)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-95 ${
                        isActive
                          ? 'border-white/50 bg-white/10 shadow-lg'
                          : isTrueBlack
                          ? 'border-white/20 bg-black hover:border-white/40'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                      style={{
                        boxShadow: isActive ? `0 0 20px ${meta.glowRgba}` : undefined,
                      }}
                    >
                      <span className="text-2xl">{meta.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-xs text-white truncate">{meta.label.split('&')[0]}</div>
                          {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">{meta.tagline}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emotion Timeline & Chronological History */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-neutral-200">Chronological Emotion Timeline</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                    {filteredHistory.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Emotion Filter Selector */}
                  <select
                    value={filterEmotion}
                    onChange={(e) => setFilterEmotion(e.target.value as any)}
                    className="text-xs bg-neutral-900 border border-white/15 rounded-xl px-2.5 py-1 text-neutral-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Emotions</option>
                    {(Object.keys(EMOTION_METAS) as EmotionType[]).map((emo) => (
                      <option key={emo} value={emo}>
                        {EMOTION_METAS[emo].emoji} {EMOTION_METAS[emo].label}
                      </option>
                    ))}
                  </select>

                  {/* Clear History Button */}
                  {history.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="text-xs px-2.5 py-1 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Log
                    </button>
                  )}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-neutral-400 text-xs">
                  No emotion records logged yet for this filter. Speak to Myraa to log emotional transitions in real time!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredHistory.map((item, index) => {
                    const meta = EMOTION_METAS[item.emotion] || EMOTION_METAS.serene;
                    const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    });

                    return (
                      <div
                        key={item.id || index}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-all ${
                          isTrueBlack
                            ? 'border-white/20 bg-[#090909]'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                          style={{
                            backgroundColor: meta.colorHex + '20',
                            borderColor: meta.colorHex + '40',
                          }}
                        >
                          {meta.emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-white">{meta.label}</span>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                                style={{
                                  backgroundColor: meta.colorHex + '15',
                                  borderColor: meta.colorHex + '35',
                                  color: meta.colorHex,
                                }}
                              >
                                {item.intensity || 85}% intensity
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-neutral-400 shrink-0">{dateStr}</span>
                          </div>

                          <p className="text-xs text-neutral-300 mt-1 font-medium">{item.trigger}</p>
                          {item.contextSnippet && (
                            <p className="text-[11px] text-neutral-400 mt-0.5 italic">"{item.contextSnippet}"</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center justify-between ${
              isTrueBlack ? 'border-white/20 bg-neutral-950' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="text-xs text-neutral-400">
              Active Voice Model: <span className="text-white font-medium">Gemini 2.0 Live Multimodal</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
