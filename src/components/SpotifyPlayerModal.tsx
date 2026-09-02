import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpotifyTrack, ContrastMode, PlaybackRepeatMode, EqualizerPreset } from '../types';
import {
  POPULAR_SPOTIFY_TRACKS,
  findSpotifyTrack,
  EQUALIZER_PRESETS,
  MUSIC_GENRES,
} from '../utils/mediaData';
import {
  Music,
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  ExternalLink,
  Disc3,
  Sparkles,
  CheckCircle2,
  Youtube,
  Shuffle,
  Repeat,
  Repeat1,
  Sliders,
  FileText,
  ListMusic,
  Clock,
  Radio,
  Flame,
} from 'lucide-react';

interface SpotifyPlayerModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  repeatMode?: PlaybackRepeatMode;
  isShuffle?: boolean;
  equalizerPreset?: EqualizerPreset;
  sleepTimerMinutes?: number | null;
  queue?: SpotifyTrack[];
  onSelectTrack: (track: SpotifyTrack) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleRepeat?: () => void;
  onToggleShuffle?: () => void;
  onSetEqualizer?: (preset: EqualizerPreset) => void;
  onSetSleepTimer?: (minutes: number | null) => void;
  onPlayAllTracks?: (tracks: SpotifyTrack[]) => void;
  onMinimize: () => void;
  onClose: () => void;
  onSwitchToYouTube?: (query: string) => void;
}

const SPOTIFY_QUICK_PICKS = [
  'Curated Vibes Playlist',
  'Blinding Lights',
  'Kesariya',
  'Shape of You',
  'Starboy',
  'As It Was',
  'Cruel Summer',
  'Tum Hi Ho',
  'Lover - Diljit',
  'Hot Hits Punjabi',
  'Bollywood Butter',
  'Deewana 90s Romance',
  'Naam Hai Tera',
  'Deep Focus Flow',
  'Chill Lofi Beats',
  'Beast Mode Gym',
  'Peaceful Piano',
  'Today\'s Top Hits',
];

export const SpotifyPlayerModal: React.FC<SpotifyPlayerModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  currentTrack,
  isPlaying,
  volume,
  isMuted,
  repeatMode = 'all',
  isShuffle = false,
  equalizerPreset = 'bass-boost',
  sleepTimerMinutes = null,
  queue = [],
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleMute,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onSetEqualizer,
  onSetSleepTimer,
  onPlayAllTracks,
  onMinimize,
  onClose,
  onSwitchToYouTube,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasPlaybackNotice, setHasPlaybackNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'lyrics' | 'queue' | 'equalizer'>('catalog');
  const isTrueBlack = contrastMode === 'true-black';

  if (!isOpen) return null;

  const activeTrack = currentTrack || POPULAR_SPOTIFY_TRACKS[0];

  const filteredTracks = POPULAR_SPOTIFY_TRACKS.filter((track) => {
    const matchesSearch =
      searchQuery === '' ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || track.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const resolved = findSpotifyTrack(searchQuery.trim());
    onSelectTrack(resolved);
    setHasPlaybackNotice(`Playing "${resolved.title}" on Spotify`);
    setTimeout(() => setHasPlaybackNotice(null), 4000);
  };

  const handleQuickSuggestion = (item: string) => {
    setSearchQuery(item);
    const resolved = findSpotifyTrack(item);
    onSelectTrack(resolved);
    setHasPlaybackNotice(`Loaded "${resolved.title}"`);
    setTimeout(() => setHasPlaybackNotice(null), 4000);
  };

  const handlePlayAll = () => {
    const tracksToPlay = filteredTracks.length > 0 ? filteredTracks : POPULAR_SPOTIFY_TRACKS;
    if (onPlayAllTracks) {
      onPlayAllTracks(tracksToPlay);
    } else if (tracksToPlay.length > 0) {
      onSelectTrack(tracksToPlay[0]);
    }
    setHasPlaybackNotice(`Queued all ${tracksToPlay.length} Spotify songs in sequence`);
    setTimeout(() => setHasPlaybackNotice(null), 4000);
  };

  const handleShuffleAll = () => {
    const pool = [...(filteredTracks.length > 0 ? filteredTracks : POPULAR_SPOTIFY_TRACKS)];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    if (onPlayAllTracks) {
      onPlayAllTracks(shuffled);
    } else if (shuffled.length > 0) {
      onSelectTrack(shuffled[0]);
    }
    if (onToggleShuffle && !isShuffle) {
      onToggleShuffle();
    }
    setHasPlaybackNotice(`Shuffled and playing ${shuffled.length} Spotify tracks`);
    setTimeout(() => setHasPlaybackNotice(null), 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className={`w-full max-w-5xl max-h-[92vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all ${
            isTrueBlack
              ? 'bg-black border-white/30 shadow-[0_0_60px_rgba(255,255,255,0.12)] text-white'
              : 'bg-[#061009] border-emerald-500/25 shadow-[0_0_70px_rgba(16,185,129,0.18)] text-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Music className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold tracking-wide">Spotify Universal Web Player</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 animate-pulse" />
                    Play All Songs
                  </span>
                </div>
                <p className="text-xs text-white/50 hidden sm:block">
                  Stream curated Spotify playlists, albums, top tracks, and listen with lyrics & equalizer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onSwitchToYouTube && (
                <button
                  onClick={() => onSwitchToYouTube(activeTrack.title)}
                  className="px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                  title="Watch Video on YouTube"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Watch on YouTube</span>
                </button>
              )}
              <button
                id="sp-minimize-btn"
                onClick={onMinimize}
                title="Minimize to Floating Player"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                id="sp-close-btn"
                onClick={onClose}
                title="Close Player"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center text-white/70 hover:text-emerald-400 transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Header Mode Tabs */}
          <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-black/40 text-xs overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Spotify Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab('lyrics')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lyrics & Sing-Along</span>
              </button>

              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'queue'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>Spotify Queue ({queue.length > 0 ? queue.length : POPULAR_SPOTIFY_TRACKS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('equalizer')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'equalizer'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Audio Equalizer ({EQUALIZER_PRESETS[equalizerPreset]?.label || 'Standard'})</span>
              </button>
            </div>

            {/* Quick Play All Action Controls */}
            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={handlePlayAll}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play All Songs</span>
              </button>
              <button
                onClick={handleShuffleAll}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 text-xs font-medium flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle All</span>
              </button>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Playback Toast Notification */}
            {hasPlaybackNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{hasPlaybackNotice}</span>
                </div>
                <span className="text-[11px] opacity-70">Active Spotify Stream</span>
              </motion.div>
            )}

            {/* Top Row: Spotify Player & Current Track Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Spotify Embed Player */}
              <div className="lg:col-span-7 h-[200px] sm:h-[220px] rounded-2xl overflow-hidden bg-black border border-white/15 relative shadow-2xl">
                {activeTrack ? (
                  <iframe
                    key={activeTrack.id || activeTrack.embedUrl}
                    src={activeTrack.embedUrl}
                    title={activeTrack.title}
                    className="w-full h-full border-0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-2">
                    <Music className="w-8 h-8 opacity-40 animate-pulse" />
                    <span className="text-xs">No track loaded</span>
                  </div>
                )}
              </div>

              {/* Now Playing Details & Transport HUD */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-400">
                      Now Streaming on Spotify
                    </span>
                    {equalizerPreset !== 'flat' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                        EQ: {EQUALIZER_PRESETS[equalizerPreset]?.label}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide line-clamp-2">
                    {activeTrack.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 flex items-center gap-2">
                    <span className="font-medium text-white/90">{activeTrack.artist}</span>
                    <span>•</span>
                    <span className="text-xs text-white/50">{activeTrack.album}</span>
                  </p>
                </div>

                {/* Main Transport Controls */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    {/* Shuffle Toggle */}
                    <button
                      onClick={onToggleShuffle}
                      className={`p-2 rounded-xl transition-all ${
                        isShuffle
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                      title={isShuffle ? 'Shuffle Active' : 'Enable Shuffle'}
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        id="sp-prev-btn"
                        onClick={onPrevTrack}
                        className="p-2.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                        title="Previous Track"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>

                      <button
                        id="sp-play-toggle-btn"
                        onClick={onTogglePlay}
                        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      <button
                        id="sp-next-btn"
                        onClick={onNextTrack}
                        className="p-2.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                        title="Next Track"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Repeat Toggle */}
                    <button
                      onClick={onToggleRepeat}
                      className={`p-2 rounded-xl transition-all ${
                        repeatMode !== 'off'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                      title={`Repeat Mode: ${repeatMode}`}
                    >
                      {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
                    <button
                      id="sp-mute-btn"
                      onClick={onToggleMute}
                      className="text-white/60 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => onVolumeChange(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="text-[10px] text-white/50 w-7 text-right font-mono">
                      {isMuted ? '0%' : `${volume}%`}
                    </span>
                  </div>
                </div>

                {/* Footer Controls & Quick Links */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href={activeTrack.spotifyUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Open in Spotify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Sleep Timer Selector */}
                  <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sleep:</span>
                    {[null, 15, 30, 60].map((mins) => (
                      <button
                        key={mins ?? 'off'}
                        onClick={() => onSetSleepTimer?.(mins)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                          sleepTimerMinutes === mins
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        {mins ? `${mins}m` : 'Off'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 1: SPOTIFY CATALOG & SEARCH */}
            {activeTab === 'catalog' && (
              <div className="space-y-5">
                {/* Quick Spotify Suggestions Carousel */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Popular Spotify Hits:
                    </span>
                    <span className="text-[11px] text-white/40">Tap to load and play instantly</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {SPOTIFY_QUICK_PICKS.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleQuickSuggestion(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all whitespace-nowrap active:scale-95 shadow-sm"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Universal Search & Genre Tabs */}
                <div className="space-y-4 pt-1">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <form onSubmit={handleCustomSearch} className="relative flex-1 w-full">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Spotify tracks, artists, playlists, or albums..."
                        className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.08] transition-all"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md transition-all"
                      >
                        Search
                      </button>
                    </form>

                    {/* Genre Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                      {MUSIC_GENRES.map((tab) => {
                        const count = tab.id === 'all'
                          ? POPULAR_SPOTIFY_TRACKS.length
                          : POPULAR_SPOTIFY_TRACKS.filter((t) => t.category === tab.id).length;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                              selectedCategory === tab.id
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                            }`}
                          >
                            <span>{tab.label}</span>
                            {count > 0 && (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                selectedCategory === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                              }`}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tracks Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {filteredTracks.map((track) => {
                      const isCurrent = activeTrack?.id === track.id || activeTrack?.spotifyUri === track.spotifyUri;
                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            onSelectTrack(track);
                            setHasPlaybackNotice(`Now playing: ${track.title}`);
                            setTimeout(() => setHasPlaybackNotice(null), 4000);
                          }}
                          className={`group relative p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                            isCurrent
                              ? 'bg-emerald-600/20 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 shadow-md">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            </div>
                            {track.id.includes('user-playlist') && (
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-500 text-[10px] font-extrabold text-black uppercase tracking-wider shadow-md">
                                Featured Playlist
                              </span>
                            )}
                            {track.duration && (
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white/90">
                                {track.duration}
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-white tracking-wide line-clamp-1 group-hover:text-emerald-300 transition-colors">
                              {track.title}
                            </h4>
                            <p className="text-[11px] text-white/50 line-clamp-1">{track.artist}</p>
                            <p className="text-[10px] text-emerald-400/70 line-clamp-1 font-mono">{track.album}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SYNCHRONIZED LYRICS & SING-ALONG */}
            {activeTab === 'lyrics' && (
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Sing-Along Lyrics: {activeTrack.title}
                    </h3>
                    <p className="text-xs text-white/50">Artist: {activeTrack.artist} • Album: {activeTrack.album}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Live Karaoke Mode
                  </span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto py-2 pr-2 text-center sm:text-left">
                  {activeTrack.lyrics && activeTrack.lyrics.length > 0 ? (
                    activeTrack.lyrics.map((line, idx) => (
                      <p
                        key={idx}
                        className={`text-sm sm:text-base transition-all font-medium py-1 px-3 rounded-xl ${
                          idx === 1
                            ? 'text-emerald-300 font-bold text-lg sm:text-xl bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {line}
                      </p>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/50 text-sm">
                      <Music className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                      Lyrics stream dynamically synced with Spotify playback
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PLAYBACK QUEUE */}
            {activeTab === 'queue' && (
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ListMusic className="w-4 h-4 text-emerald-400" />
                      Spotify Playback Queue ({filteredTracks.length} Songs)
                    </h3>
                    <p className="text-xs text-white/50">Continuous auto-advance & seamless playback</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayAll}
                      className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md active:scale-95 transition-all"
                    >
                      Play Queue
                    </button>
                    <button
                      onClick={handleShuffleAll}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium active:scale-95 transition-all"
                    >
                      Shuffle
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredTracks.map((track, idx) => {
                    const isCurrent = activeTrack?.id === track.id || activeTrack?.spotifyUri === track.spotifyUri;
                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          onSelectTrack(track);
                          setHasPlaybackNotice(`Playing "${track.title}" from queue`);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/20 text-white font-semibold shadow-md'
                            : 'hover:bg-white/5 text-white/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-white/40 font-mono w-5 text-right">{idx + 1}</span>
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold truncate">{track.title}</h4>
                            <p className="text-[11px] text-white/50 truncate">{track.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold uppercase">
                              Playing
                            </span>
                          )}
                          <span className="text-xs text-white/40 font-mono">{track.duration || '3:30'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: AUDIO EQUALIZER */}
            {activeTab === 'equalizer' && (
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      Studio Audio Equalizer Presets
                    </h3>
                    <p className="text-xs text-white/50">Fine-tune acoustic clarity, bass boost, and stereo warmth</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Active: {EQUALIZER_PRESETS[equalizerPreset]?.label}
                  </span>
                </div>

                {/* Preset Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(EQUALIZER_PRESETS) as EqualizerPreset[]).map((key) => {
                    const preset = EQUALIZER_PRESETS[key];
                    const isSelected = equalizerPreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => onSetEqualizer?.(key)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white">{preset.label}</h4>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <p className="text-xs text-white/60 mt-1">{preset.desc}</p>
                        </div>

                        {/* Frequency Spectrum Sliders Preview */}
                        <div className="flex items-end gap-1.5 h-12 pt-2">
                          {['Bass', 'Mid', 'Treble'].map((band, bIdx) => {
                            const val = bIdx === 0 ? preset.bass : bIdx === 1 ? preset.mid : preset.treble;
                            const heightPct = Math.max(20, Math.min(100, 50 + val * 6));
                            return (
                              <div key={band} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <div
                                  className="w-full rounded-t-md transition-all"
                                  style={{
                                    height: `${heightPct}%`,
                                    backgroundColor: isSelected ? '#10b981' : '#ffffff40',
                                  }}
                                />
                                <span className="text-[9px] text-white/40 font-mono">{band}</span>
                              </div>
                            );
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
