import { TimeUpdateDigest } from '../types';

export interface WorldClockCity {
  city: string;
  country: string;
  timeZone: string;
  flag: string;
}

export const WORLD_CITIES: WorldClockCity[] = [
  { city: 'San Francisco', country: 'USA', timeZone: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: 'New York', country: 'USA', timeZone: 'America/New_York', flag: '🇺🇸' },
  { city: 'London', country: 'UK', timeZone: 'Europe/London', flag: '🇬🇧' },
  { city: 'Paris', country: 'France', timeZone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Dubai', country: 'UAE', timeZone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'New Delhi / Mumbai', country: 'India', timeZone: 'Asia/Kolkata', flag: '🇮🇳' },
  { city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', flag: '🇦🇺' },
];

export function getDayPhase(hour24: number): {
  phase: 'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night' | 'midnight';
  label: string;
  iconName: string;
  progressPercent: number;
} {
  // Day phase breakdown
  if (hour24 >= 5 && hour24 < 8) {
    return { phase: 'dawn', label: 'Dawn Twilight', iconName: 'Sunrise', progressPercent: Math.round(((hour24 - 5) / 3) * 100) };
  } else if (hour24 >= 8 && hour24 < 12) {
    return { phase: 'morning', label: 'Crisp Morning', iconName: 'Sun', progressPercent: Math.round(((hour24 - 8) / 4) * 100) };
  } else if (hour24 >= 12 && hour24 < 17) {
    return { phase: 'afternoon', label: 'Bright Afternoon', iconName: 'SunMedium', progressPercent: Math.round(((hour24 - 12) / 5) * 100) };
  } else if (hour24 >= 17 && hour24 < 20) {
    return { phase: 'sunset', label: 'Golden Sunset', iconName: 'Sunset', progressPercent: Math.round(((hour24 - 17) / 3) * 100) };
  } else if (hour24 >= 20 && hour24 < 24) {
    return { phase: 'night', label: 'Cosmic Night', iconName: 'Moon', progressPercent: Math.round(((hour24 - 20) / 4) * 100) };
  } else {
    return { phase: 'midnight', label: 'Deep Midnight', iconName: 'MoonStar', progressPercent: Math.round((hour24 / 5) * 100) };
  }
}

export function getTimeGreeting(hour24: number, language: string = 'en'): string {
  if (language === 'hi') {
    if (hour24 >= 4 && hour24 < 12) return 'शुभ प्रभात (Good Morning)';
    if (hour24 >= 12 && hour24 < 17) return 'शुभ दोपहर (Good Afternoon)';
    if (hour24 >= 17 && hour24 < 21) return 'शुभ संध्या (Good Evening)';
    return 'शुभ रात्रि (Good Night)';
  }
  if (language === 'es') {
    if (hour24 >= 4 && hour24 < 12) return '¡Buenos días!';
    if (hour24 >= 12 && hour24 < 20) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  }
  if (hour24 >= 4 && hour24 < 12) return 'Good morning';
  if (hour24 >= 12 && hour24 < 17) return 'Good afternoon';
  if (hour24 >= 17 && hour24 < 22) return 'Good evening';
  return 'Late night serenity';
}

export function generateTimeUpdateDigest(sessionStartTime: number): TimeUpdateDigest {
  const now = new Date();
  const hours = now.getHours();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const localTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dayPhaseInfo = getDayPhase(hours);
  const sessionDurationMinutes = Math.max(0, Math.floor((Date.now() - sessionStartTime) / 60000));

  const worldClocks = WORLD_CITIES.map((c) => {
    try {
      const cityTime = new Intl.DateTimeFormat('en-US', {
        timeZone: c.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(now);

      const cityHour = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: c.timeZone,
          hour: 'numeric',
          hour12: false,
        }).format(now),
        10
      );

      const diffHours = cityHour - hours;
      const diffStr = diffHours === 0 ? 'Local' : diffHours > 0 ? `+${diffHours}h` : `${diffHours}h`;

      return {
        city: c.city,
        time: cityTime,
        diff: diffStr,
        flag: c.flag,
      };
    } catch {
      return {
        city: c.city,
        time: localTimeStr,
        diff: '0h',
        flag: c.flag,
      };
    }
  });

  const greeting = `${getTimeGreeting(hours)}, currently in ${dayPhaseInfo.label}`;
  const summary = `Local time is ${localTimeStr} (${timeZone}). Session active for ${sessionDurationMinutes} min(s).`;

  return {
    timestamp: Date.now(),
    localTimeStr,
    timeZone,
    greeting,
    sessionDurationMinutes,
    dayPhase: dayPhaseInfo.phase,
    worldClocks,
    summary,
    lastSyncedAt: Date.now(),
  };
}

export interface TimeNotificationItem {
  id: string;
  timeLabel: string;
  title: string;
  message: string;
  type: 'routine' | 'wellness' | 'focus' | 'romance' | 'reflection';
  icon: string;
}

export const PERIODIC_TIME_ROUTINES: TimeNotificationItem[] = [
  {
    id: 'time-routine-morning',
    timeLabel: '08:00 AM - 11:00 AM',
    title: 'Morning Momentum & Intentions',
    message: 'Set high-priority focus tasks, hydrate, and prepare for a productive day.',
    type: 'focus',
    icon: 'Sun',
  },
  {
    id: 'time-routine-afternoon',
    timeLabel: '01:00 PM - 03:00 PM',
    title: 'Afternoon Energy & Posture Check',
    message: 'Take a brief 2-minute stretch, look away from the screen, and refresh your mind.',
    type: 'wellness',
    icon: 'Coffee',
  },
  {
    id: 'time-routine-sunset',
    timeLabel: '05:30 PM - 07:30 PM',
    title: 'Sunset Decompression & Wrap-Up',
    message: 'Review daily accomplishments, celebrate small wins, and transition into evening rest.',
    type: 'reflection',
    icon: 'Sunset',
  },
  {
    id: 'time-routine-night',
    timeLabel: '09:00 PM - 11:30 PM',
    title: 'Cosmic Night Serenity & Flirting',
    message: 'Wind down with gentle lo-fi tunes, soothing ambiance, or sweet nighttime banter with Myraa.',
    type: 'romance',
    icon: 'Moon',
  },
];

