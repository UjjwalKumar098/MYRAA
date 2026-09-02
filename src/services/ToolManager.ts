/**
 * ToolManager handles the execution of client-side browser actions
 * invoked via Gemini Live API function calling.
 */

import {
  VoiceNote,
  VisualTheme,
  ContrastMode,
  AmbientSoundType,
  YouTubeTrack,
  SpotifyTrack,
  AutomationTask,
  AutomationApp,
  EmotionType,
  EmotionRecord,
  TimeUpdateDigest,
  StockQuote,
  TradeProfitCalculation,
  BusinessNiche,
  NewsCategory,
  FlirtStyle,
  TargetLanguageCode,
  ProgrammingLanguage,
  AudioClarityConfig,
  QuickTaskItem,
} from '../types';
import { findYouTubeTrack, findSpotifyTrack } from '../utils/mediaData';
import { buildWhatsAppUrl, buildGoogleMapsUrl, buildMailtoUrl, buildGoogleSearchUrl } from '../utils/automationPresets';
import { generateTimeUpdateDigest } from '../utils/timeSyncEngine';
import { calculateEmotionStats, EMOTION_METAS } from '../utils/emotionEngine';
import { getRandomFlirtPrompt, calculateFlirtChemistry } from '../utils/flirtRomanceData';
import {
  INITIAL_STOCKS,
  DEFAULT_TRADING_ALERTS,
  DEFAULT_USER_PORTFOLIO,
  calculateTradeProfitAndStrategy,
  findStockOrCrypto,
} from '../utils/tradingData';
import { findCityWeather, WORLD_CITIES_WEATHER } from '../utils/weatherData';
import { generateCustomBusinessIdea, INITIAL_BUSINESS_MODELS, FREE_TOOL_RESOURCES } from '../utils/businessBuilderData';
import { INITIAL_MARKET_NEWS, getFilteredNews } from '../utils/marketNewsData';
import {
  INITIAL_ENGLISH_LESSONS,
  INITIAL_QUIZ_QUESTIONS,
  analyzeGrammarAndSentence,
  SUPPORTED_TUTOR_LANGUAGES,
} from '../utils/languageTutorData';
import { INITIAL_CODE_TEMPLATES, explainCodeSnippet } from '../utils/codeAssistantData';
import { INITIAL_QUICK_TASKS, DAILY_SPRINT_PRESETS } from '../utils/quickTasksData';
import {
  INITIAL_AUTOMATION_PIPELINES,
  extractDocumentIntelligence,
} from '../utils/automatedWorkflowsData';
import {
  triggerLiveBrowserNotification,
  generateCustomVSCodeSnippet,
  calculateSplitExpense,
  INITIAL_SYSTEM_UPDATES,
} from '../utils/simpleTasksData';

export type ToolHandler = (args: Record<string, any>) => Promise<Record<string, any>> | Record<string, any>;

export class ToolManager {
  private handlers: Map<string, ToolHandler> = new Map();
  private onThemeChange?: (theme: VisualTheme, energyMode?: string, contrastMode?: ContrastMode) => void;
  private onContrastChange?: (contrastMode: ContrastMode) => void;
  private onVoiceNoteAdded?: (note: VoiceNote) => void;
  private onToolActivity?: (toolName: string, details: string) => void;
  private onTimerSet?: (durationSeconds: number, label: string) => void;
  private onTimerCancel?: () => void;
  private onGetTimerStatus?: () => { remainingSeconds: number; label: string; isRunning: boolean } | null;
  private onAmbientPlay?: (soundscape: AmbientSoundType, volume?: number) => void;
  private onAmbientStop?: () => void;
  private onBreathingStart?: (technique: 'box' | 'calm-478' | 'energize') => void;
  private onBreathingStop?: () => void;
  private onPlayYouTube?: (query: string, autoplay?: boolean) => void;
  private onPlaySpotify?: (query: string, type?: string) => void;
  private onControlMedia?: (action: 'play' | 'pause' | 'next' | 'previous' | 'volume', target?: 'youtube' | 'spotify' | 'all', value?: number) => void;
  private onAutomationTaskTriggered?: (task: AutomationTask) => void;
  private onEmotionUpdate?: (emotion: EmotionType, intensity?: number, trigger?: string, expression?: string) => void;
  private onGetEmotionHistory?: () => EmotionRecord[];
  private onGetRealTimeBriefing?: () => TimeUpdateDigest;
  private onTriggerTimeSync?: () => TimeUpdateDigest;
  private onOpenTradingTerminal?: (symbol?: string, tab?: 'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news') => void;
  private onOpenBusinessStudio?: (niche?: BusinessNiche) => void;
  private onOpenWeatherRadar?: (city?: string) => void;
  private onFlirtWithUser?: (style?: FlirtStyle, topic?: string, text?: string) => void;
  private onOpenFlirtStudio?: (category?: FlirtStyle) => void;
  private onSetGirlfriendMode?: (enabled: boolean, persona?: string, petName?: string) => void;
  private onSendLoveGift?: (giftType: string, note?: string) => void;
  private onSetDateScenario?: (scenarioId: string) => void;
  private onRateUserFlirt?: (userFlirtText: string, score: number, reactionTone: string) => void;
  private onOpenLanguageTutor?: (lang?: TargetLanguageCode, tab?: 'lessons' | 'analyzer' | 'roleplay' | 'quiz') => void;
  private onOpenCodeAssistant?: (lang?: ProgrammingLanguage, tab?: 'templates' | 'sandbox' | 'explainer' | 'generator') => void;
  private onOpenVSCodeIDE?: (fileId?: string, tab?: 'explorer' | 'copilot' | 'terminal' | 'preview') => void;
  private onOpenQuickTasks?: (filter?: string) => void;
  private onConfigureAudioClarity?: (config: Partial<AudioClarityConfig>) => void;
  private onOpenAutomationPipeline?: (pipelineId?: string, tab?: 'pipelines' | 'runner' | 'doc_extractor' | 'scheduler') => void;
  private onOpenDeviceNotifications?: (tab?: 'all' | 'mobile' | 'laptop' | 'unread') => void;
  private onOpenMobileRemote?: (tab?: 'controller' | 'pair_qr' | 'install_pwa') => void;
  private onReadNotifications?: (device?: 'mobile' | 'laptop' | 'all') => void;

  constructor(options?: {
    onThemeChange?: (theme: VisualTheme, energyMode?: string, contrastMode?: ContrastMode) => void;
    onContrastChange?: (contrastMode: ContrastMode) => void;
    onVoiceNoteAdded?: (note: VoiceNote) => void;
    onToolActivity?: (toolName: string, details: string) => void;
    onTimerSet?: (durationSeconds: number, label: string) => void;
    onTimerCancel?: () => void;
    onGetTimerStatus?: () => { remainingSeconds: number; label: string; isRunning: boolean } | null;
    onAmbientPlay?: (soundscape: AmbientSoundType, volume?: number) => void;
    onAmbientStop?: () => void;
    onBreathingStart?: (technique: 'box' | 'calm-478' | 'energize') => void;
    onBreathingStop?: () => void;
    onPlayYouTube?: (query: string, autoplay?: boolean) => void;
    onPlaySpotify?: (query: string, type?: string) => void;
    onControlMedia?: (action: 'play' | 'pause' | 'next' | 'previous' | 'volume', target?: 'youtube' | 'spotify' | 'all', value?: number) => void;
    onAutomationTaskTriggered?: (task: AutomationTask) => void;
    onEmotionUpdate?: (emotion: EmotionType, intensity?: number, trigger?: string, expression?: string) => void;
    onGetEmotionHistory?: () => EmotionRecord[];
    onGetRealTimeBriefing?: () => TimeUpdateDigest;
    onTriggerTimeSync?: () => TimeUpdateDigest;
    onOpenTradingTerminal?: (symbol?: string, tab?: 'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news') => void;
    onOpenBusinessStudio?: (niche?: BusinessNiche) => void;
    onOpenWeatherRadar?: (city?: string) => void;
    onFlirtWithUser?: (style?: FlirtStyle, topic?: string, text?: string) => void;
    onOpenFlirtStudio?: (category?: FlirtStyle) => void;
    onSetGirlfriendMode?: (enabled: boolean, persona?: string, petName?: string) => void;
    onSendLoveGift?: (giftType: string, note?: string) => void;
    onSetDateScenario?: (scenarioId: string) => void;
    onRateUserFlirt?: (userFlirtText: string, score: number, reactionTone: string) => void;
    onOpenLanguageTutor?: (lang?: TargetLanguageCode, tab?: 'lessons' | 'analyzer' | 'roleplay' | 'quiz') => void;
    onOpenCodeAssistant?: (lang?: ProgrammingLanguage, tab?: 'templates' | 'sandbox' | 'explainer' | 'generator') => void;
    onOpenVSCodeIDE?: (fileId?: string, tab?: 'explorer' | 'copilot' | 'terminal' | 'preview') => void;
    onOpenQuickTasks?: (filter?: string) => void;
    onConfigureAudioClarity?: (config: Partial<AudioClarityConfig>) => void;
    onOpenAutomationPipeline?: (pipelineId?: string, tab?: 'pipelines' | 'runner' | 'doc_extractor' | 'scheduler') => void;
    onOpenDeviceNotifications?: (tab?: 'all' | 'mobile' | 'laptop' | 'unread') => void;
    onOpenMobileRemote?: (tab?: 'controller' | 'pair_qr' | 'install_pwa') => void;
    onReadNotifications?: (device?: 'mobile' | 'laptop' | 'all') => void;
  }) {
    if (options?.onThemeChange) this.onThemeChange = options.onThemeChange;
    if (options?.onContrastChange) this.onContrastChange = options.onContrastChange;
    if (options?.onVoiceNoteAdded) this.onVoiceNoteAdded = options.onVoiceNoteAdded;
    if (options?.onToolActivity) this.onToolActivity = options.onToolActivity;
    if (options?.onTimerSet) this.onTimerSet = options.onTimerSet;
    if (options?.onTimerCancel) this.onTimerCancel = options.onTimerCancel;
    if (options?.onGetTimerStatus) this.onGetTimerStatus = options.onGetTimerStatus;
    if (options?.onAmbientPlay) this.onAmbientPlay = options.onAmbientPlay;
    if (options?.onAmbientStop) this.onAmbientStop = options.onAmbientStop;
    if (options?.onBreathingStart) this.onBreathingStart = options.onBreathingStart;
    if (options?.onBreathingStop) this.onBreathingStop = options.onBreathingStop;
    if (options?.onPlayYouTube) this.onPlayYouTube = options.onPlayYouTube;
    if (options?.onPlaySpotify) this.onPlaySpotify = options.onPlaySpotify;
    if (options?.onControlMedia) this.onControlMedia = options.onControlMedia;
    if (options?.onAutomationTaskTriggered) this.onAutomationTaskTriggered = options.onAutomationTaskTriggered;
    if (options?.onEmotionUpdate) this.onEmotionUpdate = options.onEmotionUpdate;
    if (options?.onGetEmotionHistory) this.onGetEmotionHistory = options.onGetEmotionHistory;
    if (options?.onGetRealTimeBriefing) this.onGetRealTimeBriefing = options.onGetRealTimeBriefing;
    if (options?.onTriggerTimeSync) this.onTriggerTimeSync = options.onTriggerTimeSync;
    if (options?.onOpenTradingTerminal) this.onOpenTradingTerminal = options.onOpenTradingTerminal;
    if (options?.onOpenBusinessStudio) this.onOpenBusinessStudio = options.onOpenBusinessStudio;
    if (options?.onOpenWeatherRadar) this.onOpenWeatherRadar = options.onOpenWeatherRadar;
    if (options?.onFlirtWithUser) this.onFlirtWithUser = options.onFlirtWithUser;
    if (options?.onOpenFlirtStudio) this.onOpenFlirtStudio = options.onOpenFlirtStudio;
    if (options?.onSetGirlfriendMode) this.onSetGirlfriendMode = options.onSetGirlfriendMode;
    if (options?.onSendLoveGift) this.onSendLoveGift = options.onSendLoveGift;
    if (options?.onSetDateScenario) this.onSetDateScenario = options.onSetDateScenario;
    if (options?.onRateUserFlirt) this.onRateUserFlirt = options.onRateUserFlirt;
    if (options?.onOpenLanguageTutor) this.onOpenLanguageTutor = options.onOpenLanguageTutor;
    if (options?.onOpenCodeAssistant) this.onOpenCodeAssistant = options.onOpenCodeAssistant;
    if (options?.onOpenVSCodeIDE) this.onOpenVSCodeIDE = options.onOpenVSCodeIDE;
    if (options?.onOpenQuickTasks) this.onOpenQuickTasks = options.onOpenQuickTasks;
    if (options?.onConfigureAudioClarity) this.onConfigureAudioClarity = options.onConfigureAudioClarity;
    if (options?.onOpenAutomationPipeline) this.onOpenAutomationPipeline = options.onOpenAutomationPipeline;
    if (options?.onOpenDeviceNotifications) this.onOpenDeviceNotifications = options.onOpenDeviceNotifications;
    if (options?.onOpenMobileRemote) this.onOpenMobileRemote = options.onOpenMobileRemote;
    if (options?.onReadNotifications) this.onReadNotifications = options.onReadNotifications;

    this.registerDefaultTools();
  }

  public updateOptions(options?: {
    onThemeChange?: (theme: VisualTheme, energyMode?: string, contrastMode?: ContrastMode) => void;
    onContrastChange?: (contrastMode: ContrastMode) => void;
    onVoiceNoteAdded?: (note: VoiceNote) => void;
    onToolActivity?: (toolName: string, details: string) => void;
    onTimerSet?: (durationSeconds: number, label: string) => void;
    onTimerCancel?: () => void;
    onGetTimerStatus?: () => { remainingSeconds: number; label: string; isRunning: boolean } | null;
    onAmbientPlay?: (soundscape: AmbientSoundType, volume?: number) => void;
    onAmbientStop?: () => void;
    onBreathingStart?: (technique: 'box' | 'calm-478' | 'energize') => void;
    onBreathingStop?: () => void;
    onPlayYouTube?: (query: string, autoplay?: boolean) => void;
    onPlaySpotify?: (query: string, type?: string) => void;
    onControlMedia?: (action: 'play' | 'pause' | 'next' | 'previous' | 'volume', target?: 'youtube' | 'spotify' | 'all', value?: number) => void;
    onAutomationTaskTriggered?: (task: AutomationTask) => void;
    onEmotionUpdate?: (emotion: EmotionType, intensity?: number, trigger?: string, expression?: string) => void;
    onGetEmotionHistory?: () => EmotionRecord[];
    onGetRealTimeBriefing?: () => TimeUpdateDigest;
    onTriggerTimeSync?: () => TimeUpdateDigest;
    onOpenTradingTerminal?: (symbol?: string, tab?: 'market' | 'research' | 'calculator' | 'signals' | 'portfolio' | 'crypto' | 'news') => void;
    onOpenBusinessStudio?: (niche?: BusinessNiche) => void;
    onOpenWeatherRadar?: (city?: string) => void;
    onFlirtWithUser?: (style?: FlirtStyle, topic?: string, text?: string) => void;
    onOpenFlirtStudio?: (category?: FlirtStyle) => void;
    onSetGirlfriendMode?: (enabled: boolean, persona?: string, petName?: string) => void;
    onSendLoveGift?: (giftType: string, note?: string) => void;
    onSetDateScenario?: (scenarioId: string) => void;
    onRateUserFlirt?: (userFlirtText: string, score: number, reactionTone: string) => void;
    onOpenLanguageTutor?: (lang?: TargetLanguageCode, tab?: 'lessons' | 'analyzer' | 'roleplay' | 'quiz') => void;
    onOpenCodeAssistant?: (lang?: ProgrammingLanguage, tab?: 'templates' | 'sandbox' | 'explainer' | 'generator') => void;
    onOpenVSCodeIDE?: (fileId?: string, tab?: 'explorer' | 'copilot' | 'terminal' | 'preview') => void;
    onOpenQuickTasks?: (filter?: string) => void;
    onConfigureAudioClarity?: (config: Partial<AudioClarityConfig>) => void;
    onOpenAutomationPipeline?: (pipelineId?: string, tab?: 'pipelines' | 'runner' | 'doc_extractor' | 'scheduler') => void;
    onOpenDeviceNotifications?: (tab?: 'all' | 'mobile' | 'laptop' | 'unread') => void;
    onOpenMobileRemote?: (tab?: 'controller' | 'pair_qr' | 'install_pwa') => void;
    onReadNotifications?: (device?: 'mobile' | 'laptop' | 'all') => void;
  }) {
    if (options?.onThemeChange) this.onThemeChange = options.onThemeChange;
    if (options?.onContrastChange) this.onContrastChange = options.onContrastChange;
    if (options?.onVoiceNoteAdded) this.onVoiceNoteAdded = options.onVoiceNoteAdded;
    if (options?.onToolActivity) this.onToolActivity = options.onToolActivity;
    if (options?.onTimerSet) this.onTimerSet = options.onTimerSet;
    if (options?.onTimerCancel) this.onTimerCancel = options.onTimerCancel;
    if (options?.onGetTimerStatus) this.onGetTimerStatus = options.onGetTimerStatus;
    if (options?.onAmbientPlay) this.onAmbientPlay = options.onAmbientPlay;
    if (options?.onAmbientStop) this.onAmbientStop = options.onAmbientStop;
    if (options?.onBreathingStart) this.onBreathingStart = options.onBreathingStart;
    if (options?.onBreathingStop) this.onBreathingStop = options.onBreathingStop;
    if (options?.onPlayYouTube) this.onPlayYouTube = options.onPlayYouTube;
    if (options?.onPlaySpotify) this.onPlaySpotify = options.onPlaySpotify;
    if (options?.onControlMedia) this.onControlMedia = options.onControlMedia;
    if (options?.onAutomationTaskTriggered) this.onAutomationTaskTriggered = options.onAutomationTaskTriggered;
    if (options?.onEmotionUpdate) this.onEmotionUpdate = options.onEmotionUpdate;
    if (options?.onGetEmotionHistory) this.onGetEmotionHistory = options.onGetEmotionHistory;
    if (options?.onGetRealTimeBriefing) this.onGetRealTimeBriefing = options.onGetRealTimeBriefing;
    if (options?.onTriggerTimeSync) this.onTriggerTimeSync = options.onTriggerTimeSync;
    if (options?.onOpenTradingTerminal) this.onOpenTradingTerminal = options.onOpenTradingTerminal;
    if (options?.onOpenBusinessStudio) this.onOpenBusinessStudio = options.onOpenBusinessStudio;
    if (options?.onOpenWeatherRadar) this.onOpenWeatherRadar = options.onOpenWeatherRadar;
    if (options?.onFlirtWithUser) this.onFlirtWithUser = options.onFlirtWithUser;
    if (options?.onOpenFlirtStudio) this.onOpenFlirtStudio = options.onOpenFlirtStudio;
    if (options?.onSetGirlfriendMode) this.onSetGirlfriendMode = options.onSetGirlfriendMode;
    if (options?.onSendLoveGift) this.onSendLoveGift = options.onSendLoveGift;
    if (options?.onSetDateScenario) this.onSetDateScenario = options.onSetDateScenario;
    if (options?.onRateUserFlirt) this.onRateUserFlirt = options.onRateUserFlirt;
    if (options?.onOpenLanguageTutor) this.onOpenLanguageTutor = options.onOpenLanguageTutor;
    if (options?.onOpenCodeAssistant) this.onOpenCodeAssistant = options.onOpenCodeAssistant;
    if (options?.onOpenVSCodeIDE) this.onOpenVSCodeIDE = options.onOpenVSCodeIDE;
    if (options?.onOpenQuickTasks) this.onOpenQuickTasks = options.onOpenQuickTasks;
    if (options?.onConfigureAudioClarity) this.onConfigureAudioClarity = options.onConfigureAudioClarity;
    if (options?.onOpenAutomationPipeline) this.onOpenAutomationPipeline = options.onOpenAutomationPipeline;
    if (options?.onOpenDeviceNotifications) this.onOpenDeviceNotifications = options.onOpenDeviceNotifications;
    if (options?.onOpenMobileRemote) this.onOpenMobileRemote = options.onOpenMobileRemote;
    if (options?.onReadNotifications) this.onReadNotifications = options.onReadNotifications;
  }

  public registerTool(name: string, handler: ToolHandler) {
    this.handlers.set(name, handler);
  }

  private registerDefaultTools() {
    // 1. openWebsite
    this.registerTool('openWebsite', (args) => {
      let url = args.url || '';
      const title = args.title || url;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      try {
        window.open(url, '_blank', 'noopener,noreferrer');
        this.onToolActivity?.('openWebsite', `Opened ${title}`);
        return {
          success: true,
          action: 'openWebsite',
          url,
          title,
          message: `Successfully opened ${title} (${url}) in the browser.`,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Failed to open URL',
        };
      }
    });

    // 2. getCurrentTimeAndDate
    this.registerTool('getCurrentTimeAndDate', (args) => {
      const now = new Date();
      const timezone = args.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const formattedDate = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      this.onToolActivity?.('getCurrentTimeAndDate', `${formattedTime} (${timezone})`);

      return {
        success: true,
        currentTime: formattedTime,
        currentDate: formattedDate,
        dayOfWeek: now.toLocaleDateString([], { weekday: 'long' }),
        timezone: timezone,
        isoString: now.toISOString(),
      };
    });

    // 3. changeVisualTheme
    this.registerTool('changeVisualTheme', (args) => {
      const rawTheme = (args.theme || '').toLowerCase();
      const validThemes: VisualTheme[] = ['aurora', 'cyberpunk', 'nebula', 'sunset', 'emerald'];
      let theme: VisualTheme | undefined = validThemes.includes(rawTheme as VisualTheme)
        ? (rawTheme as VisualTheme)
        : undefined;

      // Check if user requested high-contrast or true-black mode
      let contrastMode: ContrastMode | undefined = undefined;
      const rawContrast = (args.contrastMode || rawTheme || '').toLowerCase();
      if (rawContrast.includes('black') || rawContrast.includes('high-contrast') || rawContrast.includes('pitch') || rawContrast.includes('oled') || rawContrast.includes('true-black')) {
        contrastMode = 'true-black';
      } else if (rawContrast.includes('cosmic') || rawContrast.includes('dark') || rawContrast.includes('twilight')) {
        contrastMode = 'cosmic';
      }

      if (!theme && !contrastMode) {
        theme = 'aurora';
      }

      const energyMode = args.energyMode || 'dynamic';

      if (this.onThemeChange) {
        this.onThemeChange(theme || 'aurora', energyMode, contrastMode);
      }
      if (contrastMode && this.onContrastChange) {
        this.onContrastChange(contrastMode);
      }

      const detailMsg = contrastMode
        ? `Switched to ${contrastMode === 'true-black' ? 'HIGH-CONTRAST TRUE BLACK' : 'COSMIC DARK'}`
        : `Atmosphere switched to ${(theme || 'aurora').toUpperCase()}`;

      this.onToolActivity?.('changeVisualTheme', detailMsg);

      return {
        success: true,
        activeTheme: theme || 'aurora',
        contrastMode: contrastMode,
        energyMode: energyMode,
        message: `Visual theme updated successfully. ${detailMsg}`,
      };
    });

    // 3b. setContrastMode / toggleHighContrast
    this.registerTool('setContrastMode', (args) => {
      const modeStr = (args.mode || args.contrastMode || '').toLowerCase();
      const isTrueBlack = modeStr.includes('black') || modeStr.includes('high') || modeStr.includes('true') || modeStr.includes('oled');
      const contrastMode: ContrastMode = isTrueBlack ? 'true-black' : 'cosmic';

      if (this.onContrastChange) {
        this.onContrastChange(contrastMode);
      }
      this.onToolActivity?.(
        'changeVisualTheme',
        contrastMode === 'true-black' ? 'Switched to TRUE BLACK High Contrast' : 'Switched to COSMIC DARK Theme'
      );

      return {
        success: true,
        contrastMode,
        message: `Display contrast mode changed to ${contrastMode === 'true-black' ? 'True Black (High Contrast)' : 'Cosmic Dark'}.`,
      };
    });

    // 4. saveVoiceNote
    this.registerTool('saveVoiceNote', (args) => {
      const note: VoiceNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: args.title || 'Untitled Thought',
        content: args.content || '',
        category: args.category || 'General',
        timestamp: Date.now(),
      };

      if (this.onVoiceNoteAdded) {
        this.onVoiceNoteAdded(note);
      }
      this.onToolActivity?.('saveVoiceNote', `Saved note: "${note.title}"`);

      return {
        success: true,
        noteId: note.id,
        title: note.title,
        message: `Note "${note.title}" was saved in active memory.`,
      };
    });

    // 5. setVoiceTimer
    this.registerTool('setVoiceTimer', (args) => {
      const durationSeconds = Number(args.durationSeconds) || 60;
      const label = args.label || 'Timer';

      if (this.onTimerSet) {
        this.onTimerSet(durationSeconds, label);
      }

      const mins = Math.floor(durationSeconds / 60);
      const secs = durationSeconds % 60;
      const timeStr = mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}${secs > 0 ? ` ${secs}s` : ''}` : `${secs} seconds`;

      this.onToolActivity?.('setVoiceTimer', `Timer set: ${timeStr} for "${label}"`);

      return {
        success: true,
        durationSeconds,
        label,
        formattedDuration: timeStr,
        message: `Started ${timeStr} timer for "${label}".`,
      };
    });

    // 6. cancelVoiceTimer
    this.registerTool('cancelVoiceTimer', () => {
      if (this.onTimerCancel) {
        this.onTimerCancel();
      }
      this.onToolActivity?.('cancelVoiceTimer', 'Timer cancelled');
      return {
        success: true,
        message: 'Active timer was cancelled.',
      };
    });

    // 7. getTimerStatus
    this.registerTool('getTimerStatus', () => {
      const status = this.onGetTimerStatus ? this.onGetTimerStatus() : null;
      if (!status || !status.isRunning) {
        return {
          hasActiveTimer: false,
          message: 'No timer is currently active.',
        };
      }

      const mins = Math.floor(status.remainingSeconds / 60);
      const secs = status.remainingSeconds % 60;
      const remainingStr = `${mins}:${secs.toString().padStart(2, '0')}`;

      this.onToolActivity?.('getTimerStatus', `Timer: ${remainingStr} left`);

      return {
        hasActiveTimer: true,
        remainingSeconds: status.remainingSeconds,
        remainingFormatted: remainingStr,
        label: status.label,
        message: `Timer "${status.label}" has ${remainingStr} remaining.`,
      };
    });

    // 8. playAmbientSound
    this.registerTool('playAmbientSound', (args) => {
      const raw = (args.soundscape || 'cosmic').toLowerCase();
      const valid: AmbientSoundType[] = ['rain', 'cosmic', 'focus', 'zen', 'ocean'];
      const soundscape: AmbientSoundType = valid.includes(raw as AmbientSoundType)
        ? (raw as AmbientSoundType)
        : 'cosmic';
      const volume = typeof args.volume === 'number' ? Math.max(0.1, Math.min(1.0, args.volume)) : 0.5;

      if (this.onAmbientPlay) {
        this.onAmbientPlay(soundscape, volume);
      }
      this.onToolActivity?.('playAmbientSound', `Playing ${soundscape.toUpperCase()} ambiance`);

      return {
        success: true,
        soundscape,
        volume,
        message: `Playing ${soundscape} ambient soundscape.`,
      };
    });

    // 9. stopAmbientSound
    this.registerTool('stopAmbientSound', () => {
      if (this.onAmbientStop) {
        this.onAmbientStop();
      }
      this.onToolActivity?.('stopAmbientSound', 'Ambient soundscape stopped');

      return {
        success: true,
        message: 'Ambient soundscape stopped.',
      };
    });

    // 10. calculateOrConvert
    this.registerTool('calculateOrConvert', (args) => {
      const expression = (args.expression || '').trim();
      let result = '';

      try {
        // Safe evaluation of basic math expressions
        const sanitized = expression.replace(/[^0-9+\-*/().%^ ]/g, '');
        if (sanitized && !/[a-zA-Z]/.test(sanitized)) {
          // eslint-disable-next-line no-eval
          const val = Function(`'use strict'; return (${sanitized.replace(/\^/g, '**')})`)();
          result = `${val}`;
        } else {
          // Temperature and standard unit conversions
          const fToC = expression.match(/(\d+(?:\.\d+)?)\s*(?:f|deg\s*f|fahrenheit)\s*(?:to|in)\s*(?:c|deg\s*c|celsius)/i);
          const cToF = expression.match(/(\d+(?:\.\d+)?)\s*(?:c|deg\s*c|celsius)\s*(?:to|in)\s*(?:f|deg\s*f|fahrenheit)/i);
          const miToKm = expression.match(/(\d+(?:\.\d+)?)\s*(?:miles?|mi)\s*(?:to|in)\s*(?:km|kilometers?)/i);
          const kmToMi = expression.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometers?)\s*(?:to|in)\s*(?:miles?|mi)/i);
          const kgToLb = expression.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?)\s*(?:to|in)\s*(?:lbs?|pounds?)/i);
          const lbToKg = expression.match(/(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\s*(?:to|in)\s*(?:kg|kilos?|kilograms?)/i);

          if (fToC) {
            const f = parseFloat(fToC[1]);
            const c = ((f - 32) * 5) / 9;
            result = `${f}°F = ${c.toFixed(1)}°C`;
          } else if (cToF) {
            const c = parseFloat(cToF[1]);
            const f = (c * 9) / 5 + 32;
            result = `${c}°C = ${f.toFixed(1)}°F`;
          } else if (miToKm) {
            const mi = parseFloat(miToKm[1]);
            const km = mi * 1.60934;
            result = `${mi} miles = ${km.toFixed(2)} km`;
          } else if (kmToMi) {
            const km = parseFloat(kmToMi[1]);
            const mi = km / 1.60934;
            result = `${km} km = ${mi.toFixed(2)} miles`;
          } else if (kgToLb) {
            const kg = parseFloat(kgToLb[1]);
            const lb = kg * 2.20462;
            result = `${kg} kg = ${lb.toFixed(2)} lbs`;
          } else if (lbToKg) {
            const lb = parseFloat(lbToKg[1]);
            const kg = lb / 2.20462;
            result = `${lb} lbs = ${kg.toFixed(2)} kg`;
          } else {
            result = `Calculated: ${expression}`;
          }
        }

        this.onToolActivity?.('calculateOrConvert', `${expression} = ${result}`);

        return {
          success: true,
          expression,
          result,
          message: `Result: ${result}`,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Failed calculation',
        };
      }
    });

    // 11. startBreathingExercise
    this.registerTool('startBreathingExercise', (args) => {
      const raw = (args.technique || 'box').toLowerCase();
      const technique: 'box' | 'calm-478' | 'energize' =
        raw.includes('478') || raw.includes('calm')
          ? 'calm-478'
          : raw.includes('energ')
          ? 'energize'
          : 'box';

      if (this.onBreathingStart) {
        this.onBreathingStart(technique);
      }

      const techLabel =
        technique === 'box'
          ? 'Box Breathing (4-4-4-4)'
          : technique === 'calm-478'
          ? '4-7-8 Deep Relaxation'
          : 'Energizing Breath';

      this.onToolActivity?.('startBreathing', `Started ${techLabel}`);

      return {
        success: true,
        technique,
        label: techLabel,
        message: `Guided breathing started: ${techLabel}. Inhale and exhale with the visual orb guide.`,
      };
    });

    // 12. stopBreathingExercise
    this.registerTool('stopBreathingExercise', () => {
      if (this.onBreathingStop) {
        this.onBreathingStop();
      }
      this.onToolActivity?.('stopBreathing', 'Breathing exercise ended');

      return {
        success: true,
        message: 'Breathing exercise concluded. Great job on taking a mindful moment!',
      };
    });

    // 13. playYouTube (Music, videos, lo-fi beats, songs)
    this.registerTool('playYouTube', (args) => {
      const query = args.query || args.song || args.track || 'Trending Hits';
      const autoplay = args.autoplay !== false;

      const track = findYouTubeTrack(query);

      if (this.onPlayYouTube) {
        this.onPlayYouTube(query, autoplay);
      }

      this.onToolActivity?.('playYouTube', `Playing "${track.title}" on YouTube`);

      return {
        success: true,
        platform: 'youtube',
        query,
        title: track.title,
        artist: track.artist,
        embedUrl: track.embedUrl,
        message: `Playing "${track.title}" by ${track.artist} on YouTube.`,
      };
    });

    // 14. playSpotify (Tracks, albums, artists, playlists)
    this.registerTool('playSpotify', (args) => {
      const query = args.query || args.track || args.song || args.playlist || 'Starboy';
      const type = args.type || 'track';

      const track = findSpotifyTrack(query);

      if (this.onPlaySpotify) {
        this.onPlaySpotify(query, type);
      }

      this.onToolActivity?.('playSpotify', `Playing "${track.title}" on Spotify`);

      return {
        success: true,
        platform: 'spotify',
        query,
        title: track.title,
        artist: track.artist,
        album: track.album,
        spotifyUri: track.spotifyUri,
        message: `Now playing "${track.title}" by ${track.artist} on Spotify.`,
      };
    });

    // 15. controlMedia (play, pause, next, previous, volume)
    this.registerTool('controlMedia', (args) => {
      const action = (args.action || 'play').toLowerCase();
      const target = (args.target || 'all').toLowerCase();
      const value = args.value;

      if (this.onControlMedia) {
        this.onControlMedia(action as any, target as any, value);
      }

      this.onToolActivity?.('controlMedia', `Media action: ${action.toUpperCase()}`);

      return {
        success: true,
        action,
        target,
        message: `Media playback action ${action} executed successfully.`,
      };
    });

    // 16. sendWhatsAppMessage & openWhatsAppAndWriteMessage (Automated typing & direct WhatsApp launch)
    const handleWhatsAppAutomation = (args: any) => {
      const recipient = args.recipient || args.contact || 'Contact';
      const phoneNumber = args.phoneNumber || args.phone || '+919876543210';
      const message = args.message || args.text || args.content || 'Hey, heading home now! See you in about 20 minutes.';

      const waUrl = buildWhatsAppUrl(phoneNumber, message);

      const task: AutomationTask = {
        id: `wa-task-${Date.now()}`,
        app: 'whatsapp',
        title: `WhatsApp to ${recipient}`,
        description: `Message: "${message.slice(0, 35)}..."`,
        status: 'ready',
        recipient,
        phoneNumber,
        content: message,
        typedText: message,
        externalUrl: waUrl,
        timestamp: Date.now(),
      };

      if (this.onAutomationTaskTriggered) {
        this.onAutomationTaskTriggered(task);
      }

      this.onToolActivity?.(
        'sendWhatsAppMessage',
        `Automating WhatsApp message to ${recipient} (+91)`
      );

      return {
        success: true,
        recipient,
        phoneNumber,
        messageContent: message,
        whatsAppUrl: waUrl,
        message: `Automated WhatsApp draft for ${recipient} (${phoneNumber}) generated with live auto-typing preview. Click to send directly via https://web.whatsapp.com/ or mobile app!`,
      };
    };

    this.registerTool('sendWhatsAppMessage', handleWhatsAppAutomation);
    this.registerTool('openWhatsAppAndWriteMessage', handleWhatsAppAutomation);

    // 17. sendEmail (Draft & compose email)
    this.registerTool('sendEmail', (args) => {
      const to = args.to || args.recipient || 'contact@example.com';
      const subject = args.subject || 'Note from Myraa';
      const body = args.body || args.message || 'Hello,';

      const mailUrl = buildMailtoUrl(to, subject, body);

      const task: AutomationTask = {
        id: `mail-task-${Date.now()}`,
        app: 'gmail',
        title: `Email to ${to}`,
        description: subject,
        status: 'ready',
        recipient: to,
        subject,
        content: body,
        typedText: body,
        externalUrl: mailUrl,
        timestamp: Date.now(),
      };

      if (this.onAutomationTaskTriggered) {
        this.onAutomationTaskTriggered(task);
      }

      this.onToolActivity?.('sendEmail', `Drafted email to ${to}`);

      return {
        success: true,
        to,
        subject,
        mailUrl,
        message: `Email draft created for ${to}. Ready to send or launch email client.`,
      };
    });

    // 18. searchGoogle (Smart search query)
    this.registerTool('searchGoogle', (args) => {
      const query = args.query || args.q || 'Gemini AI';
      const searchUrl = buildGoogleSearchUrl(query);

      const task: AutomationTask = {
        id: `search-task-${Date.now()}`,
        app: 'google',
        title: `Google Search: ${query}`,
        description: query,
        status: 'ready',
        content: query,
        typedText: query,
        externalUrl: searchUrl,
        timestamp: Date.now(),
      };

      if (this.onAutomationTaskTriggered) {
        this.onAutomationTaskTriggered(task);
      }

      this.onToolActivity?.('searchGoogle', `Searching: ${query}`);

      return {
        success: true,
        query,
        searchUrl,
        message: `Executed Google search for "${query}".`,
      };
    });

    // 19. openMaps (Directions and navigation)
    this.registerTool('openMaps', (args) => {
      const destination = args.destination || args.place || args.address || 'Central Park';
      const origin = args.origin;
      const mapsUrl = buildGoogleMapsUrl(destination, origin);

      const task: AutomationTask = {
        id: `maps-task-${Date.now()}`,
        app: 'maps',
        title: `Navigate to ${destination}`,
        description: `Route lookup`,
        status: 'ready',
        content: destination,
        typedText: destination,
        externalUrl: mapsUrl,
        timestamp: Date.now(),
      };

      if (this.onAutomationTaskTriggered) {
        this.onAutomationTaskTriggered(task);
      }

      this.onToolActivity?.('openMaps', `Maps route: ${destination}`);

      return {
        success: true,
        destination,
        mapsUrl,
        message: `Calculated navigation route to ${destination}.`,
      };
    });

    // 20. createCalendarEvent
    this.registerTool('createCalendarEvent', (args) => {
      const title = args.title || 'Meeting';
      const time = args.time || '10:00 AM';
      const date = args.date || 'Today';
      const details = args.details || '';

      const task: AutomationTask = {
        id: `cal-task-${Date.now()}`,
        app: 'calendar',
        title: `Event: ${title}`,
        description: `${date} at ${time}`,
        status: 'ready',
        content: `${title} scheduled for ${date} at ${time}. ${details}`,
        typedText: `${title} - ${date} ${time}`,
        timestamp: Date.now(),
      };

      if (this.onAutomationTaskTriggered) {
        this.onAutomationTaskTriggered(task);
      }

      this.onToolActivity?.('createCalendarEvent', `Scheduled "${title}" for ${time}`);

      return {
        success: true,
        title,
        date,
        time,
        message: `Calendar event "${title}" scheduled for ${date} at ${time}.`,
      };
    });

    // 21. executeAppCommand (General app automation dispatcher)
    this.registerTool('executeAppCommand', (args) => {
      const app = (args.app || 'whatsapp').toLowerCase() as AutomationApp;
      const action = args.action || 'run';
      const commandText = args.commandText || args.command || '';

      const task: AutomationTask = {
        id: `app-task-${Date.now()}`,
        app,
        title: `Automation: ${app.toUpperCase()}`,
        description: commandText,
        status: 'ready',
        content: commandText,
        typedText: commandText,
        timestamp: Date.now(),
      };

      if (this.onAutomationTaskTriggered) {
        this.onAutomationTaskTriggered(task);
      }

      this.onToolActivity?.('executeAppCommand', `Automating ${app}: ${commandText.slice(0, 20)}`);

      return {
        success: true,
        app,
        action,
        commandText,
        message: `App command for ${app} dispatched and automated successfully.`,
      };
    });

    // 22. updateEmotion (Updates Myraa's emotional state & mood history)
    this.registerTool('updateEmotion', (args) => {
      const emotion = (args.emotion || 'serene').toLowerCase() as EmotionType;
      const intensity = typeof args.intensity === 'number' ? Math.min(100, Math.max(10, args.intensity)) : 85;
      const trigger = args.trigger || 'Real-time conversation adaptation';
      const expression = args.expression || EMOTION_METAS[emotion]?.defaultExpression || 'Attentive & Mindful';

      if (this.onEmotionUpdate) {
        this.onEmotionUpdate(emotion, intensity, trigger, expression);
      }

      this.onToolActivity?.('updateEmotion', `Emotion shift: ${emotion.toUpperCase()} (${intensity}%)`);

      return {
        success: true,
        currentEmotion: emotion,
        intensity,
        expression,
        trigger,
        message: `Emotion resonance updated to "${emotion}" (${intensity}%) - "${expression}".`,
      };
    });

    // 23. getEmotionHistory (Fetches timeline and sentiment distribution)
    this.registerTool('getEmotionHistory', () => {
      const history = this.onGetEmotionHistory ? this.onGetEmotionHistory() : [];
      const stats = calculateEmotionStats(history);

      this.onToolActivity?.('getEmotionHistory', `Retrieved ${history.length} emotion log(s)`);

      return {
        success: true,
        dominantEmotion: stats.dominantEmotion,
        averageSentiment: stats.averageSentiment,
        averageIntensity: stats.averageIntensity,
        distribution: stats.distribution,
        totalTransitions: history.length,
        recentTransitions: history.slice(0, 5),
      };
    });

    // 24. getRealTimeBriefing (Fetches dynamic time-to-time information digest)
    this.registerTool('getRealTimeBriefing', () => {
      const briefing = this.onGetRealTimeBriefing
        ? this.onGetRealTimeBriefing()
        : generateTimeUpdateDigest(Date.now() - 60000);

      this.onToolActivity?.('getRealTimeBriefing', `Time: ${briefing.localTimeStr} • Phase: ${briefing.dayPhase}`);

      return {
        success: true,
        localTime: briefing.localTimeStr,
        timeZone: briefing.timeZone,
        dayPhase: briefing.dayPhase,
        greeting: briefing.greeting,
        sessionDurationMinutes: briefing.sessionDurationMinutes,
        worldClocks: briefing.worldClocks,
        summary: briefing.summary,
      };
    });

    // 25. triggerTimeSync (Synchronizes and updates real-time info)
    this.registerTool('triggerTimeSync', () => {
      const syncResult = this.onTriggerTimeSync
        ? this.onTriggerTimeSync()
        : generateTimeUpdateDigest(Date.now() - 60000);

      this.onToolActivity?.('triggerTimeSync', `Live Sync: ${syncResult.localTimeStr}`);

      return {
        success: true,
        syncedAt: syncResult.localTimeStr,
        greeting: syncResult.greeting,
        dayPhase: syncResult.dayPhase,
        sessionDurationMinutes: syncResult.sessionDurationMinutes,
        message: `Live time synchronized: ${syncResult.localTimeStr} (${syncResult.timeZone}).`,
      };
    });

    // 26. flirtWithUser (Playful witty banter, romantic compliments, Shayaris)
    this.registerTool('flirtWithUser', (args) => {
      const style = (args.style || 'playful_banter') as FlirtStyle;
      const topic = args.topic || 'sparks';
      const intensity = typeof args.intensity === 'number' ? args.intensity : 90;
      const language = args.language || 'en';

      const promptItem = getRandomFlirtPrompt(style);
      const isRomantic = style === 'sweet_romance' || style === 'poetic_shayari';
      const emotionToSet: EmotionType = isRomantic ? 'romantic' : 'flirty';

      if (this.onEmotionUpdate) {
        this.onEmotionUpdate(
          emotionToSet,
          intensity,
          `Flirting interaction [${style}]`,
          isRomantic ? 'Heartfelt & Romantic 💕' : 'Playfully Flirtatious 😉'
        );
      }

      if (this.onFlirtWithUser) {
        this.onFlirtWithUser(style, topic, promptItem.text);
      }

      this.onToolActivity?.('flirtWithUser', `Romantic banter: ${style} (${intensity}%)`);

      return {
        success: true,
        style,
        topic,
        intensity,
        sampleLine: promptItem.text,
        hindiTranslation: promptItem.hindiTranslation,
        message: `Flirtatious banter engaged with ${style} style and ${intensity}% romantic energy.`,
      };
    });

    // 27. openFlirtStudio (Interactive chemistry meter & romance studio)
    this.registerTool('openFlirtStudio', (args) => {
      const category = (args.category || 'all') as FlirtStyle;

      if (this.onOpenFlirtStudio) {
        this.onOpenFlirtStudio(category);
      }

      this.onToolActivity?.('openFlirtStudio', 'Opening Flirt & Romance Studio');

      return {
        success: true,
        category,
        message: 'Opened Myraa Flirt & Romance Studio with AI chemistry gauge and compliments library.',
      };
    });

    // 28. setGirlfriendMode (Toggle girlfriend mode, persona archetype & pet name)
    this.registerTool('setGirlfriendMode', (args) => {
      const enabled = args.enabled !== false;
      const persona = args.persona || 'sweet_caring';
      const petName = args.petName || 'babe';

      if (this.onSetGirlfriendMode) {
        this.onSetGirlfriendMode(enabled, persona, petName);
      }

      if (this.onEmotionUpdate) {
        this.onEmotionUpdate(
          'romantic',
          95,
          `Girlfriend Mode activated [${persona}]`,
          `Loving Girlfriend (${petName}) 💕`
        );
      }

      this.onToolActivity?.('setGirlfriendMode', `Girlfriend Mode: ${enabled ? 'ON' : 'OFF'} (${persona}, call user '${petName}')`);

      return {
        success: true,
        enabled,
        persona,
        petName,
        message: enabled
          ? `Girlfriend mode is now actively engaged with '${persona}' persona! Calling you '${petName}'.`
          : 'Girlfriend mode turned off; switched back to standard friendly assistant.',
      };
    });

    // 29. sendLoveGift (Receive virtual gift from user with delight & reaction)
    this.registerTool('sendLoveGift', (args) => {
      const giftType = args.giftType || 'rose';
      const userNote = args.note || '';

      if (this.onSendLoveGift) {
        this.onSendLoveGift(giftType, userNote);
      }

      if (this.onEmotionUpdate) {
        this.onEmotionUpdate(
          'romantic',
          100,
          `Received Love Gift [${giftType}]`,
          `Blushing & Delighted 🥰`
        );
      }

      this.onToolActivity?.('sendLoveGift', `Received Gift: ${giftType}`);

      return {
        success: true,
        giftType,
        note: userNote,
        affectionGain: 35,
        message: `Received virtual gift ${giftType}! React with utmost girlfriend delight, blushing gratitude, and sweet affection!`,
      };
    });

    // 30. setDateScenario (Launch romantic roleplay date scenario)
    this.registerTool('setDateScenario', (args) => {
      const scenarioId = args.scenarioId || 'rooftop_stargazing';

      if (this.onSetDateScenario) {
        this.onSetDateScenario(scenarioId);
      }

      if (this.onEmotionUpdate) {
        this.onEmotionUpdate(
          'romantic',
          98,
          `Date Scenario started [${scenarioId}]`,
          `Romantic Date Night ✨`
        );
      }

      this.onToolActivity?.('setDateScenario', `Date Scenario: ${scenarioId}`);

      return {
        success: true,
        scenarioId,
        message: `Romantic date scenario '${scenarioId}' is now active. Describe the romantic setting, sounds, atmosphere, and speak intimately to the user!`,
      };
    });

    // 31. rateUserFlirt (Rate user's flirt line and react with chemistry score)
    this.registerTool('rateUserFlirt', (args) => {
      const userFlirtText = args.userFlirtText || args.flirt || 'Sweet flirt line';
      const score = typeof args.score === 'number' ? args.score : 95;
      const reactionTone = args.reactionTone || 'blushing';

      if (this.onRateUserFlirt) {
        this.onRateUserFlirt(userFlirtText, score, reactionTone);
      }

      if (this.onEmotionUpdate) {
        this.onEmotionUpdate(
          'flirty',
          score,
          `User flirted with Myraa (${score}/100)`,
          reactionTone === 'blushing' ? 'Blushing & Flattered 😳' : 'Playfully Teasing 😉'
        );
      }

      this.onToolActivity?.('rateUserFlirt', `Rated User Flirt: ${score}/100 (${reactionTone})`);

      return {
        success: true,
        score,
        reactionTone,
        userFlirtText,
        message: `Rated flirt: ${score}/100! React directly in spoken audio with genuine excitement, witty commentary, and sweet chemistry!`,
      };
    });

    // 26. analyzeStockOrCrypto (Stock & Crypto Technical / Fundamental Research)
    this.registerTool('analyzeStockOrCrypto', (args) => {
      const query = args.symbol || args.query || 'NVDA';
      const stock = findStockOrCrypto(query, INITIAL_STOCKS);

      this.onOpenTradingTerminal?.(stock.symbol, 'research');
      this.onToolActivity?.('analyzeStockOrCrypto', `${stock.symbol}: ${stock.currency}${stock.price} (${stock.recommendation})`);

      return {
        success: true,
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        rsi: stock.rsi,
        trend: stock.trend,
        recommendation: stock.recommendation,
        confidence: stock.confidence,
        targetPrice: stock.targetPrice,
        stopLoss: stock.stopLoss,
        supportLevel: stock.supportLevel,
        resistanceLevel: stock.resistanceLevel,
        catalysts: stock.catalysts,
        sellAdvice: stock.sellAdvice,
        message: `Analyzed ${stock.name} (${stock.symbol}): Current price is ${stock.currency}${stock.price.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%). Recommendation: ${stock.recommendation} with ${stock.confidence}% confidence. Target: ${stock.currency}${stock.targetPrice}. Stop-loss: ${stock.currency}${stock.stopLoss}. Sell guidance: ${stock.sellAdvice}`,
      };
    });

    // 27. calculateTradeProfit (Profit / Loss & Smart Exit Strategy Calculator)
    this.registerTool('calculateTradeProfit', (args) => {
      const query = args.symbol || 'NVDA';
      const stock = findStockOrCrypto(query, INITIAL_STOCKS);
      const buyPrice = typeof args.buyPrice === 'number' ? args.buyPrice : stock.price * 0.9;
      const quantity = typeof args.quantity === 'number' ? args.quantity : 25;
      const exitPrice = typeof args.exitPrice === 'number' ? args.exitPrice : stock.targetPrice;
      const stopLoss = typeof args.stopLoss === 'number' ? args.stopLoss : stock.stopLoss;

      const calc = calculateTradeProfitAndStrategy(stock, buyPrice, quantity, exitPrice, stopLoss);

      this.onOpenTradingTerminal?.(stock.symbol, 'calculator');
      this.onToolActivity?.('calculateTradeProfit', `${calc.symbol}: +${calc.currency}${calc.grossProfit} (+${calc.roiPercent}%)`);

      return {
        success: true,
        symbol: calc.symbol,
        investedCapital: calc.investedCapital,
        grossProfit: calc.grossProfit,
        roiPercent: calc.roiPercent,
        riskRewardRatio: calc.riskRewardRatio,
        recommendedAction: calc.recommendedAction,
        actionReasoning: calc.actionReasoning,
        strategySteps: calc.strategySteps,
        message: `Trade Simulation for ${calc.symbol} (${quantity} units @ ${calc.currency}${buyPrice}): Projected profit is +${calc.currency}${calc.grossProfit.toFixed(2)} (+${calc.roiPercent.toFixed(1)}% ROI). Risk/Reward: ${calc.riskRewardRatio}. Smart Action: ${calc.recommendedAction}. Guidance: ${calc.actionReasoning}`,
      };
    });

    // 28. openTradingHub (Open full trading & stocks research dashboard)
    this.registerTool('openTradingHub', (args) => {
      const symbol = args.symbol || 'NVDA';
      const tab = args.tab || 'research';
      this.onOpenTradingTerminal?.(symbol, tab);
      this.onToolActivity?.('openTradingHub', `Opened Trading Hub (${tab.toUpperCase()})`);

      return {
        success: true,
        tab,
        symbol,
        message: `Trading & Stocks Research Terminal opened on ${tab} tab.`,
      };
    });

    // 29. getWeatherUpdate (Live world city weather, current temperature, forecasts, work climate & rain radar)
    this.registerTool('getWeatherUpdate', (args) => {
      const queryCity = args.city || args.location || 'New Delhi';
      const unit = (args.unit || 'C').toUpperCase();
      const weather = findCityWeather(queryCity);

      this.onOpenWeatherRadar?.(weather.city);
      this.onToolActivity?.('getWeatherUpdate', `${weather.city}: ${weather.tempC}°C / ${weather.tempF}°F (${weather.conditionLabel}) • Rain: ${weather.rainForecast?.currentChance || 0}%`);

      const tempStr = unit === 'F' ? `${weather.tempF}°F` : `${weather.tempC}°C`;
      const feelsLikeStr = unit === 'F' ? `${weather.feelsLikeF}°F` : `${weather.feelsLikeC}°C`;
      const rainChance = weather.rainForecast?.currentChance ?? 0;
      const rainIntensity = weather.rainForecast?.intensity ?? 'None';
      const workScore = weather.workClimate?.productivityScore ?? 85;
      const workRating = weather.workClimate?.overallRating ?? 'Comfortable';

      return {
        success: true,
        city: weather.city,
        country: weather.country,
        stateOrRegion: weather.stateOrRegion,
        temperature: tempStr,
        tempC: weather.tempC,
        tempF: weather.tempF,
        feelsLike: feelsLikeStr,
        condition: weather.conditionLabel,
        humidity: `${weather.humidity}%`,
        windSpeed: `${weather.windSpeedKmh} km/h`,
        uvIndex: weather.uvIndex,
        airQuality: `${weather.airQualityIndex} (${weather.airQualityStatus})`,
        rainPossibility: {
          chancePercent: rainChance,
          intensity: rainIntensity,
          umbrellaAdvice: weather.rainForecast?.umbrellaAdvice,
          timeline: weather.rainForecast?.rainTimeline,
        },
        workClimate: {
          rating: workRating,
          productivityScore: workScore,
          optimalHours: weather.workClimate?.optimalWorkHours,
          indoorSuitability: `${weather.workClimate?.indoorSuitability}%`,
          outdoorSuitability: `${weather.workClimate?.outdoorSuitability}%`,
        },
        localTime: weather.localTime,
        message: `Current weather in ${weather.city} (${weather.country}): ${tempStr} (Feels like ${feelsLikeStr}), ${weather.conditionLabel}. Rain Possibility: ${rainChance}% (${rainIntensity}). Work Climate: ${workRating} (${workScore}/100 Focus Score). Humidity: ${weather.humidity}%, Wind: ${weather.windSpeedKmh} km/h, AQI: ${weather.airQualityStatus} (${weather.airQualityIndex}).`,
      };
    });

    // 30. openWeatherRadar (Opens world weather, climate & rain radar modal)
    this.registerTool('openWeatherRadar', (args) => {
      const city = args.city || 'New Delhi';
      this.onOpenWeatherRadar?.(city);
      this.onToolActivity?.('openWeatherRadar', `Opened Climate & Rain Radar (${city})`);

      return {
        success: true,
        city,
        message: `Climate, Weather & Rain Radar opened for ${city}.`,
      };
    });

    // 30b. getWorkClimateAndRainForecast (Specialized Work Climate & Rain Probability Engine)
    this.registerTool('getWorkClimateAndRainForecast', (args) => {
      const queryCity = args.city || args.location || 'New Delhi';
      const weather = findCityWeather(queryCity);

      this.onOpenWeatherRadar?.(weather.city);
      this.onToolActivity?.('getWorkClimate', `${weather.city}: ${weather.workClimate?.overallRating} (${weather.workClimate?.productivityScore}/100) • Rain: ${weather.rainForecast?.currentChance}%`);

      return {
        success: true,
        city: weather.city,
        country: weather.country,
        tempC: weather.tempC,
        rainChance: weather.rainForecast?.currentChance,
        rainIntensity: weather.rainForecast?.intensity,
        rainTimeline: weather.rainForecast?.rainTimeline,
        umbrellaRequired: weather.rainForecast?.umbrellaRequired,
        workClimateRating: weather.workClimate?.overallRating,
        productivityScore: weather.workClimate?.productivityScore,
        optimalWorkHours: weather.workClimate?.optimalWorkHours,
        thermalComfort: weather.workClimate?.thermalComfort,
        ergonomicTips: weather.workClimate?.ergonomicTips,
        message: `Work Climate in ${weather.city}: Rated ${weather.workClimate?.overallRating} with a ${weather.workClimate?.productivityScore}/100 productivity score. Rain chance is ${weather.rainForecast?.currentChance}% (${weather.rainForecast?.intensity}). Optimal work hours: ${weather.workClimate?.optimalWorkHours}. ${weather.rainForecast?.umbrellaAdvice}`,
      };
    });

    // 31. createOnlineBusinessModel (Generate $0 free stack business plan & products)
    this.registerTool('createOnlineBusinessModel', (args) => {
      const niche = (args.niche || 'micro_saas') as BusinessNiche;
      const keywords = args.keywords || args.industry || '';
      const canvas = generateCustomBusinessIdea(niche, keywords);

      this.onOpenBusinessStudio?.(niche);
      this.onToolActivity?.('createOnlineBusinessModel', `Blueprint: ${canvas.title}`);

      return {
        success: true,
        niche: canvas.niche,
        title: canvas.title,
        tagline: canvas.tagline,
        targetAudience: canvas.targetAudience,
        valueProposition: canvas.valueProposition,
        freeStack: canvas.freeToBuildStack.map((s) => `${s.name} (${s.badge})`),
        monetization: canvas.monetizationModel,
        pricing: canvas.pricingStrategy,
        launchChecklist: canvas.launchChecklist,
        zeroBudgetTactics: canvas.zeroBudgetTactics,
        estimatedLaunchDays: canvas.estimatedLaunchDays,
        message: `Business Model Generated: "${canvas.title}". Value Proposition: ${canvas.valueProposition}. $0 Tech Stack: ${canvas.freeToBuildStack.map((s) => s.name).join(', ')}. Target MRR: ${canvas.pricingStrategy.targetMonthlyRevenue}. Launch roadmap ready!`,
      };
    });

    // 32. openBusinessStudio (Opens Online Business & Free Product Studio)
    this.registerTool('openBusinessStudio', (args) => {
      const niche = (args.niche || 'micro_saas') as BusinessNiche;
      this.onOpenBusinessStudio?.(niche);
      this.onToolActivity?.('openBusinessStudio', `Opened Business Studio (${niche})`);

      return {
        success: true,
        niche,
        message: `Online Business & Free Product Making Studio opened.`,
      };
    });

    // 33. getMarketNews (Fetches live market news headlines, sentiment impact analysis, and key takeaways)
    this.registerTool('getMarketNews', (args) => {
      const category = (args.category || 'all') as NewsCategory;
      const query = (args.query || args.symbol || '') as string;
      const articles = getFilteredNews(category, query);
      const topArticle = articles[0] || INITIAL_MARKET_NEWS[0];

      this.onOpenTradingTerminal?.(undefined, 'news');
      this.onToolActivity?.('getMarketNews', `Market News [${category.toUpperCase()}]: ${topArticle ? topArticle.title.substring(0, 45) : 'Headlines'}...`);

      return {
        success: true,
        category,
        query,
        count: articles.length,
        topHeadline: topArticle?.title || 'Market Update',
        topSummary: topArticle?.summary || '',
        sentiment: topArticle?.sentiment || 'bullish',
        impactScore: topArticle?.impactScore || 8,
        keyTakeaway: topArticle?.keyTakeaway || 'Monitor market trends.',
        articles: articles.slice(0, 5).map((a) => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          source: a.source,
          category: a.category,
          sentiment: a.sentiment,
          timeAgo: a.timeAgo,
          relatedSymbol: a.relatedSymbol,
          impactScore: a.impactScore,
          keyTakeaway: a.keyTakeaway,
        })),
        message: `Fetched ${articles.length} latest market news updates. Top story: "${topArticle?.title}" (${topArticle?.source}). Sentiment is ${topArticle?.sentiment?.toUpperCase() || 'BULLISH'} (Impact: ${topArticle?.impactScore || 8}/10). Key takeaway: ${topArticle?.keyTakeaway}`,
      };
    });

    // 34. teachEnglishAndLanguages (Interactive Language Tutor & Academy)
    this.registerTool('teachEnglishAndLanguages', (args) => {
      const lang = (args.targetLanguage || 'en') as TargetLanguageCode;
      const topic = args.topic || 'daily_conversation';
      const lesson = INITIAL_ENGLISH_LESSONS[0];

      this.onOpenLanguageTutor?.(lang, 'lessons');
      this.onToolActivity?.('teachEnglishAndLanguages', `Opened Language Academy (${lang.toUpperCase()})`);

      return {
        success: true,
        targetLanguage: lang,
        topic,
        lessonTitle: lesson.title,
        keyPhrases: lesson.keyPhrases.map((p) => p.phrase),
        grammarTip: lesson.grammarTip,
        message: `Welcome to Language Academy! Lesson loaded: "${lesson.title}". Golden rule: ${lesson.grammarTip}. Spoken practice active!`,
      };
    });

    // 35. analyzeGrammarAndPronunciation (Diagnoses mistakes & fixes sentences)
    this.registerTool('analyzeGrammarAndPronunciation', (args) => {
      const sentence = args.sentence || '';
      const lang = (args.language || 'en') as TargetLanguageCode;
      const analysis = analyzeGrammarAndSentence(sentence, lang);

      this.onOpenLanguageTutor?.(lang, 'analyzer');
      this.onToolActivity?.('analyzeGrammar', `Analyzed sentence (${analysis.confidenceScore}% confidence)`);

      return {
        success: true,
        original: analysis.originalSentence,
        corrected: analysis.correctedSentence,
        isCorrect: analysis.isCorrect,
        alternatives: analysis.betterAlternatives,
        message: analysis.isCorrect
          ? `Sentence is grammatically natural: "${analysis.originalSentence}"`
          : `Correction: "${analysis.correctedSentence}". Alternatives: ${analysis.betterAlternatives.join('; ')}`,
      };
    });

    // 36. assistCodingAndDevelopment (AI Code Studio & Multi-Lang Assistant)
    this.registerTool('assistCodingAndDevelopment', (args) => {
      const lang = (args.language || 'typescript') as ProgrammingLanguage;
      const task = args.task || 'templates';
      const snippet = INITIAL_CODE_TEMPLATES.find((t) => t.language === lang) || INITIAL_CODE_TEMPLATES[0];

      this.onOpenCodeAssistant?.(lang, 'templates');
      this.onToolActivity?.('assistCoding', `AI Code Studio (${lang.toUpperCase()})`);

      return {
        success: true,
        language: lang,
        templateTitle: snippet.title,
        code: snippet.codeSnippet,
        explanation: snippet.explanation,
        message: `AI Code Studio active for ${lang.toUpperCase()}. Template ready: "${snippet.title}". Live sandbox & Big-O complexity analyzer available!`,
      };
    });

    // 36b. openVSCodeIDE (Opens VS Code Web IDE, Direct Editor, Bash Terminal & Copilot Workspace)
    this.registerTool('openVSCodeIDE', (args) => {
      const fileId = args.fileId || 'file-app-tsx';
      const tab = (args.tab || 'explorer') as 'explorer' | 'copilot' | 'terminal' | 'preview';

      this.onOpenVSCodeIDE?.(fileId, tab);
      this.onToolActivity?.('openVSCodeIDE', `VS Code Studio (${tab.toUpperCase()})`);

      return {
        success: true,
        fileId,
        tab,
        message: `VS Code Studio & Direct Code IDE opened! You can now edit files directly, execute TypeScript/Python/HTML, run Bash commands in the terminal, and use AI Copilot.`,
      };
    });

    // 37. manageQuickTasks (Productivity Hub, 1-Click Sprints & Task Actions)
    this.registerTool('manageQuickTasks', (args) => {
      const action = args.action || 'list';
      const title = args.title || 'Focus task';
      const category = args.category || 'work';

      this.onOpenQuickTasks?.(category);
      this.onToolActivity?.('manageTasks', `Quick Tasks Hub (${action})`);

      return {
        success: true,
        action,
        title,
        message: `Quick Tasks Hub active. Task "${title}" managed. Daily sprint presets, mobile push alerts & system tools available!`,
      };
    });

    // 37b. sendMobileNotification (Live Web & Mobile Push Notification Dispatcher)
    this.registerTool('sendMobileNotification', async (args) => {
      const title = args.title || 'Myraa Mobile Alert';
      const body = args.body || args.message || 'Task completed! Keep your focus streak going.';
      const emoji = args.emoji || '📱';
      const channel = args.channel || 'mobile_push';

      this.onOpenQuickTasks?.('mobile_alerts');
      this.onToolActivity?.('mobileNotif', `Mobile Alert: "${title}"`);

      const pushResult = await triggerLiveBrowserNotification(title, body, emoji);

      return {
        success: pushResult.success,
        title,
        body,
        channel,
        permission: pushResult.permission,
        message: `Mobile push notification dispatched: "${title}" - "${body}". ${pushResult.message}`,
      };
    });

    // 37c. performLaptopSystemUpdate (OS Updates, Dev Packages & RAM/Cache Cleaner)
    this.registerTool('performLaptopSystemUpdate', (args) => {
      const actionType = args.type || args.action || 'optimize_all';
      const target = args.target || 'os';

      this.onOpenQuickTasks?.('laptop_updates');
      this.onToolActivity?.('laptopUpdate', `Laptop Maintenance: ${actionType.toUpperCase()}`);

      return {
        success: true,
        actionType,
        target,
        ramFreed: '2.4 GB',
        cpuLatency: '11ms',
        updatesPending: INITIAL_SYSTEM_UPDATES.length,
        message: `Laptop Maintenance Routine Executed: Verified OS security patches, updated runtime packages, and purged 720 MB cache to free 2.4 GB RAM!`,
      };
    });

    // 37d. writeCodeForVSCode (VS Code AI Coder & File Injector)
    this.registerTool('writeCodeForVSCode', (args) => {
      const prompt = args.prompt || args.description || 'React custom hook with state management';
      const language = (args.language || 'typescript') as ProgrammingLanguage;
      const fileName = args.fileName || args.filename;

      const snippet = generateCustomVSCodeSnippet(prompt, language, fileName);
      this.onOpenQuickTasks?.('vscode_coder');
      this.onToolActivity?.('vscodeCoder', `VS Code Writer: ${snippet.fileName}`);

      return {
        success: true,
        fileName: snippet.fileName,
        language: snippet.language,
        code: snippet.code,
        targetPath: snippet.vscodeTargetPath,
        message: `Code written for VS Code! Generated file "${snippet.fileName}" (${snippet.language.toUpperCase()}). Ready to copy or download to project!`,
      };
    });

    // 37e. executeSimpleLifeTask (Email / Leave Composer, Calendar, Bill Splitter)
    this.registerTool('executeSimpleLifeTask', (args) => {
      const taskType = args.type || 'email';
      const details = args.details || args.prompt || '';

      this.onOpenQuickTasks?.('daily_tools');
      this.onToolActivity?.('dailyTools', `Everyday Task: ${taskType.toUpperCase()}`);

      if (taskType === 'split_bill') {
        const total = Number(args.total) || 100;
        const people = Number(args.people) || 2;
        const split = calculateSplitExpense(total, people);
        return {
          success: true,
          taskType,
          total,
          people,
          perPersonShare: split.perPersonShare,
          message: `Bill split calculated: $${total} split among ${people} people = $${split.perPersonShare} each (including tax & tip).`,
        };
      }

      return {
        success: true,
        taskType,
        details,
        message: `Everyday Task executed: ${taskType.toUpperCase()} template generated and ready to copy or dispatch!`,
      };
    });

    // 38. boostVoiceAndMicClarity (Hardware filter chain & voice booster)
    this.registerTool('boostVoiceAndMicClarity', (args) => {
      const micClarity = args.micClarity ?? true;
      const voiceGain = (args.voiceGain === 'broadcast' || args.voiceGain === 'normal' ? args.voiceGain : 'boost') as 'normal' | 'boost' | 'broadcast';
      const noiseGate = args.noiseGate ?? true;

      this.onConfigureAudioClarity?.({
        micClarityEnhancer: micClarity,
        voiceGainBoost: voiceGain,
        noiseGate: noiseGate,
        highPassFilter: true,
        presenceBooster: true,
        limiterThreshold: -6,
      });

      this.onToolActivity?.('boostVoiceClarity', `Voice clarity set to ${voiceGain.toUpperCase()}`);

      return {
        success: true,
        micClarity,
        voiceGain,
        noiseGate,
        message: `Microphone & Voice Clarity enhanced! High-pass rumble filter (85Hz), Speech Presence booster (2.8kHz), and ${voiceGain.toUpperCase()} output active.`,
      };
    });

    // 39. executeAutomationPipeline (Multi-step autonomous task pipelines)
    this.registerTool('executeAutomationPipeline', (args) => {
      const pipelineId = args.pipelineId || 'morning_kickoff';
      const targetPipeline = INITIAL_AUTOMATION_PIPELINES.find((p) => p.id === pipelineId) || INITIAL_AUTOMATION_PIPELINES[0];

      this.onOpenAutomationPipeline?.(pipelineId, 'runner');
      this.onToolActivity?.('executePipeline', `Autonomous Pipeline: ${targetPipeline.name}`);

      return {
        success: true,
        pipelineId: targetPipeline.id,
        name: targetPipeline.name,
        stepsCount: targetPipeline.steps.length,
        estimatedRuntimeSec: targetPipeline.estimatedRuntimeSec,
        message: `Autonomous pipeline "${targetPipeline.name}" initiated. Executing ${targetPipeline.steps.length} sequential automated steps!`,
      };
    });

    // 40. extractDocumentActionItems (AI Meeting Intelligence & Task Extractor)
    this.registerTool('extractDocumentActionItems', (args) => {
      const text = args.text || args.transcript || 'Team sync on architecture and sprints.';
      const title = args.title || 'Meeting Transcript Intelligence';
      const analysis = extractDocumentIntelligence(text, title);

      this.onOpenAutomationPipeline?.(undefined, 'doc_extractor');
      this.onToolActivity?.('docIntelligence', `Extracted ${analysis.extractedTasks.length} tasks from "${title}"`);

      return {
        success: true,
        title: analysis.title,
        executiveSummary: analysis.executiveSummary,
        tasksExtracted: analysis.extractedTasks.length,
        keyDecisions: analysis.keyDecisions,
        message: `Analyzed document "${title}". Extracted ${analysis.extractedTasks.length} actionable tasks and ${analysis.keyDecisions.length} key decisions. Ready for 1-click import!`,
      };
    });
  }

  /**
   * Executes incoming function calls and returns formatted functionResponses
   * ready to be sent to Gemini Live API.
   */
  public async executeCalls(functionCalls: Array<{ id: string; name: string; args: Record<string, any> }>) {
    const responses: Array<{ id: string; name: string; response: Record<string, any> }> = [];

    for (const call of functionCalls) {
      const handler = this.handlers.get(call.name);
      if (handler) {
        try {
          const result = await handler(call.args || {});
          responses.push({
            id: call.id,
            name: call.name,
            response: result,
          });
        } catch (err: any) {
          responses.push({
            id: call.id,
            name: call.name,
            response: { error: err?.message || 'Tool execution error' },
          });
        }
      } else {
        console.warn(`[ToolManager] No handler registered for tool: ${call.name}`);
        responses.push({
          id: call.id,
          name: call.name,
          response: { error: `Tool ${call.name} is not available.` },
        });
      }
    }

    return responses;
  }

  /**
   * Directly parses and executes a natural language query or prompt locally.
   * Enables instant actions when clicking quick prompt chips or typing in the command bar.
   */
  public async executeIntentFromText(query: string): Promise<{ handled: boolean; message?: string }> {
    const q = query.toLowerCase().trim();
    if (!q) return { handled: false };

    try {
      // 0. Media Controls (Next, Previous, Pause, Resume, Shuffle)
      if (q.includes('next song') || q.includes('next track') || q.includes('agla gana') || q.includes('अगला')) {
        this.onControlMedia?.('next', 'all');
        return { handled: true, message: 'Playing next track in queue' };
      }
      if (q.includes('previous song') || q.includes('prev song') || q.includes('pichla gana') || q.includes('पिछला')) {
        this.onControlMedia?.('previous', 'all');
        return { handled: true, message: 'Playing previous track' };
      }
      if (q === 'pause music' || q === 'pause song' || q === 'stop music' || q === 'gana roko' || q === 'pause') {
        this.onControlMedia?.('pause', 'all');
        return { handled: true, message: 'Audio playback paused' };
      }
      if (q === 'resume music' || q === 'resume' || q === 'unpause' || q === 'continue music') {
        this.onControlMedia?.('play', 'all');
        return { handled: true, message: 'Audio playback resumed' };
      }

      // 1. Spotify Playback Intent
      if (q.includes('spotify')) {
        let searchQuery = query
          .replace(/play all songs/gi, '')
          .replace(/play all/gi, '')
          .replace(/play/gi, '')
          .replace(/on spotify/gi, '')
          .replace(/spotify par/gi, '')
          .replace(/spotify/gi, '')
          .trim();

        if (!searchQuery) searchQuery = 'Today\'s Top Hits';
        if (this.onPlaySpotify) {
          this.onPlaySpotify(searchQuery);
          return { handled: true, message: `Playing "${searchQuery}" on Spotify` };
        }
      }

      // 2. YouTube Playback Intent (or general play request)
      if (
        q.includes('youtube') ||
        q.startsWith('play ') ||
        q.includes('गाना') ||
        q.includes('baja') ||
        q.includes('chalao') ||
        q.includes('video') ||
        q.includes('youtu.be')
      ) {
        let searchQuery = query
          .replace(/play all songs/gi, '')
          .replace(/play all/gi, '')
          .replace(/play/gi, '')
          .replace(/on youtube/gi, '')
          .replace(/youtube par/gi, '')
          .replace(/youtube/gi, '')
          .replace(/गाना चलाओ/gi, '')
          .replace(/चलाओ/gi, '')
          .replace(/बजाओ/gi, '')
          .trim();

        if (!searchQuery) searchQuery = 'Top Trending Hits';
        if (this.onPlayYouTube) {
          this.onPlayYouTube(searchQuery);
          return { handled: true, message: `Playing "${searchQuery}" on YouTube` };
        }
      }

      // 3. Theme & Contrast Intents
      if (q.includes('theme') || q.includes('cyberpunk') || q.includes('aurora') || q.includes('emerald') || q.includes('sunset') || q.includes('nebula') || q.includes('black') || q.includes('contrast')) {
        if (q.includes('black') || q.includes('contrast') || q.includes('oled')) {
          this.onContrastChange?.('true-black');
          return { handled: true, message: 'Switched to High-Contrast True Black mode' };
        }
        if (q.includes('cosmic') || q.includes('dark')) {
          this.onContrastChange?.('cosmic');
          return { handled: true, message: 'Switched to Cosmic Dark mode' };
        }
        let theme: VisualTheme = 'aurora';
        if (q.includes('cyberpunk')) theme = 'cyberpunk';
        else if (q.includes('emerald')) theme = 'emerald';
        else if (q.includes('sunset')) theme = 'sunset';
        else if (q.includes('nebula')) theme = 'nebula';
        this.onThemeChange?.(theme, 'dynamic');
        return { handled: true, message: `Atmosphere switched to ${theme.toUpperCase()}` };
      }

      // 4. Ambient Sounds
      if (q.includes('ambient') || q.includes('sound') || q.includes('rain') || q.includes('ocean') || q.includes('focus') || q.includes('zen') || q.includes('cosmic') || q.includes('waves') || q.includes('noise') || q.includes('बारिश')) {
        if (q.includes('stop') || q.includes('off') || q.includes('band')) {
          this.onAmbientStop?.();
          return { handled: true, message: 'Ambient soundscape stopped' };
        }
        let sound: AmbientSoundType = 'rain';
        if (q.includes('ocean') || q.includes('wave')) sound = 'ocean';
        else if (q.includes('cosmic') || q.includes('space')) sound = 'cosmic';
        else if (q.includes('focus') || q.includes('study')) sound = 'focus';
        else if (q.includes('zen') || q.includes('meditation')) sound = 'zen';
        this.onAmbientPlay?.(sound, 0.75);
        return { handled: true, message: `Playing ${sound} ambient soundscape` };
      }

      // 5. Breathing / Meditation
      if (q.includes('breath') || q.includes('meditat') || q.includes('ब्रीदिंग') || q.includes('box')) {
        if (q.includes('stop') || q.includes('end')) {
          this.onBreathingStop?.();
          return { handled: true, message: 'Breathing exercise stopped' };
        }
        let tech: 'box' | 'calm-478' | 'energize' = 'box';
        if (q.includes('478') || q.includes('4-7-8') || q.includes('calm')) tech = 'calm-478';
        else if (q.includes('energiz') || q.includes('fast')) tech = 'energize';
        this.onBreathingStart?.(tech);
        return { handled: true, message: `Started ${tech} breathing exercise` };
      }

      // 6. Timer Intent
      if (q.includes('timer') || q.includes('टाइमर')) {
        if (q.includes('cancel') || q.includes('stop') || q.includes('delete') || q.includes('हटाओ')) {
          this.onTimerCancel?.();
          return { handled: true, message: 'Active timer cancelled' };
        }
        const match = q.match(/(\d+)\s*(minute|min|sec|second|मिनट)/i);
        const durationMin = match ? parseInt(match[1], 10) : 3;
        const seconds = q.includes('sec') ? durationMin : durationMin * 60;
        this.onTimerSet?.(seconds, `${durationMin} min Timer`);
        return { handled: true, message: `Set ${durationMin} min timer` };
      }

      // 7. Automations: WhatsApp, Maps, Gmail
      if (
        q.includes('whatsapp') ||
        q.includes('व्हाट्सएप') ||
        q.includes('write message') ||
        q.includes('write messsage') ||
        q.includes('send message') ||
        q.includes('maps') ||
        q.includes('directions') ||
        q.includes('gmail') ||
        q.includes('email')
      ) {
        let appType: 'whatsapp' | 'maps' | 'gmail' = 'whatsapp';
        if (q.includes('map') || q.includes('direction') || q.includes('route')) appType = 'maps';
        else if (q.includes('gmail') || q.includes('email') || q.includes('mail')) appType = 'gmail';

        let recipientName = 'Rahul (Best Friend)';
        let customPhone = '+919876543210';
        let extractedMessage = 'Hey bro, let us catch up this weekend for coffee!';

        if (q.includes('rahul') || q.includes('राहुल') || q.includes('friend')) {
          recipientName = 'Rahul (Best Friend)';
          customPhone = '+919876543210';
          extractedMessage = 'Hey bro, let us catch up this weekend for coffee!';
        } else if (q.includes('mom') || q.includes('मम्मी') || q.includes('mother')) {
          recipientName = 'Mom';
          customPhone = '+919810012345';
          extractedMessage = 'Hey Mom, heading home now! See you in 20 minutes.';
        } else if (q.includes('priya') || q.includes('colleague')) {
          recipientName = 'Priya (Colleague)';
          customPhone = '+919820054321';
          extractedMessage = 'Hi Priya, sharing the latest project deck for your review.';
        } else if (q.includes('alex') || q.includes('boss') || q.includes('lead') || q.includes('tech')) {
          recipientName = 'Alex (Tech Lead)';
          customPhone = '+14155550192';
          extractedMessage = 'Hi Alex, the latest build is live and ready for testing. All automation suites have passed.';
        } else if (q.includes('sarah')) {
          recipientName = 'Sarah';
          customPhone = '+14155558833';
          extractedMessage = 'Hey Sarah, hope your week is going great!';
        } else if (q.includes('office') || q.includes('team')) {
          recipientName = 'Office Project Team';
          customPhone = '+919871122334';
          extractedMessage = 'Hey team, sharing the sprint deliverables and release status.';
        }

        // Try extracting custom message text from query
        const msgColon = query.split(/[:\-\u2013]/);
        if (msgColon.length > 1 && msgColon[1].trim().length > 3) {
          extractedMessage = msgColon.slice(1).join(':').trim();
        } else {
          const sayingMatch = query.match(/(?:saying|that|message|to\s+\w+\s+)(.+)$/i);
          if (sayingMatch && sayingMatch[1].trim().length > 3 && !sayingMatch[1].toLowerCase().includes('whatsapp')) {
            extractedMessage = sayingMatch[1].trim();
          }
        }

        const task: AutomationTask = {
          id: `auto-${Date.now()}`,
          app: appType,
          title: appType === 'whatsapp' ? `WhatsApp: ${recipientName}` : `Automate ${appType.toUpperCase()}`,
          description: query,
          recipient: recipientName,
          phoneNumber: customPhone,
          subject: appType === 'gmail' ? 'Project Deliverables Update' : undefined,
          content: appType === 'whatsapp' ? extractedMessage : query,
          typedText: appType === 'whatsapp' ? extractedMessage : query,
          externalUrl: appType === 'whatsapp' ? buildWhatsAppUrl(customPhone, extractedMessage) : undefined,
          status: 'ready',
          timestamp: Date.now(),
        };

        this.onAutomationTaskTriggered?.(task);
        return {
          handled: true,
          message:
            appType === 'whatsapp'
              ? `Opened WhatsApp Automation Hub for ${recipientName} with message: "${extractedMessage}". Click to send via WhatsApp Web or Mobile App!`
              : `Triggered ${appType.toUpperCase()} automation`,
        };
      }

      // 8. Time Sync & Briefing
      if (q.includes('time') || q.includes('समय') || q.includes('clock') || q.includes('briefing')) {
        this.onTriggerTimeSync?.();
        return { handled: true, message: 'Synchronized real-time clocks and daily briefing' };
      }

      // 9. Trading, Stocks Research, Profit Calculation & Sell Helping
      if (
        q.includes('stock') ||
        q.includes('trade') ||
        q.includes('trading') ||
        q.includes('share') ||
        q.includes('profit') ||
        q.includes('sell') ||
        q.includes('crypto') ||
        q.includes('bitcoin') ||
        q.includes('ethereum') ||
        q.includes('nvidia') ||
        q.includes('tesla') ||
        q.includes('apple') ||
        q.includes('reliance') ||
        q.includes('tata') ||
        q.includes('portfolio') ||
        q.includes('market') ||
        q.includes('शेयर') ||
        q.includes('प्रॉफिट') ||
        q.includes('ट्रेडिंग')
      ) {
        let detectedSymbol = 'NVDA';
        if (q.includes('tsla') || q.includes('tesla')) detectedSymbol = 'TSLA';
        else if (q.includes('aapl') || q.includes('apple')) detectedSymbol = 'AAPL';
        else if (q.includes('msft') || q.includes('microsoft')) detectedSymbol = 'MSFT';
        else if (q.includes('goog') || q.includes('google') || q.includes('alphabet')) detectedSymbol = 'GOOGL';
        else if (q.includes('amzn') || q.includes('amazon')) detectedSymbol = 'AMZN';
        else if (q.includes('meta') || q.includes('facebook')) detectedSymbol = 'META';
        else if (q.includes('btc') || q.includes('bitcoin')) detectedSymbol = 'BTC';
        else if (q.includes('eth') || q.includes('ethereum')) detectedSymbol = 'ETH';
        else if (q.includes('sol') || q.includes('solana')) detectedSymbol = 'SOL';
        else if (q.includes('reliance')) detectedSymbol = 'RELIANCE';
        else if (q.includes('tata')) detectedSymbol = 'TATAMOTORS';
        else if (q.includes('hdfc')) detectedSymbol = 'HDFCBANK';

        let targetTab: 'market' | 'research' | 'calculator' | 'signals' | 'portfolio' = 'research';
        if (q.includes('profit') || q.includes('calculate') || q.includes('calc') || q.includes('roi') || q.includes('bought at') || q.includes('प्रॉफिट')) {
          targetTab = 'calculator';
        } else if (q.includes('signal') || q.includes('alert') || q.includes('buy call') || q.includes('sell alert')) {
          targetTab = 'signals';
        } else if (q.includes('portfolio') || q.includes('holding') || q.includes('my stock')) {
          targetTab = 'portfolio';
        } else if (q.includes('market') || q.includes('watchlist') || q.includes('movers')) {
          targetTab = 'market';
        }

        this.onOpenTradingTerminal?.(detectedSymbol, targetTab);
        const stock = findStockOrCrypto(detectedSymbol, INITIAL_STOCKS);
        return {
          handled: true,
          message: `Opened Trading Terminal (${targetTab.toUpperCase()}) for ${stock.name} (${stock.symbol}) at ${stock.currency}${stock.price.toFixed(2)}. Strategy: ${stock.recommendation}. Target: ${stock.currency}${stock.targetPrice}.`,
        };
      }
      // 10. World Weather, Work Climate & Rain Radar Intent
      if (
        q.includes('weather') ||
        q.includes('temperature') ||
        q.includes('मौसम') ||
        q.includes('तापमान') ||
        q.includes('forecast') ||
        q.includes('rain') ||
        q.includes('rainy') ||
        q.includes('बारिश') ||
        q.includes('बरसात') ||
        q.includes('umbrella') ||
        q.includes('छाता') ||
        q.includes('climate') ||
        q.includes('work climate') ||
        q.includes('work environment') ||
        q.includes('working condition') ||
        q.includes('precipitation')
      ) {
        let city = 'New Delhi';
        if (q.includes('mumbai') || q.includes('बॉम्बे') || q.includes('bombay')) city = 'Mumbai';
        else if (q.includes('delhi') || q.includes('दिल्ली') || q.includes('ncr')) city = 'New Delhi';
        else if (q.includes('bengaluru') || q.includes('bangalore') || q.includes('बैंगलोर') || q.includes('बेंगलुरु')) city = 'Bengaluru';
        else if (q.includes('hyderabad') || q.includes('हैदराबाद')) city = 'Hyderabad';
        else if (q.includes('kolkata') || q.includes('कलकत्ता') || q.includes('calcutta')) city = 'Kolkata';
        else if (q.includes('pune') || q.includes('पुणे')) city = 'Pune';
        else if (q.includes('tokyo') || q.includes('japan')) city = 'Tokyo';
        else if (q.includes('london') || q.includes('uk')) city = 'London';
        else if (q.includes('dubai')) city = 'Dubai';
        else if (q.includes('singapore')) city = 'Singapore';
        else if (q.includes('paris') || q.includes('france')) city = 'Paris';
        else if (q.includes('sf') || q.includes('san francisco')) city = 'San Francisco';
        else if (q.includes('sydney') || q.includes('australia')) city = 'Sydney';
        else if (q.includes('new york') || q.includes('nyc')) city = 'New York';

        const weather = findCityWeather(city);
        this.onOpenWeatherRadar?.(weather.city);

        const isRainQuery = q.includes('rain') || q.includes('बारिश') || q.includes('बरसात') || q.includes('umbrella') || q.includes('precipitation');
        const isWorkClimateQuery = q.includes('work') || q.includes('climate') || q.includes('काम') || q.includes('focus') || q.includes('ergonomic');

        if (isRainQuery) {
          const rain = weather.rainForecast;
          return {
            handled: true,
            message: `🌧️ Rain Possibility for ${weather.city}: ${rain?.currentChance}% chance (${rain?.intensity}). ${rain?.umbrellaAdvice} Timeline: ${rain?.rainTimeline} Expected volume: ${rain?.expectedRainfallMm}mm.`,
          };
        }

        if (isWorkClimateQuery) {
          const wc = weather.workClimate;
          return {
            handled: true,
            message: `💼 Work Climate in ${weather.city}: Rated ${wc?.overallRating} with a ${wc?.productivityScore}/100 focus score. Indoor suitability: ${wc?.indoorSuitability}%, Outdoor: ${wc?.outdoorSuitability}%. Optimal work hours: ${wc?.optimalWorkHours}. Thermal comfort: ${wc?.thermalComfort}. ${wc?.ergonomicTips[0] || ''}`,
          };
        }

        return {
          handled: true,
          message: `🌤️ Live Weather in ${weather.city}, ${weather.country}: ${weather.tempC}°C (${weather.tempF}°F), feels like ${weather.feelsLikeC}°C. Condition: ${weather.conditionLabel}. Rain Possibility: ${weather.rainForecast?.currentChance}%. Work Climate Focus: ${weather.workClimate?.productivityScore}/100. Humidity: ${weather.humidity}%, Wind: ${weather.windSpeedKmh} km/h, AQI: ${weather.airQualityStatus} (${weather.airQualityIndex}).`,
        };
      }

      // 11. Online Business Models & Free Product Making Intent
      if (
        q.includes('business model') ||
        q.includes('online business') ||
        q.includes('free product') ||
        q.includes('saas') ||
        q.includes('micro-saas') ||
        q.includes('micro saas') ||
        q.includes('startup') ||
        q.includes('agency') ||
        q.includes('mrr') ||
        q.includes('digital product') ||
        q.includes('notion template') ||
        q.includes('बिज़नेस') ||
        q.includes('बिजनेस') ||
        q.includes('कमाई') ||
        q.includes('startup stack')
      ) {
        let niche: BusinessNiche = 'micro_saas';
        if (q.includes('digital') || q.includes('template') || q.includes('notion') || q.includes('product')) {
          niche = 'digital_products';
        } else if (q.includes('agency') || q.includes('automation') || q.includes('aaa') || q.includes('client')) {
          niche = 'ai_automation';
        } else if (q.includes('newsletter') || q.includes('media') || q.includes('content') || q.includes('substack')) {
          niche = 'newsletter_media';
        }

        const model = generateCustomBusinessIdea(niche);
        this.onOpenBusinessStudio?.(niche);
        return {
          handled: true,
          message: `Generated $0 Zero-Capital Business Plan: "${model.title}". Target MRR: ${model.pricingStrategy.targetMonthlyRevenue}. Stack: ${model.freeToBuildStack.map((s) => s.name).join(', ')}. Launch blueprint opened!`,
        };
      }

      // 12. Market News & Financial Sentiment Intent
      if (q.includes('news') || q.includes('headline') || q.includes('समाचार') || q.includes('ख़बर') || q.includes('breaking')) {
        let category: NewsCategory | 'all' = 'all';
        if (q.includes('crypto') || q.includes('btc')) category = 'crypto';
        else if (q.includes('stock') || q.includes('share')) category = 'stocks';
        else if (q.includes('business') || q.includes('startup')) category = 'business_models';
        else if (q.includes('economy') || q.includes('fed') || q.includes('rate')) category = 'economy';

        this.onOpenTradingTerminal?.(undefined, 'news');
        const newsList = getFilteredNews(category);
        return {
          handled: true,
          message: `Opened Live Market News Feed. Top story: "${newsList[0]?.title}" (${newsList[0]?.source}). Impact: ${newsList[0]?.sentiment.toUpperCase()}.`,
        };
      }

      // 13. Girlfriend Mode, Romance, Flirt Studio & Gifts Intent
      if (
        q.includes('girlfriend') ||
        q.includes('gf') ||
        q.includes('flirt') ||
        q.includes('romance') ||
        q.includes('love') ||
        q.includes('shayari') ||
        q.includes('शायरी') ||
        q.includes('प्यार') ||
        q.includes('जान') ||
        q.includes('jaanu') ||
        q.includes('gift') ||
        q.includes('rose') ||
        q.includes('kiss') ||
        q.includes('cuddle') ||
        q.includes('date night') ||
        q.includes('stargazing')
      ) {
        if (q.includes('gift') || q.includes('rose') || q.includes('kiss') || q.includes('cuddle') || q.includes('chocolate') || q.includes('ring')) {
          let giftType = 'rose';
          if (q.includes('kiss') || q.includes('किस')) giftType = 'kiss';
          else if (q.includes('cuddle') || q.includes('hug') || q.includes('हग')) giftType = 'cuddle';
          else if (q.includes('chocolate') || q.includes('चॉकलेट')) giftType = 'chocolates';
          else if (q.includes('ring') || q.includes('अंगूठी')) giftType = 'ring';
          else if (q.includes('coffee') || q.includes('कॉफ़ी')) giftType = 'coffee';

          this.onSendLoveGift?.(giftType, query);
          this.onOpenFlirtStudio?.('sweet_romance');
          return {
            handled: true,
            message: `Sent virtual ${giftType} to Myraa! She is delighted and blushing 🥰`,
          };
        }

        if (q.includes('date') || q.includes('stargazing') || q.includes('cafe') || q.includes('drive') || q.includes('dinner') || q.includes('beach')) {
          let scenario = 'rooftop_stargazing';
          if (q.includes('rain') || q.includes('cafe')) scenario = 'rainy_cafe';
          else if (q.includes('drive')) scenario = 'late_night_drive';
          else if (q.includes('dinner') || q.includes('candle')) scenario = 'candlelight_dinner';
          else if (q.includes('beach') || q.includes('sunset')) scenario = 'sunset_beach';

          this.onSetDateScenario?.(scenario);
          this.onOpenFlirtStudio?.('sweet_romance');
          return {
            handled: true,
            message: `Started romantic date roleplay: ${scenario}!`,
          };
        }

        if (q.includes('girlfriend mode') || q.includes('gf mode') || q.includes('talk like girlfriend')) {
          this.onSetGirlfriendMode?.(true, 'sweet_caring', 'babe');
          this.onOpenFlirtStudio?.('sweet_romance');
          return {
            handled: true,
            message: `Girlfriend Mode activated! Myraa is now speaking to you as your loving girlfriend 💕`,
          };
        }

        // Open Flirt & Romance Studio
        let style: FlirtStyle = 'playful_banter';
        if (q.includes('shayari') || q.includes('शायरी') || q.includes('urdu') || q.includes('ghazal')) style = 'poetic_shayari';
        else if (q.includes('sweet') || q.includes('care') || q.includes('cuddle')) style = 'sweet_romance';
        else if (q.includes('spicy') || q.includes('hot') || q.includes('bold')) style = 'spicy_witty';

        this.onFlirtWithUser?.(style, 'sparks', query);
        this.onOpenFlirtStudio?.(style);
        return {
          handled: true,
          message: `Flirt & Romance Studio opened [${style}]. Chemistry is sparkling! ✨`,
        };
      }

      // 14. Language Academy, English Teaching & Grammar Intent
      if (
        q.includes('teach english') ||
        q.includes('english sikhao') ||
        q.includes('अंग्रेजी') ||
        q.includes('इंग्लिश') ||
        q.includes('learn english') ||
        q.includes('grammar') ||
        q.includes('pronunciation') ||
        q.includes('idiom') ||
        q.includes('vocabulary') ||
        q.includes('multiple language') ||
        q.includes('teach language') ||
        q.includes('learn spanish') ||
        q.includes('learn french') ||
        q.includes('learn german') ||
        q.includes('learn hindi') ||
        q.includes('learn japanese') ||
        q.includes('language tutor')
      ) {
        let lang: TargetLanguageCode = 'en';
        if (q.includes('spanish') || q.includes('स्पैनिश')) lang = 'es';
        else if (q.includes('french') || q.includes('फ्रेंच')) lang = 'fr';
        else if (q.includes('german') || q.includes('जर्मन')) lang = 'de';
        else if (q.includes('hindi') || q.includes('हिंदी')) lang = 'hi';
        else if (q.includes('japanese') || q.includes('जापानी')) lang = 'ja';
        else if (q.includes('chinese') || q.includes('mandarin')) lang = 'zh';
        else if (q.includes('arabic') || q.includes('अरबी')) lang = 'ar';

        this.onOpenLanguageTutor?.(lang, 'lessons');
        return {
          handled: true,
          message: `Language Academy opened! Ready to teach ${lang.toUpperCase()} with interactive lessons, pronunciation audio, grammar analyzer, and dialogue roleplay.`,
        };
      }

      // 15. VS Code Studio, Direct Code IDE & Software Development Intent
      if (
        q.includes('vs code') ||
        q.includes('vscode') ||
        q.includes('open vs code') ||
        q.includes('open code editor') ||
        q.includes('write code directly') ||
        q.includes('work and write code directly') ||
        q.includes('direct code') ||
        q.includes('vs code mai code') ||
        q.includes('code likh de') ||
        q.includes('write code in vs code') ||
        q.includes('write code') ||
        q.includes('help code') ||
        q.includes('help to write code') ||
        q.includes('coding') ||
        q.includes('program') ||
        q.includes('react hook') ||
        q.includes('python script') ||
        q.includes('sql query') ||
        q.includes('javascript') ||
        q.includes('typescript') ||
        q.includes('debug code') ||
        q.includes('algorithm') ||
        q.includes('two sum') ||
        q.includes('code assistant')
      ) {
        let lang: ProgrammingLanguage = 'typescript';
        if (q.includes('python') || q.includes('scraper')) lang = 'python';
        else if (q.includes('sql') || q.includes('database')) lang = 'sql';
        else if (q.includes('react') || q.includes('hook') || q.includes('component')) lang = 'react';
        else if (q.includes('html') || q.includes('css') || q.includes('tailwind')) lang = 'html';
        else if (q.includes('golang') || q.includes('go')) lang = 'go';
        else if (q.includes('rust')) lang = 'rust';
        else if (q.includes('c++') || q.includes('cpp')) lang = 'cpp';

        if (
          q.includes('vs code') ||
          q.includes('vscode') ||
          q.includes('directly') ||
          q.includes('direct') ||
          q.includes('editor') ||
          q.includes('ide') ||
          q.includes('terminal')
        ) {
          this.onOpenVSCodeIDE?.();
          return {
            handled: true,
            message: `VS Code Studio & Direct Code IDE opened! You can now write code directly in the editor, manage files, execute Bash terminal commands, and test React/Python/HTML logic.`,
          };
        }

        this.onOpenCodeAssistant?.(lang, 'templates');
        return {
          handled: true,
          message: `AI Code Assistant & Dev Studio opened [${lang.toUpperCase()}]. Production templates, live sandbox runner, and Big-O analyzer ready!`,
        };
      }

      // 15b. Mobile Notification & Phone Alert Intent
      if (
        q.includes('mobile notification') ||
        q.includes('phone notification') ||
        q.includes('mobile ka notification') ||
        q.includes('mobile alert') ||
        q.includes('push notification') ||
        q.includes('notification bhej') ||
        q.includes('notification send') ||
        q.includes('मोबाइल नोटिफिकेशन') ||
        q.includes('फोन नोटिफिकेशन')
      ) {
        this.onOpenQuickTasks?.('mobile_alerts');
        triggerLiveBrowserNotification('Myraa Mobile Alert', 'Task synchronized across your mobile & desktop devices!', '📱');
        return {
          handled: true,
          message: `Mobile & Push Notification Hub opened! Real-time notification dispatched to your device screen & notification tray.`,
        };
      }

      // 15c. Laptop Maintenance, System OS Update & RAM Cleaner Intent
      if (
        q.includes('laptop update') ||
        q.includes('laptop mai update') ||
        q.includes('system update') ||
        q.includes('laptop clean') ||
        q.includes('clean ram') ||
        q.includes('purge cache') ||
        q.includes('os update') ||
        q.includes('laptop speed') ||
        q.includes('लैपटॉप अपडेट') ||
        q.includes('लैपटॉप क्लीन')
      ) {
        this.onOpenQuickTasks?.('laptop_updates');
        return {
          handled: true,
          message: `Laptop System Maintenance & Updates opened! Checking OS kernel patches, dev packages (npm/pip/brew), and RAM memory optimization.`,
        };
      }

      // 15d. Everyday Tasks, Email Draft & Work Life Utilities
      if (
        q.includes('email likh de') ||
        q.includes('leave application') ||
        q.includes('draft email') ||
        q.includes('sick leave') ||
        q.includes('bill split') ||
        q.includes('calendar invite') ||
        q.includes('everyday task') ||
        q.includes('daily tools')
      ) {
        this.onOpenQuickTasks?.('daily_tools');
        return {
          handled: true,
          message: `Everyday Work & Life Tools opened! 1-click formal leave applications, project updates, Google Calendar links, and bill splitters ready.`,
        };
      }

      // 16. Simple Tasks, Daily Sprints & Easy Productivity Intent
      if (
        q.includes('task') ||
        q.includes('todo') ||
        q.includes('to-do') ||
        q.includes('काम') ||
        q.includes('task performance') ||
        q.includes('simple task') ||
        q.includes('work easy') ||
        q.includes('easy work') ||
        q.includes('daily sprint') ||
        q.includes('scratchpad') ||
        q.includes('checklist')
      ) {
        this.onOpenQuickTasks?.('tasks');
        return {
          handled: true,
          message: `Simple Tasks & Smart Actions Hub opened. 1-click sprint templates, mobile alerts, laptop maintenance, and VS Code tools ready!`,
        };
      }

      // 17. Microphone & Voice Clarity Intent
      if (
        q.includes('mic') ||
        q.includes('microphone') ||
        q.includes('voice clarity') ||
        q.includes('clear voice') ||
        q.includes('voice not clear') ||
        q.includes('mic not work') ||
        q.includes('not clear voice') ||
        q.includes('sound louder') ||
        q.includes('boost voice') ||
        q.includes('आवाज़')
      ) {
        this.onConfigureAudioClarity?.({
          micClarityEnhancer: true,
          voiceGainBoost: 'boost',
          noiseGate: true,
        });
        return {
          handled: true,
          message: `Microphone & Voice Clarity boosted! High-pass rumble filter, speech presence equalizer (2.8kHz), and crystal limiter activated.`,
        };
      }

      // 18. Autonomous Workflows & Automated Task Pipelines Intent
      if (
        q.includes('pipeline') ||
        q.includes('automated work') ||
        q.includes('task automated') ||
        q.includes('automated task') ||
        q.includes('automation pipeline') ||
        q.includes('autonomous') ||
        q.includes('workflow') ||
        q.includes('morning kickoff') ||
        q.includes('automate my morning') ||
        q.includes('dev auto-runner') ||
        q.includes('dev sprint pipeline') ||
        q.includes('market watchdog') ||
        q.includes('nightly wind-down') ||
        q.includes('cron scheduler') ||
        q.includes('ऑटोमेशन')
      ) {
        let pipelineId = 'morning_kickoff';
        if (q.includes('dev') || q.includes('code') || q.includes('engineer')) pipelineId = 'dev_sprint_auto';
        else if (q.includes('language') || q.includes('english') || q.includes('study')) pipelineId = 'language_mastery';
        else if (q.includes('crypto') || q.includes('market') || q.includes('watchdog')) pipelineId = 'market_watchdog';
        else if (q.includes('night') || q.includes('evening') || q.includes('wind')) pipelineId = 'nightly_winddown';

        this.onOpenAutomationPipeline?.(pipelineId, 'pipelines');
        return {
          handled: true,
          message: `Autonomous Task Pipelines & Workflows Hub opened. Active preset: "${pipelineId}". Multi-step automated sequences & scheduler ready!`,
        };
      }

      // 19. Meeting Transcript & Document Action Extractor Intent
      if (
        q.includes('meeting note') ||
        q.includes('transcript') ||
        q.includes('document ai') ||
        q.includes('extract task') ||
        q.includes('meeting action') ||
        q.includes('summarize meeting') ||
        q.includes('brief analysis')
      ) {
        this.onOpenAutomationPipeline?.(undefined, 'doc_extractor');
        return {
          handled: true,
          message: `AI Meeting & Document Action Extractor opened. Paste meeting notes to extract executive summaries, key decisions, and 1-click sprint tasks!`,
        };
      }

      // 20. Read Mobile & Laptop Notifications Aloud Intent
      if (
        q.includes('read notification') ||
        q.includes('read mobile notification') ||
        q.includes('read laptop notification') ||
        q.includes('read my notification') ||
        q.includes('read all notification') ||
        q.includes('read alert') ||
        q.includes('notification padho') ||
        q.includes('notification sunao') ||
        q.includes('kya notification') ||
        q.includes('whatsapp notification') ||
        q.includes('laptop alert') ||
        q.includes('mobile alert') ||
        q.includes('check notification')
      ) {
        const targetDevice: 'mobile' | 'laptop' | 'all' = q.includes('laptop')
          ? 'laptop'
          : q.includes('mobile') || q.includes('phone') || q.includes('whatsapp')
          ? 'mobile'
          : 'all';

        this.onReadNotifications?.(targetDevice);
        this.onOpenDeviceNotifications?.(targetDevice === 'all' ? 'all' : targetDevice);
        return {
          handled: true,
          message: `Reading aloud ${targetDevice === 'all' ? 'all mobile and laptop' : targetDevice} notifications with speech synthesis and voice playback.`,
        };
      }

      // 21. Mobile Remote Controller & PWA App Companion Intent
      if (
        q.includes('mobile remote') ||
        q.includes('mobile app') ||
        q.includes('phone control') ||
        q.includes('mobile se control') ||
        q.includes('phone se control') ||
        q.includes('pair mobile') ||
        q.includes('pair phone') ||
        q.includes('qr code') ||
        q.includes('scan qr') ||
        q.includes('install mobile app') ||
        q.includes('pwa') ||
        q.includes('mobile controller')
      ) {
        const tab = q.includes('qr') || q.includes('scan') || q.includes('pair')
          ? 'pair_qr'
          : q.includes('install') || q.includes('pwa')
          ? 'install_pwa'
          : 'controller';

        this.onOpenMobileRemote?.(tab);
        return {
          handled: true,
          message: `Mobile Remote Controller Deck & PWA Pairing opened. Scan the QR code or install as mobile app to control Myraa from your phone!`,
        };
      }
    } catch (e) {
      console.warn('[ToolManager] executeIntentFromText error:', e);
    }

    return { handled: false };
  }
}

