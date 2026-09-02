import {
  AutomationPipeline,
  AutomationStep,
  DocumentAnalysisResult,
  QuickTaskItem,
  TaskPriorityLevel,
  TaskCategoryType,
} from '../types';
import { WORLD_CITIES_WEATHER } from './weatherData';
import { INITIAL_MARKET_NEWS } from './marketNewsData';
import { INITIAL_CODE_TEMPLATES } from './codeAssistantData';
import { INITIAL_ENGLISH_LESSONS } from './languageTutorData';

export const INITIAL_AUTOMATION_PIPELINES: AutomationPipeline[] = [
  {
    id: 'morning_kickoff',
    name: 'Morning Executive Kickoff',
    emoji: '🌅',
    tagline: 'Autonomous weather, financial news, 3 sprint tasks & vocal briefing',
    description:
      'Instantly gathers current meteorological conditions, top market headlines, creates your daily high-priority focus tasks, starts ambient focus audio, and delivers a personalized vocal briefing.',
    category: 'productivity',
    estimatedRuntimeSec: 6,
    cronSchedule: 'Every Day at 8:00 AM',
    autoRunEnabled: true,
    totalRunsCompleted: 14,
    lastRunTimestamp: Date.now() - 1000 * 60 * 60 * 18,
    lastRunStatus: 'success',
    steps: [
      {
        id: 'mk-step-1',
        title: 'Query Live Meteorological Radar',
        description: 'Pulls current temperature, humidity, UV index & precipitation forecasts.',
        iconName: 'CloudSun',
        actionType: 'fetch_weather',
        status: 'idle',
        durationMs: 800,
        params: { city: 'New York' },
        logOutput: [],
      },
      {
        id: 'mk-step-2',
        title: 'Synthesize Market & Tech Headlines',
        description: 'Scans top financial sentiment, NASDAQ trends & breakthrough AI developments.',
        iconName: 'TrendingUp',
        actionType: 'fetch_news',
        status: 'idle',
        durationMs: 1100,
        params: { category: 'all' },
        logOutput: [],
      },
      {
        id: 'mk-step-3',
        title: 'Generate & Seed High-Impact Sprint Tasks',
        description: 'Automatically inserts 3 structured morning tasks into the Quick Tasks queue.',
        iconName: 'CheckSquare',
        actionType: 'add_tasks',
        status: 'idle',
        durationMs: 900,
        params: {
          tasks: [
            { title: 'Review morning market briefing and system telemetry', priority: 'urgent', category: 'work', estimatedMinutes: 20 },
            { title: 'Complete high-priority code architecture refactor', priority: 'urgent', category: 'code', estimatedMinutes: 45 },
            { title: 'Hydrate & complete 10-minute focus breathing session', priority: 'medium', category: 'health', estimatedMinutes: 10 },
          ],
        },
        logOutput: [],
      },
      {
        id: 'mk-step-4',
        title: 'Trigger Binaural Focus Audio Stream',
        description: 'Initializes calming ambient background soundscape at optimal focus frequency.',
        iconName: 'Headphones',
        actionType: 'play_audio',
        status: 'idle',
        durationMs: 700,
        params: { soundId: 'binaural-focus' },
        logOutput: [],
      },
      {
        id: 'mk-step-5',
        title: 'Deliver Spoken Executive Audio Briefing',
        description: 'Myraa synthesizes all insights into an energetic morning vocal summary.',
        iconName: 'Mic',
        actionType: 'speak_briefing',
        status: 'idle',
        durationMs: 1400,
        params: { text: 'Good morning! Weather is 72 degrees and sunny. Market is rallying +1.4%. 3 daily sprint tasks are loaded. Ready for a productive day!' },
        logOutput: [],
      },
    ],
  },
  {
    id: 'dev_sprint_auto',
    name: 'Full-Stack Dev Auto-Runner',
    emoji: '🚀',
    tagline: 'Code scaffold, sandbox benchmark, task sync & dev alert digest',
    description:
      'Autonomous software engineering pipeline: pulls modern TypeScript templates, runs live sandbox compilation tests, computes Big-O complexity, and logs sprint deliverables.',
    category: 'dev',
    estimatedRuntimeSec: 5,
    cronSchedule: 'On Code Commit & Sprint Start',
    autoRunEnabled: false,
    totalRunsCompleted: 9,
    lastRunTimestamp: Date.now() - 1000 * 60 * 60 * 6,
    lastRunStatus: 'success',
    steps: [
      {
        id: 'dev-step-1',
        title: 'Scaffold TypeScript & React Architecture',
        description: 'Generates production-grade custom hook & state machine boilerplate.',
        iconName: 'Code2',
        actionType: 'scaffold_code',
        status: 'idle',
        durationMs: 900,
        params: { language: 'typescript', templateId: 't-1' },
        logOutput: [],
      },
      {
        id: 'dev-step-2',
        title: 'Execute Sandbox Runtime & Performance Test',
        description: 'Runs execution benchmarking in isolated browser sandbox with stdout capture.',
        iconName: 'Terminal',
        actionType: 'run_sandbox',
        status: 'idle',
        durationMs: 1200,
        params: { code: 'const start = performance.now(); let sum = 0; for(let i=0; i<10000; i++) sum += i; return { result: sum, timeMs: performance.now() - start };' },
        logOutput: [],
      },
      {
        id: 'dev-step-3',
        title: 'Push Code Review & Test Tasks to Queue',
        description: 'Populates unit test and deployment tasks into developer task queue.',
        iconName: 'CheckSquare',
        actionType: 'add_tasks',
        status: 'idle',
        durationMs: 700,
        params: {
          tasks: [
            { title: 'Write unit tests for custom React state hook', priority: 'urgent', category: 'code', estimatedMinutes: 30 },
            { title: 'Benchmark API endpoint latency under high concurrency', priority: 'medium', category: 'code', estimatedMinutes: 25 },
          ],
        },
        logOutput: [],
      },
      {
        id: 'dev-step-4',
        title: 'Dispatch Sprint Status Notification',
        description: 'Sends automated development success digest to system activity log.',
        iconName: 'Send',
        actionType: 'send_notification',
        status: 'idle',
        durationMs: 800,
        params: { channel: 'system', message: 'Dev Auto-Runner completed successfully: 0 compile errors, 1.2ms benchmark.' },
        logOutput: [],
      },
    ],
  },
  {
    id: 'language_mastery',
    name: 'Language & Grammar Academy Runner',
    emoji: '🎓',
    tagline: 'Daily vocabulary, grammar diagnostic, quiz generator & focus timer',
    description:
      'Autonomous daily language immersion: loads daily conversational idioms, diagnoses grammar mistakes, generates a 3-question adaptive quiz, and activates a 15-minute study countdown.',
    category: 'learning',
    estimatedRuntimeSec: 4,
    cronSchedule: 'Every Day at 6:00 PM',
    autoRunEnabled: true,
    totalRunsCompleted: 11,
    lastRunTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    lastRunStatus: 'success',
    steps: [
      {
        id: 'lang-step-1',
        title: 'Load Daily Target Language Lesson',
        description: 'Retrieves natural native idioms, vocabulary cards, and pronunciation guides.',
        iconName: 'GraduationCap',
        actionType: 'analyze_document',
        status: 'idle',
        durationMs: 800,
        params: { language: 'en', topic: 'daily_conversation' },
        logOutput: [],
      },
      {
        id: 'lang-step-2',
        title: 'Run Grammar & Pronunciation Diagnostic',
        description: 'Analyzes recent conversational phrases and generates natural native corrections.',
        iconName: 'SpellCheck',
        actionType: 'analyze_document',
        status: 'idle',
        durationMs: 1000,
        params: { sentence: 'I am agree with your opinion because it is make sense.' },
        logOutput: [],
      },
      {
        id: 'lang-step-3',
        title: 'Queue Language Practice Tasks',
        description: 'Adds speaking and listening practice to user daily schedule.',
        iconName: 'CheckSquare',
        actionType: 'add_tasks',
        status: 'idle',
        durationMs: 600,
        params: {
          tasks: [
            { title: 'Practice 5 native English idioms out loud', priority: 'medium', category: 'study', estimatedMinutes: 15 },
            { title: 'Complete daily conversational roleplay scenario', priority: 'medium', category: 'study', estimatedMinutes: 15 },
          ],
        },
        logOutput: [],
      },
      {
        id: 'lang-step-4',
        title: 'Arm 15-Minute Immersion Focus Timer',
        description: 'Starts an interactive focus timer for distraction-free language learning.',
        iconName: 'Timer',
        actionType: 'set_timer',
        status: 'idle',
        durationMs: 700,
        params: { minutes: 15, label: 'Language Academy Practice' },
        logOutput: [],
      },
    ],
  },
  {
    id: 'market_watchdog',
    name: 'Crypto & Market Auto-Watchdog',
    emoji: '📈',
    tagline: 'Live price tracker, sentiment scanner & volatility alert webhook',
    description:
      'Continuous market surveillance: checks BTC/ETH/SOL live pricing, calculates 24h momentum metrics, scans breaking financial news sentiment, and logs automated trading signals.',
    category: 'finance',
    estimatedRuntimeSec: 5,
    cronSchedule: 'Every 30 Minutes',
    autoRunEnabled: false,
    totalRunsCompleted: 38,
    lastRunTimestamp: Date.now() - 1000 * 60 * 30,
    lastRunStatus: 'success',
    steps: [
      {
        id: 'mkt-step-1',
        title: 'Scan Top 10 Crypto & Global Asset Feeds',
        description: 'Calculates real-time price changes, volume anomalies & resistance levels.',
        iconName: 'TrendingUp',
        actionType: 'fetch_news',
        status: 'idle',
        durationMs: 1000,
        params: { asset: 'BTC,ETH,SOL' },
        logOutput: [],
      },
      {
        id: 'mkt-step-2',
        title: 'Calculate Market Sentiment Score',
        description: 'Parses institutional news feeds to generate a Fear & Greed index score.',
        iconName: 'Activity',
        actionType: 'fetch_news',
        status: 'idle',
        durationMs: 1100,
        params: { category: 'crypto' },
        logOutput: [],
      },
      {
        id: 'mkt-step-3',
        title: 'Log Portfolio Rebalancing Task',
        description: 'Creates strategic review reminder if market moves >2.5%.',
        iconName: 'CheckSquare',
        actionType: 'add_tasks',
        status: 'idle',
        durationMs: 700,
        params: {
          tasks: [
            { title: 'Check limit orders and profit-taking targets for BTC & SOL', priority: 'medium', category: 'personal', estimatedMinutes: 15 },
          ],
        },
        logOutput: [],
      },
      {
        id: 'mkt-step-4',
        title: 'Send High-Priority Market Digest Alert',
        description: 'Emits a desktop notification and activity log entry with key metrics.',
        iconName: 'BellRing',
        actionType: 'send_notification',
        status: 'idle',
        durationMs: 800,
        params: { message: 'Watchdog Alert: Crypto market sentiment is 74 (Greed). BTC hovering at $94.2k.' },
        logOutput: [],
      },
    ],
  },
  {
    id: 'nightly_winddown',
    name: 'Nightly Wind-Down & Auto-Backup',
    emoji: '🌙',
    tagline: 'Task summary, voice note archive, 4-7-8 breathing & sleep rain audio',
    description:
      'Autonomous evening closure: summarizes completed tasks, archives voice notes, guides you through a 4-7-8 calming breathing cycle, and starts soothing rain audio for deep sleep.',
    category: 'wellness',
    estimatedRuntimeSec: 6,
    cronSchedule: 'Every Night at 10:30 PM',
    autoRunEnabled: true,
    totalRunsCompleted: 22,
    lastRunTimestamp: Date.now() - 1000 * 60 * 60 * 28,
    lastRunStatus: 'success',
    steps: [
      {
        id: 'night-step-1',
        title: 'Review Daily Task Accomplishments',
        description: 'Calculates productivity score and cleans completed checklist items.',
        iconName: 'CheckSquare',
        actionType: 'add_tasks',
        status: 'idle',
        durationMs: 800,
        params: { action: 'summary' },
        logOutput: [],
      },
      {
        id: 'night-step-2',
        title: 'Archive Unsaved Voice Notes & Transcripts',
        description: 'Encrypts and backs up all daily memos into local persistent memory.',
        iconName: 'FileText',
        actionType: 'analyze_document',
        status: 'idle',
        durationMs: 900,
        params: { target: 'voice_notes' },
        logOutput: [],
      },
      {
        id: 'night-step-3',
        title: 'Initialize 4-7-8 Calming Breathing Cycle',
        description: 'Activates guided parasympathetic breathing HUD for instant relaxation.',
        iconName: 'Sparkles',
        actionType: 'play_audio',
        status: 'idle',
        durationMs: 1200,
        params: { technique: 'calm-478' },
        logOutput: [],
      },
      {
        id: 'night-step-4',
        title: 'Start Gentle Rain & Lo-Fi Sleep Soundscape',
        description: 'Launches soothing binaural rain ambient player with auto-fadeout.',
        iconName: 'Moon',
        actionType: 'play_audio',
        status: 'idle',
        durationMs: 1000,
        params: { soundId: 'rain-thunder' },
        logOutput: [],
      },
    ],
  },
  {
    id: 'calendar_event_watchdog',
    name: 'Autonomous Calendar & Voice Event Watchdog',
    emoji: '📅',
    tagline: 'Voice note date/time scanner, proactive buffer alerts & upcoming task prep',
    description:
      'Autonomous scheduling intelligence: continuously scans voice notes for spoken dates & times, updates the calendar event timeline, checks 15m/30m reminder alert buffers, delivers spoken voice reminders, and injects meeting preparation checklists into Quick Tasks.',
    category: 'productivity',
    estimatedRuntimeSec: 5,
    cronSchedule: 'Every 15 Minutes',
    autoRunEnabled: true,
    totalRunsCompleted: 42,
    lastRunTimestamp: Date.now() - 1000 * 60 * 12,
    lastRunStatus: 'success',
    steps: [
      {
        id: 'cal-step-1',
        title: 'Scan Voice Notes & Meeting Transcripts for Dates/Times',
        description: 'NLP scan across voice memos for phrases like "tomorrow at 3 PM", "in 2 hours", and calendar commitments.',
        iconName: 'Mic',
        actionType: 'scan_calendar_events',
        status: 'idle',
        durationMs: 900,
        params: { scope: 'all_voice_notes' },
        logOutput: [],
      },
      {
        id: 'cal-step-2',
        title: 'Compute Event Lead Times & Buffer Urgency',
        description: 'Calculates countdown delta, sorts upcoming events by urgency, and verifies 15m / 30m notification triggers.',
        iconName: 'Clock',
        actionType: 'scan_calendar_events',
        status: 'idle',
        durationMs: 700,
        params: { checkAlerts: true },
        logOutput: [],
      },
      {
        id: 'cal-step-3',
        title: 'Arm Autonomous Proactive Reminder Alerts',
        description: 'Prepares vocal speech alerts and high-priority on-screen banner notifications for tasks starting soon.',
        iconName: 'BellRing',
        actionType: 'trigger_event_reminder',
        status: 'idle',
        durationMs: 800,
        params: { proactive: true },
        logOutput: [],
      },
      {
        id: 'cal-step-4',
        title: 'Inject Event Preparation Checklist into Quick Tasks',
        description: 'Automatically inserts structured preparation tasks (agenda review, slide checks, DND setup) into Quick Tasks hub.',
        iconName: 'CheckSquare',
        actionType: 'add_tasks',
        status: 'idle',
        durationMs: 900,
        params: {
          tasks: [
            { title: 'Prep meeting agenda & review deliverables for upcoming calendar event', priority: 'urgent', category: 'work', estimatedMinutes: 15 },
            { title: 'Check audio/mic clarity & configure presentation links', priority: 'medium', category: 'work', estimatedMinutes: 10 },
          ],
        },
        logOutput: [],
      },
      {
        id: 'cal-step-5',
        title: 'Deliver Spoken Calendar Briefing & Push Notification',
        description: 'Myraa vocalizes upcoming events and dispatches cross-device notification alerts.',
        iconName: 'Volume2',
        actionType: 'speak_briefing',
        status: 'idle',
        durationMs: 1200,
        params: { text: 'Calendar scan complete. Upcoming event detected in your schedule. Reminder alerts and prep checklist are armed in the Autonomous Pipeline.' },
        logOutput: [],
      },
    ],
  },
];

/**
 * Intelligent Document & Meeting Action Item Extractor
 * Parses meeting transcripts, project briefs, or rough notes into executive summaries and structured tasks.
 */
export function extractDocumentIntelligence(text: string, title?: string): DocumentAnalysisResult {
  const docTitle = title && title.trim().length > 0 ? title.trim() : 'Meeting & Project Brief Analysis';
  const clean = text.trim();

  // If text is very short, provide a structured fallback
  if (clean.length < 20) {
    return {
      id: `doc-${Date.now()}`,
      title: docTitle,
      rawText: text,
      executiveSummary: 'Text provided is brief. Summary: Initial kick-off alignment and exploratory scoping for upcoming deliverables.',
      keyDecisions: [
        'Confirmed project direction and primary milestones.',
        'Established daily automated sync workflows.',
      ],
      extractedTasks: [
        { title: 'Follow up on initial project scoping notes', priority: 'medium', estimatedMinutes: 15, category: 'work' },
        { title: 'Schedule deep-dive technical architecture review', priority: 'urgent', estimatedMinutes: 30, category: 'code' },
      ],
      sentiment: 'positive',
      tags: ['Planning', 'Kickoff', 'Auto-Extracted'],
      suggestedNextActions: [
        'Push extracted tasks into Quick Tasks queue.',
        'Trigger Dev Auto-Runner pipeline for technical scaffolding.',
      ],
    };
  }

  const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);
  const tasks: Array<{ title: string; assignee?: string; priority: TaskPriorityLevel; estimatedMinutes: number; category: TaskCategoryType }> = [];
  const decisions: string[] = [];

  // Heuristic extraction
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes('todo:') ||
      lower.includes('action:') ||
      lower.includes('task:') ||
      lower.includes('need to') ||
      lower.includes('will implement') ||
      lower.includes('must do') ||
      lower.startsWith('- [ ]') ||
      lower.startsWith('* [ ]')
    ) {
      const cleanTaskTitle = line.replace(/^(todo:|action:|task:|- \[[ x]\]|\* \[[ x]\]|-|\*)/i, '').trim();
      if (cleanTaskTitle.length > 5) {
        tasks.push({
          title: cleanTaskTitle,
          priority: lower.includes('urgent') || lower.includes('asap') || lower.includes('critical') ? 'urgent' : 'medium',
          estimatedMinutes: lower.includes('quick') ? 15 : 30,
          category: lower.includes('code') || lower.includes('api') || lower.includes('bug') ? 'code' : 'work',
        });
      }
    } else if (
      lower.includes('decided') ||
      lower.includes('agreed') ||
      lower.includes('approved') ||
      lower.includes('decision:') ||
      lower.includes('consensus:')
    ) {
      decisions.push(line.replace(/^(decision:|consensus:|-|\*)/i, '').trim());
    }
  }

  // Fallback defaults if none matched regex
  if (tasks.length === 0) {
    tasks.push({
      title: `Review document: "${docTitle}" key milestones and deliverables`,
      priority: 'urgent',
      estimatedMinutes: 25,
      category: 'work',
    });
    tasks.push({
      title: 'Synthesize architecture deliverables with tech lead',
      priority: 'medium',
      estimatedMinutes: 30,
      category: 'code',
    });
    tasks.push({
      title: 'Send automated status digest to project team via WhatsApp/Email',
      priority: 'low',
      estimatedMinutes: 10,
      category: 'work',
    });
  }

  if (decisions.length === 0) {
    decisions.push('Approved agile task breakdown and designated ownership for Sprint phase 1.');
    decisions.push('Standardized on automated pipeline test triggers before production push.');
  }

  // Generate Executive Summary
  const firstFewSentences = lines.slice(0, 3).join(' ');
  const executiveSummary = `Executive Brief: The document outlines key operational focus areas. Key points include: "${firstFewSentences.slice(0, 140)}...". Extracted ${tasks.length} actionable high-leverage tasks.`;

  return {
    id: `doc-${Date.now()}`,
    title: docTitle,
    rawText: text,
    executiveSummary,
    keyDecisions: decisions.slice(0, 4),
    extractedTasks: tasks.slice(0, 6),
    sentiment: clean.toLowerCase().includes('delay') || clean.toLowerCase().includes('bug') ? 'urgent' : 'positive',
    tags: ['Intelligence', 'Auto-Extracted', 'Executive-Brief'],
    suggestedNextActions: [
      'Import all extracted tasks into Quick Tasks Hub with 1 click.',
      'Trigger Morning or Dev Automation Pipeline to execute tasks.',
    ],
  };
}

export const SAMPLE_MEETING_TRANSCRIPTS = [
  {
    title: 'Sprint 24 Engineering Sync & Product Architecture',
    text: `Sprint 24 Sync Notes:
1. Architecture decision: Agreed to migrate voice streaming buffer to Web Audio AudioWorklet for sub-30ms latency.
2. Todo: Refactor ToolManager to support autonomous multi-step pipelines.
3. Urgent Task: Fix high-pass filter rumble suppressor on low-end microphones.
4. Todo: Implement 1-click sprint preset generator in Quick Tasks modal.
5. Decision: Approved daily 8:00 AM automated executive briefing pipeline.
6. Action: Send release summary to stakeholders by Thursday 5:00 PM.`,
  },
  {
    title: 'Language Academy & Global Expansion Brief',
    text: `Global Expansion Meeting:
- Decision: Approved initial curriculum for English, Spanish, French, German, Hindi, and Japanese.
- Todo: Add interactive pronunciation audio synthesizer with native accent matching.
- Action: Build grammar sentence analyzer with parts-of-speech diagnostic cards.
- Decided to add 4-phase roleplay conversation simulator for real-life job interviews.
- Urgent: QA all quiz question answers and scoring algorithms.`,
  },
  {
    title: 'Trading Terminal & Crypto Watchdog Planning',
    text: `Market Strategy Brief:
- Consensus: Real-time price tracking ticker must update every 30 seconds.
- Todo: Integrate RSI and MACD momentum indicators into visual candlestick chart.
- Decision: Approved automated alert webhooks for BTC and ETH breakout levels above 3%.
- Task: Draft daily financial news digest for pre-market opening bell at 9:00 AM.`,
  },
];
