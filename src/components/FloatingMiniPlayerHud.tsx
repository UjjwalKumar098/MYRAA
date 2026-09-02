import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaPlayerState, ContrastMode } from '../types';
import {
  Youtube,
  Music,
  Play,
  Pause,
  SkipForward,
  Maximize2,
  X,
  Volume2,
} from 'lucide-react';

interface FloatingMiniPlayerHudProps {
  mediaState: MediaPlayerState;
  contrastMode?: ContrastMode;
  onMaximizeYouTube: () => void;
  onMaximizeSpotify: () => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onClose: () => void;
}

export const FloatingMiniPlayerHud: React.FC<FloatingMiniPlayerHudProps> = ({
  mediaState,
  contrastMode = 'cosmic',
  onMaximizeYouTube,
  onMaximizeSpotify,
  onTogglePlay,
  onNextTrack,
  onClose,
}) => {
  const { activePlatform, isPlaying, currentYouTubeTrack, currentSpotifyTrack, isMinimized } =
    mediaState;

  if (activePlatform === 'none' || activePlatform === 'ambient' || !isMinimized) {
    return null;
  }

  const isYT = activePlatform === 'youtube';
  const isSpotify = activePlatform === 'spotify';
  const isTrueBlack = contrastMode === 'true-black';

  const title = isYT
    ? currentYouTubeTrack?.title || 'YouTube Audio'
    : currentSpotifyTrack?.title || 'Spotify Audio';
  const subtitle = isYT
    ? currentYouTubeTrack?.artist || 'Streaming'
    : currentSpotifyTrack?.artist || 'Streaming';
  const thumbnail = isYT
    ? currentYouTubeTrack?.thumbnail
    : currentSpotifyTrack?.coverUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        className={`fixed bottom-24 right-6 z-40 p-2.5 pr-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-center gap-3 transition-all select-none max-w-sm ${
          isTrueBlack
            ? 'bg-black/95 border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]'
            : isYT
            ? 'bg-[#0f0b0c]/90 border-red-500/30 text-white shadow-[0_0_30px_rgba(239,68,68,0.2)]'
            : 'bg-[#0a0f0d]/90 border-emerald-500/30 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)]'
        }`}
      >
        {/* Track Thumbnail & Visualizer Overlay */}
        <div
          onClick={isYT ? onMaximizeYouTube : onMaximizeSpotify}
          className="relative w-12 h-12 rounded-xl overflow-hidden cursor-pointer group bg-neutral-900 shrink-0"
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {isYT ? (
              <Youtube className="w-5 h-5 text-red-500 drop-shadow" />
            ) : (
              <Music className="w-5 h-5 text-emerald-400 drop-shadow" />
            )}
          </div>

          {/* Equalizer Wavelet animation */}
          {isPlaying && (
            <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded">
              <span className="w-0.5 h-2 bg-white animate-pulse" />
              <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div
          onClick={isYT ? onMaximizeYouTube : onMaximizeSpotify}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] uppercase font-bold tracking-wider ${
                isYT ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {isYT ? 'YouTube' : 'Spotify'}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-white tracking-wide truncate max-w-[150px]">
            {title}
          </h4>
          <p className="text-[11px] text-white/50 truncate max-w-[150px]">{subtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onTogglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isYT
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onNextTrack}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
            title="Next Song"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={isYT ? onMaximizeYouTube : onMaximizeSpotify}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
            title="Maximize Player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            title="Stop & Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
