import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceNote, CalendarTrackedEvent } from '../types';
import { extractCalendarEventFromText } from '../utils/calendarEventExtractor';
import {
  X,
  Trash2,
  Copy,
  Check,
  Clock,
  StickyNote,
  Calendar,
  Zap,
  Sparkles,
  BellRing,
} from 'lucide-react';

interface VoiceNotesDrawerProps {
  isOpen: boolean;
  notes: VoiceNote[];
  onClose: () => void;
  onDeleteNote: (id: string) => void;
  onScheduleEventFromNote?: (event: CalendarTrackedEvent) => void;
  onOpenCalendarTracker?: () => void;
}

export const VoiceNotesDrawer: React.FC<VoiceNotesDrawerProps> = ({
  isOpen,
  notes,
  onClose,
  onDeleteNote,
  onScheduleEventFromNote,
  onOpenCalendarTracker,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [scheduledNoteIds, setScheduledNoteIds] = React.useState<Set<string>>(new Set());

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleScheduleFromNote = (note: VoiceNote) => {
    const event = extractCalendarEventFromText(note.content, note.title, note.id);
    if (event && onScheduleEventFromNote) {
      onScheduleEventFromNote(event);
      setScheduledNoteIds((prev) => new Set(prev).add(note.id));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Slide-over Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-neutral-950/95 border-l border-white/10 backdrop-blur-3xl z-50 flex flex-col p-6 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <StickyNote className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Voice Memory & Notes</h2>
                  <p className="text-xs text-neutral-400">
                    Saved thoughts, schedules & reminders from Myraa
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Tracker Shortcut Banner */}
            {onOpenCalendarTracker && (
              <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-amber-200 font-medium">
                    Calendar Event Tracker & Reminders
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCalendarTracker();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold active:scale-95 transition-all shrink-0"
                >
                  View Timeline
                </button>
              </div>
            )}

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {notes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center px-4">
                  <StickyNote className="w-10 h-10 text-neutral-600 mb-3" />
                  <p className="text-sm font-medium text-neutral-400">No notes captured yet</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Ask Myraa during your voice conversation: <br />
                    <span className="text-cyan-400 italic">
                      "Myraa, remember this meeting tomorrow at 3 PM"
                    </span>
                  </p>
                </div>
              ) : (
                notes.map((note) => {
                  const detectedEvent = extractCalendarEventFromText(note.content, note.title, note.id);
                  const isScheduled = scheduledNoteIds.has(note.id);

                  return (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white/95">{note.title}</h3>
                        {note.category && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-medium uppercase tracking-wider">
                            {note.category}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>

                      {/* Detected Date/Time Schedule & 1-Click Pipeline Reminder */}
                      {detectedEvent && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                          <div className="text-[11px] text-amber-300 flex items-center gap-1.5 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>
                              Detected: {detectedEvent.date} at {detectedEvent.time}
                            </span>
                          </div>

                          <button
                            onClick={() => handleScheduleFromNote(note)}
                            disabled={isScheduled}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              isScheduled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-sm'
                            }`}
                          >
                            {isScheduled ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Pipeline Armed</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 fill-current" />
                                <span>Arm Alert</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(note.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(note.id, `${note.title}\n${note.content}`)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                            title="Copy Note"
                          >
                            {copiedId === note.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
