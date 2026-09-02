import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ContrastMode } from '../types';
import { getDayPhase } from '../utils/timeSyncEngine';
import { Clock, Sunrise, Sun, SunMedium, Sunset, Moon, MoonStar } from 'lucide-react';

interface LiveTimeTickerPillProps {
  contrastMode?: ContrastMode;
  onClick: () => void;
}

export const LiveTimeTickerPill: React.FC<LiveTimeTickerPillProps> = ({
  contrastMode = 'cosmic',
  onClick,
}) => {
  const isTrueBlack = contrastMode === 'true-black';
  const [timeStr, setTimeStr] = useState<string>('--:--');
  const [dayPhase, setDayPhase] = useState<'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night' | 'midnight'>('afternoon');

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setDayPhase(getDayPhase(d.getHours()).phase);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    switch (dayPhase) {
      case 'dawn':
        return <Sunrise className="w-3.5 h-3.5 text-amber-400" />;
      case 'morning':
        return <Sun className="w-3.5 h-3.5 text-yellow-400" />;
      case 'afternoon':
        return <SunMedium className="w-3.5 h-3.5 text-orange-400" />;
      case 'sunset':
        return <Sunset className="w-3.5 h-3.5 text-rose-400" />;
      case 'night':
        return <Moon className="w-3.5 h-3.5 text-cyan-400" />;
      case 'midnight':
      default:
        return <MoonStar className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title="Click for Real-Time Time & World Clocks"
      className={`px-3 py-1.5 rounded-full border flex items-center gap-2 backdrop-blur-md transition-all shadow-md ${
        isTrueBlack
          ? 'bg-black border-white/30 hover:border-white/60 text-white'
          : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30 text-white'
      }`}
    >
      {getIcon()}
      <span className="text-xs font-mono font-bold text-neutral-200">{timeStr}</span>
    </motion.button>
  );
};
