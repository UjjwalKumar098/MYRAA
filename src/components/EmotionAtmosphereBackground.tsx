import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EmotionType, VisualTheme, ContrastMode, AssistantState } from '../types';
import { EMOTION_METAS } from '../utils/emotionEngine';

interface EmotionAtmosphereBackgroundProps {
  currentEmotion: EmotionType;
  emotionIntensity: number;
  theme: VisualTheme;
  contrastMode: ContrastMode;
  state: AssistantState;
  audioVolume?: number;
}

interface EmotionGradientProfile {
  primary: string;
  secondary: string;
  accent: string;
  deepAura: string;
  pulseDuration: number;
  starlightColor: string;
}

const EMOTION_GRADIENT_PROFILES: Record<EmotionType, EmotionGradientProfile> = {
  serene: {
    primary: '#06b6d4', // Cyan
    secondary: '#0284c7', // Sky blue
    accent: '#38bdf8',
    deepAura: '#082f49', // Deep oceanic
    pulseDuration: 9,
    starlightColor: 'rgba(56, 189, 248, 0.15)',
  },
  joyful: {
    primary: '#eab308', // Radiant Gold
    secondary: '#f97316', // Warm Amber
    accent: '#fde047',
    deepAura: '#451a03', // Warm twilight amber
    pulseDuration: 6,
    starlightColor: 'rgba(253, 224, 71, 0.2)',
  },
  empathetic: {
    primary: '#ec4899', // Caring Pink
    secondary: '#a855f7', // Soft Violet
    accent: '#f472b6',
    deepAura: '#4c0519', // Velvet Wine
    pulseDuration: 8,
    starlightColor: 'rgba(244, 114, 182, 0.2)',
  },
  curious: {
    primary: '#8b5cf6', // Mystic Purple
    secondary: '#6366f1', // Indigo
    accent: '#c084fc',
    deepAura: '#1e1035', // Deep Cosmic Violet
    pulseDuration: 7,
    starlightColor: 'rgba(192, 132, 252, 0.2)',
  },
  focused: {
    primary: '#10b981', // Emerald
    secondary: '#06b6d4', // Teal Cyan
    accent: '#34d399',
    deepAura: '#022c22', // Deep Forest Jade
    pulseDuration: 7.5,
    starlightColor: 'rgba(52, 211, 153, 0.18)',
  },
  witty: {
    primary: '#f43f5e', // Electric Rose
    secondary: '#e11d48', // Crimson Pink
    accent: '#fb7185',
    deepAura: '#3b0764', // Magenta Twilight
    pulseDuration: 5,
    starlightColor: 'rgba(251, 113, 133, 0.22)',
  },
  energized: {
    primary: '#f97316', // Dynamic Solar Orange
    secondary: '#ef4444', // Fiery Red
    accent: '#fbbf24',
    deepAura: '#431407', // Dark Amber Ember
    pulseDuration: 4.5,
    starlightColor: 'rgba(251, 191, 36, 0.25)',
  },
  reassuring: {
    primary: '#38bdf8', // Calming Sky
    secondary: '#0284c7', // Deep Azure
    accent: '#7dd3fc',
    deepAura: '#0c2a42', // Anchor Navy
    pulseDuration: 8.5,
    starlightColor: 'rgba(125, 211, 252, 0.18)',
  },
  flirty: {
    primary: '#ff2d75', // Neon Hot Pink
    secondary: '#d946ef', // Electric Fuchsia
    accent: '#fb7185',
    deepAura: '#4c0519', // Velvet Wine
    pulseDuration: 4.5,
    starlightColor: 'rgba(255, 45, 117, 0.3)',
  },
  romantic: {
    primary: '#e11d48', // Deep Ruby Rose
    secondary: '#ec4899', // Romantic Pink
    accent: '#fda4af',
    deepAura: '#3b0764', // Midnight Purple Wine
    pulseDuration: 6,
    starlightColor: 'rgba(244, 114, 182, 0.28)',
  },
};

export const EmotionAtmosphereBackground: React.FC<EmotionAtmosphereBackgroundProps> = ({
  currentEmotion,
  emotionIntensity,
  theme,
  contrastMode,
  state,
  audioVolume = 0,
}) => {
  const isTrueBlack = contrastMode === 'true-black';
  const profile = EMOTION_GRADIENT_PROFILES[currentEmotion] || EMOTION_GRADIENT_PROFILES.serene;
  const meta = EMOTION_METAS[currentEmotion] || EMOTION_METAS.serene;

  // Normalized intensity multiplier (0.6 to 1.3)
  const intensityFactor = useMemo(() => {
    return Math.min(Math.max((emotionIntensity || 80) / 100, 0.5), 1.25);
  }, [emotionIntensity]);

  // Audio reactivity boost
  const audioBoost = useMemo(() => {
    if (state === 'speaking' || state === 'listening') {
      return Math.min(audioVolume * 0.4, 0.25);
    }
    return 0;
  }, [state, audioVolume]);

  const baseOpacity = isTrueBlack ? 0.05 : 0.42 * intensityFactor + audioBoost;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Base Dark Canvas with Smooth Background Color Transition */}
      <motion.div
        className="absolute inset-0 transition-colors duration-1000"
        animate={{
          backgroundColor: isTrueBlack
            ? '#000000'
            : '#050507',
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 2. Seamless Emotion Radial Vignette Layer */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: isTrueBlack ? 0 : 0.85 * intensityFactor,
          background: `radial-gradient(ellipse 90% 70% at 50% 35%, ${profile.primary}18 0%, ${profile.secondary}0d 45%, transparent 75%)`,
        }}
        transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1.0] }}
      />

      {/* 3. Primary Top-Left Fluid Aura Blob */}
      <motion.div
        className="absolute rounded-full blur-[140px]"
        initial={false}
        animate={{
          top: '-15%',
          left: '-15%',
          width: '68%',
          height: '68%',
          backgroundColor: profile.primary,
          opacity: baseOpacity * 0.95,
          scale: [1, 1.08 + audioBoost, 1],
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          backgroundColor: { duration: 2.4, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 1.8 },
          scale: {
            duration: profile.pulseDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          x: {
            duration: profile.pulseDuration * 1.3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          y: {
            duration: profile.pulseDuration * 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* 4. Secondary Bottom-Right Complementary Nebula Blob */}
      <motion.div
        className="absolute rounded-full blur-[150px]"
        initial={false}
        animate={{
          bottom: '-18%',
          right: '-15%',
          width: '72%',
          height: '72%',
          backgroundColor: profile.secondary,
          opacity: baseOpacity * 0.88,
          scale: [1, 1.12 + audioBoost, 1],
          x: [0, -25, 0],
          y: [0, -20, 0],
        }}
        transition={{
          backgroundColor: { duration: 2.5, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 1.8 },
          scale: {
            duration: profile.pulseDuration * 1.15,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          x: {
            duration: profile.pulseDuration * 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          y: {
            duration: profile.pulseDuration * 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* 5. Center-Mid Ambient Mood Highlight (Dynamic Spectral Flare) */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
        initial={false}
        animate={{
          width: '50%',
          height: '50%',
          backgroundColor: profile.accent,
          opacity: isTrueBlack ? 0 : baseOpacity * 0.55 + audioBoost * 0.5,
          scale: [0.95, 1.15, 0.95],
        }}
        transition={{
          backgroundColor: { duration: 2.6, ease: 'easeInOut' },
          opacity: { duration: 1.5 },
          scale: {
            duration: profile.pulseDuration * 0.85,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* 6. Deep Atmospheric Shadow Horizon */}
      {!isTrueBlack && (
        <motion.div
          className="absolute -bottom-20 left-0 right-0 h-96 blur-[120px] rounded-t-full opacity-60"
          initial={false}
          animate={{
            backgroundColor: profile.deepAura,
          }}
          transition={{ duration: 2.8, ease: 'easeInOut' }}
        />
      )}

      {/* 7. Subtle Emotion Tinted Starlight Mesh Matrix */}
      <motion.div
        className="absolute inset-0 [background-size:36px_36px] transition-opacity duration-1000"
        initial={false}
        animate={{
          opacity: isTrueBlack ? 0.08 : 0.35 * intensityFactor,
          backgroundImage: `radial-gradient(${profile.starlightColor} 1px, transparent 1px)`,
        }}
        transition={{ duration: 2.0, ease: 'easeInOut' }}
      />

      {/* 8. Subtle Emotion Transition Wave Flare */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`flare-${currentEmotion}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isTrueBlack ? 0.08 : 0.45, scale: 1.15 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full blur-[180px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${profile.primary}33 0%, ${profile.secondary}15 50%, transparent 80%)`,
          }}
        />
      </AnimatePresence>
    </div>
  );
};
