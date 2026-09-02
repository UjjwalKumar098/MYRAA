import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AutomationTask, ContrastMode } from '../types';
import {
  MessageSquare,
  Youtube,
  Music,
  MapPin,
  Mail,
  Search,
  ExternalLink,
  Send,
  X,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface LiveAutomationHudProps {
  task: AutomationTask | null;
  contrastMode?: ContrastMode;
  onOpenAppHub: (task: AutomationTask) => void;
  onDismiss: () => void;
}

export const LiveAutomationHud: React.FC<LiveAutomationHudProps> = ({
  task,
  contrastMode = 'cosmic',
  onOpenAppHub,
  onDismiss,
}) => {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTrueBlack = contrastMode === 'true-black';

  useEffect(() => {
    if (!task) {
      setTypedText('');
      setIsTyping(false);
      return;
    }

    const fullText = task.content || task.title;
    let index = 0;
    setIsTyping(true);
    setTypedText('');

    if (timerRef.current) clearInterval(timerRef.current);

    const speed = Math.max(12, Math.min(35, 800 / (fullText.length || 1)));

    timerRef.current = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [task]);

  if (!task) return null;

  const getAppMeta = () => {
    switch (task.app) {
      case 'whatsapp':
        return {
          icon: MessageSquare,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20 border-emerald-500/40',
          label: 'WhatsApp Message',
          btnText: 'Send on WhatsApp',
        };
      case 'youtube':
        return {
          icon: Youtube,
          color: 'text-red-500',
          bg: 'bg-red-500/20 border-red-500/40',
          label: 'YouTube Music',
          btnText: 'Open in YouTube',
        };
      case 'spotify':
        return {
          icon: Music,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20 border-emerald-500/40',
          label: 'Spotify Stream',
          btnText: 'Open in Spotify',
        };
      case 'maps':
        return {
          icon: MapPin,
          color: 'text-amber-400',
          bg: 'bg-amber-500/20 border-amber-500/40',
          label: 'Google Maps Route',
          btnText: 'Start Navigation',
        };
      case 'gmail':
        return {
          icon: Mail,
          color: 'text-rose-400',
          bg: 'bg-rose-500/20 border-rose-500/40',
          label: 'Gmail Draft',
          btnText: 'Send Email',
        };
      case 'google':
      default:
        return {
          icon: Search,
          color: 'text-blue-400',
          bg: 'bg-blue-500/20 border-blue-500/40',
          label: 'Google Search',
          btnText: 'View Results',
        };
    }
  };

  const meta = getAppMeta();
  const Icon = meta.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all ${
          isTrueBlack
            ? 'bg-black/95 border-white/40 text-white shadow-[0_0_40px_rgba(255,255,255,0.2)]'
            : 'bg-[#0b0e14]/90 border-cyan-500/30 text-white shadow-[0_0_40px_rgba(6,182,212,0.25)]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${meta.bg}`}
          >
            <Icon className={`w-5 h-5 ${meta.color}`} />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  {meta.label}
                </span>
                {isTyping && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
                    Auto-Typing...
                  </span>
                )}
                {!isTyping && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Ready</span>
                  </span>
                )}
              </div>

              <button
                onClick={onDismiss}
                className="text-white/40 hover:text-white transition-colors p-1"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-xs font-semibold text-white tracking-wide truncate">
              {task.title}
            </h4>

            {/* Live Typing Terminal */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white/90 max-h-24 overflow-y-auto">
              <p className="whitespace-pre-wrap leading-relaxed">
                {typedText}
                {isTyping && (
                  <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {task.externalUrl && (
                <a
                  href={task.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>{meta.btnText}</span>
                </a>
              )}

              <button
                onClick={() => onOpenAppHub(task)}
                className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3 h-3 text-cyan-300" />
                <span>Open Automation Hub</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
