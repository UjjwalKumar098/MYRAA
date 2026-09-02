import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer as TimerIcon, X, Play, Pause, Bell } from 'lucide-react';
import { VoiceTimer } from '../types';

interface FloatingTimerHudProps {
  timer: VoiceTimer | null;
  onCancel: () => void;
  onTogglePause: () => void;
}

export const FloatingTimerHud: React.FC<FloatingTimerHudProps> = ({
  timer,
  onCancel,
  onTogglePause,
}) => {
  if (!timer) return null;

  const mins = Math.floor(timer.remainingSeconds / 60);
  const secs = timer.remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;
  const progressPercent = Math.max(0, Math.min(100, (timer.remainingSeconds / timer.durationSeconds) * 100));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-20 right-6 z-40 max-w-xs select-none"
      >
        <div className="flex items-center gap-3 p-3 pl-3.5 rounded-2xl bg-[#09090d]/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          {/* Circular Countdown Progress Mini Ring */}
          <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
            <svg className="w-10 h-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="transparent"
                className="text-white/10"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={100}
                strokeDashoffset={100 - progressPercent}
                className="text-cyan-400 transition-all duration-300"
              />
            </svg>
            <TimerIcon className="absolute w-4 h-4 text-cyan-300" />
          </div>

          {/* Timer Label & Countdown */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                Timer Active
              </span>
              {timer.remainingSeconds <= 10 && (
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                </span>
              )}
            </div>
            <div className="text-base font-mono font-bold tracking-tight text-white flex items-baseline gap-1.5">
              <span>{timeFormatted}</span>
              <span className="text-[11px] font-sans font-normal text-neutral-400 truncate max-w-[90px]">
                {timer.label}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePause}
              title={timer.isRunning ? 'Pause Timer' : 'Resume Timer'}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            >
              {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onCancel}
              title="Dismiss Timer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
