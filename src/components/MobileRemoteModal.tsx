import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AssistantState,
  ContrastMode,
  VisualTheme,
  DeviceNotification,
} from '../types';
import { generateQRCodeSVG } from '../utils/qrCodeGenerator';
import {
  Smartphone,
  QrCode,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Heart,
  Wind,
  Bell,
  Send,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Vibrate,
  Layers,
  X,
  Laptop,
  Radio,
  Share2,
  Download,
  Info,
} from 'lucide-react';

interface MobileRemoteModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  assistantState: AssistantState;
  isStreaming: boolean;
  currentTheme: VisualTheme;
  mediaPlayerState: {
    isPlaying: boolean;
    currentTrack: any | null;
    volume: number;
  };
  notifications: DeviceNotification[];
  onToggleMic: () => void;
  onSendTextPrompt: (text: string) => void;
  onReadNotifications: (device?: 'mobile' | 'laptop' | 'all') => void;
  onToggleMediaPlay: () => void;
  onMediaVolumeChange: (vol: number) => void;
  onOpenGirlfriendMode: () => void;
  onStartBreathing: (technique?: any) => void;
  onOpenNotifications: () => void;
  onThemeChange: (theme: VisualTheme) => void;
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: string, details?: string, source?: 'voice' | 'touch' | 'system') => void;
}

export const MobileRemoteModal: React.FC<MobileRemoteModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  assistantState,
  isStreaming,
  currentTheme,
  mediaPlayerState,
  notifications,
  onToggleMic,
  onSendTextPrompt,
  onReadNotifications,
  onToggleMediaPlay,
  onMediaVolumeChange,
  onOpenGirlfriendMode,
  onStartBreathing,
  onOpenNotifications,
  onThemeChange,
  onClose,
  onLogVoiceCommand,
}) => {
  const [activeTab, setActiveTab] = useState<'controller' | 'pair_qr' | 'install_pwa'>('controller');
  const [remotePrompt, setRemotePrompt] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [vibrateSuccess, setVibrateSuccess] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.href);
    }
  }, [isOpen]);

  const triggerHaptic = (pattern: number[] = [35]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleCopyUrl = async () => {
    triggerHaptic([50, 30, 50]);
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const handleTestVibration = () => {
    triggerHaptic([100, 50, 100, 50, 150]);
    setVibrateSuccess(true);
    setTimeout(() => setVibrateSuccess(false), 2000);
  };

  const handleSendPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remotePrompt.trim()) return;
    triggerHaptic([40]);
    onSendTextPrompt(remotePrompt.trim());
    onLogVoiceCommand?.(
      `Mobile Remote: "${remotePrompt.trim()}"`,
      'general',
      'Sent from Mobile Remote Controller deck',
      'touch'
    );
    setRemotePrompt('');
  };

  if (!isOpen) return null;

  const isTrueBlack = contrastMode === 'true_black';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const qrSvg = generateQRCodeSVG(appUrl || 'https://myraa-ai.app', 180);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isTrueBlack
            ? 'bg-black border-white/20 text-white'
            : 'bg-slate-900/95 border-slate-700/70 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <Smartphone className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-wide">
                  Mobile Remote & PWA App Companion
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Control Myraa from your phone, read notifications, and install as native mobile app
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-3 border-b border-white/10 bg-black/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => {
                triggerHaptic();
                setActiveTab('controller');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'controller'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Remote Deck
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setActiveTab('pair_qr');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'pair_qr'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Scan QR & Open on Phone
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setActiveTab('install_pwa');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'install_pwa'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Install Mobile App (PWA)
            </button>
          </div>

          <button
            onClick={handleTestVibration}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
              vibrateSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Test Mobile Haptic Vibration"
          >
            <Vibrate className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Haptic Test</span>
          </button>
        </div>

        {/* Tab 1: Remote Controller Deck */}
        {activeTab === 'controller' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Status Bar */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">
                  Assistant State: <span className="uppercase text-cyan-300 font-mono">{assistantState}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span>Theme: <strong className="text-slate-200 capitalize">{currentTheme}</strong></span>
                <span>•</span>
                <span>Unread: <strong className="text-amber-300">{unreadCount}</strong></span>
              </div>
            </div>

            {/* Big Push-to-Talk Mic Centerpiece */}
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={() => {
                  triggerHaptic([60, 30, 60]);
                  onToggleMic();
                }}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center gap-2 border-2 transition-all shadow-2xl active:scale-95 ${
                  isStreaming
                    ? 'bg-gradient-to-tr from-rose-600 to-amber-600 border-rose-400 text-white shadow-[0_0_40px_rgba(244,63,94,0.5)] animate-pulse'
                    : 'bg-gradient-to-tr from-emerald-600 to-cyan-600 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Mic className="w-10 h-10 text-white" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">Live (Tap Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10 text-white" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">Tap to Speak</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {isStreaming ? 'Streaming microphone to Myraa' : 'Tap to toggle microphone from phone'}
              </p>
            </div>

            {/* Quick Voice Notification Readout Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>🔊 Notification Voice Reader:</span>
                <button
                  onClick={onOpenNotifications}
                  className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
                >
                  Manage Inbox ({unreadCount})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => {
                    triggerHaptic();
                    onReadNotifications('mobile');
                  }}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all active:scale-95"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Smartphone className="w-4 h-4" />
                    Read Mobile Alerts
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    WhatsApp, Calls, SMS out loud
                  </p>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onReadNotifications('laptop');
                  }}
                  className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-left transition-all active:scale-95"
                >
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <Laptop className="w-4 h-4" />
                    Read Laptop Alerts
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Slack, GitHub, Calendar alerts
                  </p>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onReadNotifications('all');
                  }}
                  className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left transition-all active:scale-95"
                >
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Volume2 className="w-4 h-4" />
                    Read All Unread
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sequential voice playback
                  </p>
                </button>
              </div>
            </div>

            {/* Media & Wellness Controls */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">🎵 Media & Quick Actions:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    triggerHaptic();
                    onToggleMediaPlay();
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {mediaPlayerState.isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-amber-400" />
                      Pause Music
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-emerald-400" />
                      Play Music
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onOpenGirlfriendMode();
                  }}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  Girlfriend Mode
                </button>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onStartBreathing('box');
                  }}
                  className="p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Wind className="w-4 h-4 text-teal-400" />
                  4-7-8 Breathing
                </button>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onThemeChange(currentTheme === 'cyberpunk' ? 'matrix' : 'cyberpunk');
                  }}
                  className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Toggle Theme
                </button>
              </div>
            </div>

            {/* Quick Text Command to Myraa */}
            <form onSubmit={handleSendPromptSubmit} className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">💬 Send Text Prompt from Phone:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Play Kesariya', 'What is my schedule today?', 'Set timer 10m'"
                  value={remotePrompt}
                  onChange={(e) => setRemotePrompt(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Scan QR & Direct Pair */}
        {activeTab === 'pair_qr' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
            </div>

            <div className="space-y-1 max-w-md">
              <h3 className="font-bold text-base text-slate-100 flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                Scan to Open on iPhone or Android
              </h3>
              <p className="text-xs text-slate-400">
                Point your phone's default Camera app at this QR code to instantly launch Myraa on your mobile browser.
              </p>
            </div>

            {/* URL Copy Box */}
            <div className="w-full max-w-md p-2.5 rounded-xl bg-black/50 border border-white/15 flex items-center justify-between gap-2 text-xs">
              <span className="truncate text-slate-300 font-mono select-all text-[11px]">
                {appUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-950" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Install PWA Guide */}
        {activeTab === 'install_pwa' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Download className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Install Myraa as a Standalone Mobile App</h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  You can install this app directly on your phone's home screen without using the App Store or Play Store. It runs in full-screen native mode with instant launch!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h5 className="font-bold text-slate-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Android (Google Chrome / Brave)
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Open the URL on Chrome on your Android phone.</li>
                  <li>Tap the <strong>⋮ (Three Dots menu)</strong> in the top-right corner.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Myraa icon will appear on your app drawer and home screen.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h5 className="font-bold text-slate-100 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  iPhone (Apple Safari)
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Open the URL in <strong>Safari</strong> on your iPhone.</li>
                  <li>Tap the <strong>Share button</strong> (square with arrow pointing up) at the bottom.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>"Add"</strong> in the top-right corner.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-3.5 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mobile Remote Protocol: Active • Haptics & Audio Synced</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
