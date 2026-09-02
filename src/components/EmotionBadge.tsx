import React from 'react';
import { motion } from 'motion/react';
import { EmotionType, ContrastMode } from '../types';
import { EMOTION_METAS } from '../utils/emotionEngine';
import { Sparkles } from 'lucide-react';

interface EmotionBadgeProps {
  currentEmotion: EmotionType;
  intensity: number;
  expression: string;
  contrastMode?: ContrastMode;
  onClick: () => void;
}

export const EmotionBadge: React.FC<EmotionBadgeProps> = ({
  currentEmotion,
  intensity,
  expression,
  contrastMode = 'cosmic',
  onClick,
}) => {
  const isTrueBlack = contrastMode === 'true-black';
  const meta = EMOTION_METAS[currentEmotion] || EMOTION_METAS.serene;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={`Emotion: ${meta.label} (${intensity}%) - Click for Mood History`}
      className={`px-3 py-1.5 rounded-full border flex items-center gap-2 backdrop-blur-md transition-all shadow-md ${
        isTrueBlack
          ? 'bg-black border-white/30 hover:border-white/60 text-white'
          : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30 text-white'
      }`}
      style={{
        boxShadow: !isTrueBlack ? `0 0 15px ${meta.glowRgba}` : undefined,
      }}
    >
      <span className="text-sm">{meta.emoji}</span>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span style={{ color: meta.colorHex }}>{meta.label.split('&')[0].trim()}</span>
        <span className="text-[10px] opacity-70 font-mono">({intensity}%)</span>
      </div>
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: meta.colorHex }}
      />
    </motion.button>
  );
};
