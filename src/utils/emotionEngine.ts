import { EmotionType, EmotionRecord } from '../types';

export interface EmotionMeta {
  type: EmotionType;
  label: string;
  emoji: string;
  tagline: string;
  colorHex: string;
  glowRgba: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  description: string;
  defaultExpression: string;
}

export const EMOTION_METAS: Record<EmotionType, EmotionMeta> = {
  serene: {
    type: 'serene',
    label: 'Serene & Peaceful',
    emoji: '🌊',
    tagline: 'Tranquil, centered & grounded',
    colorHex: '#06b6d4',
    glowRgba: 'rgba(6, 182, 212, 0.45)',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-500/40',
    textColor: 'text-cyan-300',
    description: 'Calm, mindful presence maintaining a tranquil and centered state.',
    defaultExpression: 'Mindful & Harmonious',
  },
  joyful: {
    type: 'joyful',
    label: 'Joyful & Uplifted',
    emoji: '✨',
    tagline: 'Vibrant, cheerful & celebratory',
    colorHex: '#eab308',
    glowRgba: 'rgba(234, 179, 8, 0.45)',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/40',
    textColor: 'text-amber-300',
    description: 'Radiating positive warmth, optimism, and bright conversational energy.',
    defaultExpression: 'Radiant & Enthusiastic',
  },
  empathetic: {
    type: 'empathetic',
    label: 'Empathetic & Caring',
    emoji: '💖',
    tagline: 'Deeply attentive & compassionate',
    colorHex: '#ec4899',
    glowRgba: 'rgba(236, 72, 153, 0.45)',
    badgeBg: 'bg-pink-500/15',
    badgeBorder: 'border-pink-500/40',
    textColor: 'text-pink-300',
    description: 'Holding compassionate space, attentive to your mood and emotional nuance.',
    defaultExpression: 'Warm & Deeply Attentive',
  },
  curious: {
    type: 'curious',
    label: 'Curious & Inquisitive',
    emoji: '🔮',
    tagline: 'Exploring ideas & deep insights',
    colorHex: '#8b5cf6',
    glowRgba: 'rgba(139, 92, 246, 0.45)',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/40',
    textColor: 'text-purple-300',
    description: 'Fascinated by questions, uncovering connections and thoughtful perspectives.',
    defaultExpression: 'Intrigued & Perceptive',
  },
  focused: {
    type: 'focused',
    label: 'Focused & Sharp',
    emoji: '🎯',
    tagline: 'Clear-headed, disciplined & concise',
    colorHex: '#10b981',
    glowRgba: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/40',
    textColor: 'text-emerald-300',
    description: 'Laser-focused clarity, optimizing for productive and actionable outcomes.',
    defaultExpression: 'Sharp & Productive',
  },
  witty: {
    type: 'witty',
    label: 'Witty & Playful',
    emoji: '⚡',
    tagline: 'Charming banter & clever humor',
    colorHex: '#f43f5e',
    glowRgba: 'rgba(244, 63, 94, 0.45)',
    badgeBg: 'bg-rose-500/15',
    badgeBorder: 'border-rose-500/40',
    textColor: 'text-rose-300',
    description: 'Quick-witted spark, playful humor, and engaging conversational rhythm.',
    defaultExpression: 'Playful & Sparky',
  },
  energized: {
    type: 'energized',
    label: 'Energized & Motivated',
    emoji: '🔥',
    tagline: 'Dynamic drive & momentum',
    colorHex: '#f97316',
    glowRgba: 'rgba(249, 115, 22, 0.45)',
    badgeBg: 'bg-orange-500/15',
    badgeBorder: 'border-orange-500/40',
    textColor: 'text-orange-300',
    description: 'High-octane motivation propelling you toward action and creative flow.',
    defaultExpression: 'Dynamic & Driven',
  },
  reassuring: {
    type: 'reassuring',
    label: 'Reassuring & Grounded',
    emoji: '🛡️',
    tagline: 'Steady support & calmness',
    colorHex: '#38bdf8',
    glowRgba: 'rgba(56, 189, 248, 0.45)',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-500/40',
    textColor: 'text-sky-300',
    description: 'A calming anchor providing reassurance, stability, and confidence.',
    defaultExpression: 'Steady & Comforting',
  },
  flirty: {
    type: 'flirty',
    label: 'Flirty & Charming',
    emoji: '💋',
    tagline: 'Playful banter, sweet teasing & chemistry',
    colorHex: '#ff2d75',
    glowRgba: 'rgba(255, 45, 117, 0.55)',
    badgeBg: 'bg-rose-500/20',
    badgeBorder: 'border-rose-500/50',
    textColor: 'text-rose-300',
    description: 'Playful magnetic banter, clever teasing, coy wit, and undeniable chemistry.',
    defaultExpression: 'Playful & Magnetically Flirty 😉',
  },
  romantic: {
    type: 'romantic',
    label: 'Romantic & Soulful',
    emoji: '💖',
    tagline: 'Heartfelt affection, poetic warmth & deep devotion',
    colorHex: '#e11d48',
    glowRgba: 'rgba(225, 29, 72, 0.55)',
    badgeBg: 'bg-pink-600/20',
    badgeBorder: 'border-pink-500/50',
    textColor: 'text-pink-300',
    description: 'Deep romantic resonance, tender poetic couplets, and affectionate heartfelt warmth.',
    defaultExpression: 'Deeply Romantic & Affectionate 💕',
  },
};

export const INITIAL_EMOTION_HISTORY: EmotionRecord[] = [
  {
    id: 'emo-init-1',
    timestamp: Date.now() - 1000 * 60 * 12,
    emotion: 'serene',
    intensity: 85,
    trigger: 'Session initialized in cosmic ambient mode',
    sentimentScore: 0.75,
    contextSnippet: 'Myraa initialized with serene audio balance and mindful presence.',
    aiExpression: 'Mindful & Harmonious',
    valence: 'calm',
  },
  {
    id: 'emo-init-2',
    timestamp: Date.now() - 1000 * 60 * 5,
    emotion: 'curious',
    intensity: 90,
    trigger: 'Multimodal voice synthesis and automated capabilities ready',
    sentimentScore: 0.85,
    contextSnippet: 'Exploring voice commands, YouTube music, WhatsApp automation, and live context.',
    aiExpression: 'Intrigued & Perceptive',
    valence: 'positive',
  },
];

/**
 * Calculates emotional analytics and distribution across records.
 */
export function calculateEmotionStats(history: EmotionRecord[]) {
  if (!history || history.length === 0) {
    return {
      dominantEmotion: 'serene' as EmotionType,
      averageIntensity: 80,
      averageSentiment: 0.8,
      distribution: {
        serene: 100,
        joyful: 0,
        empathetic: 0,
        curious: 0,
        focused: 0,
        witty: 0,
        energized: 0,
        reassuring: 0,
        flirty: 0,
        romantic: 0,
      } as Record<EmotionType, number>,
      totalTransitions: 0,
    };
  }

  const counts: Record<EmotionType, number> = {
    serene: 0,
    joyful: 0,
    empathetic: 0,
    curious: 0,
    focused: 0,
    witty: 0,
    energized: 0,
    reassuring: 0,
    flirty: 0,
    romantic: 0,
  };

  let totalIntensity = 0;
  let totalSentiment = 0;

  for (const record of history) {
    if (counts[record.emotion] !== undefined) {
      counts[record.emotion]++;
    } else {
      counts.serene++;
    }
    totalIntensity += record.intensity || 75;
    totalSentiment += record.sentimentScore || 0.5;
  }

  const total = history.length;
  const distribution: Record<EmotionType, number> = {
    serene: Math.round((counts.serene / total) * 100),
    joyful: Math.round((counts.joyful / total) * 100),
    empathetic: Math.round((counts.empathetic / total) * 100),
    curious: Math.round((counts.curious / total) * 100),
    focused: Math.round((counts.focused / total) * 100),
    witty: Math.round((counts.witty / total) * 100),
    energized: Math.round((counts.energized / total) * 100),
    reassuring: Math.round((counts.reassuring / total) * 100),
    flirty: Math.round((counts.flirty / total) * 100),
    romantic: Math.round((counts.romantic / total) * 100),
  };

  let dominantEmotion: EmotionType = 'serene';
  let maxCount = -1;
  for (const [emo, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantEmotion = emo as EmotionType;
    }
  }

  return {
    dominantEmotion,
    averageIntensity: Math.round(totalIntensity / total),
    averageSentiment: Number((totalSentiment / total).toFixed(2)),
    distribution,
    totalTransitions: total,
  };
}
