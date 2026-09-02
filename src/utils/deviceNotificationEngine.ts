import { DeviceNotification, DeviceSourceType, NotificationCategory } from '../types';

export const INITIAL_DEVICE_NOTIFICATIONS: DeviceNotification[] = [
  {
    id: 'notif-mob-1',
    device: 'mobile',
    category: 'whatsapp',
    sender: 'Rahul Sharma',
    title: 'WhatsApp Message',
    message: 'Bhai, meeting sham ko 5:00 PM pe shift ho gayi hai. Slides ready hain?',
    timestamp: Date.now() - 1000 * 60 * 3, // 3 mins ago
    read: false,
    priority: 'urgent',
    replyDraft: 'Haan bilkul, main 5 baje connect karunga!',
  },
  {
    id: 'notif-mob-2',
    device: 'mobile',
    category: 'call',
    sender: 'Papa',
    title: 'Missed Call',
    message: 'Missed voice call (5 minutes ago). Call back when you are free.',
    timestamp: Date.now() - 1000 * 60 * 5,
    read: false,
    priority: 'urgent',
    replyDraft: 'Papa, abhi call karta hoon 2 minute me.',
  },
  {
    id: 'notif-mob-3',
    device: 'mobile',
    category: 'sms',
    sender: 'HDFC Bank',
    title: 'Account Credit Alert',
    message: 'A/c *4092 credited with INR 45,000.00 via NEFT salary transfer. Avl Bal: INR 1,28,450.00.',
    timestamp: Date.now() - 1000 * 60 * 18,
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-mob-4',
    device: 'mobile',
    category: 'battery',
    sender: 'Mobile System',
    title: 'Battery Low Warning',
    message: 'Battery dropped to 18%. Plug in your charger or enable Power Saver mode.',
    timestamp: Date.now() - 1000 * 60 * 25,
    read: false,
    priority: 'urgent',
  },
  {
    id: 'notif-lap-1',
    device: 'laptop',
    category: 'calendar',
    sender: 'Google Calendar',
    title: 'Upcoming Sprint Review',
    message: 'Product Demo & Architecture Sprint Review starts in 15 minutes on Google Meet.',
    timestamp: Date.now() - 1000 * 60 * 8,
    read: false,
    priority: 'urgent',
  },
  {
    id: 'notif-lap-2',
    device: 'laptop',
    category: 'github',
    sender: 'GitHub Core',
    title: 'Pull Request Approved',
    message: 'PR #42 "Mobile Remote Control & Voice Notification Engine" merged into main branch.',
    timestamp: Date.now() - 1000 * 60 * 35,
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-lap-3',
    device: 'laptop',
    category: 'slack',
    sender: 'Priya Verma (#engineering)',
    title: 'Slack Direct Message',
    message: 'Can you please review the new API proxy endpoint when you get a chance?',
    timestamp: Date.now() - 1000 * 60 * 42,
    read: false,
    priority: 'normal',
    replyDraft: 'Sure Priya, looking at it right now!',
  },
  {
    id: 'notif-lap-4',
    device: 'laptop',
    category: 'system',
    sender: 'Laptop OS',
    title: 'System Performance Report',
    message: 'CPU at 14%, RAM at 48%. Cloud Run dev server healthy on port 3000.',
    timestamp: Date.now() - 1000 * 60 * 60,
    read: true,
    priority: 'low',
  },
];

const NOTIFICATION_STORAGE_KEY = 'myraa_device_notifications_v1';

export function getStoredDeviceNotifications(): DeviceNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load stored notifications:', e);
  }
  return INITIAL_DEVICE_NOTIFICATIONS;
}

export function saveStoredDeviceNotifications(notifications: DeviceNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.warn('Failed to save device notifications:', e);
  }
}

// -------------------------------------------------------------
// WEB BROWSER NATIVE SYSTEM NOTIFICATION BRIDGE
// -------------------------------------------------------------
export async function requestSystemNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.warn('Error requesting notification permission:', e);
    return Notification.permission || 'denied';
  }
}

export function checkSystemNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function triggerNativeSystemNotification(notification: DeviceNotification): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const titleText = `${notification.device === 'mobile' ? '📱 Mobile: ' : '💻 Laptop: '}${notification.title}`;
    const bodyText = notification.sender
      ? `${notification.sender}: ${notification.message}`
      : notification.message;

    const notif = new Notification(titleText, {
      body: bodyText,
      icon: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    // Trigger mobile vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    return true;
  } catch (err) {
    console.warn('Failed to dispatch native notification:', err);
    return false;
  }
}

// -------------------------------------------------------------
// SPEECH SYNTHESIS VOICE NOTIFICATION READER
// -------------------------------------------------------------
let activeSpeechUtterance: SpeechSynthesisUtterance | null = null;

export function stopVoiceNotificationReading(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeSpeechUtterance = null;
  }
}

export const stopReadingNotifications = stopVoiceNotificationReading;

export function formatNotificationForSpeech(notification: DeviceNotification): string {
  const devicePrefix = notification.device === 'mobile' ? 'Mobile notification' : 'Laptop alert';
  const categoryName = notification.category.toUpperCase();
  const senderText = notification.sender ? `from ${notification.sender}` : '';
  return `${devicePrefix}, ${categoryName} ${senderText}. ${notification.title}. Message says: ${notification.message}`;
}

export function readNotificationsAloud(
  notifications: DeviceNotification[],
  options?: {
    voiceName?: string;
    onStart?: (index: number, current: DeviceNotification) => void;
    onItemComplete?: (index: number, current: DeviceNotification) => void;
    onAllComplete?: () => void;
    onError?: (err: any) => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onError?.(new Error('Speech synthesis is not supported in this browser.'));
    return;
  }

  stopVoiceNotificationReading();

  if (notifications.length === 0) {
    const utterance = new SpeechSynthesisUtterance('You have no new unread notifications on mobile or laptop.');
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
    utterance.onend = () => options?.onAllComplete?.();
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  // Find voice by name or pleasant Hindi/English voice or female English voice
  const preferredVoice =
    (options?.voiceName && voices.find((v) => v.name.toLowerCase().includes(options.voiceName!.toLowerCase()))) ||
    voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN')) ||
    voices.find((v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira')) ||
    voices[0];

  let currentIndex = 0;

  function speakNext() {
    if (currentIndex >= notifications.length) {
      activeSpeechUtterance = null;
      options?.onAllComplete?.();
      return;
    }

    const currentItem = notifications[currentIndex];
    const speechText = formatNotificationForSpeech(currentItem);

    const utterance = new SpeechSynthesisUtterance(speechText);
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.98;
    utterance.pitch = 1.02;

    utterance.onstart = () => {
      activeSpeechUtterance = utterance;
      options?.onStart?.(currentIndex, currentItem);
    };

    utterance.onend = () => {
      options?.onItemComplete?.(currentIndex, currentItem);
      currentIndex++;
      // Brief pause between multiple notifications
      setTimeout(() => {
        speakNext();
      }, 400);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      options?.onError?.(e);
      currentIndex++;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNext();
}

// -------------------------------------------------------------
// QUICK AI RESPONSE DRAFTS
// -------------------------------------------------------------
export function generateQuickSmartReply(notification: DeviceNotification): string {
  switch (notification.category) {
    case 'whatsapp':
      return `Haan bilkul! Main time pe ready rahunga.`;
    case 'call':
      return `Free ho kar abhi call back karta hoon.`;
    case 'slack':
      return `Received and reviewing this right now.`;
    case 'email':
      return `Thanks for the update. Will get back shortly.`;
    case 'calendar':
      return `Confirmed! Joining the meeting in a minute.`;
    default:
      return `Acknowledged. Thank you!`;
  }
}
