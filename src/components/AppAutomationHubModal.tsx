import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AutomationApp,
  AutomationTask,
  WhatsAppContact,
  ContrastMode,
} from '../types';
import {
  DEFAULT_WHATSAPP_CONTACTS,
  QUICK_AUTOMATION_PROMPTS,
  WHATSAPP_MESSAGE_TEMPLATES,
  COUNTRY_CODES,
  buildWhatsAppUrl,
  buildWhatsAppWebUrl,
  buildWhatsAppAppUrl,
  polishWhatsAppMessage,
  buildGoogleMapsUrl,
  buildMailtoUrl,
  buildGoogleSearchUrl,
} from '../utils/automationPresets';
import {
  MessageSquare,
  Youtube,
  Music,
  MapPin,
  Mail,
  Search,
  Send,
  ExternalLink,
  Terminal,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Phone,
  User,
  X,
  Zap,
  ArrowRight,
  Copy,
  Plus,
  History,
  Volume2,
  VolumeX,
  Globe,
  Smile,
  Heart,
  Briefcase,
  Clock,
  Check,
} from 'lucide-react';

interface AppAutomationHubModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialApp?: AutomationApp;
  activeTask: AutomationTask | null;
  onExecuteTask: (task: AutomationTask) => void;
  onOpenYouTube: (query?: string) => void;
  onOpenSpotify: (query?: string) => void;
  onClose: () => void;
}

interface SentWhatsAppRecord {
  id: string;
  recipientName: string;
  phone: string;
  message: string;
  timestamp: number;
}

const LOCAL_CONTACTS_KEY = 'myraa_custom_whatsapp_contacts_v1';
const LOCAL_HISTORY_KEY = 'myraa_sent_whatsapp_history_v1';

export const AppAutomationHubModal: React.FC<AppAutomationHubModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialApp = 'whatsapp',
  activeTask,
  onExecuteTask,
  onOpenYouTube,
  onOpenSpotify,
  onClose,
}) => {
  const [selectedApp, setSelectedApp] = useState<AutomationApp>(initialApp);
  const [commandInput, setCommandInput] = useState('');

  // WhatsApp Contacts State (Defaults + LocalStorage Custom Contacts)
  const [contactsList, setContactsList] = useState<WhatsAppContact[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CONTACTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...DEFAULT_WHATSAPP_CONTACTS, ...parsed];
      }
    } catch {
      // fallback
    }
    return DEFAULT_WHATSAPP_CONTACTS;
  });

  // WhatsApp active contact & message
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact>(DEFAULT_WHATSAPP_CONTACTS[0]);
  const [customPhone, setCustomPhone] = useState(DEFAULT_WHATSAPP_CONTACTS[0].phone);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [whatsAppMessage, setWhatsAppMessage] = useState(
    'Hey! Sending this via WhatsApp Web automation.'
  );

  // New Contact Modal State
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Friend');

  // WhatsApp Sent / Draft History
  const [sentHistory, setSentHistory] = useState<SentWhatsAppRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Active Template Category
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  // Email form state
  const [emailTo, setEmailTo] = useState('alex@company.com');
  const [emailSubject, setEmailSubject] = useState('Project Deliverables Update');
  const [emailBody, setEmailBody] = useState(
    'Hi Alex,\n\nThe latest build is live and ready for testing. All automation suites have passed.\n\nBest regards.'
  );

  // Maps form state
  const [mapsDestination, setMapsDestination] = useState('Central Park, New York, NY');

  // Search form state
  const [searchQuery, setSearchQuery] = useState('Latest AI news and voice technology');

  // Automation Typing Simulator State
  const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);
  const [simulatedTypedText, setSimulatedTypedText] = useState('');
  const [typingProgress, setTypingProgress] = useState(0);
  const [typingSpeedMode, setTypingSpeedMode] = useState<'fast' | 'normal' | 'cinematic'>('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const isTrueBlack = contrastMode === 'true-black';

  useEffect(() => {
    if (initialApp) {
      setSelectedApp(initialApp);
    }
  }, [initialApp]);

  // Sync if an active task came from voice command
  useEffect(() => {
    if (activeTask) {
      setSelectedApp(activeTask.app);
      if (activeTask.phoneNumber) {
        setCustomPhone(activeTask.phoneNumber);
      }
      if (activeTask.recipient) {
        const found = contactsList.find(
          (c) => c.name.toLowerCase().includes(activeTask.recipient!.toLowerCase())
        );
        if (found) {
          setSelectedContact(found);
        }
      }
      if (activeTask.content) {
        setWhatsAppMessage(activeTask.content);
        triggerTypingSimulation(activeTask.content);
      }
    }
  }, [activeTask, contactsList]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Web Audio subtle mechanical key-click sound
  const playKeyClickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.random() * 220, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext unavailable or muted
    }
  };

  const triggerTypingSimulation = (fullText: string) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsSimulatingTyping(true);
    setSimulatedTypedText('');
    setTypingProgress(0);

    let currentIndex = 0;
    const totalChars = Math.max(1, fullText.length);
    
    let baseSpeed = 25;
    if (typingSpeedMode === 'fast') baseSpeed = 12;
    else if (typingSpeedMode === 'cinematic') baseSpeed = 50;

    const speed = Math.max(10, Math.min(60, (baseSpeed * 50) / totalChars));

    typingTimerRef.current = setInterval(() => {
      if (currentIndex <= totalChars) {
        setSimulatedTypedText(fullText.slice(0, currentIndex));
        setTypingProgress(Math.round((currentIndex / totalChars) * 100));
        if (currentIndex % 3 === 0) playKeyClickSound();
        currentIndex++;
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsSimulatingTyping(false);
      }
    }, speed);
  };

  const saveToSentHistory = (phone: string, recipient: string, msg: string) => {
    const record: SentWhatsAppRecord = {
      id: `wa-hist-${Date.now()}`,
      recipientName: recipient,
      phone,
      message: msg,
      timestamp: Date.now(),
    };
    const updated = [record, ...sentHistory.slice(0, 19)];
    setSentHistory(updated);
    try {
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleRunWhatsAppAutomation = () => {
    const phone = customPhone || selectedContact.phone;
    const msg = whatsAppMessage;
    triggerTypingSimulation(msg);
    saveToSentHistory(phone, selectedContact.name || phone, msg);

    const task: AutomationTask = {
      id: `task-wa-${Date.now()}`,
      app: 'whatsapp',
      title: `WhatsApp to ${selectedContact.name || phone}`,
      description: `Automating message: "${msg.slice(0, 30)}..."`,
      status: 'ready',
      recipient: selectedContact.name,
      phoneNumber: phone,
      content: msg,
      typedText: msg,
      externalUrl: buildWhatsAppUrl(phone, msg),
      timestamp: Date.now(),
    };

    onExecuteTask(task);
  };

  const handleOpenWhatsAppWeb = () => {
    const phone = customPhone || selectedContact.phone;
    const msg = whatsAppMessage;
    saveToSentHistory(phone, selectedContact.name || phone, msg);
    const url = buildWhatsAppWebUrl(phone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWhatsAppApp = () => {
    const phone = customPhone || selectedContact.phone;
    const msg = whatsAppMessage;
    saveToSentHistory(phone, selectedContact.name || phone, msg);
    const appUrl = buildWhatsAppAppUrl(phone, msg);
    const fallbackUrl = buildWhatsAppUrl(phone, msg);

    // Try app protocol, fallback to wa.me
    window.location.href = appUrl;
    setTimeout(() => {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }, 1200);
  };

  const handleCopyMessage = () => {
    if (!whatsAppMessage) return;
    navigator.clipboard.writeText(whatsAppMessage);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleApplyAITone = (tone: 'formal' | 'casual' | 'romantic' | 'concise' | 'hindi' | 'spanish') => {
    const polished = polishWhatsAppMessage(whatsAppMessage, tone);
    setWhatsAppMessage(polished);
    triggerTypingSimulation(polished);
  };

  const handleAddNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    let fullPhone = newContactPhone.trim();
    if (!fullPhone.startsWith('+')) {
      fullPhone = `${selectedCountryCode}${fullPhone.replace(/^0+/, '')}`;
    }

    const newContact: WhatsAppContact = {
      id: `c-custom-${Date.now()}`,
      name: newContactName.trim(),
      phone: fullPhone,
      relationship: newContactRelation,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    };

    const updated = [...contactsList, newContact];
    setContactsList(updated);
    setSelectedContact(newContact);
    setCustomPhone(fullPhone);

    // Save only customs to local storage
    const customs = updated.filter((c) => c.id.startsWith('c-custom-'));
    try {
      localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(customs));
    } catch {
      // ignore
    }

    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  const handleRunEmailAutomation = () => {
    triggerTypingSimulation(emailBody);
    const task: AutomationTask = {
      id: `task-mail-${Date.now()}`,
      app: 'gmail',
      title: `Email to ${emailTo}`,
      description: emailSubject,
      status: 'ready',
      recipient: emailTo,
      subject: emailSubject,
      content: emailBody,
      typedText: emailBody,
      externalUrl: buildMailtoUrl(emailTo, emailSubject, emailBody),
      timestamp: Date.now(),
    };
    onExecuteTask(task);
  };

  const handleRunMapsAutomation = () => {
    triggerTypingSimulation(mapsDestination);
    const task: AutomationTask = {
      id: `task-maps-${Date.now()}`,
      app: 'maps',
      title: `Navigate to ${mapsDestination}`,
      description: `Google Maps route lookup`,
      status: 'ready',
      content: mapsDestination,
      typedText: mapsDestination,
      externalUrl: buildGoogleMapsUrl(mapsDestination),
      timestamp: Date.now(),
    };
    onExecuteTask(task);
  };

  const handleRunSearchAutomation = () => {
    triggerTypingSimulation(searchQuery);
    const task: AutomationTask = {
      id: `task-search-${Date.now()}`,
      app: 'google',
      title: `Search Google: ${searchQuery}`,
      description: `Search query lookup`,
      status: 'ready',
      content: searchQuery,
      typedText: searchQuery,
      externalUrl: buildGoogleSearchUrl(searchQuery),
      timestamp: Date.now(),
    };
    onExecuteTask(task);
  };

  const handleDirectCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const lower = commandInput.toLowerCase();

    if (lower.startsWith('youtube:') || lower.includes('on youtube') || lower.includes('play youtube')) {
      const query = commandInput.replace(/^(youtube:|\/yt)/i, '').replace(/on youtube/i, '').trim();
      onOpenYouTube(query || 'Trending Hits');
      setCommandInput('');
      return;
    }

    if (lower.startsWith('spotify:') || lower.includes('on spotify') || lower.includes('play spotify')) {
      const query = commandInput.replace(/^(spotify:|\/sp)/i, '').replace(/on spotify/i, '').trim();
      onOpenSpotify(query || 'Starboy');
      setCommandInput('');
      return;
    }

    if (lower.startsWith('whatsapp:') || lower.includes('whatsapp') || lower.includes('write message') || lower.includes('message')) {
      setSelectedApp('whatsapp');
      const parts = commandInput.split(':');
      if (parts[1]) {
        setWhatsAppMessage(parts[1].trim());
        triggerTypingSimulation(parts[1].trim());
      } else {
        const cleaned = commandInput.replace(/^(whatsapp:|send whatsapp to|open whatsapp and write message|open whatsapp and write messsage)/i, '').trim();
        if (cleaned) {
          setWhatsAppMessage(cleaned);
          triggerTypingSimulation(cleaned);
        }
      }
      setCommandInput('');
      return;
    }

    if (lower.startsWith('maps:') || lower.includes('navigate') || lower.includes('directions')) {
      setSelectedApp('maps');
      const dest = commandInput.replace(/^(maps:|navigate to|directions to)/i, '').trim();
      if (dest) {
        setMapsDestination(dest);
        triggerTypingSimulation(dest);
      }
      setCommandInput('');
      return;
    }

    // Default to Google search
    setSelectedApp('google');
    setSearchQuery(commandInput.trim());
    triggerTypingSimulation(commandInput.trim());
    setCommandInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-6xl max-h-[94vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all ${
            isTrueBlack
              ? 'bg-black border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.15)] text-white'
              : 'bg-[#090d14] border-emerald-500/25 shadow-[0_0_60px_rgba(16,185,129,0.15)] text-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold tracking-wide">
                    WhatsApp Automation & App Hub
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    <span>Auto-Write & Send</span>
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  Compose, auto-type with live simulated keystrokes, and launch WhatsApp Web or App with 1-click
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Disable Typing Sound FX' : 'Enable Typing Sound FX'}
                className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
                  soundEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Audio FX On' : 'Muted'}</span>
              </button>

              <button
                onClick={onClose}
                title="Close Automation Hub"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Command Execution Bar */}
          <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5">
            <form onSubmit={handleDirectCommandSubmit} className="relative flex items-center">
              <Terminal className="w-4 h-4 absolute left-3.5 text-emerald-400" />
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type command (e.g. 'whatsapp: Heading home now', 'youtube: Bohemian Rhapsody', 'maps: Central Park')..."
                className="w-full pl-10 pr-28 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/60 transition-all font-mono"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Execute</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* App Navigation Tabs */}
          <div className="px-6 py-2 border-b border-white/5 overflow-x-auto flex items-center gap-2">
            {[
              { id: 'whatsapp', label: 'WhatsApp Messenger', icon: MessageSquare, color: 'text-emerald-400' },
              { id: 'youtube', label: 'YouTube Music & Video', icon: Youtube, color: 'text-red-500' },
              { id: 'spotify', label: 'Spotify Player', icon: Music, color: 'text-emerald-400' },
              { id: 'maps', label: 'Google Maps Directions', icon: MapPin, color: 'text-amber-400' },
              { id: 'gmail', label: 'Gmail Composer', icon: Mail, color: 'text-rose-400' },
              { id: 'google', label: 'Google Search', icon: Search, color: 'text-blue-400' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedApp === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedApp(tab.id as AutomationApp);
                    if (tab.id === 'youtube') onOpenYouTube();
                    if (tab.id === 'spotify') onOpenSpotify();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-white border border-emerald-500/40 shadow-md font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* WhatsApp Messenger Automation View */}
            {selectedApp === 'whatsapp' && (
              <div className="space-y-6">
                {/* Main WhatsApp Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Contact Selector, Composer, Templates & AI Polish */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Contact Picker Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-2">
                          <User className="w-3.5 h-3.5" />
                          <span>Select Recipient</span>
                        </h3>
                        <button
                          onClick={() => setIsAddingContact(!isAddingContact)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-emerald-300 text-[11px] font-medium border border-white/10 flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isAddingContact ? 'Cancel' : 'Add Contact'}</span>
                        </button>
                      </div>

                      {/* Add Contact Form Inline */}
                      {isAddingContact && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleAddNewContact}
                          className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 space-y-2.5"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={newContactName}
                              onChange={(e) => setNewContactName(e.target.value)}
                              placeholder="Name (e.g. Boss, Sister)"
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                            />
                            <select
                              value={newContactRelation}
                              onChange={(e) => setNewContactRelation(e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#1a222d] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                            >
                              <option value="Family">Family</option>
                              <option value="Friend">Friend</option>
                              <option value="Work">Work</option>
                              <option value="Partner">Partner</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={selectedCountryCode}
                              onChange={(e) => setSelectedCountryCode(e.target.value)}
                              className="px-2 py-1.5 rounded-lg bg-[#1a222d] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              required
                              value={newContactPhone}
                              onChange={(e) => setNewContactPhone(e.target.value)}
                              placeholder="Phone Number"
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow"
                          >
                            Save Recipient
                          </button>
                        </motion.form>
                      )}

                      {/* Contacts Horizontal/Vertical List */}
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        {contactsList.map((contact) => {
                          const isSelected = selectedContact.id === contact.id;
                          return (
                            <div
                              key={contact.id}
                              onClick={() => {
                                setSelectedContact(contact);
                                setCustomPhone(contact.phone);
                              }}
                              className={`p-2 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                                isSelected
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm'
                                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70'
                              }`}
                            >
                              <img
                                src={contact.avatar}
                                alt={contact.name}
                                className="w-8 h-8 rounded-full object-cover border border-white/20"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-semibold truncate">{contact.name}</h4>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">
                                    {contact.relationship}
                                  </span>
                                </div>
                                <p className="text-[11px] text-white/40 font-mono truncate">{contact.phone}</p>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom Phone with Country Code */}
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-white/50 block font-medium">
                            Direct Custom Number:
                          </label>
                          <span className="text-[9px] text-emerald-400 font-mono">
                            🇮🇳 Default: +91 (India)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={selectedCountryCode}
                            onChange={(e) => {
                              const newCode = e.target.value;
                              setSelectedCountryCode(newCode);
                              if (customPhone.startsWith('+')) {
                                setCustomPhone(
                                  `${newCode}${customPhone.replace(/^\+\d+/, '')}`
                                );
                              } else if (customPhone.trim()) {
                                setCustomPhone(`${newCode}${customPhone.replace(/^0+/, '')}`);
                              }
                            }}
                            className="px-2 py-1.5 rounded-xl bg-[#131b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code} ({c.country.split('/')[0].trim()})
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={customPhone}
                            onChange={(e) => {
                              const val = e.target.value;
                              const digitsOnly = val.replace(/[^0-9]/g, '');
                              // Auto format 10 digit Indian number with +91
                              if (val.length === 10 && /^[6-9]\d{9}$/.test(val)) {
                                setCustomPhone(`+91${val}`);
                              } else {
                                setCustomPhone(val);
                              }
                            }}
                            placeholder="+919876543210 or 10-digit number"
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message Composer & AI Polisher */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Message Content</span>
                        </h3>
                        <span className="text-[10px] text-white/40 font-mono">
                          {whatsAppMessage.length} chars
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        value={whatsAppMessage}
                        onChange={(e) => setWhatsAppMessage(e.target.value)}
                        placeholder="Write your message to automate & send..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                      />

                      {/* AI Tone Quick Buttons */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>AI Tone Polisher:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'formal', label: 'Formal / Work', icon: Briefcase },
                            { id: 'casual', label: 'Casual & Fun', icon: Smile },
                            { id: 'romantic', label: 'Sweet & Romantic', icon: Heart },
                            { id: 'concise', label: 'Concise', icon: Zap },
                            { id: 'hindi', label: 'हिंदी (Hindi)', icon: Globe },
                            { id: 'spanish', label: 'Español', icon: Globe },
                          ].map((t) => {
                            const ToneIcon = t.icon;
                            return (
                              <button
                                key={t.id}
                                onClick={() => handleApplyAITone(t.id as any)}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white/70 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 text-[10px] flex items-center gap-1 transition-all"
                              >
                                <ToneIcon className="w-2.5 h-2.5 text-emerald-400" />
                                <span>{t.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Auto-Typing Speed Selector */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-white/40">Typing Animation Speed:</span>
                        <div className="flex items-center gap-1">
                          {(['fast', 'normal', 'cinematic'] as const).map((spd) => (
                            <button
                              key={spd}
                              onClick={() => setTypingSpeedMode(spd)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all ${
                                typingSpeedMode === spd
                                  ? 'bg-emerald-500 text-black font-bold'
                                  : 'bg-white/5 text-white/50 hover:text-white'
                              }`}
                            >
                              {spd}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Primary Auto-Type Trigger Button */}
                      <button
                        onClick={handleRunWhatsAppAutomation}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Simulate Auto-Typing & Stage Message</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Simulated Phone HUD & Direct Send Action Station */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Simulated Phone HUD */}
                    <div className="rounded-3xl bg-[#0e161c] border border-emerald-500/30 overflow-hidden shadow-2xl flex flex-col h-full min-h-[420px]">
                      {/* Simulated WhatsApp Phone Header */}
                      <div className="px-4 py-3 bg-[#182229] border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedContact.avatar}
                            alt={selectedContact.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span>{selectedContact.name}</span>
                              <span className="text-[10px] text-white/40 font-mono">
                                ({customPhone || selectedContact.phone})
                              </span>
                            </h4>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>online (Myraa Auto-Agent)</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => triggerTypingSimulation(whatsAppMessage)}
                            title="Replay Auto-Typing Simulation"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-[10px] flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span className="hidden sm:inline">Replay</span>
                          </button>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                            {isSimulatingTyping ? `Typing ${typingProgress}%` : 'Draft Ready'}
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Chat Canvas */}
                      <div className="flex-1 p-5 flex flex-col justify-end space-y-4 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] min-h-[220px]">
                        {/* Incoming Greeting message */}
                        <div className="self-start max-w-[80%] bg-[#202c33] text-white/90 p-3 rounded-2xl rounded-tl-sm text-xs border border-white/5 shadow-md">
                          <p>Hey! Feel free to send over the update or notes.</p>
                          <span className="text-[9px] text-white/30 block text-right mt-1">10:42 AM</span>
                        </div>

                        {/* Outgoing Animated Auto-Typed Message Bubble */}
                        <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-sm text-xs border border-emerald-400/20 shadow-lg relative">
                          <p className="whitespace-pre-wrap leading-relaxed font-sans">
                            {isSimulatingTyping ? simulatedTypedText : whatsAppMessage}
                            {isSimulatingTyping && (
                              <span className="inline-block w-1.5 h-3.5 bg-emerald-300 ml-0.5 animate-pulse align-middle" />
                            )}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1.5">
                            <span className="text-[9px] text-emerald-200/60 font-mono">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Bottom Input & Action Station */}
                      <div className="p-3 bg-[#202c33] border-t border-white/10 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-3 py-2 rounded-xl bg-[#2a3942] text-xs text-white/80 font-mono flex items-center justify-between overflow-hidden">
                            <span className="truncate">
                              {isSimulatingTyping ? simulatedTypedText : whatsAppMessage}
                            </span>
                            {isSimulatingTyping && (
                              <span className="text-[10px] text-emerald-400 shrink-0 ml-2 animate-pulse font-sans">
                                Auto-Typing...
                              </span>
                            )}
                          </div>

                          <button
                            onClick={handleCopyMessage}
                            title="Copy Message Text"
                            className="p-2.5 rounded-xl bg-[#2a3942] hover:bg-[#344550] text-white/70 hover:text-white transition-all"
                          >
                            {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Direct Action Launchers */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {/* 1. Open WhatsApp Web */}
                          <button
                            onClick={handleOpenWhatsAppWeb}
                            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>WhatsApp Web</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          {/* 2. Direct wa.me Mobile/Desktop Send */}
                          <a
                            href={buildWhatsAppUrl(customPhone || selectedContact.phone, whatsAppMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => saveToSentHistory(customPhone || selectedContact.phone, selectedContact.name, whatsAppMessage)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send via wa.me</span>
                          </a>

                          {/* 3. Open Native WhatsApp App */}
                          <button
                            onClick={handleOpenWhatsAppApp}
                            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all active:scale-95"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Open App</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Message Templates Selector */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>1-Click Smart WhatsApp Templates</span>
                    </span>

                    {/* Category tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {WHATSAPP_MESSAGE_TEMPLATES.map((cat, idx) => (
                        <button
                          key={cat.category}
                          onClick={() => setActiveCategoryIdx(idx)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                            activeCategoryIdx === idx
                              ? 'bg-emerald-500 text-black font-bold shadow'
                              : 'bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          <span>{cat.icon} {cat.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Category Templates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {WHATSAPP_MESSAGE_TEMPLATES[activeCategoryIdx]?.templates.map((tpl, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => {
                          setWhatsAppMessage(tpl.text);
                          triggerTypingSimulation(tpl.text);
                        }}
                        className="p-3 rounded-xl bg-black/30 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                            {tpl.title}
                          </h5>
                          <Play className="w-2.5 h-2.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed font-sans">
                          {tpl.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sent / Draft History Drawer (Toggleable) */}
                {sentHistory.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-white/50 flex items-center gap-2">
                        <History className="w-3.5 h-3.5" />
                        <span>Recent Sent & Drafted Messages ({sentHistory.length})</span>
                      </span>
                      <button
                        onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        {showHistoryDrawer ? 'Hide History' : 'Show History'}
                      </button>
                    </div>

                    {showHistoryDrawer && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                        {sentHistory.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setWhatsAppMessage(item.message);
                              setCustomPhone(item.phone);
                              triggerTypingSimulation(item.message);
                            }}
                            className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/5 cursor-pointer transition-all space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-emerald-300 truncate">
                                {item.recipientName}
                              </span>
                              <span className="text-[9px] text-white/30 font-mono">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/60 line-clamp-1 font-mono">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Google Maps Automation View */}
            {selectedApp === 'maps' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Google Maps Navigation Automation</h3>
                      <p className="text-xs text-white/50">Search routes, traffic, and directions</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Destination Address or Place:</label>
                    <input
                      type="text"
                      value={mapsDestination}
                      onChange={(e) => setMapsDestination(e.target.value)}
                      placeholder="e.g. Golden Gate Bridge, San Francisco"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleRunMapsAutomation}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Route Lookup</span>
                    </button>
                    <a
                      href={buildGoogleMapsUrl(mapsDestination)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all border border-white/10"
                    >
                      <span>Open Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Simulated Maps preview */}
                <div className="lg:col-span-6 p-6 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-amber-400 pb-2 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" />
                      <span>Maps Engine Log</span>
                    </span>
                    <span className="text-[10px] text-white/40">READY</span>
                  </div>
                  <div className="space-y-1.5 text-white/70">
                    <p className="text-white/40">&gt; Target Destination: &quot;{mapsDestination}&quot;</p>
                    <p className="text-emerald-400">&gt; Route URL: {buildGoogleMapsUrl(mapsDestination)}</p>
                    <p className="text-white/40">&gt; Realtime traffic layer: Enabled</p>
                    {isSimulatingTyping && (
                      <p className="text-amber-300 animate-pulse">&gt; Typing: {simulatedTypedText}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Gmail Composer View */}
            {selectedApp === 'gmail' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Gmail Auto-Composer</h3>
                      <p className="text-xs text-white/50">Draft emails with simulated keystrokes</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-xs text-white/60">To (Email):</label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/60">Subject:</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Subject line..."
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/60">Body:</label>
                      <textarea
                        rows={4}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Draft message content..."
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 resize-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleRunEmailAutomation}
                      className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Auto-Typing</span>
                    </button>
                    <a
                      href={buildMailtoUrl(emailTo, emailSubject, emailBody)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all border border-white/10"
                    >
                      <span>Open Mail App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Simulated Email Canvas */}
                <div className="lg:col-span-6 p-6 rounded-2xl bg-black/40 border border-rose-500/20 space-y-3 font-mono text-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-rose-400">
                      <span>Draft Preview</span>
                      <span className="text-[10px] text-white/40">RFC-822</span>
                    </div>
                    <div className="space-y-1 text-white/80">
                      <p><span className="text-white/40">To:</span> {emailTo}</p>
                      <p><span className="text-white/40">Subject:</span> {emailSubject}</p>
                      <hr className="border-white/5 my-2" />
                      <p className="whitespace-pre-wrap font-sans text-xs text-white/90 leading-relaxed">
                        {isSimulatingTyping ? simulatedTypedText : emailBody}
                        {isSimulatingTyping && (
                          <span className="inline-block w-1.5 h-3.5 bg-rose-400 ml-0.5 animate-pulse align-middle" />
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/5 text-[10px] text-white/40 flex items-center justify-between">
                    <span>{isSimulatingTyping ? `Progress: ${typingProgress}%` : 'Ready to send'}</span>
                    <span>Charset: UTF-8</span>
                  </div>
                </div>
              </div>
            )}

            {/* Google Search View */}
            {selectedApp === 'google' && (
              <div className="max-w-2xl mx-auto space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Google Smart Search</h3>
                  <p className="text-xs text-white/50">Look up any topic or research question</p>
                </div>
                <div className="space-y-2 text-left">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Google..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleRunSearchAutomation}
                      className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Query Typing</span>
                    </button>
                    <a
                      href={buildGoogleSearchUrl(searchQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all border border-white/10"
                    >
                      <span>Search on Google</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Automation Prompts Grid */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-[11px] uppercase font-bold tracking-wider text-white/50 block">
                Quick Automation Commands
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {QUICK_AUTOMATION_PROMPTS.map((prompt) => (
                  <div
                    key={prompt.id}
                    onClick={() => {
                      if (prompt.app === 'youtube') {
                        onOpenYouTube(prompt.query);
                      } else if (prompt.app === 'spotify') {
                        onOpenSpotify(prompt.query);
                      } else if (prompt.app === 'whatsapp') {
                        setSelectedApp('whatsapp');
                        if (prompt.phone) setCustomPhone(prompt.phone);
                        if (prompt.message) {
                          setWhatsAppMessage(prompt.message);
                          triggerTypingSimulation(prompt.message);
                        }
                      } else if (prompt.app === 'maps') {
                        setSelectedApp('maps');
                        if (prompt.destination) {
                          setMapsDestination(prompt.destination);
                          triggerTypingSimulation(prompt.destination);
                        }
                      } else if (prompt.app === 'gmail') {
                        setSelectedApp('gmail');
                        if (prompt.to) setEmailTo(prompt.to);
                        if (prompt.subject) setEmailSubject(prompt.subject);
                        if (prompt.body) {
                          setEmailBody(prompt.body);
                          triggerTypingSimulation(prompt.body);
                        }
                      }
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 cursor-pointer transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {prompt.title}
                      </h5>
                      <p className="text-[11px] text-white/40 truncate">{prompt.command}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
