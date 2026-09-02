import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  X,
  Wifi,
  Radio,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Mic,
  Clock,
  Music,
  Send,
  Timer as TimerIcon,
  FileText,
  Waves,
  Sparkles,
  Search,
  Trash2,
  Copy,
  Check,
  Terminal,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { SessionTelemetry, AssistantState, VoiceCommandRecord, ContrastMode } from '../types';

interface TelemetryDrawerProps {
  isOpen: boolean;
  state: AssistantState;
  telemetry: SessionTelemetry;
  voiceCommands?: VoiceCommandRecord[];
  onClearCommands?: () => void;
  onSelectCommand?: (cmd: string) => void;
  contrastMode?: ContrastMode;
  onClose: () => void;
}

type TabType = 'telemetry' | 'commands';
type CategoryFilter = 'all' | 'media' | 'automation' | 'timer' | 'notes' | 'ambient' | 'emotion' | 'system';

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  isOpen,
  state,
  telemetry,
  voiceCommands = [],
  onClearCommands,
  onSelectCommand,
  contrastMode = 'cosmic',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('commands');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isTrueBlack = contrastMode === 'true-black';

  // Relative time helper
  const getRelativeTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  };

  // Format exact time string
  const formatExactTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Filtered voice commands
  const filteredCommands = useMemo(() => {
    return voiceCommands.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [voiceCommands, selectedCategory, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'media':
        return <Music className="w-3.5 h-3.5 text-pink-400" />;
      case 'automation':
        return <Send className="w-3.5 h-3.5 text-emerald-400" />;
      case 'timer':
        return <TimerIcon className="w-3.5 h-3.5 text-amber-400" />;
      case 'notes':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ambient':
        return <Waves className="w-3.5 h-3.5 text-teal-400" />;
      case 'emotion':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'media':
        return 'text-pink-300 bg-pink-500/10 border-pink-500/30';
      case 'automation':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
      case 'timer':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'notes':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
      case 'ambient':
        return 'text-teal-300 bg-teal-500/10 border-teal-500/30';
      case 'emotion':
        return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full max-w-2xl border rounded-3xl p-5 sm:p-6 shadow-2xl z-10 select-none overflow-hidden flex flex-col max-h-[90vh] ${
            isTrueBlack
              ? 'bg-[#090909] border-white/20'
              : 'bg-[#0a0a10]/95 backdrop-blur-2xl border-white/15'
          }`}
        >
          {/* Header & Tabs */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Assistant Telemetry & Command Logs
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tab Pills */}
          <div className="flex items-center gap-2 mt-4 p-1 rounded-2xl bg-white/[0.04] border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('commands')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'commands'
                  ? isTrueBlack
                    ? 'bg-white text-black shadow'
                    : 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Commands Log</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'commands'
                    ? 'bg-black/20 text-black'
                    : 'bg-white/10 text-neutral-300'
                }`}
              >
                {voiceCommands.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'telemetry'
                  ? isTrueBlack
                    ? 'bg-white text-black shadow'
                    : 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Audio Telemetry HUD</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  state === 'speaking' || state === 'listening'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-neutral-500'
                }`}
              />
            </button>
          </div>

          {/* TAB 1: Voice Commands Log (Scrollable Timestamped List) */}
          {activeTab === 'commands' && (
            <div className="flex flex-col flex-1 min-h-0 mt-4 overflow-hidden">
              {/* Controls Bar: Search + Category Filters + Clear */}
              <div className="flex flex-col gap-2.5 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search processed voice commands..."
                      className={`w-full text-xs pl-8 pr-3 py-2 rounded-xl border outline-none placeholder:text-neutral-500 transition-colors ${
                        isTrueBlack
                          ? 'bg-[#151515] border-white/20 text-white focus:border-white'
                          : 'bg-white/[0.04] border-white/10 text-white focus:border-cyan-400/50'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {voiceCommands.length > 0 && onClearCommands && (
                    <button
                      type="button"
                      onClick={onClearCommands}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                      title="Clear command history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Clear Log</span>
                    </button>
                  )}
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                  {(
                    [
                      { id: 'all', label: 'All Commands' },
                      { id: 'media', label: 'Music & Media' },
                      { id: 'automation', label: 'Automation' },
                      { id: 'timer', label: 'Timers' },
                      { id: 'notes', label: 'Voice Notes' },
                      { id: 'ambient', label: 'Soundscapes' },
                      { id: 'emotion', label: 'Emotion Shifts' },
                      { id: 'system', label: 'System & Clock' },
                    ] as Array<{ id: CategoryFilter; label: string }>
                  ).map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                            : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Command Records List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar min-h-0 py-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, idx) => (
                    <motion.div
                      key={cmd.id || idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border transition-all relative group ${
                        isTrueBlack
                          ? 'bg-[#111111] border-white/10 hover:border-white/25'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          {/* Category Icon Capsule */}
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                            {getCategoryIcon(cmd.category)}
                          </div>

                          {/* Command Content & Metadata */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {/* Category Badge */}
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getCategoryColor(
                                  cmd.category
                                )}`}
                              >
                                {cmd.category}
                              </span>

                              {/* Source Badge */}
                              <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                                {cmd.source === 'quick_prompt' ? (
                                  <>
                                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                    <span>Quick Prompt</span>
                                  </>
                                ) : (
                                  <>
                                    <Mic className="w-2.5 h-2.5 text-cyan-400" />
                                    <span>Voice Command</span>
                                  </>
                                )}
                              </span>

                              {/* Status Indicator */}
                              <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1 ml-auto">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Processed</span>
                              </span>
                            </div>

                            {/* Main Voice Command Text */}
                            <p className="text-sm font-semibold text-white tracking-tight break-words">
                              {cmd.command}
                            </p>

                            {/* Execution Details / Output */}
                            {cmd.details && (
                              <p className="text-xs text-neutral-300 mt-1 bg-black/30 p-2 rounded-lg border border-white/5 font-mono break-words">
                                {cmd.details}
                              </p>
                            )}

                            {/* Timestamp Footer */}
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-neutral-500" />
                                <span>{formatExactTime(cmd.timestamp)}</span>
                              </span>
                              <span>•</span>
                              <span className="text-neutral-400 font-medium">
                                {getRelativeTime(cmd.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Copy & Run */}
                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopy(cmd.id, cmd.command)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                            title="Copy command text"
                          >
                            {copiedId === cmd.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {onSelectCommand && (
                            <button
                              type="button"
                              onClick={() => onSelectCommand(cmd.command)}
                              className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-colors"
                              title="Re-run command"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 px-4">
                    <div className="p-3.5 rounded-full bg-white/5 border border-white/10 mb-3 text-neutral-400">
                      <Mic className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">
                      {searchQuery ? 'No matching commands found' : 'No Voice Commands Processed Yet'}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-sm">
                      {searchQuery
                        ? 'Try searching with different keywords or switch the category filter.'
                        : 'Speak naturally to Myraa or tap a quick prompt to play music, automate WhatsApp, set timers, and manage notes.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Audio Telemetry HUD */}
          {activeTab === 'telemetry' && (
            <div className="flex flex-col flex-1 min-h-0 mt-4 overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3 my-2">
                {/* Live Model & Voice */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live AI Model</span>
                  </div>
                  <span className="text-sm font-semibold text-white font-mono">
                    gemini-3.1-flash
                  </span>
                  <span className="text-[10px] text-cyan-300">Aoede Voice (24kHz)</span>
                </div>

                {/* WebSocket Latency (RTT) */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WebSocket RTT</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-300 font-mono">
                    {state === 'disconnected' ? '--' : `${telemetry.rttMs} ms`}
                  </span>
                  <span className="text-[10px] text-neutral-400">Duplex Stream Channel</span>
                </div>

                {/* Audio Capture Stream */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mic Input Stream</span>
                  </div>
                  <span className="text-sm font-semibold text-white font-mono">16,000 Hz</span>
                  <span className="text-[10px] text-neutral-400">PCM Linear 16-Bit Mono</span>
                </div>

                {/* Audio Synthesis Output */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                    <Radio className="w-3.5 h-3.5 text-pink-400" />
                    <span>AI Playback Rate</span>
                  </div>
                  <span className="text-sm font-semibold text-white font-mono">24,000 Hz</span>
                  <span className="text-[10px] text-neutral-400">Direct Buffer Scheduling</span>
                </div>
              </div>

              {/* Stream Packets Diagnostics */}
              <div className="grid grid-cols-2 gap-3 my-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Audio Packets Sent</span>
                  </div>
                  <span className="text-sm font-semibold text-white font-mono">
                    {telemetry.packetsSent || 0} pkts
                  </span>
                  <span className="text-[10px] text-neutral-400">Outbound Audio Payload</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                    <Layers className="w-3.5 h-3.5 text-pink-400" />
                    <span>Audio Packets Recv</span>
                  </div>
                  <span className="text-sm font-semibold text-white font-mono">
                    {telemetry.packetsReceived || 0} pkts
                  </span>
                  <span className="text-[10px] text-neutral-400">Inbound Synthesized Audio</span>
                </div>
              </div>

              {/* Buffer Pipeline Health */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Audio Stream Status</div>
                    <div className="text-[11px] text-neutral-400">
                      {state === 'speaking'
                        ? 'Transmitting real-time synthesized voice frames'
                        : state === 'listening'
                        ? 'Sampling continuous microphone frames'
                        : 'Stream idle / ready for activation'}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Healthy
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
