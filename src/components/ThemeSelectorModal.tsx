import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VisualTheme, VisualizerStyle, ContrastMode, EmotionType } from '../types';
import { THEME_CONFIGS, CONTRAST_CONFIGS } from '../utils/theme';
import { EMOTION_METAS } from '../utils/emotionEngine';
import { X, Check, Disc, Activity, BarChart2, Sparkles, Moon, SunMoon, ShieldCheck, Heart } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentTheme: VisualTheme;
  currentStyle: VisualizerStyle;
  currentContrastMode: ContrastMode;
  currentEmotion?: EmotionType;
  onSelectTheme: (theme: VisualTheme) => void;
  onSelectStyle: (style: VisualizerStyle) => void;
  onSelectContrastMode: (mode: ContrastMode) => void;
  onSelectEmotion?: (emotion: EmotionType) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  currentStyle,
  currentContrastMode,
  currentEmotion = 'serene',
  onSelectTheme,
  onSelectStyle,
  onSelectContrastMode,
  onSelectEmotion,
  onClose,
}) => {
  const themes = Object.values(THEME_CONFIGS);
  const emotionMetas = Object.values(EMOTION_METAS);
  const isTrueBlack = currentContrastMode === 'true-black';

  const visualizerStyles: Array<{ id: VisualizerStyle; label: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'fluid-orb',
      label: 'Fluid Plasma Core',
      icon: <Disc className="w-4 h-4" />,
      desc: 'Organic pulsating audio-reactive corona',
    },
    {
      id: 'waveform-ring',
      label: 'Acoustic Harmonics',
      icon: <Activity className="w-4 h-4" />,
      desc: 'Concentric vibrating frequency orbits',
    },
    {
      id: 'frequency-bars',
      label: 'Radial Equalizer',
      icon: <BarChart2 className="w-4 h-4" />,
      desc: 'Futuristic circular spectrum bars',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-3xl p-6 text-white shadow-2xl z-10 max-h-[90vh] overflow-y-auto ${
              isTrueBlack
                ? 'bg-black border border-white/35 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
                : 'bg-neutral-950/95 border border-white/15 backdrop-blur-2xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${isTrueBlack ? 'bg-white/10 border-white/30 text-white' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                  <SunMoon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Display & Atmosphere</h2>
                  <p className="text-xs text-neutral-400">
                    High contrast settings, color palettes & visualizer
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contrast Mode Selector (Cosmic vs True Black) */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <SunMoon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Display Contrast Mode</span>
                </label>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isTrueBlack
                    ? 'bg-white text-black border-white'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                }`}>
                  {isTrueBlack ? 'High Contrast Active' : 'Cosmic Glow Active'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Cosmic Dark Option */}
                <button
                  type="button"
                  onClick={() => onSelectContrastMode('cosmic')}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                    currentContrastMode === 'cosmic'
                      ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-950/40 via-purple-950/30 to-black/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-900 via-purple-800 to-cyan-500 flex items-center justify-center text-white text-[11px] shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">Cosmic Dark</span>
                    </div>
                    {currentContrastMode === 'cosmic' && (
                      <span className="p-1 rounded-full bg-cyan-400 text-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Deep #050507 canvas with ambient nebula glows, soft starlight mesh, and glassmorphic sheen.
                  </p>
                </button>

                {/* True Black Option */}
                <button
                  type="button"
                  onClick={() => onSelectContrastMode('true-black')}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                    currentContrastMode === 'true-black'
                      ? 'border-white bg-[#090909] shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-black border border-white/60 flex items-center justify-center text-white text-[11px]">
                        <Moon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">True Black</span>
                    </div>
                    {currentContrastMode === 'true-black' && (
                      <span className="p-1 rounded-full bg-white text-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug">
                    Pure OLED pitch black (#000000) with crisp high-contrast outlines for maximum clarity in all lighting.
                  </p>
                </button>
              </div>
            </div>

            {/* Theme Palette Options */}
            <div className="mt-6 space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Atmospheric Accent Palette</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {themes.map((t) => {
                  const isSelected = currentTheme === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => onSelectTheme(t.name)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? isTrueBlack
                            ? 'bg-[#111] border-white/80 shadow-md ring-1 ring-white/40'
                            : 'bg-white/10 border-cyan-400/60 shadow-lg'
                          : isTrueBlack
                          ? 'bg-[#090909] border-white/20 hover:border-white/50'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full shadow-inner border border-white/30"
                          style={{
                            background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                          }}
                        />
                        <span className="text-xs font-semibold text-white">{t.label}</span>
                      </div>
                      {isSelected && (
                        <Check className={`w-4 h-4 ${isTrueBlack ? 'text-white' : 'text-cyan-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emotion Atmosphere Mood Aura Options */}
            {onSelectEmotion && (
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    <span>Emotion Atmosphere Gradient Aura</span>
                  </label>
                  <span className="text-[10px] text-cyan-300 font-medium">Smooth Atmospheric Transition</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {emotionMetas.map((emo) => {
                    const isSelected = currentEmotion === emo.type;
                    return (
                      <button
                        key={emo.type}
                        type="button"
                        onClick={() => onSelectEmotion(emo.type)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all text-center relative overflow-hidden group ${
                          isSelected
                            ? isTrueBlack
                              ? 'bg-[#151515] border-white ring-1 ring-white'
                              : 'bg-white/10 border-white/40 shadow-lg'
                            : isTrueBlack
                            ? 'bg-[#090909] border-white/20 hover:border-white/50'
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/20'
                        }`}
                        style={{
                          boxShadow: isSelected && !isTrueBlack ? `0 0 16px ${emo.glowRgba}` : undefined,
                        }}
                      >
                        <span className="text-base mb-1 group-hover:scale-110 transition-transform">
                          {emo.emoji}
                        </span>
                        <span
                          className="text-[11px] font-bold truncate max-w-full"
                          style={{ color: isSelected ? emo.colorHex : undefined }}
                        >
                          {emo.label.split('&')[0].trim()}
                        </span>
                        {isSelected && (
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1 animate-pulse"
                            style={{ backgroundColor: emo.colorHex }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Visualizer Style Options */}
            <div className="mt-6 space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visualizer Animation Engine</span>
              </label>
              <div className="space-y-2">
                {visualizerStyles.map((v) => {
                  const isSelected = currentStyle === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => onSelectStyle(v.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? isTrueBlack
                            ? 'bg-[#111] border-white/80 shadow-md ring-1 ring-white/40'
                            : 'bg-white/10 border-cyan-400/60 shadow-lg'
                          : isTrueBlack
                          ? 'bg-[#090909] border-white/20 hover:border-white/50'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isTrueBlack ? 'bg-white/10 text-white' : 'bg-white/5 text-neutral-300'}`}>
                          {v.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{v.label}</p>
                          <p className={`text-[11px] ${isTrueBlack ? 'text-neutral-300' : 'text-neutral-400'}`}>{v.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className={`w-4 h-4 ${isTrueBlack ? 'text-white' : 'text-cyan-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
