import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AutomationPipeline,
  AutomationStep,
  DocumentAnalysisResult,
  ContrastMode,
  QuickTaskItem,
  CalendarTrackedEvent,
  VoiceNote,
} from '../types';
import {
  INITIAL_AUTOMATION_PIPELINES,
  extractDocumentIntelligence,
  SAMPLE_MEETING_TRANSCRIPTS,
} from '../utils/automatedWorkflowsData';
import {
  extractCalendarEventsFromVoiceNotes,
  checkUpcomingEventsForAlert,
  formatEventCountdown,
} from '../utils/calendarEventExtractor';
import { CalendarEventTrackerView } from './CalendarEventTrackerView';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  FileText,
  Sparkles,
  Terminal,
  Activity,
  ArrowRight,
  TrendingUp,
  CloudSun,
  Code2,
  CheckSquare,
  GraduationCap,
  Volume2,
  Mic,
  Moon,
  Headphones,
  RotateCcw,
  X,
  Copy,
  Plus,
  Flame,
  AlertCircle,
  Cpu,
} from 'lucide-react';

interface AutonomousPipelineModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialTab?: 'pipelines' | 'runner' | 'doc_extractor' | 'scheduler' | 'calendar_tracker';
  activePipelineId?: string;
  calendarEvents?: CalendarTrackedEvent[];
  voiceNotes?: VoiceNote[];
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: string, detail?: string, source?: string) => void;
  onAddQuickTasks?: (tasks: Partial<QuickTaskItem>[]) => void;
  onPlayAmbientSound?: (soundId: string) => void;
  onStartBreathing?: (technique?: any) => void;
  onUpdateCalendarEvent?: (event: CalendarTrackedEvent) => void;
  onAddCalendarEvent?: (event: CalendarTrackedEvent) => void;
  onDeleteCalendarEvent?: (id: string) => void;
  onTriggerCalendarAlert?: (event: CalendarTrackedEvent) => void;
}

export const AutonomousPipelineModal: React.FC<AutonomousPipelineModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialTab = 'pipelines',
  activePipelineId,
  calendarEvents = [],
  voiceNotes = [],
  onClose,
  onLogVoiceCommand,
  onAddQuickTasks,
  onPlayAmbientSound,
  onStartBreathing,
  onUpdateCalendarEvent,
  onAddCalendarEvent,
  onDeleteCalendarEvent,
  onTriggerCalendarAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'pipelines' | 'runner' | 'doc_extractor' | 'scheduler' | 'calendar_tracker'>(initialTab);
  const [pipelines, setPipelines] = useState<AutomationPipeline[]>(INITIAL_AUTOMATION_PIPELINES);
  const [selectedPipeline, setSelectedPipeline] = useState<AutomationPipeline>(
    INITIAL_AUTOMATION_PIPELINES.find((p) => p.id === activePipelineId) || INITIAL_AUTOMATION_PIPELINES[0]
  );

  // Live Runner State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [executionLogs, setExecutionLogs] = useState<Array<{ timestamp: string; stepTitle: string; message: string; type: 'info' | 'success' | 'warn' }>>([]);
  const [executionProgress, setExecutionProgress] = useState<number>(0);
  const [executionStopwatch, setExecutionStopwatch] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  // Document Extractor State
  const [docInputText, setDocInputText] = useState<string>(SAMPLE_MEETING_TRANSCRIPTS[0].text);
  const [docTitle, setDocTitle] = useState<string>(SAMPLE_MEETING_TRANSCRIPTS[0].title);
  const [analyzedDoc, setAnalyzedDoc] = useState<DocumentAnalysisResult | null>(() =>
    extractDocumentIntelligence(SAMPLE_MEETING_TRANSCRIPTS[0].text, SAMPLE_MEETING_TRANSCRIPTS[0].title)
  );
  const [importedTaskCount, setImportedTaskCount] = useState<number>(0);

  const isTrueBlack = contrastMode === 'true-black';

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activePipelineId) {
      const found = pipelines.find((p) => p.id === activePipelineId);
      if (found) setSelectedPipeline(found);
    }
  }, [activePipelineId, pipelines]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, []);

  const handleRunPipeline = (pipelineToRun: AutomationPipeline) => {
    setSelectedPipeline(pipelineToRun);
    setActiveTab('runner');
    setIsExecuting(true);
    setCurrentStepIndex(0);
    setExecutionProgress(0);
    setExecutionStopwatch(0);
    setExecutionLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        stepTitle: 'System Initialization',
        message: `🚀 Initiating autonomous pipeline: "${pipelineToRun.name}" (${pipelineToRun.steps.length} sequential steps)...`,
        type: 'info',
      },
    ]);

    if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    const startTime = Date.now();
    stopwatchRef.current = setInterval(() => {
      setExecutionStopwatch(Math.floor((Date.now() - startTime) / 100) / 10);
    }, 100);

    onLogVoiceCommand?.(
      `Execute Pipeline: ${pipelineToRun.name}`,
      'automation',
      `Autonomous multi-step execution with ${pipelineToRun.steps.length} actions`,
      'pipeline'
    );

    // Sequentially step through
    executeStepSequence(pipelineToRun, 0, startTime);
  };

  const executeStepSequence = (pipeline: AutomationPipeline, stepIdx: number, startTime: number) => {
    if (stepIdx >= pipeline.steps.length) {
      // Finished all steps
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
      setIsExecuting(false);
      setCurrentStepIndex(pipeline.steps.length);
      setExecutionProgress(100);

      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stepTitle: 'Pipeline Complete',
          message: `✨ All ${pipeline.steps.length} steps in "${pipeline.name}" completed in ${Math.floor((Date.now() - startTime) / 1000)}s with 100% success.`,
          type: 'success',
        },
      ]);

      // Update pipeline stats
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipeline.id
            ? {
                ...p,
                totalRunsCompleted: (p.totalRunsCompleted || 0) + 1,
                lastRunTimestamp: Date.now(),
                lastRunStatus: 'success',
              }
            : p
        )
      );
      return;
    }

    const step = pipeline.steps[stepIdx];
    setCurrentStepIndex(stepIdx);
    setExecutionProgress(Math.round(((stepIdx) / pipeline.steps.length) * 100));

    setExecutionLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        stepTitle: step.title,
        message: `Executing step ${stepIdx + 1}/${pipeline.steps.length}: ${step.description}`,
        type: 'info',
      },
    ]);

    // Perform actual real-time side-effects for certain action types
    if (step.actionType === 'add_tasks' && step.params?.tasks) {
      onAddQuickTasks?.(step.params.tasks);
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stepTitle: step.title,
          message: `✓ Injected ${step.params.tasks.length} priority sprint tasks into Quick Tasks queue.`,
          type: 'success',
        },
      ]);
    } else if (step.actionType === 'play_audio' && step.params?.soundId) {
      onPlayAmbientSound?.(step.params.soundId);
    } else if (step.actionType === 'play_audio' && step.params?.technique) {
      onStartBreathing?.(step.params.technique);
    } else if (step.actionType === 'scan_calendar_events') {
      const eventsFound = extractCalendarEventsFromVoiceNotes(voiceNotes);
      let newCount = 0;
      for (const ev of eventsFound) {
        const exists = calendarEvents.some((e) => e.title.toLowerCase() === ev.title.toLowerCase());
        if (!exists) {
          onAddCalendarEvent?.(ev);
          newCount++;
        }
      }
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stepTitle: step.title,
          message: `✓ Scanned ${voiceNotes.length} voice notes: Discovered ${eventsFound.length} date/time schedules (${newCount} new calendar events tracked).`,
          type: 'success',
        },
      ]);
    } else if (step.actionType === 'trigger_event_reminder') {
      const urgentEvents = checkUpcomingEventsForAlert(calendarEvents);
      const targetEvent = urgentEvents[0] || calendarEvents.find((e) => e.status === 'scheduled') || calendarEvents[0];
      if (targetEvent) {
        onTriggerCalendarAlert?.(targetEvent);
        setExecutionLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            stepTitle: step.title,
            message: `⏰ Armed autonomous reminder alert for: "${targetEvent.title}" (Starting at ${targetEvent.time}). Vocal alert & HUD dispatched!`,
            type: 'success',
          },
        ]);
      }
    } else if (step.actionType === 'speak_briefing' && step.params?.text) {
      if ('speechSynthesis' in window) {
        try {
          const utt = new SpeechSynthesisUtterance(step.params.text);
          utt.rate = 1.05;
          window.speechSynthesis.speak(utt);
        } catch {}
      }
    }

    // Schedule next step
    timerRef.current = setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stepTitle: step.title,
          message: `✓ Finished: ${step.title} (${step.durationMs}ms)`,
          type: 'success',
        },
      ]);

      executeStepSequence(pipeline, stepIdx + 1, startTime);
    }, step.durationMs);
  };

  const handleAnalyzeDocument = () => {
    const result = extractDocumentIntelligence(docInputText, docTitle);
    setAnalyzedDoc(result);
    setImportedTaskCount(0);
    onLogVoiceCommand?.(
      `AI Document Analysis: "${docTitle}"`,
      'ai',
      `Extracted ${result.extractedTasks.length} tasks and ${result.keyDecisions.length} key decisions`,
      'doc_ai'
    );
  };

  const handleImportAllExtractedTasks = () => {
    if (!analyzedDoc || analyzedDoc.extractedTasks.length === 0) return;
    onAddQuickTasks?.(analyzedDoc.extractedTasks);
    setImportedTaskCount(analyzedDoc.extractedTasks.length);
    onLogVoiceCommand?.(
      `Imported ${analyzedDoc.extractedTasks.length} Tasks`,
      'automation',
      `Synchronized with Quick Tasks Hub from document extraction`,
      'doc_ai'
    );
  };

  const toggleCronSchedule = (pipelineId: string) => {
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === pipelineId ? { ...p, autoRunEnabled: !p.autoRunEnabled } : p
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      id="autonomous-pipeline-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl ${
          isTrueBlack
            ? 'bg-black border-white/20 text-white'
            : 'bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-amber-500/30 text-slate-100'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isTrueBlack ? 'border-white/10 bg-neutral-950' : 'border-amber-500/20 bg-amber-950/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-wide">Autonomous Workflows & Task Pipelines</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  v3.4 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-step autonomous task pipelines, live execution runner & AI document action extractor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="close-pipeline-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`flex items-center gap-2 px-6 py-2.5 border-b overflow-x-auto ${
            isTrueBlack ? 'border-white/10 bg-black' : 'border-white/5 bg-slate-950/60'
          }`}
        >
          <button
            onClick={() => setActiveTab('pipelines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pipelines'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Workflow Pipelines</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {pipelines.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('runner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'runner'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin text-amber-300' : ''}`} />
            <span>Live Runner HUD</span>
            {isExecuting && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('doc_extractor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'doc_extractor'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document & Meeting AI</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'scheduler'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Autonomous Cron Scheduler</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar_tracker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'calendar_tracker'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Calendar & Voice Reminders</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {calendarEvents.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: WORKFLOW PIPELINES */}
          {activeTab === 'pipelines' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Autonomous Multi-Step Presets
                  </h3>
                  <p className="text-xs text-slate-400">
                    One-click autonomous pipelines combining live radar, market news, task scaffolding & voice synthesis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pipelines.map((pipeline) => {
                  const isSelected = selectedPipeline.id === pipeline.id;
                  return (
                    <div
                      key={pipeline.id}
                      className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500/60 bg-gradient-to-br from-amber-500/15 to-orange-500/5 shadow-lg shadow-amber-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl p-2 rounded-xl bg-white/10 flex items-center justify-center">
                              {pipeline.emoji}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                {pipeline.name}
                              </h4>
                              <span className="text-[11px] font-mono text-amber-300">
                                ~{pipeline.estimatedRuntimeSec}s runtime • {pipeline.steps.length} sequential steps
                              </span>
                            </div>
                          </div>
                          {pipeline.cronSchedule && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-slate-300">
                              {pipeline.cronSchedule}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {pipeline.description}
                        </p>

                        {/* Step summary pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pipeline.steps.map((s, idx) => (
                            <div
                              key={s.id}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] text-slate-300 font-mono"
                            >
                              <span className="text-amber-400 font-bold">{idx + 1}.</span>
                              <span className="truncate max-w-[140px]">{s.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                        <div className="text-[11px] text-slate-400">
                          Runs: <span className="font-bold text-white">{pipeline.totalRunsCompleted || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pipeline.id === 'calendar_event_watchdog' && (
                            <button
                              onClick={() => setActiveTab('calendar_tracker')}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-all flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>View Calendar Timeline</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setActiveTab('runner');
                            }}
                            className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                          >
                            Inspect Steps
                          </button>
                          <button
                            onClick={() => handleRunPipeline(pipeline)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run Autonomous Pipeline</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE RUNNER HUD */}
          {activeTab === 'runner' && (
            <div className="space-y-6">
              {/* Pipeline Hero Status */}
              <div
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isTrueBlack
                    ? 'border-white/15 bg-neutral-950'
                    : 'border-amber-500/30 bg-amber-500/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-3xl p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30">
                    {selectedPipeline.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedPipeline.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isExecuting
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : currentStepIndex >= selectedPipeline.steps.length
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {isExecuting ? 'Running Live' : currentStepIndex >= selectedPipeline.steps.length ? 'Completed' : 'Ready'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{selectedPipeline.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Stopwatch</div>
                    <div className="text-sm font-bold text-amber-300">{executionStopwatch.toFixed(1)}s</div>
                  </div>

                  <button
                    disabled={isExecuting}
                    onClick={() => handleRunPipeline(selectedPipeline)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                      isExecuting
                        ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                    }`}
                  >
                    <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : 'fill-current'}`} />
                    <span>{isExecuting ? 'Executing Sequence...' : 'Re-Run Pipeline'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Execution Progress</span>
                  <span className="font-bold text-amber-300">{executionProgress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${executionProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Step Sequence Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sequential Step Pipeline ({selectedPipeline.steps.length} Steps)
                </h4>

                <div className="space-y-2">
                  {selectedPipeline.steps.map((step, idx) => {
                    const isStepRunning = isExecuting && currentStepIndex === idx;
                    const isStepComplete = currentStepIndex > idx || (!isExecuting && currentStepIndex >= selectedPipeline.steps.length);
                    const isStepPending = currentStepIndex < idx;

                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                          isStepRunning
                            ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10'
                            : isStepComplete
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : 'border-white/5 bg-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isStepRunning
                                ? 'bg-amber-400 text-slate-950 animate-bounce'
                                : isStepComplete
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            {isStepComplete ? (
                              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{step.title}</span>
                              <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-white/10 text-slate-300">
                                {step.actionType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">{step.description}</p>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs text-slate-400">
                          {isStepRunning && <span className="text-amber-300 animate-pulse">Running...</span>}
                          {isStepComplete && <span className="text-emerald-400 font-bold">✓ {step.durationMs}ms</span>}
                          {isStepPending && <span>~{step.durationMs}ms</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stdout & Telemetry Logs */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Execution Logs</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Autonomous telemetry feed</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                  {executionLogs.length === 0 ? (
                    <div className="text-slate-500 italic py-2">Click 'Run Autonomous Pipeline' to start stream...</div>
                  ) : (
                    executionLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-slate-500 text-[10px] shrink-0">[{log.timestamp}]</span>
                        <span
                          className={`font-semibold shrink-0 ${
                            log.type === 'success'
                              ? 'text-emerald-400'
                              : log.type === 'warn'
                              ? 'text-amber-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          [{log.stepTitle}]
                        </span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT & MEETING AI EXTRACTOR */}
          {activeTab === 'doc_extractor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  AI Document & Meeting Action Item Extractor
                </h3>
                <p className="text-xs text-slate-400">
                  Paste raw meeting notes, requirements, or voice transcripts. Myraa extracts an executive summary, key decisions, and automatically converts action items into 1-click Quick Tasks.
                </p>
              </div>

              {/* Sample Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Load Sample:</span>
                {SAMPLE_MEETING_TRANSCRIPTS.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDocTitle(sample.title);
                      setDocInputText(sample.text);
                    }}
                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all truncate max-w-[200px]"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>

              {/* Text Input Area */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Document / Meeting Title..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-semibold"
                />
                <textarea
                  rows={6}
                  value={docInputText}
                  onChange={(e) => setDocInputText(e.target.value)}
                  placeholder="Paste meeting transcript, discussion notes, or project requirements here..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyzeDocument}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Run AI Document Intelligence</span>
                  </button>
                </div>
              </div>

              {/* Analysis Output */}
              {analyzedDoc && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  {/* Executive Summary Card */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Executive Synthesis & Sentiment
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                        {analyzedDoc.sentiment}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {analyzedDoc.executiveSummary}
                    </p>
                  </div>

                  {/* Key Decisions */}
                  {analyzedDoc.keyDecisions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Approved Decisions & Consensus ({analyzedDoc.keyDecisions.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {analyzedDoc.keyDecisions.map((dec, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{dec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Extracted Tasks with 1-Click Import */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Extracted Action Items ({analyzedDoc.extractedTasks.length})
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Structured tasks ready for 1-click synchronization into your Quick Tasks queue
                        </p>
                      </div>
                      <button
                        onClick={handleImportAllExtractedTasks}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs active:scale-95 transition-all shadow-md shadow-emerald-500/20"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>
                          {importedTaskCount > 0
                            ? `✓ Injected ${importedTaskCount} Tasks`
                            : `Import ${analyzedDoc.extractedTasks.length} Tasks`}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analyzedDoc.extractedTasks.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                        >
                          <div className="space-y-1 pr-2">
                            <div className="text-xs font-semibold text-white">{t.title}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                                  t.priority === 'urgent'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {t.priority}
                              </span>
                              <span>~{t.estimatedMinutes}m</span>
                              <span>[{t.category}]</span>
                            </div>
                          </div>
                          <CheckSquare className="w-4 h-4 text-slate-500 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUTONOMOUS CRON SCHEDULER */}
          {activeTab === 'scheduler' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Autonomous Cron & Trigger Scheduler
                </h3>
                <p className="text-xs text-slate-400">
                  Configure background automated execution schedules. Myraa runs multi-step pipelines on timer or trigger events.
                </p>
              </div>

              <div className="space-y-3">
                {pipelines.map((pipeline) => (
                  <div
                    key={pipeline.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-white/10">
                        {pipeline.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{pipeline.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300">
                            {pipeline.cronSchedule || 'Manual'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{pipeline.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs font-mono">
                        <div className="text-slate-400">Auto-Run</div>
                        <div className={`font-bold ${pipeline.autoRunEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {pipeline.autoRunEnabled ? 'ACTIVE' : 'PAUSED'}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCronSchedule(pipeline.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${
                          pipeline.autoRunEnabled ? 'bg-emerald-500' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            pipeline.autoRunEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CALENDAR EVENT TRACKER & VOICE REMINDERS */}
          {activeTab === 'calendar_tracker' && (
            <CalendarEventTrackerView
              events={calendarEvents}
              voiceNotes={voiceNotes}
              contrastMode={contrastMode}
              onUpdateEvent={(ev) => onUpdateCalendarEvent?.(ev)}
              onAddEvent={(ev) => onAddCalendarEvent?.(ev)}
              onDeleteEvent={(id) => onDeleteCalendarEvent?.(id)}
              onAddQuickTasks={onAddQuickTasks}
              onTriggerAlert={(ev) => onTriggerCalendarAlert?.(ev)}
              onRunWatchdogPipeline={() => {
                const watchdog = pipelines.find((p) => p.id === 'calendar_event_watchdog');
                if (watchdog) handleRunPipeline(watchdog);
              }}
              onLogVoiceCommand={onLogVoiceCommand}
            />
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div
          className={`flex items-center justify-between px-6 py-3 border-t text-xs text-slate-400 ${
            isTrueBlack ? 'border-white/10 bg-neutral-950' : 'border-amber-500/20 bg-slate-950'
          }`}
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Autonomous Pipeline Engine: Online & Synced</span>
          </div>
          <div className="font-mono text-[11px] text-amber-300">
            Voice Command: "Run Morning Kickoff Pipeline"
          </div>
        </div>
      </motion.div>
    </div>
  );
};
