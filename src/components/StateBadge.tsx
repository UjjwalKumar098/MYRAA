import React from 'react';
import { motion } from 'motion/react';
import { AssistantState, VisualTheme } from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import { Radio, Mic, Volume2, PowerOff } from 'lucide-react';

interface StateBadgeProps {
  state: AssistantState;
  theme: VisualTheme;
  userVolume: number;
  assistantVolume: number;
}

export const StateBadge: React.FC<StateBadgeProps> = ({
  state,
  theme,
  userVolume,
  assistantVolume,
}) => {
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.aurora;

  const getStatusDetails = () => {
    switch (state) {
      case 'disconnected':
        return {
          icon: <PowerOff className="w-3.5 h-3.5 text-neutral-400" />,
          label: 'OFFLINE',
          subtext: 'Tap central orb or microphone to start conversation',
          dotColor: 'bg-neutral-500',
        };
      case 'connecting':
        return {
          icon: <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />,
          label: 'CONNECTING',
          subtext: 'Establishing ultra-low latency voice bridge...',
          dotColor: 'bg-cyan-400 animate-ping',
        };
      case 'listening':
        return {
          icon: <Mic className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />,
          label: 'LISTENING',
          subtext: 'Speak naturally • Myraa is hearing you in real time',
          dotColor: 'bg-emerald-400',
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-bounce" />,
          label: 'MYRAA SPEAKING',
          subtext: 'Voice response active • Interrupt anytime',
          dotColor: 'bg-pink-400 animate-pulse',
        };
    }
  };

  const status = getStatusDetails();

  return (
    <div id="myraa-state-badge" className="flex flex-col items-center gap-1.5 text-center select-none">
      <motion.div
        layout
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <span className="relative flex h-2 w-2">
          {state !== 'disconnected' && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dotColor}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              state === 'disconnected' ? 'bg-neutral-500' : 'bg-white'
            }`}
          />
        </span>

        <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
          {status.label}
        </span>

        {/* Live Audio Level VU Meter */}
        {state === 'listening' && (
          <div className="flex items-center gap-0.5 ml-1">
            {[0.1, 0.3, 0.6, 0.8].map((threshold, i) => (
              <span
                key={i}
                className="w-1 rounded-full transition-all duration-75"
                style={{
                  height: `${userVolume > threshold ? 10 + i * 2 : 4}px`,
                  backgroundColor: userVolume > threshold ? themeConfig.accent : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        )}

        {state === 'speaking' && (
          <div className="flex items-center gap-0.5 ml-1">
            {[0.1, 0.3, 0.6, 0.8].map((threshold, i) => (
              <span
                key={i}
                className="w-1 rounded-full transition-all duration-75"
                style={{
                  height: `${assistantVolume > threshold ? 12 + i * 2 : 4}px`,
                  backgroundColor: assistantVolume > threshold ? '#f43f5e' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      <p className="text-xs text-neutral-400 font-normal max-w-xs transition-opacity duration-300">
        {status.subtext}
      </p>
    </div>
  );
};
