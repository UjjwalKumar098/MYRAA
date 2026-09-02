import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Mic, Zap, MessageSquareQuote, ShieldCheck } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const examplePrompts = [
    {
      topic: 'हिंदी बातचीत (Hindi Talk)',
      phrase: '“नमस्ते मायरा, कैसी हो आप? एक अच्छी सी शायरी सुनाओ।”',
    },
    {
      topic: 'Voice Timer & Countdown',
      phrase: '“मायरा, 3 मिनट का चाय का टाइमर लगाओ।” (or in English)',
    },
    {
      topic: 'Ambient Soundscape Synthesizer',
      phrase: '“Play gentle rain sounds in the background / बारिश की आवाज़ चलाओ।”',
    },
    {
      topic: 'Mindful Breathing',
      phrase: '“मायरा, मुझे बॉक्स ब्रीदिंग मेडिटेशन कराओ।”',
    },
    {
      topic: 'Calculation & Unit Conversion',
      phrase: '“What is 78 degrees Fahrenheit in Celsius?”',
    },
    {
      topic: 'Browser Action Tool',
      phrase: '“Myraa, open YouTube for me in a new tab.”',
    },
    {
      topic: 'Visual Atmosphere Tool',
      phrase: '“थीम को साइबरपंक में बदल दो / Change theme to cyberpunk!”',
    },
    {
      topic: 'Voice Memory & Notes',
      phrase: '“Save a note: review quarterly roadmap tomorrow at 10 AM.”',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-neutral-950/95 border border-white/15 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Meet Myraa</h2>
                    <p className="text-xs text-neutral-400">Real-time Voice-to-Voice AI Companion</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Personality highlights */}
              <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Personality & Voice Engine
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Myraa is a young, confident, witty, and charming female AI companion. She is smart,
                  emotionally responsive, naturally conversational, and loves playful banter while
                  maintaining classy, respectful standards.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Voice-to-Voice Only', 'Low Latency Audio', 'Aoede Expressive Voice', 'Live Function Calling'].map(
                    (tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300 font-medium"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Things to try speaking */}
              <div className="mt-5 space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-purple-400" />
                  Try Speaking Naturally
                </h3>
                <div className="space-y-2">
                  {examplePrompts.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1"
                    >
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                        {p.topic}
                      </span>
                      <p className="text-xs text-neutral-200 font-mono">{p.phrase}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture & Specs */}
              <div className="mt-5 p-4 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Audio Pipeline Specifications
                </h3>
                <ul className="text-xs text-neutral-400 space-y-1">
                  <li>• <strong className="text-neutral-200">Model:</strong> gemini-3.1-flash-live-preview</li>
                  <li>• <strong className="text-neutral-200">Microphone Input:</strong> 16,000 Hz Linear PCM16</li>
                  <li>• <strong className="text-neutral-200">Voice Synthesis Output:</strong> 24,000 Hz PCM via Web Audio API</li>
                  <li>• <strong className="text-neutral-200">Interruption:</strong> Instant zero-delay audio buffer flush</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
