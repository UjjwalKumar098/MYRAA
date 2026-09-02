import { CalendarTrackedEvent, VoiceNote } from '../types';

const STORAGE_KEY = 'myraa_tracked_calendar_events';

export function getStoredCalendarEvents(): CalendarTrackedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCalendarEvents();
    return JSON.parse(raw);
  } catch (e) {
    return getDefaultCalendarEvents();
  }
}

export function saveStoredCalendarEvents(events: CalendarTrackedEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save calendar events to localStorage', e);
  }
}

export function getDefaultCalendarEvents(): CalendarTrackedEvent[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  return [
    {
      id: 'cal_event_1',
      title: 'Executive Sprint Architecture Review',
      description: 'Discuss WebSocket live streaming and offline fallback protocols.',
      date: formatDate(today),
      time: '14:30',
      datetime: `${formatDate(today)}T14:30:00`,
      category: 'meeting',
      reminderMinutesBefore: 15,
      status: 'scheduled',
      isAutoExtracted: true,
      confidenceScore: 0.95,
      location: 'Google Meet',
      participants: ['Dev Lead', 'Architecture Team'],
    },
    {
      id: 'cal_event_2',
      title: 'Quarterly AI Strategy & Roadmap',
      description: 'Review multimodal voice model deployments and performance metrics.',
      date: formatDate(tomorrow),
      time: '11:00',
      datetime: `${formatDate(tomorrow)}T11:00:00`,
      category: 'meeting',
      reminderMinutesBefore: 30,
      status: 'scheduled',
      isAutoExtracted: true,
      confidenceScore: 0.92,
      location: 'Conference Room Alpha',
      participants: ['Product VP', 'AI Research'],
    },
    {
      id: 'cal_event_3',
      title: 'Cloud Run Container Health Check & Deploy',
      description: 'Verify SSL ingress certificates and zero-downtime container spin-up.',
      date: formatDate(today),
      time: '18:00',
      datetime: `${formatDate(today)}T18:00:00`,
      category: 'deadline',
      reminderMinutesBefore: 15,
      status: 'scheduled',
      isAutoExtracted: true,
      confidenceScore: 0.88,
      location: 'GCP Console',
    },
  ];
}

export function extractCalendarEventFromText(
  text: string,
  titleHint?: string,
  noteId?: string
): CalendarTrackedEvent | null {
  if (!text || text.trim().length === 0) return null;

  const lower = text.toLowerCase();

  // Look for time hints like "at 3:00 PM", "at 14:30", "tomorrow at 10am", "on Friday at 4pm"
  const timeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\b/i;
  const timeMatch = text.match(timeRegex);

  let timeStr = '10:00';
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const mins = timeMatch[2] ? timeMatch[2] : '00';
    const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : '';

    if (ampm.includes('pm') && hours < 12) {
      hours += 12;
    } else if (ampm.includes('am') && hours === 12) {
      hours = 0;
    }
    timeStr = `${String(hours).padStart(2, '0')}:${mins}`;
  }

  // Look for date hints
  const today = new Date();
  let targetDate = new Date(today);

  if (lower.includes('tomorrow') || lower.includes('kal')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (lower.includes('day after tomorrow') || lower.includes('parso')) {
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (lower.includes('next week') || lower.includes('agle hafte')) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  const dateStr = targetDate.toISOString().split('T')[0];
  const datetimeStr = `${dateStr}T${timeStr}:00`;

  let category: CalendarTrackedEvent['category'] = 'general';
  if (lower.includes('meeting') || lower.includes('call') || lower.includes('sync') || lower.includes('discuss')) {
    category = 'meeting';
  } else if (lower.includes('deadline') || lower.includes('submit') || lower.includes('due') || lower.includes('deploy')) {
    category = 'deadline';
  } else if (lower.includes('flight') || lower.includes('travel') || lower.includes('train')) {
    category = 'flight';
  } else if (lower.includes('doctor') || lower.includes('dinner') || lower.includes('gym') || lower.includes('personal')) {
    category = 'personal';
  } else if (lower.includes('task') || lower.includes('finish') || lower.includes('complete')) {
    category = 'task';
  }

  const cleanTitle =
    titleHint ||
    text.split('\n')[0].substring(0, 60) ||
    'Voice Scheduled Event';

  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: cleanTitle,
    description: text,
    date: dateStr,
    time: timeStr,
    datetime: datetimeStr,
    category,
    sourceNoteId: noteId,
    reminderMinutesBefore: 15,
    status: 'scheduled',
    isAutoExtracted: true,
    confidenceScore: 0.85,
  };
}

export function extractCalendarEventsFromVoiceNotes(notes: VoiceNote[]): CalendarTrackedEvent[] {
  const events: CalendarTrackedEvent[] = [];

  for (const note of notes) {
    const combined = `${note.title} ${note.content}`;
    // Check if it has scheduling keywords
    const lower = combined.toLowerCase();
    const hasTimeKeyword =
      lower.includes('meet') ||
      lower.includes('call') ||
      lower.includes('at ') ||
      lower.includes('pm') ||
      lower.includes('am') ||
      lower.includes('schedule') ||
      lower.includes('tomorrow') ||
      lower.includes('kal') ||
      lower.includes('deadline') ||
      lower.includes('reminder') ||
      lower.includes('sync');

    if (hasTimeKeyword) {
      const extracted = extractCalendarEventFromText(combined, note.title, note.id);
      if (extracted) {
        events.push(extracted);
      }
    }
  }

  return events;
}

export function checkUpcomingEventsForAlert(
  events: CalendarTrackedEvent[],
  windowMinutes: number = 30
): CalendarTrackedEvent[] {
  const now = new Date().getTime();
  const windowMs = windowMinutes * 60 * 1000;

  return events.filter((ev) => {
    if (ev.status === 'completed' || ev.status === 'cancelled') return false;
    const eventTime = new Date(ev.datetime).getTime();
    const diff = eventTime - now;
    return diff > 0 && diff <= windowMs;
  });
}

export function formatEventCountdown(datetimeStr: string): string {
  const eventTime = new Date(datetimeStr).getTime();
  const now = new Date().getTime();
  const diffMs = eventTime - now;

  if (diffMs <= 0) return 'Due now / past';

  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 60) return `in ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  const remMins = diffMins % 60;
  if (diffHours < 24) return `in ${diffHours}h ${remMins}m`;

  const diffDays = Math.floor(diffHours / 24);
  return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
}
