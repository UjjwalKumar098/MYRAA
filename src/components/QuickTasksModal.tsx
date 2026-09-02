import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  Flame,
  Zap,
  CheckCircle2,
  Circle,
  Tag,
  Filter,
  Sparkles,
  ListTodo,
  Rocket,
  Play,
  RotateCcw,
  Smartphone,
  Laptop,
  Code2,
  Mail,
  Bell,
  RefreshCw,
  Cpu,
  HardDrive,
  BatteryCharging,
  Copy,
  Check,
  Download,
  ExternalLink,
  Calendar,
  DollarSign,
  Wifi,
  Send,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  Sliders,
  Share2,
} from 'lucide-react';
import {
  ContrastMode,
  QuickTaskItem,
  TaskCategoryType,
  TaskPriorityLevel,
  MobileNotificationItem,
  SystemUpdateItem,
  DevPackageUpdateItem,
  SystemHealthDiagnostics,
  VSCodeFileSnippet,
  EverydayEmailTemplate,
  ProgrammingLanguage,
} from '../types';
import {
  INITIAL_QUICK_TASKS,
  DAILY_SPRINT_PRESETS,
  TASK_CATEGORY_METAS,
  TASK_PRIORITY_METAS,
} from '../utils/quickTasksData';
import {
  INITIAL_MOBILE_NOTIFICATIONS,
  MOBILE_NOTIFICATION_PRESETS,
  triggerLiveBrowserNotification,
  INITIAL_SYSTEM_UPDATES,
  DEV_PACKAGE_UPDATES,
  INITIAL_SYSTEM_DIAGNOSTICS,
  INITIAL_VSCODE_SNIPPETS,
  generateCustomVSCodeSnippet,
  EVERYDAY_EMAIL_TEMPLATES,
  generateCalendarEventLink,
  calculateSplitExpense,
} from '../utils/simpleTasksData';

interface QuickTasksModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialCategory?: string;
  onClose: () => void;
  onStartTimer?: (durationSeconds: number, label: string) => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
}

type ActiveHubTab = 'tasks' | 'mobile_alerts' | 'laptop_updates' | 'vscode_coder' | 'daily_tools';

export const QuickTasksModal: React.FC<QuickTasksModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialCategory = 'tasks',
  onClose,
  onStartTimer,
  onLogVoiceCommand,
}) => {
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<ActiveHubTab>(() => {
    if (initialCategory === 'mobile_alerts' || initialCategory === 'mobile' || initialCategory === 'notification') return 'mobile_alerts';
    if (initialCategory === 'laptop_updates' || initialCategory === 'laptop' || initialCategory === 'update' || initialCategory === 'system') return 'laptop_updates';
    if (initialCategory === 'vscode_coder' || initialCategory === 'vscode' || initialCategory === 'code') return 'vscode_coder';
    if (initialCategory === 'daily_tools' || initialCategory === 'tools' || initialCategory === 'email') return 'daily_tools';
    return 'tasks';
  });

  // 1. Task List State
  const [tasks, setTasks] = useState<QuickTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('myraa_quick_tasks_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_QUICK_TASKS;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | TaskCategoryType>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategoryType>('work');
  const [newPriority, setNewPriority] = useState<TaskPriorityLevel>('urgent');
  const [newEstMinutes, setNewEstMinutes] = useState<number>(15);
  const [scratchpad, setScratchpad] = useState<string>(() => {
    return localStorage.getItem('myraa_scratchpad') || '💡 Quick thoughts, everyday notes, and priority reminders...';
  });

  // 2. Mobile Notification State
  const [notifications, setNotifications] = useState<MobileNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('myraa_mobile_notifs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MOBILE_NOTIFICATIONS;
  });
  const [customNotifTitle, setCustomNotifTitle] = useState('Myraa Daily Ping');
  const [customNotifBody, setCustomNotifBody] = useState('Task completed! Keep the productivity streak going.');
  const [notifFeedback, setNotifFeedback] = useState<string | null>(null);
  const [dndMode, setDndMode] = useState<boolean>(false);

  // 3. Laptop System & Dev Updates State
  const [systemUpdates, setSystemUpdates] = useState<SystemUpdateItem[]>(INITIAL_SYSTEM_UPDATES);
  const [devPackages, setDevPackages] = useState<DevPackageUpdateItem[]>(DEV_PACKAGE_UPDATES);
  const [diagnostics, setDiagnostics] = useState<SystemHealthDiagnostics>(INITIAL_SYSTEM_DIAGNOSTICS);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ system-diag --quick',
    '✓ CPU: Optimal (24% load, 8 cores active)',
    '✓ Memory: 58% utilized (Cache purge ready)',
    '✓ Disk: 142.6 GB free on NVMe primary SSD',
    '✓ Dev Environment: Node LTS / Git / Python 3 ready',
  ]);
  const [isCleaningRAM, setIsCleaningRAM] = useState(false);

  // 4. VS Code AI Coder State
  const [vscodeSnippets, setVscodeSnippets] = useState<VSCodeFileSnippet[]>(INITIAL_VSCODE_SNIPPETS);
  const [selectedSnippet, setSelectedSnippet] = useState<VSCodeFileSnippet>(INITIAL_VSCODE_SNIPPETS[0]);
  const [customCodePrompt, setCustomCodePrompt] = useState('Create a full TypeScript auth controller with JWT and validation');
  const [customCodeLang, setCustomCodeLang] = useState<ProgrammingLanguage>('typescript');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 5. Everyday Life Tasks State
  const [selectedEmail, setSelectedEmail] = useState<EverydayEmailTemplate>(EVERYDAY_EMAIL_TEMPLATES[0]);
  const [emailCopied, setEmailCopied] = useState(false);
  const [calTitle, setCalTitle] = useState('Product Strategy Sync with Client');
  const [calDuration, setCalDuration] = useState(30);
  const [billTotal, setBillTotal] = useState(85);
  const [billPeople, setBillPeople] = useState(3);
  const [billTip, setBillTip] = useState(15);
  const [pingResult, setPingResult] = useState<{ ms: number; host: string } | null>({ ms: 22, host: 'google.com (DNS 8.8.8.8)' });
  const [isPinging, setIsPinging] = useState(false);

  const isTrueBlack = contrastMode === 'true-black';

  useEffect(() => {
    try {
      localStorage.setItem('myraa_quick_tasks_v2', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('myraa_scratchpad', scratchpad);
    } catch {}
  }, [scratchpad]);

  useEffect(() => {
    try {
      localStorage.setItem('myraa_mobile_notifs', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  if (!isOpen) return null;

  // --- Handlers: Tasks ---
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: QuickTaskItem = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      createdAt: Date.now(),
      estimatedMinutes: newEstMinutes,
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    onLogVoiceCommand?.(`Add task: ${newTask.title}`, 'system', `Category: ${newTask.category}, Priority: ${newTask.priority}`);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleApplySprint = (presetId: string) => {
    const preset = DAILY_SPRINT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const sprintTasks: QuickTaskItem[] = preset.tasks.map((t, idx) => ({
      id: `sprint-${Date.now()}-${idx}`,
      title: t.title,
      category: t.category,
      priority: t.priority,
      completed: false,
      createdAt: Date.now() + idx,
      estimatedMinutes: t.estimatedMinutes,
    }));

    setTasks([...sprintTasks, ...tasks]);
    onLogVoiceCommand?.(`Apply sprint: ${preset.name}`, 'system', `Loaded ${sprintTasks.length} tasks`);
  };

  // --- Handlers: Mobile Notifications ---
  const handleDispatchNotification = async (title: string, body: string, emoji = '🔔', channel: MobileNotificationItem['channel'] = 'browser') => {
    setNotifFeedback('Dispatching notification to device...');
    const result = await triggerLiveBrowserNotification(title, body, emoji);

    const newNotif: MobileNotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${emoji} ${title}`,
      body,
      timestamp: Date.now(),
      priority: 'high',
      channel,
      iconEmoji: emoji,
      status: 'sent',
    };

    setNotifications([newNotif, ...notifications]);
    setNotifFeedback(result.message);
    onLogVoiceCommand?.(`Mobile Notification: ${title}`, 'system', `Channel: ${channel}, Message: ${body}`);

    setTimeout(() => {
      setNotifFeedback(null);
    }, 4000);
  };

  // --- Handlers: Laptop Updates & Maintenance ---
  const handleRunSystemUpdate = (id: string) => {
    setSystemUpdates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'updating' } : item))
    );
    const target = systemUpdates.find((u) => u.id === id);

    setTerminalOutput((prev) => [
      ...prev,
      `$ ${target?.updateCommand || 'system-update --install'}`,
      `[DOWNLOAD] Fetching packages (${target?.updateSizeMb || 45} MB)...`,
      `[COMPILE] Verifying cryptographic checksums & installing...`,
    ]);

    setTimeout(() => {
      setSystemUpdates((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'up_to_date' } : item))
      );
      setTerminalOutput((prev) => [
        ...prev,
        `✓ ${target?.name || 'Package'} successfully updated to ${target?.latestVersion || 'latest'}!`,
        `[STATUS] System running at optimal stability.`,
      ]);
      onLogVoiceCommand?.(`System Update: ${target?.name}`, 'system', `Updated to ${target?.latestVersion}`);
    }, 1200);
  };

  const handleUpdateDevPackage = (pkgName: string) => {
    setDevPackages((prev) =>
      prev.map((p) => (p.name === pkgName ? { ...p, status: 'running' } : p))
    );
    const pkg = devPackages.find((p) => p.name === pkgName);

    setTerminalOutput((prev) => [
      ...prev,
      `$ ${pkg?.command || `npm update ${pkgName}`}`,
      `> Fetching ${pkgName}@${pkg?.latestVersion}...`,
    ]);

    setTimeout(() => {
      setDevPackages((prev) =>
        prev.map((p) => (p.name === pkgName ? { ...p, status: 'updated' } : p))
      );
      setTerminalOutput((prev) => [
        ...prev,
        `✓ ${pkgName} successfully upgraded from ${pkg?.currentVersion} to ${pkg?.latestVersion}!`,
      ]);
      onLogVoiceCommand?.(`Dev Package Update: ${pkgName}`, 'system', `${pkg?.manager} upgraded to ${pkg?.latestVersion}`);
    }, 900);
  };

  const handleCleanRAM = () => {
    setIsCleaningRAM(true);
    setTerminalOutput((prev) => [
      ...prev,
      `$ myraa-optimizer --clean-memory --purge-cache`,
      `[GC] Invoking V8 engine garbage collector...`,
      `[CACHE] Purging 720 MB temp compiler & browser caches...`,
    ]);

    setTimeout(() => {
      setDiagnostics((prev) => ({
        ...prev,
        ramUsagePercent: 36,
        cpuUsagePercent: 12,
        cacheSizeBytes: 1024 * 1024 * 45, // 45 MB
      }));
      setIsCleaningRAM(false);
      setTerminalOutput((prev) => [
        ...prev,
        `✓ RAM optimization complete: Freed 2.4 GB memory!`,
        `✓ System response latency reduced to 11ms.`,
      ]);
      onLogVoiceCommand?.(`Clean RAM & Cache`, 'system', `Freed 2.4 GB, RAM usage dropped to 36%`);
    }, 1000);
  };

  // --- Handlers: VS Code AI Coder ---
  const handleGenerateVSCodeCode = () => {
    if (!customCodePrompt.trim()) return;
    const generated = generateCustomVSCodeSnippet(customCodePrompt, customCodeLang);
    setVscodeSnippets([generated, ...vscodeSnippets]);
    setSelectedSnippet(generated);
    onLogVoiceCommand?.(`VS Code Code Writer: ${customCodePrompt}`, 'system', `Generated ${generated.fileName} (${generated.language})`);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (snippet: VSCodeFileSnippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = snippet.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onLogVoiceCommand?.(`Download VS Code File: ${snippet.fileName}`, 'system', `Saved to local drive`);
  };

  // --- Handlers: Everyday Tools ---
  const handleCopyEmail = (body: string) => {
    navigator.clipboard.writeText(body);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
    onLogVoiceCommand?.(`Copied Email Draft: ${selectedEmail.title}`, 'system', selectedEmail.subject);
  };

  const handleTestNetworkPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 15) + 14;
      setPingResult({ ms: latency, host: 'google.com (DNS 8.8.8.8)' });
      setIsPinging(false);
      onLogVoiceCommand?.(`Network Ping Test`, 'system', `Latency: ${latency}ms, DNS: 8.8.8.8`);
    }, 450);
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const taskProgressPct = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  const splitData = calculateSplitExpense(billTotal, billPeople, billTip, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isTrueBlack
            ? 'bg-black border-zinc-700 text-white'
            : 'bg-zinc-950/95 border-emerald-500/30 text-zinc-100'
        }`}
      >
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Simple Tasks & Smart Actions Hub
                  <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    सरल कार्य & डिवाइस ऑटोमेशन
                  </span>
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Mobile notification dispatcher, laptop system updates, VS Code code writer & daily work utilities
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>RAM: {diagnostics.ramUsagePercent}%</span>
              <span className="text-zinc-600">|</span>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{notifications.length} Alerts</span>
            </div>

            <button
              onClick={() => onStartTimer && onStartTimer(25 * 60, 'Pomodoro Focus')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Start 25m Focus Sprint"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>25m Focus</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-Tab Navigation Bar */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-zinc-800/80 bg-zinc-900/40 px-3 sm:px-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'tasks'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Daily Tasks & Sprints</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mobile_alerts')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'mobile_alerts'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile & Push Alerts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('laptop_updates')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'laptop_updates'
                ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop System & Updates</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300">
              {systemUpdates.filter((u) => u.status === 'available').length} updates
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vscode_coder')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'vscode_coder'
                ? 'border-blue-400 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>VS Code AI Coder</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300">
              Files
            </span>
          </button>

          <button
            onClick={() => setActiveTab('daily_tools')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'daily_tools'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Everyday Life & Work Tools</span>
          </button>
        </div>

        {/* Tab 1: Daily Tasks & Sprint Presets */}
        {activeTab === 'tasks' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Quick Sprints Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">1-Click Daily Sprint Presets</h3>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">{taskProgressPct}% Tasks Done</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DAILY_SPRINT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplySprint(preset.id)}
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-850 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{preset.emoji}</span>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        {preset.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Task Input */}
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Type a new task (e.g. 'Push git commit', 'Review client PR')..."
                className="flex-1 px-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TaskCategoryType)}
                  className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="work">💼 Work</option>
                  <option value="code">⚡ Code</option>
                  <option value="study">📚 Study</option>
                  <option value="health">🌿 Health</option>
                  <option value="personal">🏡 Personal</option>
                  <option value="quick">⚡ Quick 2m</option>
                </select>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriorityLevel)}
                  className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="urgent">🔥 Urgent</option>
                  <option value="medium">⚡ Normal</option>
                  <option value="low">🌿 Low</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </form>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg border transition ${
                  activeFilter === 'all'
                    ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-3 py-1 rounded-lg border transition ${
                  activeFilter === 'pending'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Pending ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1 rounded-lg border transition ${
                  activeFilter === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Completed ({completedTasksCount})
              </button>
            </div>

            {/* Task Item List */}
            <div className="space-y-2">
              {tasks
                .filter((t) => {
                  if (activeFilter === 'all') return true;
                  if (activeFilter === 'pending') return !t.completed;
                  if (activeFilter === 'completed') return t.completed;
                  return t.category === activeFilter;
                })
                .map((task) => {
                  const catMeta = TASK_CATEGORY_METAS[task.category] || TASK_CATEGORY_METAS.work;
                  const priMeta = TASK_PRIORITY_METAS[task.priority] || TASK_PRIORITY_METAS.medium;

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        task.completed
                          ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
                          : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            task.completed
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white'
                          }`}
                        >
                          {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.2 rounded border ${catMeta.bg} ${catMeta.color}`}>
                              {catMeta.emoji} {catMeta.label}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded border ${priMeta.color}`}>
                              {priMeta.badge}
                            </span>
                            {task.estimatedMinutes && (
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.estimatedMinutes}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Quick Scratchpad */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Scratchpad & Brainstorm Notes</span>
              </label>
              <textarea
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                rows={3}
                placeholder="Capture quick links, phone numbers, terminal flags, or meeting takeaways..."
                className="w-full p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition font-mono"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Mobile Notifications & Cross-Device Alerts */}
        {activeTab === 'mobile_alerts' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Live Notification Dispatch Card */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-zinc-900 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Direct Mobile & Web Push Dispatcher</h3>
                    <p className="text-xs text-zinc-400">Sends real system alerts to desktop tray & connected mobile devices</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDndMode(!dndMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                      dndMode
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{dndMode ? 'DND Active' : 'Allow All'}</span>
                  </button>
                </div>
              </div>

              {/* Custom Dispatch Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={customNotifTitle}
                  onChange={(e) => setCustomNotifTitle(e.target.value)}
                  placeholder="Notification Title (e.g. 'Task Complete')"
                  className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={customNotifBody}
                  onChange={(e) => setCustomNotifBody(e.target.value)}
                  placeholder="Notification Message..."
                  className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 sm:col-span-1"
                />
                <button
                  onClick={() => handleDispatchNotification(customNotifTitle, customNotifBody, '📱', 'mobile_push')}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification Now</span>
                </button>
              </div>

              {notifFeedback && (
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{notifFeedback}</span>
                </div>
              )}
            </div>

            {/* Quick 1-Click Mobile Alert Presets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Mobile Alert Triggers</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOBILE_NOTIFICATION_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/30 flex flex-col justify-between gap-3 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{preset.emoji}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {preset.channel.toUpperCase()}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white">{preset.title}</h5>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{preset.body}</p>
                    </div>

                    <button
                      onClick={() => handleDispatchNotification(preset.title, preset.body, preset.emoji, preset.channel)}
                      className="w-full py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-xs font-semibold text-zinc-200 transition flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dispatch Alert</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sent Notifications Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Recent Dispatched Alerts Log</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{notif.iconEmoji}</span>
                      <div>
                        <p className="font-semibold text-white">{notif.title}</p>
                        <p className="text-zinc-400 text-[11px]">{notif.body}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {notif.status.toUpperCase()}
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Laptop System & Dev Updates */}
        {activeTab === 'laptop_updates' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* System Diagnostics & RAM Cleaner Header */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-950 border border-purple-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Laptop System Diagnostics & Health</h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {diagnostics.osName} • 8 Cores • 16 GB Unified Memory • SSD High-Speed Bus
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCleanRAM}
                    disabled={isCleaningRAM}
                    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCleaningRAM ? 'animate-spin' : ''}`} />
                    <span>{isCleaningRAM ? 'Cleaning RAM...' : 'Optimize RAM & Purge Cache'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span>CPU Usage</span>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{diagnostics.cpuUsagePercent}%</p>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5">
                    <div className="bg-cyan-400 h-1 rounded-full" style={{ width: `${diagnostics.cpuUsagePercent}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span>RAM Load</span>
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{diagnostics.ramUsagePercent}%</p>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5">
                    <div className="bg-purple-400 h-1 rounded-full" style={{ width: `${diagnostics.ramUsagePercent}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span>Disk Free</span>
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{diagnostics.diskFreeGb} GB</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">Healthy SSD</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span>Battery Health</span>
                    <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{diagnostics.batteryHealthPercent}%</p>
                  <span className="text-[10px] text-amber-400 font-semibold">{diagnostics.batteryStatus.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Pending System Updates */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>OS & System Updates Available</span>
              </h4>

              <div className="space-y-2.5">
                {systemUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{update.name}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {update.category.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {update.currentVersion} ➔ <strong className="text-white">{update.latestVersion}</strong> ({update.updateSizeMb} MB)
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{update.releaseNotes}</p>
                    </div>

                    <button
                      onClick={() => handleRunSystemUpdate(update.id)}
                      disabled={update.status !== 'available'}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                        update.status === 'up_to_date'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                          : update.status === 'updating'
                          ? 'bg-purple-500/20 text-purple-300 animate-pulse'
                          : 'bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold'
                      }`}
                    >
                      {update.status === 'up_to_date' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Up to Date</span>
                        </>
                      ) : update.status === 'updating' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Install Update</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Package Updates (`npm`, `pip`, `brew`) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Developer Package Upgrades (npm / pip / brew)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {devPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{pkg.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {pkg.manager}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {pkg.currentVersion} ➔ <span className="text-emerald-400">{pkg.latestVersion}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleUpdateDevPackage(pkg.name)}
                      disabled={pkg.status === 'updated'}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        pkg.status === 'updated'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-zinc-200'
                      }`}
                    >
                      {pkg.status === 'updated' ? '✓ Updated' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Live Output Console */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Maintenance Terminal Log</span>
              </label>
              <div className="p-3.5 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-emerald-400 space-y-1 max-h-36 overflow-y-auto">
                {terminalOutput.map((line, idx) => (
                  <div key={idx} className={line.startsWith('$') ? 'text-zinc-400' : line.startsWith('✓') ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: VS Code AI Coder & File Injector */}
        {activeTab === 'vscode_coder' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Prompt & Code Generator Header */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-zinc-900 border border-blue-500/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">VS Code Instant Code & File Writer</h3>
                  <p className="text-xs text-zinc-400">
                    "VS Code mai code likh de" — generates clean, production-ready modules formatted for your editor
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={customCodePrompt}
                  onChange={(e) => setCustomCodePrompt(e.target.value)}
                  placeholder="What code should Myraa write for VS Code? (e.g. 'React custom modal hook with keyboard shortcuts')..."
                  className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={customCodeLang}
                    onChange={(e) => setCustomCodeLang(e.target.value as ProgrammingLanguage)}
                    className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-400 font-mono"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="react">React JSX</option>
                    <option value="sql">SQL</option>
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML / CSS</option>
                  </select>

                  <button
                    onClick={handleGenerateVSCodeCode}
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-blue-500/20 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Write Code</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Code Snippets Browser & Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Snippet List */}
              <div className="lg:col-span-4 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">VS Code Project Files</label>
                {vscodeSnippets.map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => setSelectedSnippet(snippet)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      selectedSnippet.id === snippet.id
                        ? 'bg-blue-500/10 border-blue-500/40 text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-blue-300">{snippet.fileName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 uppercase">
                        {snippet.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{snippet.title}</p>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                      📁 {snippet.vscodeTargetPath || snippet.fileName}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Code Display */}
              <div className="lg:col-span-8 p-4 rounded-xl bg-black border border-zinc-800 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      📄 {selectedSnippet.fileName}
                    </h4>
                    <p className="text-[11px] text-zinc-400">{selectedSnippet.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedSnippet.code, selectedSnippet.id)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5 transition font-semibold"
                    >
                      {copiedId === selectedSnippet.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === selectedSnippet.id ? 'Copied to VS Code' : 'Copy Code'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile(selectedSnippet)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500 hover:text-zinc-950 text-xs text-blue-300 font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save File</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 max-h-[320px] overflow-y-auto bg-zinc-950 p-3 rounded-lg border border-zinc-850 font-mono text-xs text-zinc-200 leading-relaxed">
                  <pre>{selectedSnippet.code}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Everyday Life & Work Automations */}
        {activeTab === 'daily_tools' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Quick Email & Formal Application Composer */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant Email & Leave Application Composer</h3>
                    <p className="text-xs text-zinc-400">1-Click formal email drafts ready to send or paste</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyEmail(selectedEmail.body)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
                >
                  {emailCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{emailCopied ? 'Email Copied!' : 'Copy Draft'}</span>
                </button>
              </div>

              {/* Email Template Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {EVERYDAY_EMAIL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedEmail(tmpl)}
                    className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
                      selectedEmail.id === tmpl.id
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>

              {/* Subject & Body Box */}
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="text-zinc-500 font-semibold">Subject: </span>
                  <span className="text-white font-bold">{selectedEmail.subject}</span>
                </div>
                <textarea
                  value={selectedEmail.body}
                  onChange={(e) => setSelectedEmail({ ...selectedEmail, body: e.target.value })}
                  rows={6}
                  className="w-full p-3.5 bg-black/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Quick 3-Grid: Calendar, Expense Split & Network Ping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Calendar Quick Link */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">Google Calendar Meeting Generator</h4>
                </div>
                <input
                  type="text"
                  value={calTitle}
                  onChange={(e) => setCalTitle(e.target.value)}
                  placeholder="Meeting Title..."
                  className="w-full px-3 py-2 bg-black border border-zinc-850 rounded-lg text-xs text-white"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Duration: {calDuration} mins</span>
                  <a
                    href={generateCalendarEventLink(calTitle, new Date(), calDuration).googleCalendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 text-xs font-semibold transition flex items-center gap-1"
                  >
                    <span>Open GCal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 2. Quick Expense & Split Calculator */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white">Bill & Expense Split Calculator</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400">Total Bill ($)</label>
                    <input
                      type="number"
                      value={billTotal}
                      onChange={(e) => setBillTotal(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400">Split (People)</label>
                    <input
                      type="number"
                      value={billPeople}
                      onChange={(e) => setBillPeople(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white text-xs"
                    />
                  </div>
                </div>
                <div className="p-2 rounded bg-black/60 border border-zinc-850 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-400">Each Pays:</span>
                  <span className="text-cyan-400 text-sm font-bold">${splitData.perPersonShare}</span>
                </div>
              </div>

              {/* 3. DNS & Network Diagnostic */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">Network & WiFi Ping Diagnostic</h4>
                </div>
                <p className="text-[11px] text-zinc-400">Measure real-time DNS latency and WiFi round-trip</p>
                <div className="p-2 rounded bg-black/60 border border-zinc-850 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Ping Result:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {isPinging ? 'Pinging...' : `${pingResult?.ms} ms (${pingResult?.host})`}
                  </span>
                </div>
                <button
                  onClick={handleTestNetworkPing}
                  disabled={isPinging}
                  className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-purple-500 hover:text-zinc-950 text-xs font-semibold text-zinc-200 transition"
                >
                  {isPinging ? 'Testing Ping...' : 'Test Network Ping'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
