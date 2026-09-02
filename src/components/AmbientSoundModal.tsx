import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudRain, Sparkles, Waves, Flame, Headphones, Volume2, X, Play, Square } from 'lucide-react';
import { AmbientSoundType } from '../types';

interface AmbientSoundModalProps {
  isOpen: boolean;
  activeSound: AmbientSoundType;
  volume: number;
  onSelectSound: (sound: AmbientSoundType) => void;
  onVolumeChange: (vol: number) => void;
  onClose: () => void;
}

interface SoundscapeItem {
  type: AmbientSoundType;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  gradient: string;
}

const SOUNDSCAPES: SoundscapeItem[] = [
  {
    type: 'rain',
    name: 'Gentle Rain',
    desc: 'Soft continuous rain droplets and pink noise frequency filter',
    icon: CloudRain,
    tag: 'Focus & Calm',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    type: 'cosmic',
    name: 'Cosmic Drone',
    desc: '432Hz deep space resonance and harmonic meditative drone',
    icon: Sparkles,
    tag: 'Meditation',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    type: 'focus',
    name: 'Brown Noise',
    desc: 'Deep warm low-frequency noise for intense focus and masking distractions',
    icon: Headphones,
    tag: 'Deep Work',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    type: 'zen',
    name: 'Zen Stream',
    desc: 'Resonant acoustic bubbling brook and temple water flow',
    icon: Waves,
    tag: 'Relaxation',
    gradient: 'from-teal-500/20 to-emerald-500/20',
  },
  {
    type: 'ocean',
    name: 'Ocean Waves',
    desc: 'Slow rhythmic tidal swells mimicking evening shorelines',
    icon: Flame,
    tag: 'Rest & Sleep',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
];

export const AmbientSoundModal: React.FC<AmbientSoundModalProps> = ({
  isOpen,
  activeSound,
  volume,
  onSelectSound,
  onVolumeChange,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#09090e] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 select-none overflow-hidden"
        >
          {/* Ambient header glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">Ambient Soundscapes</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Procedural background audio generated natively in real-time
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Soundscape List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 max-h-[320px] overflow-y-auto pr-1">
            {SOUNDSCAPES.map((s) => {
              const Icon = s.icon;
              const isPlaying = activeSound === s.type;

              return (
                <button
                  key={s.type}
                  onClick={() => onSelectSound(isPlaying ? 'off' : s.type)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                    isPlaying
                      ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`p-2 rounded-xl border ${
                        isPlaying
                          ? 'border-cyan-400/40 bg-cyan-400/20 text-cyan-300'
                          : 'border-white/10 bg-white/5 text-neutral-300 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isPlaying
                          ? 'bg-cyan-400 text-black'
                          : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {isPlaying ? 'Playing' : s.tag}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    {s.name}
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Volume & Master Control Bar */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Ambiance Volume</span>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />

              {activeSound !== 'off' && (
                <button
                  onClick={() => onSelectSound('off')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Square className="w-3 h-3 fill-rose-300" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>

          {/* Voice Prompt Hint */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-neutral-400">
              Tip: You can also say <span className="text-cyan-300 font-medium">"Myraa, play rain sounds"</span> or <span className="text-cyan-300 font-medium">"Stop background noise"</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
