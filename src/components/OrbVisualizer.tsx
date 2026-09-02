import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AssistantState, VisualTheme, VisualizerStyle, ContrastMode, EmotionType } from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import { EMOTION_METAS } from '../utils/emotionEngine';

interface OrbVisualizerProps {
  state: AssistantState;
  theme: VisualTheme;
  style: VisualizerStyle;
  contrastMode?: ContrastMode;
  currentEmotion?: EmotionType;
  userMetrics: { frequencyData: Uint8Array; volume: number };
  assistantMetrics: { frequencyData: Uint8Array; volume: number };
  onOrbClick: () => void;
}

export const OrbVisualizer: React.FC<OrbVisualizerProps> = ({
  state,
  theme,
  style,
  contrastMode = 'cosmic',
  currentEmotion = 'serene',
  userMetrics,
  assistantMetrics,
  onOrbClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.aurora;
  const emotionMeta = EMOTION_METAS[currentEmotion] || EMOTION_METAS.serene;
  const animationFrameRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);
  const isTrueBlack = contrastMode === 'true-black';

  // Render dynamic canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;
      phaseRef.current += 0.03;

      // Determine active audio metric based on who is speaking
      const activeVolume =
        state === 'speaking'
          ? assistantMetrics.volume
          : state === 'listening'
          ? userMetrics.volume
          : state === 'connecting'
          ? 0.35
          : 0.05;

      const activeFreq =
        state === 'speaking'
          ? assistantMetrics.frequencyData
          : state === 'listening'
          ? userMetrics.frequencyData
          : new Uint8Array(32).fill(10);

      if (style === 'fluid-orb') {
        // --- 1. FLUID ORGANIC ORB ---
        // Outer glowing halo
        const haloGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          baseRadius * 0.5,
          centerX,
          centerY,
          baseRadius * (1.6 + activeVolume * 0.8)
        );
        haloGrad.addColorStop(0, themeConfig.primary + '66');
        haloGrad.addColorStop(0.5, themeConfig.secondary + '33');
        haloGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * (1.6 + activeVolume * 0.8), 0, Math.PI * 2);
        ctx.fill();

        // Deformed organic wave layer 1
        ctx.save();
        ctx.beginPath();
        const points = 36;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const freqIndex = Math.floor((i / points) * (activeFreq.length / 2));
          const freqFactor = (activeFreq[freqIndex] || 0) / 255;
          const deform =
            Math.sin(angle * 4 + phaseRef.current) * (10 + activeVolume * 30) +
            Math.cos(angle * 3 - phaseRef.current * 1.5) * (8 + freqFactor * 25);
          const r = baseRadius + deform;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const orbGrad = ctx.createRadialGradient(
          centerX - baseRadius * 0.3,
          centerY - baseRadius * 0.3,
          baseRadius * 0.1,
          centerX,
          centerY,
          baseRadius * 1.2
        );
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.3, themeConfig.accent);
        orbGrad.addColorStop(0.7, themeConfig.primary);
        orbGrad.addColorStop(1, themeConfig.secondary);

        ctx.fillStyle = orbGrad;
        ctx.shadowColor = themeConfig.primary;
        ctx.shadowBlur = 25 + activeVolume * 40;
        ctx.fill();
        ctx.restore();

        // Inner glowing core
        ctx.save();
        const coreGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          baseRadius * (0.5 + activeVolume * 0.3)
        );
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        coreGrad.addColorStop(0.6, themeConfig.accent + 'aa');
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * (0.5 + activeVolume * 0.3), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (style === 'waveform-ring') {
        // --- 2. ACOUSTIC HARMONIC RINGS ---
        const numRings = 4;
        for (let rIdx = 0; rIdx < numRings; rIdx++) {
          const ringRadius = baseRadius * (0.7 + rIdx * 0.35) + activeVolume * 25;
          ctx.save();
          ctx.beginPath();
          const segments = 48;
          for (let s = 0; s <= segments; s++) {
            const angle = (s / segments) * Math.PI * 2;
            const freqVal = (activeFreq[s % activeFreq.length] || 0) / 255;
            const waveOffset = Math.sin(angle * (6 + rIdx) + phaseRef.current * (1 + rIdx * 0.5)) * (4 + freqVal * 18);
            const rad = ringRadius + waveOffset;
            const x = centerX + Math.cos(angle) * rad;
            const y = centerY + Math.sin(angle) * rad;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = rIdx % 2 === 0 ? themeConfig.primary : themeConfig.secondary;
          ctx.lineWidth = 2.5 + activeVolume * 2;
          ctx.shadowColor = themeConfig.primary;
          ctx.shadowBlur = 12 + activeVolume * 20;
          ctx.stroke();
          ctx.restore();
        }

        // Center glass sphere
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.65, 0, Math.PI * 2);
        const centerGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          baseRadius * 0.65
        );
        centerGrad.addColorStop(0, '#ffffff');
        centerGrad.addColorStop(0.5, themeConfig.accent);
        centerGrad.addColorStop(1, themeConfig.primary);
        ctx.fillStyle = centerGrad;
        ctx.shadowColor = themeConfig.accent;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();

      } else {
        // --- 3. RADIAL FREQUENCY EQUALIZER BARS ---
        const numBars = 42;
        ctx.save();
        for (let b = 0; b < numBars; b++) {
          const angle = (b / numBars) * Math.PI * 2;
          const freqVal = (activeFreq[b % activeFreq.length] || 0) / 255;
          const barHeight = 8 + freqVal * (45 + activeVolume * 50) + Math.sin(phaseRef.current * 2 + b) * 4;

          const startX = centerX + Math.cos(angle) * (baseRadius * 0.8);
          const startY = centerY + Math.sin(angle) * (baseRadius * 0.8);
          const endX = centerX + Math.cos(angle) * (baseRadius * 0.8 + barHeight);
          const endY = centerY + Math.sin(angle) * (baseRadius * 0.8 + barHeight);

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = b % 2 === 0 ? themeConfig.primary : themeConfig.accent;
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.shadowColor = themeConfig.primary;
          ctx.shadowBlur = 10;
          ctx.stroke();
        }
        ctx.restore();

        // Inner glowing core
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.65, 0, Math.PI * 2);
        const barCoreGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          baseRadius * 0.65
        );
        barCoreGrad.addColorStop(0, '#ffffff');
        barCoreGrad.addColorStop(0.7, themeConfig.primary);
        barCoreGrad.addColorStop(1, themeConfig.secondary);
        ctx.fillStyle = barCoreGrad;
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [state, theme, style, userMetrics, assistantMetrics, themeConfig]);

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* Central Immersive Interactive Orb Stage */}
      <div
        id="myraa-orb-container"
        className="relative group cursor-pointer flex items-center justify-center transition-transform active:scale-98"
        onClick={onOrbClick}
      >
        {/* Atmospheric Blurred Bloom Layers */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[90px] scale-150 pointer-events-none"
          style={{
            background: themeConfig.primary,
          }}
          animate={{
            opacity: isTrueBlack ? 0 : state === 'speaking' ? 0.65 : state === 'listening' ? 0.45 : 0.25,
            scale: state === 'speaking' ? [1.4, 1.65, 1.45] : state === 'listening' ? [1.3, 1.45, 1.3] : [1.1, 1.25, 1.1],
          }}
          transition={{
            duration: state === 'speaking' ? 1.6 : state === 'listening' ? 2.5 : 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-full blur-[100px] scale-125 translate-y-6 pointer-events-none"
          style={{
            background: themeConfig.secondary,
          }}
          animate={{
            opacity: isTrueBlack ? 0 : state === 'speaking' ? 0.5 : state === 'listening' ? 0.35 : 0.2,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Concentric Nested Circular Glass Enclosures (Immersive UI specification) */}
        <div className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border backdrop-blur-3xl flex items-center justify-center relative z-20 transition-all duration-300 ${
          isTrueBlack
            ? 'border-white/40 bg-black shadow-[0_0_50px_rgba(255,255,255,0.12)] hover:border-white/70'
            : 'border-white/20 bg-white/[0.04] shadow-[0_0_90px_rgba(6,182,212,0.18)] hover:border-white/30'
        }`}>
          {/* Middle Ring */}
          <div className={`w-52 h-52 sm:w-58 sm:h-58 rounded-full border flex items-center justify-center ${
            isTrueBlack ? 'border-white/30 bg-[#050505]' : 'border-white/10'
          }`}>
            {/* Inner Core Container */}
            <div className={`w-40 h-40 sm:w-46 sm:h-46 rounded-full border-4 flex items-center justify-center relative overflow-hidden ${
              isTrueBlack
                ? 'border-white/20 bg-black'
                : 'border-white/5 bg-gradient-to-tr from-cyan-400/10 to-purple-400/10'
            }`}>
              {/* Dynamic Waveform Canvas mounted right within the core */}
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

              {/* Center Microphone Icon Overlay */}
              <div className="relative z-20 pointer-events-none flex items-center justify-center">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-all duration-300 ${
                    state === 'speaking'
                      ? 'text-cyan-300 scale-110 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                      : state === 'listening'
                      ? 'text-white scale-105'
                      : state === 'connecting'
                      ? 'text-cyan-400/70 animate-pulse'
                      : isTrueBlack
                      ? 'text-white/80'
                      : 'text-white/60'
                  }`}
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Pill Badge on Bottom Edge */}
          <div className="absolute -bottom-3.5 z-30">
            {state === 'speaking' && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyan-400 text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,211,238,0.7)]"
              >
                Speaking
              </motion.div>
            )}

            {state === 'listening' && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-400 text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(52,211,153,0.7)]"
              >
                Listening
              </motion.div>
            )}

            {state === 'connecting' && (
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className={`backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg ${
                  isTrueBlack
                    ? 'bg-black text-cyan-300 border border-cyan-400'
                    : 'bg-white/15 text-cyan-300 border border-cyan-400/40'
                }`}
              >
                Connecting...
              </motion.div>
            )}

            {state === 'disconnected' && (
              <div className={`backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg ${
                isTrueBlack
                  ? 'bg-black text-white border border-white/40 shadow-sm'
                  : 'bg-white/10 text-white/80 border border-white/15'
              }`}>
                Tap to Talk
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Soundwave Spectrum Equalizer Bars (Immersive Emotion Harmonized) */}
      <div className="mt-12 sm:mt-16 w-full max-w-lg h-20 flex items-center justify-center gap-1.5 sm:gap-2 px-4">
        {[
          { baseH: 24, mult: 40, opacity: 0.35 },
          { baseH: 36, mult: 55, opacity: 0.55 },
          { baseH: 48, mult: 70, opacity: 0.75 },
          { baseH: 52, mult: 85, opacity: 0.95, isCenter: true },
          { baseH: 64, mult: 95, opacity: 1.0, isCenter: true },
          { baseH: 44, mult: 75, opacity: 0.95, isCenter: true },
          { baseH: 68, mult: 100, opacity: 1.0, isCenter: true },
          { baseH: 48, mult: 70, opacity: 0.75 },
          { baseH: 56, mult: 80, opacity: 0.65 },
          { baseH: 32, mult: 50, opacity: 0.45 },
          { baseH: 18, mult: 30, opacity: 0.25 },
        ].map((bar, idx) => {
          const freqIndex = Math.min(idx * 2, (state === 'speaking' ? assistantMetrics.frequencyData : userMetrics.frequencyData).length - 1);
          const freqVal = ((state === 'speaking' ? assistantMetrics.frequencyData[freqIndex] : userMetrics.frequencyData[freqIndex]) || 0) / 255;
          const dynamicHeight =
            state === 'speaking' || state === 'listening'
              ? Math.max(8, bar.baseH * 0.2 + freqVal * bar.mult)
              : state === 'connecting'
              ? Math.max(8, 12 + Math.sin(Date.now() / 200 + idx) * 8)
              : 8;

          return (
            <motion.div
              key={idx}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${dynamicHeight}px`,
                backgroundColor: bar.isCenter ? '#ffffff' : emotionMeta.colorHex,
                opacity: bar.opacity,
                boxShadow: bar.isCenter
                  ? `0 0 14px ${emotionMeta.glowRgba}`
                  : `0 0 8px ${emotionMeta.glowRgba}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
