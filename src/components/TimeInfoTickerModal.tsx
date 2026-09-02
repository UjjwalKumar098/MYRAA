import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimeUpdateDigest, ContrastMode } from '../types';
import { getDayPhase, getTimeGreeting, WORLD_CITIES, PERIODIC_TIME_ROUTINES } from '../utils/timeSyncEngine';
import {
  Clock,
  Globe,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  MoonStar,
  SunMedium,
  RefreshCw,
  X,
  Sparkles,
  Zap,
  Volume2,
  Calendar,
  Compass,
  Bell,
  CheckCircle2,
  Sliders,
  Radio,
} from 'lucide-react';

interface TimeInfoTickerModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  sessionStartTime: number;
  autoSyncIntervalMinutes?: number;
  onSetAutoSyncInterval?: (mins: number) => void;
  onTriggerBriefing: () => void;
  onClose: () => void;
}

export const TimeInfoTickerModal: React.FC<TimeInfoTickerModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  sessionStartTime,
  autoSyncIntervalMinutes = 5,
  onSetAutoSyncInterval,
  onTriggerBriefing,
  onClose,
}) => {
  const isTrueBlack = contrastMode === 'true-black';
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [intervalMins, setIntervalMins] = useState<number>(autoSyncIntervalMinutes);
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState<number>(autoSyncIntervalMinutes * 60);

  // 1-second live ticker and countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setSecondsUntilNextSync((prev) => {
        if (prev <= 1) {
          return intervalMins * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [intervalMins]);

  if (!isOpen) return null;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const dayPhaseInfo = getDayPhase(hours);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const greeting = getTimeGreeting(hours, 'en');
  const sessionMinutes = Math.max(0, Math.floor((Date.now() - sessionStartTime) / 60000));
  const sessionSeconds = Math.max(0, Math.floor(((Date.now() - sessionStartTime) % 60000) / 1000));

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getPhaseIcon = () => {
    switch (dayPhaseInfo.phase) {
      case 'dawn':
        return <Sunrise className="w-5 h-5 text-amber-400" />;
      case 'morning':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'afternoon':
        return <SunMedium className="w-5 h-5 text-orange-400" />;
      case 'sunset':
        return <Sunset className="w-5 h-5 text-rose-400" />;
      case 'night':
        return <Moon className="w-5 h-5 text-cyan-400" />;
      case 'midnight':
      default:
        return <MoonStar className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setCurrentTime(new Date());
    setSecondsUntilNextSync(intervalMins * 60);
    setTimeout(() => {
      setIsSyncing(false);
      onTriggerBriefing();
    }, 400);
  };

  const handleIntervalChange = (mins: number) => {
    setIntervalMins(mins);
    setSecondsUntilNextSync(mins * 60);
    onSetAutoSyncInterval?.(mins);
  };

  const nextSyncMins = Math.floor(secondsUntilNextSync / 60);
  const nextSyncSecs = secondsUntilNextSync % 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl bg-black/75">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
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
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">Time-to-Time Real-Time Intelligence</h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                    Live 1s Tick
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Synchronized world time zones, day/night cycles, and periodic status digests
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Primary Time & Day Phase Hero Display */}
            <div
              className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
                isTrueBlack ? 'border-white/25 bg-[#0a0a0a]' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div
                className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-25 bg-cyan-500"
              />

              {/* Digital Live Clock */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  {timeZone}
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                  {formattedTime}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-neutral-300 mt-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {formattedDate}
                </div>
              </div>

              {/* Day Phase & Sun Arc */}
              <div
                className={`w-full md:w-64 p-4 rounded-2xl border flex flex-col justify-between ${
                  isTrueBlack ? 'border-white/20 bg-black' : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Daylight Phase</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    {getPhaseIcon()}
                    <span>{dayPhaseInfo.label}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Phase Arc Progress</span>
                    <span className="font-mono text-cyan-300">{dayPhaseInfo.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${dayPhaseInfo.progressPercent}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-neutral-300 mt-2 pt-2 border-t border-white/10 italic">
                  "{greeting}"
                </div>
              </div>
            </div>

            {/* Session Time & Auto-Sync Digest Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Session Duration Tracker */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isTrueBlack ? 'border-white/20 bg-[#090909]' : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">Active Conversation Elapsed</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {sessionMinutes}m {sessionSeconds}s
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 font-mono">
                  Online
                </span>
              </div>

              {/* Time Sync Action Trigger */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isTrueBlack ? 'border-white/20 bg-[#090909]' : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div>
                  <div className="text-xs text-neutral-400">Time-to-Time Voice Briefing</div>
                  <div className="text-xs text-neutral-300 mt-0.5">
                    Next sync in <span className="font-mono font-bold text-cyan-300">{nextSyncMins}m {nextSyncSecs}s</span>
                  </div>
                </div>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Briefing Now
                </button>
              </div>
            </div>

            {/* Time-to-Time Proactive Auto-Update Interval Config */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                isTrueBlack ? 'border-white/20 bg-[#090909]' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                    Proactive Time-to-Time Sync Interval
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  Every {intervalMins} Minutes
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 5, 10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleIntervalChange(mins)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      intervalMins === mins
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                    }`}
                  >
                    <Radio className={`w-3 h-3 ${intervalMins === mins ? 'text-black' : 'text-neutral-400'}`} />
                    <span>Every {mins} min{mins > 1 ? 's' : ''}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Phase Routines & Contextual Reminders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-semibold text-neutral-200">Periodic Day-Phase Routines</h4>
                </div>
                <span className="text-xs text-neutral-400">Contextual time alerts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERIODIC_TIME_ROUTINES.map((routine) => (
                  <div
                    key={routine.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                      isTrueBlack ? 'border-white/15 bg-[#0a0a0a]' : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 text-sm mt-0.5">
                      ⏰
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">{routine.title}</span>
                        <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {routine.timeLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-relaxed">{routine.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Synchronized World Clock Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-neutral-200">Global World Clocks</h4>
                </div>
                <span className="text-xs text-neutral-400">Auto-calculated UTC offsets</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {WORLD_CITIES.map((city) => {
                  let cityTimeStr = '--:--';
                  let diffStr = '0h';
                  try {
                    cityTimeStr = new Intl.DateTimeFormat('en-US', {
                      timeZone: city.timeZone,
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).format(currentTime);

                    const cityHour = parseInt(
                      new Intl.DateTimeFormat('en-US', {
                        timeZone: city.timeZone,
                        hour: 'numeric',
                        hour12: false,
                      }).format(currentTime),
                      10
                    );
                    const diff = cityHour - hours;
                    diffStr = diff === 0 ? 'Local' : diff > 0 ? `+${diff}h` : `${diff}h`;
                  } catch {
                    cityTimeStr = formattedTime;
                  }

                  return (
                    <div
                      key={city.city}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isTrueBlack
                          ? 'border-white/20 bg-[#090909]'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{city.flag}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-neutral-300">
                          {diffStr}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-base font-bold font-mono text-white">{cityTimeStr}</div>
                        <div className="text-xs font-semibold text-neutral-300 truncate mt-0.5">{city.city}</div>
                        <div className="text-[11px] text-neutral-400 truncate">{city.country}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center justify-between ${
              isTrueBlack ? 'border-white/20 bg-neutral-950' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="text-xs text-neutral-400">
              Live Precision: <span className="text-cyan-400 font-mono">1000ms Real-Time Pulse</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
