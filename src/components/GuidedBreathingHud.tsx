import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Play, RotateCcw, Wind } from 'lucide-react';
import { BreathingSession, BreathingPhase } from '../types';

interface GuidedBreathingHudProps {
  session: BreathingSession | null;
  onStop: () => void;
  onRestart: () => void;
}

export const GuidedBreathingHud: React.FC<GuidedBreathingHudProps> = ({
  session,
  onStop,
  onRestart,
}) => {
  if (!session || !session.isActive) return null;

  const getPhaseColor = (phase: BreathingPhase) => {
    switch (phase) {
      case 'inhale':
        return 'text-cyan-300 border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.35)]';
      case 'hold':
        return 'text-purple-300 border-purple-400/40 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.35)]';
      case 'exhale':
        return 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.35)]';
      case 'rest':
        return 'text-amber-300 border-amber-400/40 bg-amber-500/10 shadow-[0_0_25px_rgba(251,191,36,0.35)]';
    }
  };

  const getPhaseInstruction = (phase: BreathingPhase) => {
    switch (phase) {
      case 'inhale':
        return 'Inhale deeply through your nose...';
      case 'hold':
        return 'Hold and gently sustain your breath...';
      case 'exhale':
        return 'Exhale slowly through your mouth...';
      case 'rest':
        return 'Rest and relax naturally...';
    }
  };

  const techLabel =
    session.technique === 'box'
      ? 'Box Breathing (4-4-4-4)'
      : session.technique === 'calm-478'
      ? '4-7-8 Deep Calm'
      : 'Energizing Breath';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 select-none"
      >
        <div
          className={`relative flex flex-col items-center p-4 rounded-3xl border backdrop-blur-2xl transition-all duration-700 ${getPhaseColor(
            session.phase
          )}`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 animate-spin-slow" />
              <span className="text-xs font-bold tracking-wide uppercase">{techLabel}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onRestart}
                title="Restart Cycles"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onStop}
                title="End Breathing Session"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Breathing Stage Animation */}
          <div className="my-2 flex flex-col items-center">
            <motion.div
              key={session.phase}
              initial={{ scale: session.phase === 'inhale' ? 0.8 : session.phase === 'exhale' ? 1.2 : 1 }}
              animate={{ scale: session.phase === 'inhale' ? 1.25 : session.phase === 'exhale' ? 0.8 : 1 }}
              transition={{ duration: session.phaseTimeRemaining, ease: 'easeInOut' }}
              className="text-2xl font-extrabold uppercase tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            >
              {session.phase}
            </motion.div>

            <div className="text-3xl font-mono font-black text-white/95 my-1">
              {session.phaseTimeRemaining}s
            </div>

            <p className="text-xs text-center text-white/80 font-medium max-w-xs mt-1">
              {getPhaseInstruction(session.phase)}
            </p>
          </div>

          {/* Footer Cycle Stats */}
          <div className="w-full flex items-center justify-between text-[11px] text-white/60 pt-2 border-t border-white/10 mt-1">
            <span>Cycle completed: {session.totalCyclesCompleted}</span>
            <span className="text-cyan-300 font-medium">In sync with Myraa</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
