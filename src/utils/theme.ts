import { VisualTheme, ThemeColors, ContrastMode } from '../types';

export interface ContrastConfig {
  id: ContrastMode;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  bgHex: string;
  appRootClass: string;
  containerBgClass: string;
  cardBgClass: string;
  borderClass: string;
  hoverBorderClass: string;
  pillBorderClass: string;
  subtextClass: string;
  bloomEnabled: boolean;
}

export const CONTRAST_CONFIGS: Record<ContrastMode, ContrastConfig> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Dark',
    shortName: 'Cosmic',
    tagline: 'Ambient Nebula Atmosphere',
    description: 'Deep twilight canvas (#050507) with soft ambient starlight blooms and subtle translucent glass styling.',
    bgHex: '#050507',
    appRootClass: 'bg-[#050507]',
    containerBgClass: 'bg-neutral-950/95 backdrop-blur-2xl',
    cardBgClass: 'bg-white/[0.04]',
    borderClass: 'border-white/10',
    hoverBorderClass: 'hover:border-white/20',
    pillBorderClass: 'border-white/15',
    subtextClass: 'text-neutral-400',
    bloomEnabled: true,
  },
  'true-black': {
    id: 'true-black',
    name: 'True Black (High Contrast)',
    shortName: 'True Black',
    tagline: 'OLED Pitch Black & Crisp Outlines',
    description: 'Pure pitch-black (#000000) canvas with high-contrast outlines and maximized visibility in all lighting conditions.',
    bgHex: '#000000',
    appRootClass: 'bg-black',
    containerBgClass: 'bg-black border-white/30',
    cardBgClass: 'bg-[#0a0a0a]',
    borderClass: 'border-white/30',
    hoverBorderClass: 'hover:border-white/60',
    pillBorderClass: 'border-white/35',
    subtextClass: 'text-neutral-300',
    bloomEnabled: false,
  },
};

export const THEME_CONFIGS: Record<VisualTheme, ThemeColors> = {
  aurora: {
    name: 'aurora',
    label: 'Aurora Borealis',
    primary: '#06b6d4', // cyan-500
    secondary: '#8b5cf6', // purple-500
    accent: '#38bdf8', // sky-400
    glow: 'rgba(6, 182, 212, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(139, 92, 246, 0.1) 40%, rgba(3, 7, 18, 0.95) 100%)',
  },
  cyberpunk: {
    name: 'cyberpunk',
    label: 'Neon Cyberpunk',
    primary: '#ec4899', // pink-500
    secondary: '#06b6d4', // cyan-500
    accent: '#f43f5e', // rose-500
    glow: 'rgba(236, 72, 153, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.18) 0%, rgba(6, 182, 212, 0.12) 40%, rgba(9, 9, 11, 0.98) 100%)',
  },
  nebula: {
    name: 'nebula',
    label: 'Cosmic Nebula',
    primary: '#a855f7', // purple-500
    secondary: '#6366f1', // indigo-500
    accent: '#c084fc', // purple-400
    glow: 'rgba(168, 85, 247, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.16) 0%, rgba(99, 102, 241, 0.12) 40%, rgba(5, 5, 15, 0.98) 100%)',
  },
  sunset: {
    name: 'sunset',
    label: 'Solar Sunset',
    primary: '#f97316', // orange-500
    secondary: '#e11d48', // rose-600
    accent: '#fbbf24', // amber-400
    glow: 'rgba(249, 115, 22, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.18) 0%, rgba(225, 29, 72, 0.12) 40%, rgba(12, 10, 9, 0.98) 100%)',
  },
  emerald: {
    name: 'emerald',
    label: 'Cyber Emerald',
    primary: '#10b981', // emerald-500
    secondary: '#06b6d4', // cyan-500
    accent: '#34d399', // emerald-400
    glow: 'rgba(16, 185, 129, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.1) 40%, rgba(2, 14, 10, 0.98) 100%)',
  },
};
