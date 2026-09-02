import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AssistantState,
  VisualTheme,
  VisualizerStyle,
  ContrastMode,
  VoiceNote,
  VoiceTimer,
  AmbientSoundType,
  SessionTelemetry,
  LanguageSettings,
  YouTubeTrack,
  SpotifyTrack,
  MediaPlayerState,
  PlaybackRepeatMode,
  EqualizerPreset,
  AutomationTask,
  AutomationApp,
  EmotionType,
  EmotionRecord,
  TimeUpdateDigest,
  VoiceCommandRecord,
  BusinessNiche,
  FlirtStyle,
  GirlfriendSettings,
  GirlfriendPersona,
} from './types';
import { AudioStreamer } from './services/AudioStreamer';
import { AudioPlayer } from './services/AudioPlayer';
import { ToolManager } from './services/ToolManager';
import { LiveSession } from './services/LiveSession';
import { AmbientSynthesizer } from './services/AmbientSynthesizer';
import { THEME_CONFIGS, CONTRAST_CONFIGS } from './utils/theme';
import {
  findYouTubeTrack,
  findSpotifyTrack,
  YOUTUBE_CATALOG,
  SPOTIFY_CATALOG,
  POPULAR_YOUTUBE_TRACKS,
  POPULAR_SPOTIFY_TRACKS,
} from './utils/mediaData';
import { INITIAL_EMOTION_HISTORY, EMOTION_METAS } from './utils/emotionEngine';
import { generateTimeUpdateDigest } from './utils/timeSyncEngine';

const INITIAL_VOICE_COMMANDS: VoiceCommandRecord[] = [
  {
    id: 'cmd-init-1',
    timestamp: Date.now() - 1000 * 60 * 2,
    command: 'Play Kesariya by Arijit Singh on YouTube',
    category: 'media',
    status: 'completed',
    details: 'Loaded YouTube Player: Kesariya (Brahmāstra)',
    source: 'voice',
  },
  {
    id: 'cmd-init-2',
    timestamp: Date.now() - 1000 * 60 * 6,
    command: 'Draft WhatsApp message to Rahul: "Meeting at 5 PM"',
    category: 'automation',
    status: 'completed',
    details: 'Prepared WhatsApp automation card for Rahul',
    source: 'voice',
  },
  {
    id: 'cmd-init-3',
    timestamp: Date.now() - 1000 * 60 * 12,
    command: 'Set a focus timer for 25 minutes',
    category: 'timer',
    status: 'completed',
    details: 'Timer "Focus Session" set for 25:00',
    source: 'quick_prompt',
  },
  {
    id: 'cmd-init-4',
    timestamp: Date.now() - 1000 * 60 * 20,
    command: 'Take note: Review Q3 UI architecture and live telemetry HUD',
    category: 'notes',
    status: 'completed',
    details: 'Saved to Voice Notes Vault',
    source: 'voice',
  },
  {
    id: 'cmd-init-5',
    timestamp: Date.now() - 1000 * 60 * 30,
    command: 'Switch theme to Cyberpunk and enable True Black OLED mode',
    category: 'system',
    status: 'completed',
    details: 'Theme updated to Cyberpunk with True-Black contrast',
    source: 'quick_prompt',
  },
];
import { OrbVisualizer } from './components/OrbVisualizer';
import { StateBadge } from './components/StateBadge';
import { MainControls } from './components/MainControls';
import { ToolToast } from './components/ToolToast';
import { VoiceNotesDrawer } from './components/VoiceNotesDrawer';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { InfoModal } from './components/InfoModal';
import { BatteryIndicator } from './components/BatteryIndicator';
import { FloatingTimerHud } from './components/FloatingTimerHud';
import { AmbientSoundModal } from './components/AmbientSoundModal';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { QuickPromptsBar } from './components/QuickPromptsBar';
import { GuidedBreathingHud } from './components/GuidedBreathingHud';
import { SettingsModal, SUPPORTED_LANGUAGES } from './components/SettingsModal';
import { YouTubePlayerModal } from './components/YouTubePlayerModal';
import { SpotifyPlayerModal } from './components/SpotifyPlayerModal';
import { AppAutomationHubModal } from './components/AppAutomationHubModal';
import { FloatingMiniPlayerHud } from './components/FloatingMiniPlayerHud';
import { LiveAutomationHud } from './components/LiveAutomationHud';
import { EmotionAtmosphereBackground } from './components/EmotionAtmosphereBackground';
import { EmotionBadge } from './components/EmotionBadge';
import { LiveTimeTickerPill } from './components/LiveTimeTickerPill';
import { EmotionHistoryModal } from './components/EmotionHistoryModal';
import { TimeInfoTickerModal } from './components/TimeInfoTickerModal';
import { TradingHubModal } from './components/TradingHubModal';
import { LiveTradingTickerPill } from './components/LiveTradingTickerPill';
import { WorldWeatherModal } from './components/WorldWeatherModal';
import { BusinessBuilderModal } from './components/BusinessBuilderModal';
import { LiveWeatherTickerPill } from './components/LiveWeatherTickerPill';
import { FlirtRomanceStudioModal } from './components/FlirtRomanceStudioModal';
import { LanguageTutorModal } from './components/LanguageTutorModal';
import { CodeAssistantModal } from './components/CodeAssistantModal';
import { VSCodeStudioModal } from './components/VSCodeStudioModal';
import { QuickTasksModal } from './components/QuickTasksModal';
import { AutonomousPipelineModal } from './components/AutonomousPipelineModal';
import { DeviceNotificationHubModal } from './components/DeviceNotificationHubModal';
import { MobileRemoteModal } from './components/MobileRemoteModal';
import {
  getStoredDeviceNotifications,
  saveStoredDeviceNotifications,
  readNotificationsAloud,
  stopReadingNotifications,
} from './utils/deviceNotificationEngine';
import {
  Sparkles,
  AlertCircle,
  Headphones,
  Activity,
  Wind,
  Languages,
  ArrowRightLeft,
  Sliders,
  SunMoon,
  Youtube,
  Music,
  Zap,
  Heart,
  Clock,
  TrendingUp,
  CloudSun,
  Rocket,
  GraduationCap,
  Code2,
  CheckSquare,
  Volume2,
  Mic,
  Bell,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { TargetLanguageCode, ProgrammingLanguage, AudioClarityConfig, DeviceNotification, MobileRemoteAction } from './types';

export default function App() {
  const [state, setState] = useState<AssistantState>('disconnected');
  const [theme, setTheme] = useState<VisualTheme>('aurora');
  const [contrastMode, setContrastMode] = useState<ContrastMode>(() => {
    try {
      const saved = localStorage.getItem('myraa_contrast_mode');
      return saved === 'true-black' || saved === 'cosmic' ? (saved as ContrastMode) : 'cosmic';
    } catch {
      return 'cosmic';
    }
  });
  const [style, setStyle] = useState<VisualizerStyle>('fluid-orb');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [notes, setNotes] = useState<VoiceNote[]>(() => {
    try {
      const saved = localStorage.getItem('myraa_voice_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Language & Translation state
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>(() => {
    try {
      const saved = localStorage.getItem('myraa_language_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      primaryLanguage: 'en',
      translationMode: false,
      sourceLanguage: 'en',
      targetLanguage: 'hi',
      voice: 'Aoede',
    };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Advanced feature states
  const [activeTimer, setActiveTimer] = useState<VoiceTimer | null>(null);
  const [activeAmbientSound, setActiveAmbientSound] = useState<AmbientSoundType>('off');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.5);
  const [isAmbientOpen, setIsAmbientOpen] = useState<boolean>(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);

  // Media Player State (YouTube & Spotify)
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayerState>({
    activePlatform: 'none',
    isPlaying: false,
    currentYouTubeTrack: POPULAR_YOUTUBE_TRACKS[0],
    currentSpotifyTrack: POPULAR_SPOTIFY_TRACKS[0],
    volume: 80,
    isMuted: false,
    isMinimized: false,
    repeatMode: 'all',
    isShuffle: false,
    equalizerPreset: 'bass-boost',
    sleepTimerMinutes: null,
    sleepTimerRemainingSeconds: null,
    youtubeQueue: POPULAR_YOUTUBE_TRACKS,
    spotifyQueue: POPULAR_SPOTIFY_TRACKS,
  });
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState<boolean>(false);
  const sleepTimerIntervalRef = useRef<any>(null);

  // App Automation State (WhatsApp, Maps, Gmail, etc.)
  const [isAppHubOpen, setIsAppHubOpen] = useState<boolean>(false);
  const [activeAutomationTask, setActiveAutomationTask] = useState<AutomationTask | null>(null);
  const [recentAutomationTasks, setRecentAutomationTasks] = useState<AutomationTask[]>(() => {
    try {
      const saved = localStorage.getItem('myraa_automation_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Trading & Stocks Intelligence Hub State
  const [isTradingHubOpen, setIsTradingHubOpen] = useState<boolean>(false);
  const [tradingSelectedStockSymbol, setTradingSelectedStockSymbol] = useState<string>('NVDA');
  const [tradingActiveTab, setTradingActiveTab] = useState<'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news'>('research');


  // World Weather & Live Global Temperature Radar State
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);
  const [selectedWeatherCity, setSelectedWeatherCity] = useState<string>('New York');

  // Online Business Builder & Free Digital Product Studio State
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);
  const [selectedBusinessNiche, setSelectedBusinessNiche] = useState<BusinessNiche>('micro_saas');

  // Flirt & Romance Studio State
  const [isFlirtModalOpen, setIsFlirtModalOpen] = useState<boolean>(false);
  const [selectedFlirtCategory, setSelectedFlirtCategory] = useState<FlirtStyle | 'all'>('all');
  const [girlfriendSettings, setGirlfriendSettings] = useState<GirlfriendSettings>(() => {
    try {
      const saved = localStorage.getItem('myraa_girlfriend_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      girlfriendModeEnabled: true,
      persona: 'sweet_caring',
      userPetName: 'babe',
      aiPetName: 'Myraa',
      affectionPoints: 120,
      loveStage: 'Dating',
      proactiveAffection: true,
      blushingReactions: true,
    };
  });

  // Language Academy & English Tutor State
  const [isLanguageTutorOpen, setIsLanguageTutorOpen] = useState<boolean>(false);
  const [languageTutorInitialTab, setLanguageTutorInitialTab] = useState<'lessons' | 'analyzer' | 'roleplay' | 'quiz'>('lessons');
  const [languageTutorTargetLang, setLanguageTutorTargetLang] = useState<TargetLanguageCode>('en');

  // AI Code Assistant & Sandbox State
  const [isCodeAssistantOpen, setIsCodeAssistantOpen] = useState<boolean>(false);
  const [codeAssistantInitialTab, setCodeAssistantInitialTab] = useState<'templates' | 'sandbox' | 'explainer' | 'generator'>('templates');
  const [codeAssistantTargetLang, setCodeAssistantTargetLang] = useState<ProgrammingLanguage>('typescript');

  // VS Code Web Studio & Direct Code IDE State
  const [isVSCodeModalOpen, setIsVSCodeModalOpen] = useState<boolean>(false);
  const [vsCodeInitialFileId, setVsCodeInitialFileId] = useState<string>('file-app-tsx');

  // Quick Tasks & Productivity Hub State
  const [isQuickTasksOpen, setIsQuickTasksOpen] = useState<boolean>(false);
  const [quickTasksFilter, setQuickTasksFilter] = useState<string>('all');

  // Autonomous Pipeline & Multi-Step Workflows State
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState<boolean>(false);
  const [pipelineInitialTab, setPipelineInitialTab] = useState<'pipelines' | 'runner' | 'doc_extractor' | 'scheduler'>('pipelines');
  const [pipelineInitialId, setPipelineInitialId] = useState<string>('morning_kickoff');

  // Device Notifications & Voice Reader State
  const [deviceNotifications, setDeviceNotifications] = useState<DeviceNotification[]>(() => {
    return getStoredDeviceNotifications();
  });
  const [isDeviceNotificationOpen, setIsDeviceNotificationOpen] = useState<boolean>(false);
  const [deviceNotificationTab, setDeviceNotificationTab] = useState<'all' | 'mobile' | 'laptop' | 'unread'>('all');

  // Mobile Remote Controller & PWA Pairing Companion State
  const [isMobileRemoteOpen, setIsMobileRemoteOpen] = useState<boolean>(false);
  const [mobileRemoteTab, setMobileRemoteTab] = useState<'controller' | 'pair_qr' | 'install_pwa'>('controller');

  // Mic & Voice Clarity Settings
  const [audioClarityConfig, setAudioClarityConfig] = useState<AudioClarityConfig>(() => {
    try {
      const saved = localStorage.getItem('myraa_audio_clarity');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      micClarityEnhancer: true,
      highPassFilter: true,
      presenceBooster: true,
      noiseGate: true,
      voiceGainBoost: 'boost',
      limiterThreshold: -6,
    };
  });

  // Guided Breathing state
  const [breathingSession, setBreathingSession] = useState<{
    isActive: boolean;
    technique: 'box' | 'calm-478' | 'energize';
    phase: 'inhale' | 'hold' | 'exhale' | 'rest';
    phaseTimeRemaining: number;
    totalCyclesCompleted: number;
  } | null>(null);

  const breathingIntervalRef = useRef<any>(null);

  const [telemetry, setTelemetry] = useState<SessionTelemetry>({
    rttMs: 28,
    packetsReceived: 0,
    packetsSent: 0,
    inputSampleRate: 16000,
    outputSampleRate: 24000,
    bufferHealth: 'optimal',
  });

  const [activeActivity, setActiveActivity] = useState<{
    toolName: string;
    detail: string;
    id: number;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isThemesOpen, setIsThemesOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // Emotion Engine State & History
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('serene');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(85);
  const [emotionExpression, setEmotionExpression] = useState<string>('Mindful & Harmonious');
  const [emotionHistory, setEmotionHistory] = useState<EmotionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('myraa_emotion_history');
      return saved ? JSON.parse(saved) : INITIAL_EMOTION_HISTORY;
    } catch {
      return INITIAL_EMOTION_HISTORY;
    }
  });
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState<boolean>(false);

  // User Voice Command History Logs
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommandRecord[]>(() => {
    try {
      const saved = localStorage.getItem('myraa_voice_commands');
      return saved ? JSON.parse(saved) : INITIAL_VOICE_COMMANDS;
    } catch {
      return INITIAL_VOICE_COMMANDS;
    }
  });

  // Time-to-Time Real-Time Briefing State
  const [isTimeInfoModalOpen, setIsTimeInfoModalOpen] = useState<boolean>(false);
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Real-time audio metrics for visualizer
  const [userMetrics, setUserMetrics] = useState<{ frequencyData: Uint8Array; volume: number }>({
    frequencyData: new Uint8Array(32),
    volume: 0,
  });
  const [assistantMetrics, setAssistantMetrics] = useState<{
    frequencyData: Uint8Array;
    volume: number;
  }>({
    frequencyData: new Uint8Array(32),
    volume: 0,
  });

  // Services references
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const toolManagerRef = useRef<ToolManager | null>(null);
  const liveSessionRef = useRef<LiveSession | null>(null);
  const ambientSynthRef = useRef<AmbientSynthesizer | null>(null);
  const metricsIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Sync notes to local storage
  useEffect(() => {
    try {
      localStorage.setItem('myraa_voice_notes', JSON.stringify(notes));
    } catch (e) {
      // ignore
    }
  }, [notes]);

  // Sync recent automation tasks to local storage
  useEffect(() => {
    try {
      localStorage.setItem('myraa_automation_tasks', JSON.stringify(recentAutomationTasks));
    } catch (e) {
      // ignore
    }
  }, [recentAutomationTasks]);

  // Sync contrast mode to local storage
  useEffect(() => {
    try {
      localStorage.setItem('myraa_contrast_mode', contrastMode);
    } catch (e) {
      // ignore
    }
  }, [contrastMode]);

  // Sync emotion history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('myraa_emotion_history', JSON.stringify(emotionHistory));
    } catch (e) {
      // ignore
    }
  }, [emotionHistory]);

  // Sync voice command history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('myraa_voice_commands', JSON.stringify(voiceCommands));
    } catch (e) {
      // ignore
    }
  }, [voiceCommands]);

  const handleLogVoiceCommand = useCallback(
    (
      command: string,
      category: VoiceCommandRecord['category'] = 'general',
      details?: string,
      source: VoiceCommandRecord['source'] = 'voice'
    ) => {
      const newRecord: VoiceCommandRecord = {
        id: `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        command,
        category,
        status: 'completed',
        details,
        source,
      };
      setVoiceCommands((prev) => [newRecord, ...prev].slice(0, 100));
    },
    []
  );

  const handleToolActivity = useCallback((toolName: string, detail: string) => {
    const newActivity = { toolName, detail, id: Date.now() };
    setActiveActivity(newActivity);
    setTimeout(() => {
      setActiveActivity((curr) => (curr?.id === newActivity.id ? null : curr));
    }, 4000);
  }, []);

  const handleEmotionUpdate = useCallback(
    (emotion: EmotionType, intensity?: number, trigger?: string, expression?: string) => {
      const finalIntensity = intensity !== undefined ? intensity : 85;
      const finalExpression =
        expression || EMOTION_METAS[emotion]?.defaultExpression || 'Attuned & Present';
      const finalTrigger = trigger || 'Adaptive conversational resonance';

      setCurrentEmotion(emotion);
      setEmotionIntensity(finalIntensity);
      setEmotionExpression(finalExpression);

      const record: EmotionRecord = {
        id: `em_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        emotion,
        intensity: finalIntensity,
        trigger: finalTrigger,
        aiExpression: finalExpression,
        sentimentScore: finalIntensity >= 70 ? 0.85 : 0.5,
        valence: emotion === 'serene' || emotion === 'focused' ? 'calm' : emotion === 'curious' ? 'reflective' : 'positive',
      };

      setEmotionHistory((prev) => [record, ...prev].slice(0, 50));
      handleToolActivity(
        'emotionUpdate',
        `${EMOTION_METAS[emotion]?.emoji || '✨'} Emotion Shift: ${
          EMOTION_METAS[emotion]?.label || emotion
        } (${finalIntensity}%)`
      );
      handleLogVoiceCommand(
        `Mood Shift: ${EMOTION_METAS[emotion]?.label || emotion} (${finalIntensity}%)`,
        'emotion',
        finalTrigger,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleGetEmotionHistory = useCallback(() => {
    return emotionHistory;
  }, [emotionHistory]);

  const handleGetRealTimeBriefing = useCallback(() => {
    const briefing = generateTimeUpdateDigest(sessionStartTimeRef.current);
    handleToolActivity('timeBriefing', `⏱️ Real-Time Briefing: ${briefing.localTimeStr}`);
    handleLogVoiceCommand(
      `Real-Time Briefing (${briefing.localTimeStr})`,
      'system',
      briefing.summary,
      'voice'
    );
    return briefing;
  }, [handleToolActivity, handleLogVoiceCommand]);

  const handleTriggerTimeSync = useCallback(() => {
    const briefing = generateTimeUpdateDigest(sessionStartTimeRef.current);
    handleToolActivity(
      'timeSync',
      `🕒 Time Sync: ${briefing.localTimeStr} • ${briefing.summary}`
    );
    handleLogVoiceCommand(
      `Synchronize World Clock & Day Phase`,
      'system',
      `Synced to ${briefing.localTimeStr} (${briefing.dayPhase.toUpperCase()})`,
      'voice'
    );
    setIsTimeInfoModalOpen(true);
    return briefing;
  }, [handleToolActivity, handleLogVoiceCommand]);

  const handleClearEmotionHistory = useCallback(() => {
    setEmotionHistory([]);
  }, []);

  const handleOpenTradingTerminal = useCallback(
    (symbol?: string, tab?: 'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news') => {
      if (symbol) setTradingSelectedStockSymbol(symbol);
      if (tab) setTradingActiveTab(tab);
      setIsTradingHubOpen(true);
      handleLogVoiceCommand(
        `Open Trading & Stocks Terminal${symbol ? ` (${symbol})` : ''}`,
        'trading',
        `Stock & Crypto Research, Profit Calculator & Sell Advisor for ${symbol || 'NVDA'}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleOpenWeatherRadar = useCallback(
    (city?: string) => {
      if (city) setSelectedWeatherCity(city);
      setIsWeatherModalOpen(true);
      handleToolActivity('weatherRadar', `🌤️ Weather Radar: ${city || 'World Atmospheric Map'}`);
      handleLogVoiceCommand(
        `Open World Weather Radar${city ? ` (${city})` : ''}`,
        'weather',
        `Atmospheric conditions & temperature forecast for ${city || 'world cities'}`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleOpenBusinessStudio = useCallback(
    (niche?: BusinessNiche) => {
      if (niche) setSelectedBusinessNiche(niche);
      setIsBusinessModalOpen(true);
      handleToolActivity('businessStudio', `🚀 Business Studio: ${niche ? niche.replace('_', ' ').toUpperCase() : 'Free Product Blueprints'}`);
      handleLogVoiceCommand(
        `Open Online Business Studio${niche ? ` (${niche})` : ''}`,
        'business',
        `Zero-capital online business models & free digital product blueprints`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleOpenFlirtStudio = useCallback(
    (category?: FlirtStyle) => {
      if (category) setSelectedFlirtCategory(category);
      setIsFlirtModalOpen(true);
      handleToolActivity('flirtStudio', `💋 Flirt & Romance Studio: ${category ? category.replace('_', ' ').toUpperCase() : 'AI Chemistry Gauge'}`);
      handleLogVoiceCommand(
        `Open Flirt & Romance Studio${category ? ` (${category})` : ''}`,
        'emotion',
        `AI Chemistry meter, compliments library & romantic banter generator`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleFlirtWithUser = useCallback(
    (style?: FlirtStyle, topic?: string, text?: string) => {
      const displayStyle = style ? style.replace('_', ' ') : 'playful banter';
      handleToolActivity('flirtWithUser', `💕 Romantic Banter [${displayStyle}]: "${text ? text.slice(0, 35) + '...' : topic || 'Charm'}"`);
      handleLogVoiceCommand(
        `Romantic Banter (${displayStyle})`,
        'emotion',
        text || `Flirting topic: ${topic || 'sparks & chemistry'}`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleUpdateGirlfriendSettings = useCallback(
    (newSettings: Partial<GirlfriendSettings>) => {
      setGirlfriendSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        try {
          localStorage.setItem('myraa_girlfriend_settings', JSON.stringify(updated));
        } catch {}

        if (liveSessionRef.current) {
          liveSessionRef.current.updateLanguageSettings({
            ...languageSettings,
            girlfriendMode: updated.girlfriendModeEnabled,
            gfPersona: updated.persona,
            petName: updated.userPetName,
          });
        }
        return updated;
      });
    },
    [languageSettings]
  );

  const handleSetGirlfriendMode = useCallback(
    (enabled: boolean, persona?: GirlfriendPersona, petName?: string) => {
      setGirlfriendSettings((prev) => {
        const updated: GirlfriendSettings = {
          ...prev,
          girlfriendModeEnabled: enabled,
          persona: persona || prev.persona,
          userPetName: petName || prev.userPetName,
        };
        try {
          localStorage.setItem('myraa_girlfriend_settings', JSON.stringify(updated));
        } catch {}

        if (liveSessionRef.current) {
          liveSessionRef.current.updateLanguageSettings({
            ...languageSettings,
            girlfriendMode: updated.girlfriendModeEnabled,
            gfPersona: updated.persona,
            petName: updated.userPetName,
          });
        }

        handleLogVoiceCommand(
          `Girlfriend Mode: ${enabled ? 'ACTIVATED' : 'OFF'} (${updated.persona})`,
          'emotion',
          `Calling user "${updated.userPetName}" with ${updated.persona} persona`,
          'voice'
        );

        return updated;
      });
    },
    [languageSettings, handleLogVoiceCommand]
  );

  const handleSendLoveGift = useCallback(
    (giftType: string, note?: string) => {
      setGirlfriendSettings((prev) => {
        const updated = { ...prev, affectionPoints: (prev.affectionPoints || 120) + 35 };
        try {
          localStorage.setItem('myraa_girlfriend_settings', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      handleToolActivity('loveGift', `🎁 Love Gift Sent: ${giftType.toUpperCase()} (+35 Affection)`);
      handleLogVoiceCommand(
        `Send Love Gift: ${giftType}`,
        'emotion',
        note || `Virtual gift ${giftType} sent to Myraa`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleSetDateScenario = useCallback(
    (scenarioId: string) => {
      const scenarioMap: Record<string, AmbientSoundType> = {
        rooftop_stargazing: 'cosmic',
        rainy_cafe: 'rain',
        late_night_drive: 'focus',
        candlelight_dinner: 'zen',
        sunset_beach: 'ocean',
      };
      const sound = scenarioMap[scenarioId] || 'zen';
      if (ambientSynthRef.current) {
        ambientSynthRef.current.play(sound, 0.7);
        setActiveAmbientSound(sound);
      }
      handleToolActivity('dateScenario', `✨ Romantic Date: ${scenarioId.replace('_', ' ').toUpperCase()}`);
      handleLogVoiceCommand(
        `Romantic Date Roleplay: ${scenarioId}`,
        'emotion',
        `Atmospheric ${sound} soundscape and date mode started`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleRateUserFlirt = useCallback(
    (userFlirtText: string, score: number, reactionTone: string) => {
      setGirlfriendSettings((prev) => {
        const updated = { ...prev, affectionPoints: (prev.affectionPoints || 120) + 15 };
        try {
          localStorage.setItem('myraa_girlfriend_settings', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      handleToolActivity('userFlirt', `🔥 Flirt Reaction: ${score}/100 (${reactionTone})`);
      handleLogVoiceCommand(
        `Flirted With Myraa: "${userFlirtText.slice(0, 30)}..."`,
        'emotion',
        `Score: ${score}/100 • Reaction: ${reactionTone}`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Open Language Academy & English Tutor
  const handleOpenLanguageTutor = useCallback(
    (lang?: TargetLanguageCode, tab: 'lessons' | 'analyzer' | 'roleplay' | 'quiz' = 'lessons') => {
      if (lang) setLanguageTutorTargetLang(lang);
      setLanguageTutorInitialTab(tab);
      setIsLanguageTutorOpen(true);
      handleToolActivity('languageTutor', `🎓 Language Academy: ${lang ? lang.toUpperCase() : 'English / Multi-Lang'} [${tab}]`);
      handleLogVoiceCommand(
        `Open Language Academy (${lang ? lang.toUpperCase() : 'English'})`,
        'language',
        `Interactive lessons, grammar correction & pronunciation tutor`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Open AI Code Assistant & Dev Studio
  const handleOpenCodeAssistant = useCallback(
    (lang?: ProgrammingLanguage, tab: 'templates' | 'sandbox' | 'explainer' | 'generator' = 'templates') => {
      if (lang) setCodeAssistantTargetLang(lang);
      setCodeAssistantInitialTab(tab);
      setIsCodeAssistantOpen(true);
      handleToolActivity('codeAssistant', `💻 AI Code Studio: ${lang ? lang.toUpperCase() : 'TypeScript'} [${tab}]`);
      handleLogVoiceCommand(
        `Open AI Code Assistant (${lang ? lang.toUpperCase() : 'Full-Stack'})`,
        'system',
        `Production templates, sandbox runner & Big-O complexity analyzer`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Open VS Code Web Studio & Direct Code IDE
  const handleOpenVSCodeIDE = useCallback(
    (fileId?: string, tab: 'explorer' | 'copilot' | 'terminal' | 'preview' = 'explorer') => {
      if (fileId) setVsCodeInitialFileId(fileId);
      setIsVSCodeModalOpen(true);
      handleToolActivity('openVSCodeIDE', `💻 VS Code Studio & Direct Code IDE [${tab.toUpperCase()}]`);
      handleLogVoiceCommand(
        `Open VS Code Studio & Direct Code IDE`,
        'system',
        `Direct code editor, bash terminal emulator, live runner & AI copilot`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Open Quick Tasks & Productivity Hub
  const handleOpenQuickTasks = useCallback(
    (filter: string = 'all') => {
      setQuickTasksFilter(filter);
      setIsQuickTasksOpen(true);
      handleToolActivity('quickTasks', `📋 Quick Tasks: ${filter.toUpperCase()} View`);
      handleLogVoiceCommand(
        `Open Quick Tasks (${filter})`,
        'automation',
        `1-click daily sprint presets, focus checklist & task manager`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Open Autonomous Pipeline & Multi-Step Workflows Hub
  const handleOpenAutomationPipeline = useCallback(
    (pipelineId?: string, tab: 'pipelines' | 'runner' | 'doc_extractor' | 'scheduler' = 'pipelines') => {
      if (pipelineId) setPipelineInitialId(pipelineId);
      setPipelineInitialTab(tab);
      setIsPipelineModalOpen(true);
      handleToolActivity('automationPipeline', `⚡ Autonomous Pipeline: ${pipelineId || 'Overview'} [${tab}]`);
      handleLogVoiceCommand(
        `Open Autonomous Pipelines (${tab})`,
        'automation',
        `Multi-step execution pipelines, meeting action extractor & cron scheduler`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Device Notifications & Reader Hub Open Handler
  const handleOpenDeviceNotifications = useCallback(
    (tab: 'all' | 'mobile' | 'laptop' | 'unread' = 'all') => {
      setDeviceNotificationTab(tab);
      setIsDeviceNotificationOpen(true);
      handleToolActivity('deviceNotifications', `🔔 Device Notification Reader Hub [${tab}]`);
      handleLogVoiceCommand(
        `Open Device Notifications (${tab})`,
        'system',
        `Mobile and laptop notification sync and voice reader`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Mobile Remote Controller Deck Open Handler
  const handleOpenMobileRemote = useCallback(
    (tab: 'controller' | 'pair_qr' | 'install_pwa' = 'controller') => {
      setMobileRemoteTab(tab);
      setIsMobileRemoteOpen(true);
      handleToolActivity('mobileRemote', `📱 Mobile Remote Controller Deck [${tab}]`);
      handleLogVoiceCommand(
        `Open Mobile Remote (${tab})`,
        'system',
        `Phone remote control, QR pairing & PWA mobile install`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  // Read Notifications Aloud with Speech Synthesis
  const handleReadNotifications = useCallback(
    (targetDevice: 'mobile' | 'laptop' | 'all' = 'all') => {
      setDeviceNotifications((prev) => {
        const filtered = prev.filter((n) => {
          if (targetDevice === 'mobile') return n.deviceSource === 'mobile' || n.deviceSource === 'tablet';
          if (targetDevice === 'laptop') return n.deviceSource === 'laptop' || n.deviceSource === 'desktop';
          return true;
        });

        readNotificationsAloud(filtered, {
          voiceName: languageSettings.voicePreference,
          onStart: () => {
            handleToolActivity('voiceReading', `🔊 Reading ${targetDevice} notifications aloud...`);
          },
          onAllComplete: () => {
            handleToolActivity('voiceReadingComplete', `✅ Finished reading ${targetDevice} notifications.`);
          },
        });

        const marked = prev.map((n) =>
          filtered.some((f) => f.id === n.id) ? { ...n, isRead: true } : n
        );
        saveStoredDeviceNotifications(marked);
        return marked;
      });

      handleLogVoiceCommand(
        `Read ${targetDevice === 'all' ? 'All' : targetDevice} Notifications Aloud`,
        'voice',
        `Text-to-speech audio playback of device alerts`,
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand, languageSettings.voicePreference]
  );

  // Configure Audio & Mic Clarity
  const handleConfigureAudioClarity = useCallback(
    (config: Partial<AudioClarityConfig>) => {
      setAudioClarityConfig((prev) => {
        const updated = { ...prev, ...config };
        try {
          localStorage.setItem('myraa_audio_clarity', JSON.stringify(updated));
        } catch {}
        if (audioPlayerRef.current && updated.voiceGainBoost) {
          audioPlayerRef.current.setVoiceBoost(updated.voiceGainBoost);
        }
        return updated;
      });
      handleToolActivity('audioClarity', `🎙️ Audio Clarity Boosted: ${config.voiceGainBoost || 'Active'}`);
      handleLogVoiceCommand(
        'Optimize Microphone & Voice Clarity',
        'system',
        'Hardware rumble filter, presence booster & limiter active',
        'voice'
      );
    },
    [handleToolActivity, handleLogVoiceCommand]
  );

  const handleVoiceNoteAdded = useCallback(
    (note: VoiceNote) => {
      setNotes((prev) => [note, ...prev]);
      handleLogVoiceCommand(
        `Save Voice Note: "${note.title}"`,
        'notes',
        note.content.slice(0, 120),
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleThemeChange = useCallback(
    (newTheme: VisualTheme, newContrast?: ContrastMode) => {
      setTheme(newTheme);
      if (newContrast) {
        setContrastMode(newContrast);
      }
      handleLogVoiceCommand(
        `Switch theme to ${newTheme.toUpperCase()}${newContrast ? ` (${newContrast})` : ''}`,
        'system',
        `Visual theme set to ${newTheme}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleContrastChange = useCallback(
    (mode: ContrastMode) => {
      setContrastMode(mode);
      handleLogVoiceCommand(
        `Display Mode: ${mode === 'true-black' ? 'True Black OLED' : 'Cosmic Gradient'}`,
        'system',
        `Contrast mode updated to ${mode}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleToggleContrastMode = useCallback(() => {
    setContrastMode((prev) => {
      const next = prev === 'cosmic' ? 'true-black' : 'cosmic';
      handleLogVoiceCommand(
        `Toggle Display Mode to ${next === 'true-black' ? 'True Black' : 'Cosmic'}`,
        'system',
        `Contrast mode toggled`,
        'voice'
      );
      return next;
    });
  }, [handleLogVoiceCommand]);

  // Media Playback Handlers (YouTube & Spotify)
  const handlePlayYouTube = useCallback(
    (query: string, autoplay: boolean = true) => {
      const track = findYouTubeTrack(query);
      setMediaPlayer((prev) => ({
        ...prev,
        activePlatform: 'youtube',
        isPlaying: autoplay,
        currentYouTubeTrack: track,
        isMinimized: false,
        youtubeQueue: prev.youtubeQueue?.some((t) => t.id === track.id)
          ? prev.youtubeQueue
          : [track, ...(prev.youtubeQueue || [])],
      }));
      setIsYouTubeModalOpen(true);
      setIsSpotifyModalOpen(false);
      handleLogVoiceCommand(
        query.toLowerCase().startsWith('play') ? query : `Play "${query}" on YouTube`,
        'media',
        `Loaded YouTube Track: ${track.title} by ${track.artist}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handlePlaySpotify = useCallback(
    (query: string, _type: string = 'track') => {
      const track = findSpotifyTrack(query);
      setMediaPlayer((prev) => ({
        ...prev,
        activePlatform: 'spotify',
        isPlaying: true,
        currentSpotifyTrack: track,
        isMinimized: false,
        spotifyQueue: prev.spotifyQueue?.some((t) => t.id === track.id)
          ? prev.spotifyQueue
          : [track, ...(prev.spotifyQueue || [])],
      }));
      setIsSpotifyModalOpen(true);
      setIsYouTubeModalOpen(false);
      handleLogVoiceCommand(
        query.toLowerCase().startsWith('play') ? query : `Play "${query}" on Spotify`,
        'media',
        `Loaded Spotify Track: ${track.title} by ${track.artist}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handlePlayAllYouTubeTracks = useCallback(
    (tracks: YouTubeTrack[]) => {
      if (!tracks || tracks.length === 0) return;
      setMediaPlayer((prev) => ({
        ...prev,
        activePlatform: 'youtube',
        isPlaying: true,
        currentYouTubeTrack: tracks[0],
        youtubeQueue: tracks,
        isMinimized: false,
      }));
      setIsYouTubeModalOpen(true);
      setIsSpotifyModalOpen(false);
      handleLogVoiceCommand(
        `Play All YouTube Songs (${tracks.length} tracks)`,
        'media',
        `Started continuous playback of ${tracks.length} YouTube songs`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handlePlayAllSpotifyTracks = useCallback(
    (tracks: SpotifyTrack[]) => {
      if (!tracks || tracks.length === 0) return;
      setMediaPlayer((prev) => ({
        ...prev,
        activePlatform: 'spotify',
        isPlaying: true,
        currentSpotifyTrack: tracks[0],
        spotifyQueue: tracks,
        isMinimized: false,
      }));
      setIsSpotifyModalOpen(true);
      setIsYouTubeModalOpen(false);
      handleLogVoiceCommand(
        `Play All Spotify Songs (${tracks.length} tracks)`,
        'media',
        `Started continuous playback of ${tracks.length} Spotify tracks`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleToggleShuffle = useCallback(() => {
    setMediaPlayer((prev) => {
      const nextShuffle = !prev.isShuffle;
      handleLogVoiceCommand(
        nextShuffle ? 'Enable Shuffle Mode' : 'Disable Shuffle Mode',
        'media',
        `Shuffle is now ${nextShuffle ? 'ON' : 'OFF'}`,
        'voice'
      );
      return { ...prev, isShuffle: nextShuffle };
    });
  }, [handleLogVoiceCommand]);

  const handleToggleRepeat = useCallback(() => {
    setMediaPlayer((prev) => {
      const nextMode: PlaybackRepeatMode =
        prev.repeatMode === 'all' ? 'one' : prev.repeatMode === 'one' ? 'off' : 'all';
      handleLogVoiceCommand(
        `Repeat Mode: ${nextMode.toUpperCase()}`,
        'media',
        `Repeat mode set to ${nextMode}`,
        'voice'
      );
      return { ...prev, repeatMode: nextMode };
    });
  }, [handleLogVoiceCommand]);

  const handleSetEqualizer = useCallback(
    (preset: EqualizerPreset) => {
      setMediaPlayer((prev) => ({ ...prev, equalizerPreset: preset }));
      handleLogVoiceCommand(
        `Equalizer: ${preset.toUpperCase()}`,
        'media',
        `Applied acoustic preset: ${preset}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleSetSleepTimer = useCallback(
    (minutes: number | null) => {
      setMediaPlayer((prev) => ({
        ...prev,
        sleepTimerMinutes: minutes,
        sleepTimerRemainingSeconds: minutes ? minutes * 60 : null,
      }));
      handleLogVoiceCommand(
        minutes ? `Sleep Timer set for ${minutes} minutes` : 'Sleep Timer cancelled',
        'media',
        minutes ? `Audio will automatically pause in ${minutes} minutes` : 'Timer disabled',
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleControlMedia = useCallback(
    (
      action: 'play' | 'pause' | 'next' | 'previous' | 'volume',
      target: 'youtube' | 'spotify' | 'all' = 'all',
      value?: number
    ) => {
      handleLogVoiceCommand(
        `Media Control: ${action.toUpperCase()} (${target})`,
        'media',
        value !== undefined ? `Volume: ${value}%` : `Action: ${action}`,
        'voice'
      );
      setMediaPlayer((prev) => {
        if (action === 'play') return { ...prev, isPlaying: true };
        if (action === 'pause') return { ...prev, isPlaying: false };
        if (action === 'volume' && value !== undefined) return { ...prev, volume: value, isMuted: false };

        // Next / Previous song logic
        if (action === 'next' || action === 'previous') {
          if (prev.activePlatform === 'youtube' || target === 'youtube') {
            const queue = prev.youtubeQueue && prev.youtubeQueue.length > 0 ? prev.youtubeQueue : YOUTUBE_CATALOG;
            const currentIndex = queue.findIndex((t) => t.id === prev.currentYouTubeTrack?.id);
            
            let nextIndex = 0;
            if (prev.isShuffle) {
              nextIndex = Math.floor(Math.random() * queue.length);
            } else if (prev.repeatMode === 'one' && action === 'next') {
              nextIndex = currentIndex >= 0 ? currentIndex : 0;
            } else {
              nextIndex =
                action === 'next'
                  ? (currentIndex + 1) % queue.length
                  : (currentIndex - 1 + queue.length) % queue.length;
            }

            return {
              ...prev,
              currentYouTubeTrack: queue[nextIndex >= 0 ? nextIndex : 0],
              isPlaying: true,
            };
          } else if (prev.activePlatform === 'spotify' || target === 'spotify') {
            const queue = prev.spotifyQueue && prev.spotifyQueue.length > 0 ? prev.spotifyQueue : SPOTIFY_CATALOG;
            const currentIndex = queue.findIndex((t) => t.id === prev.currentSpotifyTrack?.id);

            let nextIndex = 0;
            if (prev.isShuffle) {
              nextIndex = Math.floor(Math.random() * queue.length);
            } else if (prev.repeatMode === 'one' && action === 'next') {
              nextIndex = currentIndex >= 0 ? currentIndex : 0;
            } else {
              nextIndex =
                action === 'next'
                  ? (currentIndex + 1) % queue.length
                  : (currentIndex - 1 + queue.length) % queue.length;
            }

            return {
              ...prev,
              currentSpotifyTrack: queue[nextIndex >= 0 ? nextIndex : 0],
              isPlaying: true,
            };
          }
        }
        return prev;
      });
    },
    [handleLogVoiceCommand]
  );

  // Sleep Timer countdown ticker
  useEffect(() => {
    if (mediaPlayer.sleepTimerRemainingSeconds && mediaPlayer.sleepTimerRemainingSeconds > 0) {
      sleepTimerIntervalRef.current = setInterval(() => {
        setMediaPlayer((prev) => {
          if (!prev.sleepTimerRemainingSeconds || prev.sleepTimerRemainingSeconds <= 1) {
            // Sleep Timer Expired: Pause all music & ambient sound
            if (ambientSynthRef.current) ambientSynthRef.current.playChime();
            handleToolActivity('sleepTimerCompleted', '🌙 Sleep Timer Expired: Audio paused automatically');
            return {
              ...prev,
              isPlaying: false,
              sleepTimerMinutes: null,
              sleepTimerRemainingSeconds: null,
            };
          }
          return {
            ...prev,
            sleepTimerRemainingSeconds: prev.sleepTimerRemainingSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    };
  }, [mediaPlayer.sleepTimerRemainingSeconds, handleToolActivity]);

  // App Automation Handler (WhatsApp, Maps, Gmail, etc.)
  const handleAutomationTaskTriggered = useCallback(
    (task: AutomationTask) => {
      setActiveAutomationTask(task);
      setRecentAutomationTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)].slice(0, 20));
      handleLogVoiceCommand(
        `Automate ${task.app.toUpperCase()}: ${task.title}`,
        'automation',
        task.description || task.content || `Target: ${task.recipient || task.app}`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  // Timer controls
  const handleTimerSet = useCallback(
    (durationSeconds: number, label: string) => {
      setActiveTimer({
        id: `timer_${Date.now()}`,
        label,
        durationSeconds,
        remainingSeconds: durationSeconds,
        isRunning: true,
        createdAt: Date.now(),
      });
      const mins = Math.round(durationSeconds / 60);
      handleLogVoiceCommand(
        `Set timer "${label}" for ${mins > 0 ? `${mins} min` : `${durationSeconds}s`}`,
        'timer',
        `Active countdown timer started for "${label}"`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleTimerCancel = useCallback(() => {
    setActiveTimer(null);
    handleLogVoiceCommand('Cancel active countdown timer', 'timer', 'Timer stopped and dismissed', 'voice');
  }, [handleLogVoiceCommand]);

  const handleGetTimerStatus = useCallback(() => {
    if (!activeTimer) return null;
    return {
      remainingSeconds: activeTimer.remainingSeconds,
      label: activeTimer.label,
      isRunning: activeTimer.isRunning,
    };
  }, [activeTimer]);

  // Ambient soundscape controls
  const handleAmbientPlay = useCallback(
    (soundscape: AmbientSoundType, vol?: number) => {
      if (!ambientSynthRef.current) return;
      setActiveAmbientSound(soundscape);
      if (vol !== undefined) setAmbientVolume(vol);
      ambientSynthRef.current.play(soundscape, vol);
      handleLogVoiceCommand(
        `Play ambient soundscape: ${soundscape.toUpperCase()}`,
        'ambient',
        `Synthesizing ${soundscape} ambient frequency loop`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleAmbientStop = useCallback(() => {
    if (!ambientSynthRef.current) return;
    setActiveAmbientSound('off');
    ambientSynthRef.current.stop();
    handleLogVoiceCommand('Stop ambient soundscape', 'ambient', 'Ambient synthesizer halted', 'voice');
  }, [handleLogVoiceCommand]);

  // Guided Breathing controls
  const handleBreathingStart = useCallback(
    (technique: 'box' | 'calm-478' | 'energize') => {
      const initialDuration = technique === 'box' ? 4 : technique === 'calm-478' ? 4 : 2;
      setBreathingSession({
        isActive: true,
        technique,
        phase: 'inhale',
        phaseTimeRemaining: initialDuration,
        totalCyclesCompleted: 0,
      });
      handleLogVoiceCommand(
        `Start Guided Breathing: ${technique.toUpperCase()}`,
        'ambient',
        `Diaphragmatic pacing cycle started (${technique})`,
        'voice'
      );
    },
    [handleLogVoiceCommand]
  );

  const handleBreathingStop = useCallback(() => {
    setBreathingSession(null);
    handleLogVoiceCommand('Stop Guided Breathing session', 'ambient', 'Breathing HUD dismissed', 'voice');
  }, [handleLogVoiceCommand]);

  const handleBreathingRestart = useCallback(() => {
    if (!breathingSession) return;
    const initialDuration =
      breathingSession.technique === 'box' ? 4 : breathingSession.technique === 'calm-478' ? 4 : 2;
    setBreathingSession({
      ...breathingSession,
      phase: 'inhale',
      phaseTimeRemaining: initialDuration,
      totalCyclesCompleted: 0,
    });
  }, [breathingSession]);

  // Breathing step loop
  useEffect(() => {
    if (!breathingSession || !breathingSession.isActive) {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
      return;
    }

    breathingIntervalRef.current = setInterval(() => {
      setBreathingSession((prev) => {
        if (!prev || !prev.isActive) return null;

        if (prev.phaseTimeRemaining > 1) {
          return { ...prev, phaseTimeRemaining: prev.phaseTimeRemaining - 1 };
        }

        // Transition to next phase
        const { technique, phase } = prev;
        let nextPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale';
        let nextDuration = 4;
        let incrementCycle = false;

        if (technique === 'box') {
          if (phase === 'inhale') {
            nextPhase = 'hold';
            nextDuration = 4;
          } else if (phase === 'hold') {
            nextPhase = 'exhale';
            nextDuration = 4;
          } else if (phase === 'exhale') {
            nextPhase = 'rest';
            nextDuration = 4;
          } else {
            nextPhase = 'inhale';
            nextDuration = 4;
            incrementCycle = true;
          }
        } else if (technique === 'calm-478') {
          if (phase === 'inhale') {
            nextPhase = 'hold';
            nextDuration = 7;
          } else if (phase === 'hold') {
            nextPhase = 'exhale';
            nextDuration = 8;
          } else {
            nextPhase = 'inhale';
            nextDuration = 4;
            incrementCycle = true;
          }
        } else {
          // Energize: 2-1-2
          if (phase === 'inhale') {
            nextPhase = 'hold';
            nextDuration = 1;
          } else if (phase === 'hold') {
            nextPhase = 'exhale';
            nextDuration = 2;
          } else {
            nextPhase = 'inhale';
            nextDuration = 2;
            incrementCycle = true;
          }
        }

        return {
          ...prev,
          phase: nextPhase,
          phaseTimeRemaining: nextDuration,
          totalCyclesCompleted: incrementCycle
            ? prev.totalCyclesCompleted + 1
            : prev.totalCyclesCompleted,
        };
      });
    }, 1000);

    return () => {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    };
  }, [breathingSession?.isActive, breathingSession?.technique]);

  // Countdown clock loop
  useEffect(() => {
    if (activeTimer && activeTimer.isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setActiveTimer((prev) => {
          if (!prev || !prev.isRunning) return prev;
          if (prev.remainingSeconds <= 1) {
            if (ambientSynthRef.current) {
              ambientSynthRef.current.playChime();
            }
            handleToolActivity('timerCompleted', `⏰ Timer Finished: "${prev.label}"`);
            return null;
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeTimer?.isRunning, handleToolActivity]);

  // Initialize service singletons once on mount
  useEffect(() => {
    const streamer = new AudioStreamer();
    const player = new AudioPlayer();
    const synth = new AmbientSynthesizer();

    const tools = new ToolManager({
      onThemeChange: handleThemeChange,
      onContrastChange: handleContrastChange,
      onVoiceNoteAdded: handleVoiceNoteAdded,
      onToolActivity: handleToolActivity,
      onTimerSet: handleTimerSet,
      onTimerCancel: handleTimerCancel,
      onGetTimerStatus: handleGetTimerStatus,
      onAmbientPlay: handleAmbientPlay,
      onAmbientStop: handleAmbientStop,
      onBreathingStart: handleBreathingStart,
      onBreathingStop: handleBreathingStop,
      onPlayYouTube: handlePlayYouTube,
      onPlaySpotify: handlePlaySpotify,
      onControlMedia: handleControlMedia,
      onAutomationTaskTriggered: handleAutomationTaskTriggered,
      onEmotionUpdate: handleEmotionUpdate,
      onGetEmotionHistory: handleGetEmotionHistory,
      onGetRealTimeBriefing: handleGetRealTimeBriefing,
      onTriggerTimeSync: handleTriggerTimeSync,
      onOpenTradingTerminal: handleOpenTradingTerminal,
      onOpenWeatherRadar: handleOpenWeatherRadar,
      onOpenBusinessStudio: handleOpenBusinessStudio,
      onFlirtWithUser: handleFlirtWithUser,
      onOpenFlirtStudio: handleOpenFlirtStudio,
      onSetGirlfriendMode: handleSetGirlfriendMode,
      onSendLoveGift: handleSendLoveGift,
      onSetDateScenario: handleSetDateScenario,
      onRateUserFlirt: handleRateUserFlirt,
      onOpenLanguageTutor: handleOpenLanguageTutor,
      onOpenCodeAssistant: handleOpenCodeAssistant,
      onOpenVSCodeIDE: handleOpenVSCodeIDE,
      onOpenQuickTasks: handleOpenQuickTasks,
      onConfigureAudioClarity: handleConfigureAudioClarity,
      onOpenAutomationPipeline: handleOpenAutomationPipeline,
      onOpenDeviceNotifications: handleOpenDeviceNotifications,
      onOpenMobileRemote: handleOpenMobileRemote,
      onReadNotifications: handleReadNotifications,
    });

    const session = new LiveSession(streamer, player, tools, {
      onStateChange: (newState) => {
        setState(newState);
        if (newState === 'disconnected') {
          setUserMetrics({ frequencyData: new Uint8Array(32), volume: 0 });
          setAssistantMetrics({ frequencyData: new Uint8Array(32), volume: 0 });
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setTimeout(() => setErrorMessage(null), 6000);
      },
      onToolActivity: handleToolActivity,
    });

    audioStreamerRef.current = streamer;
    audioPlayerRef.current = player;
    toolManagerRef.current = tools;
    liveSessionRef.current = session;
    ambientSynthRef.current = synth;

    // Start polling audio metrics for visualization
    metricsIntervalRef.current = setInterval(() => {
      if (audioStreamerRef.current && streamer.getIsStreaming()) {
        setUserMetrics(audioStreamerRef.current.getAudioMetrics());
      }
      if (audioPlayerRef.current && player.getIsPlaying()) {
        setAssistantMetrics(audioPlayerRef.current.getAudioMetrics());
      }
    }, 40);

    return () => {
      if (metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
      session.stop();
      player.destroy();
      streamer.stop();
      synth.destroy();
    };
  }, []);

  // Keep ToolManager callbacks updated with latest state/references
  useEffect(() => {
    if (toolManagerRef.current) {
      toolManagerRef.current.updateOptions({
        onThemeChange: handleThemeChange,
        onContrastChange: handleContrastChange,
        onVoiceNoteAdded: handleVoiceNoteAdded,
        onToolActivity: handleToolActivity,
        onTimerSet: handleTimerSet,
        onTimerCancel: handleTimerCancel,
        onGetTimerStatus: handleGetTimerStatus,
        onAmbientPlay: handleAmbientPlay,
        onAmbientStop: handleAmbientStop,
        onBreathingStart: handleBreathingStart,
        onBreathingStop: handleBreathingStop,
        onPlayYouTube: handlePlayYouTube,
        onPlaySpotify: handlePlaySpotify,
        onControlMedia: handleControlMedia,
        onAutomationTaskTriggered: handleAutomationTaskTriggered,
        onEmotionUpdate: handleEmotionUpdate,
        onGetEmotionHistory: handleGetEmotionHistory,
        onGetRealTimeBriefing: handleGetRealTimeBriefing,
        onTriggerTimeSync: handleTriggerTimeSync,
        onOpenTradingTerminal: handleOpenTradingTerminal,
        onOpenWeatherRadar: handleOpenWeatherRadar,
        onOpenBusinessStudio: handleOpenBusinessStudio,
        onFlirtWithUser: handleFlirtWithUser,
        onOpenFlirtStudio: handleOpenFlirtStudio,
        onSetGirlfriendMode: handleSetGirlfriendMode,
        onSendLoveGift: handleSendLoveGift,
        onSetDateScenario: handleSetDateScenario,
        onRateUserFlirt: handleRateUserFlirt,
        onOpenLanguageTutor: handleOpenLanguageTutor,
        onOpenCodeAssistant: handleOpenCodeAssistant,
        onOpenVSCodeIDE: handleOpenVSCodeIDE,
        onOpenQuickTasks: handleOpenQuickTasks,
        onConfigureAudioClarity: handleConfigureAudioClarity,
        onOpenAutomationPipeline: handleOpenAutomationPipeline,
        onOpenDeviceNotifications: handleOpenDeviceNotifications,
        onOpenMobileRemote: handleOpenMobileRemote,
        onReadNotifications: handleReadNotifications,
      });
    }
  }, [
    handleThemeChange,
    handleContrastChange,
    handleVoiceNoteAdded,
    handleToolActivity,
    handleTimerSet,
    handleTimerCancel,
    handleGetTimerStatus,
    handleAmbientPlay,
    handleAmbientStop,
    handleBreathingStart,
    handleBreathingStop,
    handlePlayYouTube,
    handlePlaySpotify,
    handleControlMedia,
    handleAutomationTaskTriggered,
    handleEmotionUpdate,
    handleGetEmotionHistory,
    handleGetRealTimeBriefing,
    handleTriggerTimeSync,
    handleOpenTradingTerminal,
    handleOpenWeatherRadar,
    handleOpenBusinessStudio,
    handleFlirtWithUser,
    handleOpenFlirtStudio,
    handleSetGirlfriendMode,
    handleSendLoveGift,
    handleSetDateScenario,
    handleRateUserFlirt,
    handleOpenLanguageTutor,
    handleOpenCodeAssistant,
    handleOpenVSCodeIDE,
    handleOpenQuickTasks,
    handleConfigureAudioClarity,
    handleOpenAutomationPipeline,
    handleOpenDeviceNotifications,
    handleOpenMobileRemote,
    handleReadNotifications,
  ]);

  // Primary toggle connection
  const handleToggleConnection = async () => {
    if (!liveSessionRef.current) return;

    if (state === 'disconnected') {
      setErrorMessage(null);
      await liveSessionRef.current.start({
        ...languageSettings,
        girlfriendMode: girlfriendSettings.girlfriendModeEnabled,
        gfPersona: girlfriendSettings.persona,
        petName: girlfriendSettings.userPetName,
      });
    } else {
      liveSessionRef.current.stop();
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!audioStreamerRef.current || !liveSessionRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    liveSessionRef.current.setMute(nextMuted);
  };

  // Interrupt Speaking
  const handleInterrupt = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.interrupt();
    }
  };

  // Delete Voice Note
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Toggle Timer Pause
  const handleTogglePauseTimer = () => {
    setActiveTimer((prev) => (prev ? { ...prev, isRunning: !prev.isRunning } : null));
  };

  // Quick Prompt & Command Selection
  const handleSelectQuickPrompt = async (prompt: string) => {
    if (!prompt.trim()) return;

    // Check if command can be fulfilled immediately via local ToolManager intent
    if (toolManagerRef.current) {
      const intentResult = await toolManagerRef.current.executeIntentFromText(prompt);
      if (intentResult.handled) {
        handleToolActivity('commandExecuted', intentResult.message || `Executed: "${prompt}"`);
        handleLogVoiceCommand(prompt, 'tool_call', intentResult.message || 'Direct Action', 'quick_prompt');
        return;
      }
    }

    if (state === 'disconnected') {
      await handleToggleConnection();
    }
    handleToolActivity('prompt', prompt);
    handleLogVoiceCommand(prompt, 'general', 'Dispatched via Quick Prompt Bar', 'quick_prompt');
  };

  // Determine contextual last command or prompt string
  const getLastCommandDisplay = () => {
    if (activeActivity) {
      return `"${activeActivity.detail}"`;
    }
    if (mediaPlayer.isPlaying && mediaPlayer.currentTrack) {
      return `🎵 Playing: "${mediaPlayer.currentTrack.title}" (${mediaPlayer.activePlatform?.toUpperCase()})`;
    }
    if (activeTimer) {
      const m = Math.floor(activeTimer.remainingSeconds / 60);
      const s = activeTimer.remainingSeconds % 60;
      return `Timer "${activeTimer.label}": ${m}:${s.toString().padStart(2, '0')} remaining`;
    }
    if (notes.length > 0) {
      return `"${notes[0].title}"`;
    }
    if (state === 'speaking') {
      return '"Responding to your voice query..."';
    }
    if (state === 'listening') {
      return '"Speak to play music, automate WhatsApp, or run commands"';
    }
    return '"Play Bohemian Rhapsody on YouTube"';
  };

  const isTrueBlack = contrastMode === 'true-black';

  return (
    <div
      id="myraa-app-root"
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden text-white selection:bg-cyan-500 selection:text-black font-sans antialiased transition-colors duration-500 ${
        isTrueBlack ? 'bg-black' : 'bg-[#050507]'
      }`}
    >
      {/* Dynamic Animated Emotion Atmosphere Background */}
      <EmotionAtmosphereBackground
        currentEmotion={currentEmotion}
        emotionIntensity={emotionIntensity}
        theme={theme}
        contrastMode={contrastMode}
        state={state}
        audioVolume={assistantMetrics.volume || userMetrics.volume}
      />

      {/* Floating Active Timer HUD */}
      <FloatingTimerHud
        timer={activeTimer}
        onCancel={handleTimerCancel}
        onTogglePause={handleTogglePauseTimer}
      />

      {/* Floating Guided Breathing HUD */}
      <GuidedBreathingHud
        session={breathingSession}
        onStop={handleBreathingStop}
        onRestart={handleBreathingRestart}
      />

      {/* Floating Mini Media Player (When full modal is minimized) */}
      <FloatingMiniPlayerHud
        mediaState={mediaPlayer}
        contrastMode={contrastMode}
        onTogglePlay={() =>
          handleControlMedia(mediaPlayer.isPlaying ? 'pause' : 'play', mediaPlayer.activePlatform || 'all')
        }
        onNext={() => handleControlMedia('next', mediaPlayer.activePlatform || 'all')}
        onPrevious={() => handleControlMedia('previous', mediaPlayer.activePlatform || 'all')}
        onExpand={() => {
          if (mediaPlayer.activePlatform === 'youtube') setIsYouTubeModalOpen(true);
          if (mediaPlayer.activePlatform === 'spotify') setIsSpotifyModalOpen(true);
        }}
        onClose={() => {
          setMediaPlayer((prev) => ({ ...prev, isPlaying: false, activePlatform: null }));
        }}
      />

      {/* Floating Live Automation Keystroke Typing Notification */}
      <LiveAutomationHud
        task={activeAutomationTask}
        contrastMode={contrastMode}
        onOpenAppHub={(task) => {
          setIsAppHubOpen(true);
        }}
        onDismiss={() => setActiveAutomationTask(null)}
      />

      {/* Floating Tool Action Toast */}
      <ToolToast activity={activeActivity} />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        {/* Session Status Pill & Time/Emotion/Trading Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live Real-Time Day Phase Clock Pill */}
          <LiveTimeTickerPill
            contrastMode={contrastMode}
            onClick={() => setIsTimeInfoModalOpen(true)}
          />

          {/* Live Real-Time Stock Market Ticker Pill */}
          <LiveTradingTickerPill
            contrastMode={contrastMode}
            onClick={() => handleOpenTradingTerminal()}
          />

          {/* Live Real-Time World Weather Radar Ticker Pill */}
          <LiveWeatherTickerPill
            contrastMode={contrastMode}
            onClick={() => handleOpenWeatherRadar()}
          />

          {/* Active AI Emotion State & Mood Badge */}
          <EmotionBadge
            currentEmotion={currentEmotion}
            intensity={emotionIntensity}
            expression={emotionExpression}
            contrastMode={contrastMode}
            onClick={() => setIsEmotionModalOpen(true)}
          />

          <div
            className={`w-2 h-2 rounded-full ${
              state === 'speaking' || state === 'listening'
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : state === 'connecting'
                ? 'bg-cyan-400 animate-ping'
                : 'bg-neutral-500'
            }`}
          />
          <span
            className={`text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase hidden md:inline-block ${
              state === 'speaking' || state === 'listening'
                ? 'text-emerald-400'
                : state === 'connecting'
                ? 'text-cyan-300'
                : isTrueBlack
                ? 'text-neutral-300'
                : 'text-neutral-400'
            }`}
          >
            {state === 'speaking'
              ? 'Speaking'
              : state === 'listening'
              ? 'Listening'
              : state === 'connecting'
              ? 'Connecting'
              : 'Session Ready'}
          </span>
          {isTrueBlack && (
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white text-black font-bold">
              True Black
            </span>
          )}
        </div>

        {/* Minimalist Centered Brand Typography */}
        <div className="text-xl sm:text-2xl font-light tracking-[0.3em] uppercase text-white/95 text-center hidden sm:block">
          Myraa
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2">
          {/* Subtle Color-coded Energy / Battery Indicator */}
          <BatteryIndicator />

          {/* YouTube Music Quick Header Trigger */}
          <button
            onClick={() => setIsYouTubeModalOpen(true)}
            title="YouTube Player"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              mediaPlayer.activePlatform === 'youtube' && mediaPlayer.isPlaying
                ? 'border-red-500/60 bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <Youtube className="w-4 h-4" />
          </button>

          {/* Spotify Music Quick Header Trigger */}
          <button
            onClick={() => setIsSpotifyModalOpen(true)}
            title="Spotify Stream"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              mediaPlayer.activePlatform === 'spotify' && mediaPlayer.isPlaying
                ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-400 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* App Automation Hub Header Trigger */}
          <button
            onClick={() => setIsAppHubOpen(true)}
            title="App Automation & Typing Hub"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-300" />
          </button>

          {/* Trading & Stocks Research Hub Header Trigger */}
          <button
            id="header-trading-hub-btn"
            onClick={() => handleOpenTradingTerminal()}
            title="Trading & Stocks Intelligence Terminal (Market, Research, Profit Calc & Sell Advisor)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </button>

          {/* World Weather Radar Header Trigger */}
          <button
            id="header-weather-radar-btn"
            onClick={() => handleOpenWeatherRadar()}
            title="World Weather Radar & Live Temperatures"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg hidden md:flex ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <CloudSun className="w-4 h-4 text-sky-300" />
          </button>

          {/* Online Business Studio Header Trigger */}
          <button
            id="header-business-builder-btn"
            onClick={() => handleOpenBusinessStudio()}
            title="Online Business Builder & Free Digital Products Studio"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg hidden md:flex ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <Rocket className="w-4 h-4 text-amber-400" />
          </button>

          {/* Language Academy & English Tutor Header Trigger */}
          <button
            id="header-language-tutor-btn"
            onClick={() => handleOpenLanguageTutor()}
            title="Language Academy & English Tutor (Grammar, Pronunciation & Roleplay)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </button>

          {/* VS Code Studio & Direct Code IDE Header Trigger */}
          <button
            id="header-vscode-studio-btn"
            onClick={() => handleOpenVSCodeIDE()}
            title="VS Code Studio & Direct Code IDE (Write Code Directly, Bash Terminal & AI Copilot)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-cyan-400/50 bg-black hover:bg-neutral-900 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
          </button>

          {/* AI Code Assistant Studio Header Trigger */}
          <button
            id="header-code-assistant-btn"
            onClick={() => handleOpenCodeAssistant()}
            title="AI Code Assistant & Dev Studio (Templates, Sandbox & Big-O Analyzer)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Quick Tasks Hub Header Trigger */}
          <button
            id="header-quick-tasks-btn"
            onClick={() => handleOpenQuickTasks()}
            title="Quick Tasks & Productivity Hub (1-Click Daily Sprints & Focus Timer)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-white'
                : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Autonomous Task Pipelines & Workflows Header Trigger */}
          <button
            id="header-pipeline-workflows-btn"
            onClick={() => handleOpenAutomationPipeline()}
            title="Autonomous Task Pipelines & Workflows (Multi-Step Sequences & Document AI Extractor)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-amber-400/50 bg-black hover:bg-neutral-900 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </button>

          {/* Device Notifications & Voice Reader Header Trigger */}
          <button
            id="header-device-notifications-btn"
            onClick={() => handleOpenDeviceNotifications()}
            title="Device Notifications Reader (Mobile & Laptop Sync, WhatsApp & Voice Aloud)"
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-emerald-400/50 bg-black hover:bg-neutral-900 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                : 'border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            {deviceNotifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-black flex items-center justify-center shadow-md animate-pulse">
                {deviceNotifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Mobile Remote Controller & PWA Companion Header Trigger */}
          <button
            id="header-mobile-remote-btn"
            onClick={() => handleOpenMobileRemote()}
            title="Mobile Remote Controller & PWA Pairing (Phone Control Deck & QR Code)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-cyan-400/50 bg-black hover:bg-neutral-900 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Flirt & Romance Studio Header Trigger */}
          <button
            id="header-flirt-studio-btn"
            onClick={() => handleOpenFlirtStudio()}
            title="Flirt & Romance Studio (AI Chemistry Gauge, Banter & Compliments Library)"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              currentEmotion === 'flirty' || currentEmotion === 'romantic'
                ? 'border-pink-500/60 bg-pink-500/20 text-pink-300 animate-pulse shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 text-pink-400'
                : 'border-pink-500/20 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400'
            }`}
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30" />
          </button>

          {/* Quick Contrast Mode Toggle */}
          <button
            id="header-contrast-toggle-btn"
            onClick={handleToggleContrastMode}
            title={isTrueBlack ? 'Switch to Cosmic Dark' : 'Switch to High-Contrast True Black'}
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white bg-white text-black ring-1 ring-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <SunMoon className="w-4 h-4" />
          </button>

          {/* Guided Breathing Meditation Button */}
          <button
            onClick={() => {
              if (breathingSession?.isActive) {
                handleBreathingStop();
              } else {
                handleBreathingStart('box');
              }
            }}
            title={breathingSession?.isActive ? 'Stop Breathing Exercise' : 'Guided Breathing Meditation'}
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg hidden sm:flex ${
              breathingSession?.isActive
                ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 hover:border-white/60 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <Wind className="w-4 h-4" />
          </button>

          {/* Ambient Soundscapes Quick Trigger */}
          <button
            onClick={() => setIsAmbientOpen(true)}
            title="Ambient Soundscapes"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg hidden sm:flex ${
              activeAmbientSound !== 'off'
                ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 hover:border-white/60 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Visual Atmosphere & Theme Selector */}
          <button
            onClick={() => setIsThemesOpen(true)}
            title="Visual Atmosphere & Contrast"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 hover:border-white/60 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </button>

          {/* Info Modal */}
          <button
            onClick={() => setIsInfoOpen(true)}
            title="Overview & Voice Prompts"
            className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all shadow-lg ${
              isTrueBlack
                ? 'border-white/30 bg-black hover:bg-neutral-900 hover:border-white/60 text-white'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Status & Error Notification Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-40 max-w-md mx-auto px-4 mt-2"
          >
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-white/10 text-neutral-200 text-xs shadow-2xl backdrop-blur-xl">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="flex-1 font-medium">{errorMessage}</span>
              <button
                onClick={() => {
                  setErrorMessage(null);
                  handleToggleConnection();
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-[11px] uppercase tracking-wider transition-colors border border-cyan-500/30"
              >
                Reconnect
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Immersive Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4">
        <OrbVisualizer
          state={state}
          theme={theme}
          style={style}
          contrastMode={contrastMode}
          currentEmotion={currentEmotion}
          userMetrics={userMetrics}
          assistantMetrics={assistantMetrics}
          onOrbClick={handleToggleConnection}
        />
      </main>

      {/* Interactive Quick Prompts Carousel */}
      <div className="relative z-20 w-full mb-3">
        <QuickPromptsBar onSelectPrompt={handleSelectQuickPrompt} />
      </div>

      {/* Footer Controls & Last Command Section */}
      <footer className="relative z-20 w-full">
        <MainControls
          state={state}
          theme={theme}
          contrastMode={contrastMode}
          isMuted={isMuted}
          notesCount={notes.length}
          activeAmbientSound={activeAmbientSound}
          lastCommandText={getLastCommandDisplay()}
          languageSettings={languageSettings}
          isMediaPlaying={mediaPlayer.isPlaying}
          activeMediaPlatform={mediaPlayer.activePlatform}
          onToggleConnection={handleToggleConnection}
          onToggleMute={handleToggleMute}
          onInterrupt={handleInterrupt}
          onOpenThemes={() => setIsThemesOpen(true)}
          onToggleContrastMode={handleToggleContrastMode}
          onOpenNotes={() => setIsNotesOpen(true)}
          onOpenAmbient={() => setIsAmbientOpen(true)}
          onOpenTelemetry={() => setIsTelemetryOpen(true)}
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenYouTube={() => setIsYouTubeModalOpen(true)}
          onOpenSpotify={() => setIsSpotifyModalOpen(true)}
          onOpenAppAutomation={() => setIsAppHubOpen(true)}
          onOpenEmotionHistory={() => setIsEmotionModalOpen(true)}
          onOpenTimeInfo={() => setIsTimeInfoModalOpen(true)}
          onOpenTradingHub={() => handleOpenTradingTerminal()}
          onOpenWeather={() => handleOpenWeatherRadar()}
          onOpenBusinessBuilder={() => handleOpenBusinessStudio()}
        />
      </footer>

      {/* Modals & Drawers */}
      {/* Emotion History & Sentiment Modal */}
      <EmotionHistoryModal
        isOpen={isEmotionModalOpen}
        currentEmotion={currentEmotion}
        intensity={emotionIntensity}
        expression={emotionExpression}
        history={emotionHistory}
        contrastMode={contrastMode}
        onSelectEmotion={(em, intens, trig, expr) => {
          handleEmotionUpdate(em, intens, trig, expr);
        }}
        onClearHistory={handleClearEmotionHistory}
        onClose={() => setIsEmotionModalOpen(false)}
      />

      {/* Real-Time Information Briefing & Time-to-Time Digest Modal */}
      <TimeInfoTickerModal
        isOpen={isTimeInfoModalOpen}
        contrastMode={contrastMode}
        sessionStartTime={sessionStartTimeRef.current}
        onTriggerSync={() => {
          handleTriggerTimeSync();
        }}
        onClose={() => setIsTimeInfoModalOpen(false)}
      />

      {/* Modals & Drawers */}
      {/* YouTube Player Modal */}
      <YouTubePlayerModal
        isOpen={isYouTubeModalOpen}
        currentTrack={mediaPlayer.currentYouTubeTrack || POPULAR_YOUTUBE_TRACKS[0]}
        isPlaying={mediaPlayer.isPlaying && mediaPlayer.activePlatform === 'youtube'}
        volume={mediaPlayer.volume}
        isMuted={mediaPlayer.isMuted}
        contrastMode={contrastMode}
        repeatMode={mediaPlayer.repeatMode}
        isShuffle={mediaPlayer.isShuffle}
        equalizerPreset={mediaPlayer.equalizerPreset}
        sleepTimerMinutes={mediaPlayer.sleepTimerMinutes}
        queue={mediaPlayer.youtubeQueue}
        onSelectTrack={(track) => {
          setMediaPlayer((prev) => ({
            ...prev,
            activePlatform: 'youtube',
            isPlaying: true,
            currentYouTubeTrack: track,
            isMinimized: false,
          }));
        }}
        onTogglePlay={() =>
          handleControlMedia(mediaPlayer.isPlaying ? 'pause' : 'play', 'youtube')
        }
        onNextTrack={() => handleControlMedia('next', 'youtube')}
        onPrevTrack={() => handleControlMedia('previous', 'youtube')}
        onToggleMute={() => setMediaPlayer((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
        onVolumeChange={(vol) => setMediaPlayer((prev) => ({ ...prev, volume: vol, isMuted: false }))}
        onToggleRepeat={handleToggleRepeat}
        onToggleShuffle={handleToggleShuffle}
        onSetEqualizer={handleSetEqualizer}
        onSetSleepTimer={handleSetSleepTimer}
        onPlayAllTracks={handlePlayAllYouTubeTracks}
        onMinimize={() => {
          setIsYouTubeModalOpen(false);
          setMediaPlayer((prev) => ({ ...prev, isMinimized: true }));
        }}
        onClose={() => setIsYouTubeModalOpen(false)}
      />

      {/* Spotify Player Modal */}
      <SpotifyPlayerModal
        isOpen={isSpotifyModalOpen}
        currentTrack={mediaPlayer.currentSpotifyTrack || POPULAR_SPOTIFY_TRACKS[0]}
        isPlaying={mediaPlayer.isPlaying && mediaPlayer.activePlatform === 'spotify'}
        volume={mediaPlayer.volume}
        isMuted={mediaPlayer.isMuted}
        contrastMode={contrastMode}
        repeatMode={mediaPlayer.repeatMode}
        isShuffle={mediaPlayer.isShuffle}
        equalizerPreset={mediaPlayer.equalizerPreset}
        sleepTimerMinutes={mediaPlayer.sleepTimerMinutes}
        queue={mediaPlayer.spotifyQueue}
        onSelectTrack={(track) => {
          setMediaPlayer((prev) => ({
            ...prev,
            activePlatform: 'spotify',
            isPlaying: true,
            currentSpotifyTrack: track,
            isMinimized: false,
          }));
        }}
        onTogglePlay={() =>
          handleControlMedia(mediaPlayer.isPlaying ? 'pause' : 'play', 'spotify')
        }
        onNextTrack={() => handleControlMedia('next', 'spotify')}
        onPrevTrack={() => handleControlMedia('previous', 'spotify')}
        onToggleMute={() => setMediaPlayer((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
        onVolumeChange={(vol) => setMediaPlayer((prev) => ({ ...prev, volume: vol, isMuted: false }))}
        onToggleRepeat={handleToggleRepeat}
        onToggleShuffle={handleToggleShuffle}
        onSetEqualizer={handleSetEqualizer}
        onSetSleepTimer={handleSetSleepTimer}
        onPlayAllTracks={handlePlayAllSpotifyTracks}
        onMinimize={() => {
          setIsSpotifyModalOpen(false);
          setMediaPlayer((prev) => ({ ...prev, isMinimized: true }));
        }}
        onClose={() => setIsSpotifyModalOpen(false)}
        onSwitchToYouTube={handlePlayYouTube}
      />

      {/* Floating Mini Player HUD for minimized audio */}
      <FloatingMiniPlayerHud
        mediaState={mediaPlayer}
        contrastMode={contrastMode}
        onMaximizeYouTube={() => {
          setMediaPlayer((prev) => ({ ...prev, isMinimized: false }));
          setIsYouTubeModalOpen(true);
          setIsSpotifyModalOpen(false);
        }}
        onMaximizeSpotify={() => {
          setMediaPlayer((prev) => ({ ...prev, isMinimized: false }));
          setIsSpotifyModalOpen(true);
          setIsYouTubeModalOpen(false);
        }}
        onTogglePlay={() =>
          handleControlMedia(
            mediaPlayer.isPlaying ? 'pause' : 'play',
            mediaPlayer.activePlatform === 'none' ? 'youtube' : (mediaPlayer.activePlatform as any)
          )
        }
        onNextTrack={() =>
          handleControlMedia(
            'next',
            mediaPlayer.activePlatform === 'none' ? 'youtube' : (mediaPlayer.activePlatform as any)
          )
        }
        onClose={() =>
          setMediaPlayer((prev) => ({
            ...prev,
            activePlatform: 'none',
            isPlaying: false,
            isMinimized: false,
          }))
        }
      />

      {/* App Automation Hub Modal with Live Auto-Typing Simulation */}
      <AppAutomationHubModal
        isOpen={isAppHubOpen}
        contrastMode={contrastMode}
        recentTasks={recentAutomationTasks}
        onTriggerTask={(task) => {
          setActiveAutomationTask(task);
          setRecentAutomationTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)].slice(0, 20));
          handleToolActivity(
            'appAutomation',
            `Automating ${task.app.toUpperCase()}: ${task.title}`
          );
        }}
        onClose={() => setIsAppHubOpen(false)}
      />

      <VoiceNotesDrawer
        isOpen={isNotesOpen}
        notes={notes}
        onClose={() => setIsNotesOpen(false)}
        onDeleteNote={handleDeleteNote}
      />

      <ThemeSelectorModal
        isOpen={isThemesOpen}
        currentTheme={theme}
        currentStyle={style}
        currentContrastMode={contrastMode}
        currentEmotion={currentEmotion}
        onSelectTheme={handleThemeChange}
        onSelectStyle={setStyle}
        onSelectContrastMode={handleContrastChange}
        onSelectEmotion={(emo) => {
          handleEmotionUpdate(emo, 90, 'User Atmosphere Preset Selection');
        }}
        onClose={() => setIsThemesOpen(false)}
      />

      {/* Emotion Analytics & History Modal */}
      <EmotionHistoryModal
        isOpen={isEmotionModalOpen}
        currentEmotion={currentEmotion}
        emotionIntensity={emotionIntensity}
        emotionExpression={emotionExpression}
        history={emotionHistory}
        contrastMode={contrastMode}
        onSelectEmotion={(emo, intensity, trigger) => {
          handleEmotionUpdate(emo, intensity, trigger);
        }}
        onClearHistory={handleClearEmotionHistory}
        onClose={() => setIsEmotionModalOpen(false)}
      />

      {/* Real-Time Day Phase & World Time Digest Modal */}
      <TimeInfoTickerModal
        isOpen={isTimeInfoModalOpen}
        contrastMode={contrastMode}
        sessionStartTime={sessionStartTimeRef.current}
        onTriggerBriefing={handleGetRealTimeBriefing}
        onClose={() => setIsTimeInfoModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={languageSettings}
        onSaveSettings={(newSettings) => {
          setLanguageSettings(newSettings);
          try {
            localStorage.setItem('myraa_language_settings', JSON.stringify(newSettings));
          } catch {}
        }}
        isSessionActive={state === 'listening' || state === 'speaking'}
      />

      <AmbientSoundModal
        isOpen={isAmbientOpen}
        activeSound={activeAmbientSound}
        volume={ambientVolume}
        onSelectSound={handleAmbientPlay}
        onVolumeChange={(v) => {
          setAmbientVolume(v);
          if (ambientSynthRef.current) ambientSynthRef.current.setVolume(v);
        }}
        onClose={() => setIsAmbientOpen(false)}
      />

      <TelemetryDrawer
        isOpen={isTelemetryOpen}
        state={state}
        telemetry={telemetry}
        voiceCommands={voiceCommands}
        onClearCommands={() => setVoiceCommands([])}
        onSelectCommand={(cmd) => {
          setIsTelemetryOpen(false);
          handleSelectQuickPrompt(cmd);
        }}
        contrastMode={contrastMode}
        onClose={() => setIsTelemetryOpen(false)}
      />

      {/* Trading & Stocks Intelligence Terminal Modal */}
      <TradingHubModal
        isOpen={isTradingHubOpen}
        contrastMode={contrastMode}
        initialStockSymbol={tradingSelectedStockSymbol}
        initialTab={tradingActiveTab}
        onClose={() => setIsTradingHubOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* World Weather Radar & Atmospheric Forecast Modal */}
      <WorldWeatherModal
        isOpen={isWeatherModalOpen}
        contrastMode={contrastMode}
        initialCity={selectedWeatherCity}
        onClose={() => setIsWeatherModalOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* Online Business Builder & Free Digital Products Studio Modal */}
      <BusinessBuilderModal
        isOpen={isBusinessModalOpen}
        contrastMode={contrastMode}
        initialNiche={selectedBusinessNiche}
        onClose={() => setIsBusinessModalOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* Flirt & Romance Studio with AI Chemistry Gauge Modal */}
      <FlirtRomanceStudioModal
        isOpen={isFlirtModalOpen}
        contrastMode={contrastMode}
        currentEmotion={currentEmotion}
        girlfriendSettings={girlfriendSettings}
        onClose={() => setIsFlirtModalOpen(false)}
        onUpdateGirlfriendSettings={handleUpdateGirlfriendSettings}
        onSendLoveGift={handleSendLoveGift}
        onSetDateScenario={handleSetDateScenario}
        onRateUserFlirt={handleRateUserFlirt}
        onTriggerFlirt={(style, topic, text) => {
          handleFlirtWithUser(style, topic, text);
          if (text) {
            handleSelectQuickPrompt(`Tell me this: "${text}"`);
          }
        }}
        onSetEmotion={(emo, intensity, trigger, expression) => {
          handleEmotionUpdate(emo, intensity, trigger, expression);
        }}
      />

      {/* Language Academy & English Tutor Modal */}
      <LanguageTutorModal
        isOpen={isLanguageTutorOpen}
        contrastMode={contrastMode}
        initialLanguage={languageTutorTargetLang}
        initialTab={languageTutorInitialTab}
        onClose={() => setIsLanguageTutorOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* AI Code Assistant & Sandbox Modal */}
      <CodeAssistantModal
        isOpen={isCodeAssistantOpen}
        contrastMode={contrastMode}
        initialLanguage={codeAssistantTargetLang}
        initialTab={codeAssistantInitialTab}
        onClose={() => setIsCodeAssistantOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* VS Code Studio & Direct Code IDE Modal */}
      <VSCodeStudioModal
        isOpen={isVSCodeModalOpen}
        contrastMode={contrastMode}
        initialFileId={vsCodeInitialFileId}
        onClose={() => setIsVSCodeModalOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
        onToolActivity={handleToolActivity}
      />

      {/* Quick Tasks & Easy Productivity Hub Modal */}
      <QuickTasksModal
        isOpen={isQuickTasksOpen}
        contrastMode={contrastMode}
        initialCategory={quickTasksFilter}
        onClose={() => setIsQuickTasksOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* Autonomous Task Pipelines & Multi-Step Workflows Modal */}
      <AutonomousPipelineModal
        isOpen={isPipelineModalOpen}
        contrastMode={contrastMode}
        initialPipelineId={pipelineInitialId}
        initialTab={pipelineInitialTab}
        onClose={() => setIsPipelineModalOpen(false)}
        onLogVoiceCommand={handleLogVoiceCommand}
        onPlayAmbientSound={(soundscape) => handleAmbientPlay(soundscape, 0.4)}
        onOpenTrading={(sym) => handleOpenTradingTerminal(sym, 'market')}
        onOpenWeather={(city) => handleOpenWeatherRadar(city)}
      />

      {/* Device Notifications Hub & Voice Reader Modal */}
      <DeviceNotificationHubModal
        isOpen={isDeviceNotificationOpen}
        contrastMode={contrastMode}
        initialTab={deviceNotificationTab}
        notifications={deviceNotifications}
        onClose={() => setIsDeviceNotificationOpen(false)}
        onNotificationsChange={(updated) => {
          setDeviceNotifications(updated);
          saveStoredDeviceNotifications(updated);
        }}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      {/* Mobile Remote Controller & PWA Companion Modal */}
      <MobileRemoteModal
        isOpen={isMobileRemoteOpen}
        contrastMode={contrastMode}
        initialTab={mobileRemoteTab}
        assistantState={state}
        isMuted={isMuted}
        isMediaPlaying={mediaPlayer.isPlaying}
        unreadNotificationsCount={deviceNotifications.filter((n) => !n.isRead).length}
        onClose={() => setIsMobileRemoteOpen(false)}
        onToggleMic={handleToggleConnection}
        onToggleMute={handleToggleMute}
        onPlayPauseMedia={() => {
          if (mediaPlayer.isPlaying) {
            handleControlMedia('pause', 'all');
          } else {
            handleControlMedia('play', 'all');
          }
        }}
        onNextMedia={() => handleControlMedia('next', 'all')}
        onTriggerBreathing={() => handleBreathingStart('box')}
        onReadNotifications={() => handleReadNotifications('all')}
        onOpenDeviceNotifications={() => {
          setIsMobileRemoteOpen(false);
          handleOpenDeviceNotifications('mobile');
        }}
        onLogVoiceCommand={handleLogVoiceCommand}
      />

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
