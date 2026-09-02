import { WhatsAppContact, AutomationApp, AutomationTask } from '../types';

export interface WhatsAppCountryCode {
  country: string;
  code: string;
  flag: string;
}

export const COUNTRY_CODES: WhatsAppCountryCode[] = [
  { country: 'India', code: '+91', flag: '🇮🇳' },
  { country: 'United States / Canada', code: '+1', flag: '🇺🇸' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { country: 'Australia', code: '+61', flag: '🇦🇺' },
  { country: 'Germany', code: '+49', flag: '🇩🇪' },
  { country: 'France', code: '+33', flag: '🇫🇷' },
  { country: 'Japan', code: '+81', flag: '🇯🇵' },
  { country: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { country: 'Singapore', code: '+65', flag: '🇸🇬' },
  { country: 'Spain', code: '+34', flag: '🇪🇸' },
  { country: 'Italy', code: '+39', flag: '🇮🇹' },
  { country: 'Brazil', code: '+55', flag: '🇧🇷' },
  { country: 'Mexico', code: '+52', flag: '🇲🇽' },
  { country: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { country: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { country: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
];

export const DEFAULT_WHATSAPP_CONTACTS: WhatsAppContact[] = [
  {
    id: 'c-1',
    name: 'Rahul (Best Friend)',
    phone: '+919876543210',
    relationship: 'Friend',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: 'c-2',
    name: 'Mom',
    phone: '+919810012345',
    relationship: 'Family',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  },
  {
    id: 'c-3',
    name: 'Priya (Colleague)',
    phone: '+919820054321',
    relationship: 'Work',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
  },
  {
    id: 'c-4',
    name: 'Alex (Tech Lead)',
    phone: '+14155550192',
    relationship: 'Work',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  },
  {
    id: 'c-5',
    name: 'Sarah',
    phone: '+14155558833',
    relationship: 'Friend',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    id: 'c-6',
    name: 'Office Project Team',
    phone: '+919871122334',
    relationship: 'Work Group',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&q=80',
  },
];

export interface WhatsAppTemplateCategory {
  category: string;
  icon: string;
  templates: Array<{ title: string; text: string }>;
}

export const WHATSAPP_MESSAGE_TEMPLATES: WhatsAppTemplateCategory[] = [
  {
    category: 'Status & ETA',
    icon: '🏃‍♂️',
    templates: [
      { title: 'Heading Home', text: 'Hey, heading home now! See you in about 20 minutes.' },
      { title: 'Running 5 Mins Late', text: 'Running 5 minutes behind schedule due to traffic. Starting the meeting shortly!' },
      { title: 'Reached Safely', text: 'Just arrived safely at the venue. Let me know when you get here!' },
      { title: 'In a Meeting', text: 'I am currently in a meeting. Will call you back as soon as I am free.' },
    ],
  },
  {
    category: 'Work & Projects',
    icon: '💼',
    templates: [
      { title: 'PR / Code Review', text: 'Hi Alex, the latest build is live and ready for testing. All automation suites have passed.' },
      { title: 'Quick Sync Request', text: 'Hey, do you have 10 minutes for a quick alignment sync regarding sprint deliverables?' },
      { title: 'Shared Document', text: 'Sharing the finalized project brief and roadmap. Please review and share your feedback.' },
      { title: 'EOD Status Update', text: 'EOD Update: Completed the authentication flow and tool integrations. Ready for deployment tomorrow.' },
    ],
  },
  {
    category: 'Love & Family',
    icon: '💖',
    templates: [
      { title: 'Sweet Thinking of You', text: 'Hey sweetheart, just wanted to say I am thinking of you! Hope your day is going wonderfully 💕' },
      { title: 'Check In on Mom', text: 'Hey Mom, hope you had lunch and are resting well! Love you ❤️' },
      { title: 'Dinner Tonight', text: 'Hey babe, what are you in the mood for dinner tonight? Cooking or grabbing takeout together? 🍕' },
      { title: 'Good Morning Sunshine', text: 'Good morning my love! Wishing you an energized, peaceful, and super productive day! ☀️' },
    ],
  },
  {
    category: 'Friends & Casual',
    icon: '☕',
    templates: [
      { title: 'Coffee Catch-up', text: 'Hey bro, let us catch up this weekend for coffee! It has been a while.' },
      { title: 'Birthday Wishes', text: 'Happy Birthday! 🎉 Wishing you endless joy, great health, and huge success this year!' },
      { title: 'Weekend Plans', text: 'Hey! Are you free this Saturday evening? A few of us are planning to hang out.' },
      { title: 'Thanks a lot', text: 'Thanks a lot for your help earlier today, really appreciate it!' },
    ],
  },
];

export const QUICK_AUTOMATION_PROMPTS = [
  {
    id: 'p-1',
    app: 'whatsapp' as AutomationApp,
    title: 'WhatsApp Mom: On my way',
    command: 'Open WhatsApp and send message to Mom: Hey Mom, heading home now! See you in 20 minutes.',
    recipient: 'Mom',
    phone: '+14155552671',
    message: 'Hey Mom, heading home now! See you in 20 minutes.',
  },
  {
    id: 'p-2',
    app: 'youtube' as AutomationApp,
    title: 'Play Bohemian Rhapsody on YouTube',
    command: 'Play Bohemian Rhapsody by Queen on YouTube',
    query: 'Bohemian Rhapsody Queen',
  },
  {
    id: 'p-3',
    app: 'spotify' as AutomationApp,
    title: 'Play Starboy on Spotify',
    command: 'Play Starboy on Spotify',
    query: 'Starboy The Weeknd',
  },
  {
    id: 'p-4',
    app: 'whatsapp' as AutomationApp,
    title: 'WhatsApp Rahul: Coffee catch-up',
    command: 'Open WhatsApp and message Rahul: Hey bro, let us catch up this weekend for coffee!',
    recipient: 'Rahul (Best Friend)',
    phone: '+919876543210',
    message: 'Hey bro, let us catch up this weekend for coffee!',
  },
  {
    id: 'p-5',
    app: 'maps' as AutomationApp,
    title: 'Navigate to Central Park',
    command: 'Open Google Maps directions to Central Park New York',
    destination: 'Central Park, New York, NY',
  },
  {
    id: 'p-6',
    app: 'gmail' as AutomationApp,
    title: 'Draft Project Email',
    command: 'Draft email to alex@company.com about Sprint Review',
    to: 'alex@company.com',
    subject: 'Sprint Review Update & Deliverables',
    body: 'Hi Alex,\n\nThe latest build is live and ready for review. All automated tests have passed.\n\nBest regards.',
  },
  {
    id: 'p-7',
    app: 'whatsapp' as AutomationApp,
    title: 'WhatsApp Alex: Sprint Update',
    command: 'Open WhatsApp and write message to Alex: Hi Alex, latest build is live for testing.',
    recipient: 'Alex (Tech Lead)',
    phone: '+14155550192',
    message: 'Hi Alex, the latest build is live and ready for testing. All automation suites have passed.',
  },
];

/**
 * Normalizes phone number with country code (defaults to 91 for India if 10 digits provided)
 */
export function normalizeWhatsAppNumber(phoneNumber: string, defaultCode = '91'): string {
  let digits = (phoneNumber || '').replace(/[^0-9]/g, '');
  if (!digits) return '919876543210';
  if (digits.length === 10) {
    digits = `${defaultCode.replace(/[^0-9]/g, '')}${digits}`;
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = `${defaultCode.replace(/[^0-9]/g, '')}${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Builds a direct WhatsApp click-to-chat URL (universal wa.me).
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = normalizeWhatsAppNumber(phoneNumber, '91');
  const encodedText = encodeURIComponent(message || '');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Builds a direct WhatsApp Web URL (https://web.whatsapp.com/send?phone=...&text=...).
 */
export function buildWhatsAppWebUrl(phoneNumber: string, message: string): string {
  const cleanPhone = normalizeWhatsAppNumber(phoneNumber, '91');
  const encodedText = encodeURIComponent(message || '');
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * Builds a native WhatsApp App protocol URI.
 */
export function buildWhatsAppAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = normalizeWhatsAppNumber(phoneNumber, '91');
  const encodedText = encodeURIComponent(message || '');
  return `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * AI Message Tone Polisher
 */
export function polishWhatsAppMessage(
  originalText: string,
  tone: 'formal' | 'casual' | 'romantic' | 'concise' | 'hindi' | 'spanish'
): string {
  const text = originalText.trim();
  if (!text) return 'Hey, wanted to connect with you!';

  switch (tone) {
    case 'formal':
      return `Dear colleague,\n\nI hope this message finds you well. ${text}\n\nThank you and best regards.`;
    case 'casual':
      return `Hey! 😊 Just wanted to check in: ${text} Let me know! ✌️`;
    case 'romantic':
      return `Hey my love 💕 ${text} Sending you big hugs and love! 🥰`;
    case 'concise':
      return text.length > 60 ? `${text.slice(0, 57)}...` : text;
    case 'hindi':
      return `नमस्ते! ${text} कृपया समय मिलते ही बताएं। 🙏`;
    case 'spanish':
      return `¡Hola! ${text} ¡Espero que estés muy bien! Saludos. 😊`;
    default:
      return text;
  }
}

/**
 * Builds a Google Maps route or search URL.
 */
export function buildGoogleMapsUrl(destination: string, origin?: string): string {
  if (origin) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
}

/**
 * Builds a mailto link for email automation.
 */
export function buildMailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Builds a Google Search URL.
 */
export function buildGoogleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
