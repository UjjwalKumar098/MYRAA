import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarTrackedEvent, VoiceNote, ContrastMode, QuickTaskItem } from '../types';
import {
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Sparkles,
  MapPin,
  Users,
  CheckSquare,
  Volume2,
} from 'lucide-react';
import { formatEventCountdown } from '../utils/calendarEventExtractor';

interface CalendarEventTrackerViewProps {
  events?: CalendarTrackedEvent[];
  voiceNotes?: VoiceNote[];
  contrastMode?: ContrastMode;
  onUpdateEvent?: (event: CalendarTrackedEvent) => void;
  onAddEvent?: (event: CalendarTrackedEvent) => void;
  onDeleteEvent?: (id: string) => void;
  onAddQuickTasks?: (tasks: QuickTaskItem[]) => void;
  onTriggerAlert?: (event: CalendarTrackedEvent) => void;
  onRunWatchdogPipeline?: () => void;
}

export const CalendarEventTrackerView: React.FC<CalendarEventTrackerViewProps> = ({
  events = [],
  voiceNotes = [],
  contrastMode = 'cosmic',
  onUpdateEvent,
  onAddEvent,
  onDeleteEvent,
  onAddQuickTasks,
  onTriggerAlert,
  onRunWatchdogPipeline,
}) => {
  const isTrueBlack = contrastMode === 'true-black';
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState<string>('15:00');
  const [newCategory, setNewCategory] = useState<CalendarTrackedEvent['category']>('meeting');
  const [newLocation, setNewLocation] = useState<string>('Online');

  const filteredEvents = events.filter((e) => {
    if (filterCategory === 'all') return true;
    return e.category === filterCategory;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: CalendarTrackedEvent = {
      id: `ev_${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      datetime: `${newDate}T${newTime}:00`,
      category: newCategory,
      location: newLocation || undefined,
      reminderMinutesBefore: 15,
      status: 'scheduled',
      isAutoExtracted: false,
    };

    onAddEvent?.(newEv);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleToggleComplete = (ev: CalendarTrackedEvent) => {
    onUpdateEvent?.({
      ...ev,
      status: ev.status === 'completed' ? 'scheduled' : 'completed',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Autonomous Calendar Event Tracker & Watchdog
          </h3>
          <p className="text-xs text-slate-400">
            Intelligently extracts dates, meetings, deadlines, and flights from voice notes with auto-scheduled reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRunWatchdogPipeline && (
            <button
              onClick={onRunWatchdogPipeline}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isTrueBlack
                  ? 'border-indigo-400/60 bg-black text-indigo-300 hover:bg-neutral-900'
                  : 'border-indigo-500/40 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Run Watchdog Scanner
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'meeting', 'deadline', 'personal', 'flight', 'task'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
              filterCategory === cat
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No calendar events scheduled. Add an event or say &ldquo;Schedule a meeting tomorrow at 3 PM&rdquo; to auto-extract.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isCompleted = ev.status === 'completed';
            const countdown = formatEventCountdown(ev.datetime);

            return (
              <div
                key={ev.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-white/[0.02] border-white/5 opacity-60'
                    : isTrueBlack
                    ? 'bg-black border-neutral-800 hover:border-indigo-500/40'
                    : 'bg-white/5 border-white/10 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(ev)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {ev.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 font-semibold">
                        {ev.category}
                      </span>
                      {ev.isAutoExtracted && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300">
                          AI Extracted
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-indigo-300">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {ev.date} at {ev.time} ({countdown})
                      </span>
                      {ev.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {ev.location}
                        </span>
                      )}
                      {ev.participants && ev.participants.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {ev.participants.join(', ')}
                        </span>
                      )}
                    </div>

                    {ev.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{ev.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {onTriggerAlert && !isCompleted && (
                    <button
                      onClick={() => onTriggerAlert(ev)}
                      title="Test Voice Alert Reminder"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  )}

                  {onDeleteEvent && (
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      title="Delete Event"
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-white/20 text-white space-y-4 shadow-2xl">
            <h4 className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Schedule Calendar Event
            </h4>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Design Architecture Sync"
                  className="w-full mt-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-mono">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Time</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-mono">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="personal">Personal</option>
                    <option value="flight">Flight</option>
                    <option value="task">Task</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Online / Room"
                    className="w-full mt-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
