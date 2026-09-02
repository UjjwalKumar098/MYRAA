import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ExternalLink, Clock, Palette, CheckCircle2 } from 'lucide-react';

interface ToolToastProps {
  activity: { toolName: string; detail: string; id: number } | null;
}

export const ToolToast: React.FC<ToolToastProps> = ({ activity }) => {
  const getIcon = (toolName: string) => {
    switch (toolName) {
      case 'openWebsite':
        return <ExternalLink className="w-4 h-4 text-cyan-400" />;
      case 'getCurrentTimeAndDate':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'changeVisualTheme':
        return <Palette className="w-4 h-4 text-purple-400" />;
      case 'saveVoiceNote':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {activity && (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-neutral-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl text-white pointer-events-auto"
          >
            <div className="p-1 rounded-lg bg-white/10">{getIcon(activity.toolName)}</div>
            <div className="text-xs font-medium tracking-wide">
              <span className="text-neutral-400 font-mono text-[10px] uppercase block">
                Action Executed
              </span>
              <span className="text-white font-semibold">{activity.detail}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
