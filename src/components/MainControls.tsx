import React from 'react';
import { AssistantState, VisualTheme, ContrastMode, AmbientSoundType, LanguageSettings, MediaPlatform } from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import {
  Mic,
  MicOff,
  Power,
  Square,
  Palette,
  StickyNote,
  HelpCircle,
  VolumeX,
  Headphones,
  Activity,
  Languages,
  ArrowRightLeft,
  Sliders,
  SunMoon,
  Moon,
  Youtube,
  Music,
  Zap,
  Heart,
  Clock,
  TrendingUp,
  CloudSun,
  Rocket,
} from 'lucide-react';

interface MainControlsProps {
  state: AssistantState;
  theme: VisualTheme;
  contrastMode?: ContrastMode;
  isMuted: boolean;
  notesCount: number;
  activeAmbientSound?: AmbientSoundType;
  lastCommandText?: string;
  languageSettings?: LanguageSettings;
  isMediaPlaying?: boolean;
  activeMediaPlatform?: MediaPlatform | null;
  onToggleConnection: () => void;
  onToggleMute: () => void;
  onInterrupt: () => void;
  onOpenThemes: () => void;
  onToggleContrastMode?: () => void;
  onOpenNotes: () => void;
  onOpenAmbient: () => void;
  onOpenTelemetry: () => void;
  onOpenInfo: () => void;
  onOpenSettings?: () => void;
  onOpenYouTube?: () => void;
  onOpenSpotify?: () => void;
  onOpenAppAutomation?: () => void;
  onOpenEmotionHistory?: () => void;
  onOpenTimeInfo?: () => void;
  onOpenTradingHub?: () => void;
  onOpenWeather?: () => void;
  onOpenBusinessBuilder?: () => void;
}

export const MainControls: React.FC<MainControlsProps> = ({
  state,
  theme,
  contrastMode = 'cosmic',
  isMuted,
  notesCount,
  activeAmbientSound = 'off',
  lastCommandText = '"What\'s the weather in Tokyo tomorrow?"',
  languageSettings,
  isMediaPlaying = false,
  activeMediaPlatform = null,
  onToggleConnection,
  onToggleMute,
  onInterrupt,
  onOpenThemes,
  onToggleContrastMode,
  onOpenNotes,
  onOpenAmbient,
  onOpenTelemetry,
  onOpenInfo,
  onOpenSettings,
  onOpenYouTube,
  onOpenSpotify,
  onOpenAppAutomation,
  onOpenEmotionHistory,
  onOpenTimeInfo,
  onOpenTradingHub,
  onOpenWeather,
  onOpenBusinessBuilder,
}) => {
  const isConnected = state === 'listening' || state === 'speaking';
  const isConnecting = state === 'connecting';
  const isTrueBlack = contrastMode === 'true-black';

  const baseBtnClass = isTrueBlack
    ? 'border-white/35 bg-black hover:bg-[#111] hover:border-white/70 text-white shadow-md'
    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white shadow-lg';

  return (
    <div id="myraa-main-controls" className="w-full max-w-5xl mx-auto px-6 pb-8 select-none">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6">
        {/* Left Side: Last Command / Interaction Status */}
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${isTrueBlack ? 'text-white/70' : 'text-white/40'}`}>
              {state === 'speaking'
                ? 'Myraa Responding'
                : state === 'listening'
                ? 'Listening to Input'
                : isConnected
                ? 'Live Session'
                : 'Suggested Prompt'}
            </span>
            {languageSettings?.translationMode && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-medium">
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>
                  {languageSettings.sourceLanguage.toUpperCase()} ↔{' '}
                  {languageSettings.targetLanguage.toUpperCase()} Live
                </span>
              </span>
            )}
            {isTrueBlack && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-black border border-white">
                High Contrast
              </span>
            )}
          </div>
          <span className={`text-sm sm:text-base font-light tracking-wide line-clamp-1 max-w-md ${isTrueBlack ? 'text-white' : 'text-white/80'}`}>
            {lastCommandText}
          </span>
        </div>

        {/* Right Side: Interactive Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* YouTube Player Button */}
          {onOpenYouTube && (
            <button
              id="youtube-player-btn"
              onClick={onOpenYouTube}
              title="YouTube Music & Video Player"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
                activeMediaPlatform === 'youtube' && isMediaPlaying
                  ? 'border-red-500/60 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                  : baseBtnClass
              }`}
            >
              <Youtube className="w-4 h-4" />
              {activeMediaPlatform === 'youtube' && isMediaPlaying && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          )}

          {/* Spotify Player Button */}
          {onOpenSpotify && (
            <button
              id="spotify-player-btn"
              onClick={onOpenSpotify}
              title="Spotify Music Stream"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
                activeMediaPlatform === 'spotify' && isMediaPlaying
                  ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                  : baseBtnClass
              }`}
            >
              <Music className="w-4 h-4" />
              {activeMediaPlatform === 'spotify' && isMediaPlaying && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          )}

          {/* App Automation Hub Button */}
          {onOpenAppAutomation && (
            <button
              id="app-automation-hub-btn"
              onClick={onOpenAppAutomation}
              title="App Automation & Live Auto-Typing Hub (WhatsApp, Maps, Gmail)"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
            >
              <Zap className="w-4 h-4 text-cyan-300" />
            </button>
          )}

          {/* Trading & Stocks Intelligence Hub Button */}
          {onOpenTradingHub && (
            <button
              id="trading-hub-btn"
              onClick={onOpenTradingHub}
              title="Trading & Stocks Terminal: Live Market, Stock Research, Profit Calculator & Sell Advisor"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* Language & Live Translator Settings Button */}
          {onOpenSettings && (
            <button
              id="language-settings-btn"
              onClick={onOpenSettings}
              title="Language & Real-Time Translation Settings"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
                languageSettings?.translationMode
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : baseBtnClass
              }`}
            >
              {languageSettings?.translationMode ? (
                <ArrowRightLeft className="w-4 h-4" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
            </button>
          )}

          {/* High Contrast Toggle Button */}
          {onToggleContrastMode && (
            <button
              id="high-contrast-toggle-btn"
              onClick={onToggleContrastMode}
              title={isTrueBlack ? 'Switch to Cosmic Dark Theme' : 'Switch to High-Contrast True Black'}
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
                isTrueBlack
                  ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-1 ring-white'
                  : 'border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white hover:border-white/30'
              }`}
            >
              <SunMoon className="w-4 h-4" />
              {isTrueBlack && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-black" />
              )}
            </button>
          )}

          {/* Ambient Soundscape Button */}
          <button
            id="ambient-sound-btn"
            onClick={onOpenAmbient}
            title={activeAmbientSound !== 'off' ? `Ambient: ${activeAmbientSound}` : 'Ambient Soundscapes'}
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              activeAmbientSound !== 'off'
                ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : baseBtnClass
            }`}
          >
            <Headphones className="w-4 h-4" />
            {activeAmbientSound !== 'off' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          {/* Telemetry HUD Button */}
          <button
            id="telemetry-hud-btn"
            onClick={onOpenTelemetry}
            title="Audio Telemetry & Health"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Visual Atmosphere Button */}
          <button
            id="theme-selector-btn"
            onClick={onOpenThemes}
            title="Visual Atmosphere & Colors"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Emotion Engine & Mood History Button */}
          {onOpenEmotionHistory && (
            <button
              id="emotion-history-btn"
              onClick={onOpenEmotionHistory}
              title="Emotion Engine & Mood History"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
            >
              <Heart className="w-4 h-4 text-pink-400" />
            </button>
          )}

          {/* Real-Time Clock & Time-to-Time Updates Button */}
          {onOpenTimeInfo && (
            <button
              id="time-info-btn"
              onClick={onOpenTimeInfo}
              title="Time-to-Time Real-Time Intelligence & World Clocks"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
            >
              <Clock className="w-4 h-4 text-cyan-300" />
            </button>
          )}

          {/* World Weather Radar & Temperature Button */}
          {onOpenWeather && (
            <button
              id="main-weather-btn"
              onClick={onOpenWeather}
              title="World Weather Radar & Live Temperatures"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
            >
              <CloudSun className="w-4 h-4 text-sky-300" />
            </button>
          )}

          {/* Online Business Models & Digital Products Builder Button */}
          {onOpenBusinessBuilder && (
            <button
              id="main-business-builder-btn"
              onClick={onOpenBusinessBuilder}
              title="Online Business Models & $0 Digital Products Studio"
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
            >
              <Rocket className="w-4 h-4 text-amber-400" />
            </button>
          )}

          {/* Voice Notes Button */}
          <button
            id="voice-notes-btn"
            onClick={onOpenNotes}
            title="Voice Memory & Notes"
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
          >
            <StickyNote className="w-4 h-4" />
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[9px] font-bold text-black flex items-center justify-center">
                {notesCount}
              </span>
            )}
          </button>

          {/* Interrupt / Mute Control when session is active */}
          {isConnected && (
            <>
              {state === 'speaking' ? (
                <button
                  id="interrupt-speech-btn"
                  onClick={onInterrupt}
                  className="px-5 py-2.5 rounded-full border border-rose-500/50 backdrop-blur-xl bg-rose-500/20 text-xs font-semibold uppercase tracking-widest text-rose-200 hover:bg-rose-500/30 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  <Square className="w-3.5 h-3.5 fill-rose-300" />
                  <span>Interrupt</span>
                </button>
              ) : (
                <button
                  id="toggle-mute-btn"
                  onClick={onToggleMute}
                  className={`px-5 py-2.5 rounded-full border backdrop-blur-xl text-xs font-semibold uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center gap-2 ${
                    isMuted
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-300'
                      : isTrueBlack
                      ? 'border-white/35 bg-black text-white hover:border-white/70'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>
              )}
            </>
          )}

          {/* Primary Action Button (End Call / Start Session) */}
          <button
            id="primary-power-mic-btn"
            onClick={onToggleConnection}
            disabled={isConnecting}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 ${
              isConnecting
                ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/30 cursor-wait'
                : isConnected
                ? isTrueBlack
                  ? 'bg-white text-black hover:bg-white/90 border border-white'
                  : 'bg-white text-black hover:bg-white/90'
                : isTrueBlack
                ? 'bg-white text-black hover:bg-white/90 border border-white shadow-[0_0_30px_rgba(255,255,255,0.45)]'
                : 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.35)]'
            }`}
          >
            {isConnecting ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Connecting...</span>
              </>
            ) : isConnected ? (
              <>
                <Power className="w-3.5 h-3.5" />
                <span>End Call</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Start Call</span>
              </>
            )}
          </button>

          {/* Help Info Button */}
          <button
            id="app-info-btn"
            onClick={onOpenInfo}
            title="Overview & Prompts"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${baseBtnClass}`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};



