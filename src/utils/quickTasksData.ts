import {
  QuickTaskItem,
  TaskPriorityLevel,
  TaskCategoryType,
  DailySprintPreset,
} from '../types';

export const TASK_CATEGORY_METAS: Record<
  TaskCategoryType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  work: { label: 'Work & Projects', emoji: '💼', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  study: { label: 'Learning & English', emoji: '📚', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  code: { label: 'Coding & Dev', emoji: '⚡', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  personal: { label: 'Personal & Life', emoji: '🏡', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  health: { label: 'Health & Fitness', emoji: '🌿', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  quick: { label: 'Quick 2-Min Action', emoji: '⚡', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

export const TASK_PRIORITY_METAS: Record<
  TaskPriorityLevel,
  { label: string; badge: string; color: string }
> = {
  urgent: { label: 'Urgent & High', badge: '🔥 Urgent', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  medium: { label: 'Medium Priority', badge: '⚡ Normal', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  low: { label: 'Low Priority', badge: '🌿 Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
};

export const INITIAL_QUICK_TASKS: QuickTaskItem[] = [
  {
    id: 'task-1',
    title: 'Review English grammar & idioms lesson on Myraa',
    description: 'Complete 5 minutes of spoken pronunciation practice and quiz.',
    priority: 'urgent',
    category: 'study',
    completed: false,
    createdAt: Date.now() - 3600000,
    estimatedMinutes: 10,
    tags: ['English', 'Speaking'],
  },
  {
    id: 'task-2',
    title: 'Test React custom hook in Code Studio',
    description: 'Implement useDebounce and check live execution output.',
    priority: 'urgent',
    category: 'code',
    completed: false,
    createdAt: Date.now() - 7200000,
    estimatedMinutes: 15,
    tags: ['React', 'Dev'],
  },
  {
    id: 'task-3',
    title: 'Hydrate & 2-minute box breathing meditation',
    description: 'Drink a glass of water and activate guided breathing HUD.',
    priority: 'medium',
    category: 'health',
    completed: true,
    createdAt: Date.now() - 10800000,
    estimatedMinutes: 2,
    tags: ['Wellness'],
  },
  {
    id: 'task-4',
    title: 'Review daily crypto market & portfolio ticker',
    description: 'Check BTC & ETH levels and calculate take-profit targets.',
    priority: 'low',
    category: 'work',
    completed: false,
    createdAt: Date.now() - 14400000,
    estimatedMinutes: 5,
    tags: ['Finance'],
  },
];

export const DAILY_SPRINT_PRESETS: DailySprintPreset[] = [
  {
    id: 'sprint-coder',
    name: 'Developer Power Hour',
    emoji: '💻',
    description: 'Focused coding sprint to build, test, and ship clean software.',
    tasks: [
      { title: 'Write & test core API endpoints', category: 'code', priority: 'urgent', estimatedMinutes: 25 },
      { title: 'Review pull request & git diffs', category: 'code', priority: 'medium', estimatedMinutes: 15 },
      { title: 'Refactor utility functions with clean types', category: 'code', priority: 'low', estimatedMinutes: 20 },
    ],
  },
  {
    id: 'sprint-language',
    name: 'Multilingual Fluency Sprint',
    emoji: '🌍',
    description: 'Daily speaking, vocabulary, and grammar mastery routine.',
    tasks: [
      { title: 'Read 3 key business English idioms aloud', category: 'study', priority: 'urgent', estimatedMinutes: 10 },
      { title: 'Complete interactive coffee shop roleplay', category: 'study', priority: 'medium', estimatedMinutes: 15 },
      { title: 'Score 100% on English grammar quiz', category: 'study', priority: 'low', estimatedMinutes: 10 },
    ],
  },
  {
    id: 'sprint-mindset',
    name: 'High-Performance Day Plan',
    emoji: '🚀',
    description: 'Clear mind, structured goals, and rapid task execution.',
    tasks: [
      { title: 'Identify top 3 non-negotiable goals for today', category: 'work', priority: 'urgent', estimatedMinutes: 5 },
      { title: 'Send critical status updates to team', category: 'work', priority: 'medium', estimatedMinutes: 10 },
      { title: 'Clear inbox and organize files', category: 'personal', priority: 'low', estimatedMinutes: 15 },
    ],
  },
];
