import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DeviceNotification,
  DeviceSourceType,
  NotificationCategory,
  ContrastMode,
} from '../types';
import {
  requestSystemNotificationPermission,
  checkSystemNotificationPermission,
  triggerNativeSystemNotification,
  readNotificationsAloud,
  stopVoiceNotificationReading,
  generateQuickSmartReply,
} from '../utils/deviceNotificationEngine';
import {
  Bell,
  Smartphone,
  Laptop,
  Volume2,
  VolumeX,
  CheckCircle2,
  Trash2,
  Send,
  Sparkles,
  AlertTriangle,
  MessageSquare,
  PhoneCall,
  Calendar,
  Github,
  Mail,
  BatteryCharging,
  Layers,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface DeviceNotificationHubModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  notifications: DeviceNotification[];
  onClose: () => void;
  onUpdateNotifications: (updated: DeviceNotification[]) => void;
  onLogVoiceCommand?: (command: string, category: string, details?: string, source?: 'voice' | 'touch' | 'system') => void;
}

export const DeviceNotificationHubModal: React.FC<DeviceNotificationHubModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  notifications,
  onClose,
  onUpdateNotifications,
  onLogVoiceCommand,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mobile' | 'laptop' | 'unread'>('all');
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [customSender, setCustomSender] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [customDevice, setCustomDevice] = useState<DeviceSourceType>('mobile');
  const [customCategory, setCustomCategory] = useState<NotificationCategory>('whatsapp');
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPermissionStatus(checkSystemNotificationPermission());
    } else {
      stopVoiceNotificationReading();
      setIsReadingAloud(false);
      setCurrentReadingId(null);
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRequestPermission = async () => {
    const res = await requestSystemNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      showToast('System Notification Permission Granted!');
      onLogVoiceCommand?.(
        'Enable Device Notifications',
        'system',
        'Web notification permissions enabled for Mobile & Laptop',
        'touch'
      );
      // Trigger a welcome test push
      triggerNativeSystemNotification({
        id: 'test-welcome',
        device: 'laptop',
        category: 'system',
        sender: 'Remix Myraa',
        title: 'Notifications Active',
        message: 'Mobile & Laptop notification bridge is connected and ready to read alerts aloud.',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
      });
    } else if (res === 'denied') {
      showToast('Notifications blocked in browser settings.');
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'mobile') return item.device === 'mobile';
    if (activeTab === 'laptop') return item.device === 'laptop';
    if (activeTab === 'unread') return !item.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const mobileUnread = notifications.filter((n) => n.device === 'mobile' && !n.read).length;
  const laptopUnread = notifications.filter((n) => n.device === 'laptop' && !n.read).length;

  const handleStartReadAloud = (itemsToRead: DeviceNotification[]) => {
    if (itemsToRead.length === 0) {
      showToast('No notifications to read.');
      return;
    }

    setIsReadingAloud(true);
    onLogVoiceCommand?.(
      `Read ${itemsToRead.length} Notifications Aloud`,
      'automation',
      `Reading aloud ${itemsToRead.map((n) => n.title).join(', ')}`,
      'touch'
    );

    readNotificationsAloud(itemsToRead, {
      onStart: (_, current) => {
        setCurrentReadingId(current.id);
      },
      onItemComplete: (_, current) => {
        // Mark current as read
        onUpdateNotifications(
          notifications.map((n) => (n.id === current.id ? { ...n, read: true } : n))
        );
      },
      onAllComplete: () => {
        setIsReadingAloud(false);
        setCurrentReadingId(null);
        showToast('Finished reading all notifications.');
      },
      onError: () => {
        setIsReadingAloud(false);
        setCurrentReadingId(null);
      },
    });
  };

  const handleStopReading = () => {
    stopVoiceNotificationReading();
    setIsReadingAloud(false);
    setCurrentReadingId(null);
    showToast('Voice reader paused.');
  };

  const handleMarkAsRead = (id: string) => {
    onUpdateNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    onUpdateNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    onUpdateNotifications([]);
    showToast('All notifications cleared.');
  };

  const handlePushTestNotification = (device: DeviceSourceType) => {
    const isMob = device === 'mobile';
    const newNotif: DeviceNotification = {
      id: `test-${Date.now()}`,
      device,
      category: isMob ? 'whatsapp' : 'slack',
      sender: isMob ? 'Aman Gupta (WhatsApp)' : 'DevOps Watchdog (#alerts)',
      title: isMob ? 'New WhatsApp Voice Note' : 'Build Passed on Container',
      message: isMob
        ? 'Bhai, main office pahunch gaya hoon. 10 minute me call karta hoon.'
        : 'Continuous Integration build #89 succeeded. Production preview is online.',
      timestamp: Date.now(),
      read: false,
      priority: 'urgent',
      replyDraft: isMob ? 'Theek hai, call me when ready!' : 'Merged and deployed.',
    };

    onUpdateNotifications([newNotif, ...notifications]);
    triggerNativeSystemNotification(newNotif);
    showToast(`Test ${isMob ? 'Mobile' : 'Laptop'} alert sent!`);
  };

  const handleAddCustomNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    const newNotif: DeviceNotification = {
      id: `custom-${Date.now()}`,
      device: customDevice,
      category: customCategory,
      sender: customSender.trim() || (customDevice === 'mobile' ? 'Mobile Contact' : 'Laptop App'),
      title: `${customCategory.toUpperCase()} Notification`,
      message: customMsg.trim(),
      timestamp: Date.now(),
      read: false,
      priority: 'urgent',
      replyDraft: `Reply to ${customSender || 'notification'}: Received!`,
    };

    onUpdateNotifications([newNotif, ...notifications]);
    triggerNativeSystemNotification(newNotif);
    setCustomMsg('');
    setCustomSender('');
    setShowAddForm(false);
    showToast('Custom notification created and dispatched!');
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'call':
        return <PhoneCall className="w-4 h-4 text-rose-400" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'github':
        return <Github className="w-4 h-4 text-purple-400" />;
      case 'slack':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-cyan-400" />;
      case 'battery':
        return <BatteryCharging className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  if (!isOpen) return null;

  const isTrueBlack = contrastMode === 'true_black';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isTrueBlack
            ? 'bg-black border-white/20 text-white'
            : 'bg-slate-900/95 border-slate-700/70 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-wide">
                  Mobile & Laptop Notification Reader
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {unreadCount} Unread
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronized notification bridge with text-to-speech audio reading & native system push alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Permission & System Status Banner */}
        <div className="px-4 py-3 bg-cyan-950/40 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>
              OS Native Browser Push:{' '}
              <strong className={permissionStatus === 'granted' ? 'text-emerald-400' : 'text-amber-300'}>
                {permissionStatus === 'granted' ? 'Active & Enabled' : 'Needs Browser Permission'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {permissionStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                Enable System Push
              </button>
            )}

            <button
              onClick={() => handlePushTestNotification('mobile')}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs transition-colors flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              + Test Mobile Alert
            </button>

            <button
              onClick={() => handlePushTestNotification('laptop')}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs transition-colors flex items-center gap-1"
            >
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              + Test Laptop Alert
            </button>
          </div>
        </div>

        {/* Action Controls & Filter Bar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/20">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'mobile'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile ({mobileUnread} unread)
            </button>
            <button
              onClick={() => setActiveTab('laptop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'laptop'
                  ? 'bg-blue-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              Laptop ({laptopUnread} unread)
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'unread'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isReadingAloud ? (
              <button
                onClick={handleStopReading}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold flex items-center gap-2 animate-pulse shadow-lg shadow-rose-500/20 transition-all"
              >
                <VolumeX className="w-4 h-4" />
                Stop Reading
              </button>
            ) : (
              <button
                onClick={() => handleStartReadAloud(filteredNotifications)}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                Read Aloud with Myraa Voice
              </button>
            )}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              title="Add Custom Notification"
            >
              <Plus className="w-4 h-4" />
            </button>

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                title="Clear All Notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Custom Notification Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddCustomNotification}
              className="p-4 bg-white/5 border-b border-white/10 flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Create & Push Test Notification:</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={customDevice}
                  onChange={(e) => setCustomDevice(e.target.value as DeviceSourceType)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="mobile">📱 Mobile Device</option>
                  <option value="laptop">💻 Laptop / PC</option>
                </select>

                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as NotificationCategory)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="call">Missed Call</option>
                  <option value="sms">SMS Text</option>
                  <option value="slack">Slack</option>
                  <option value="calendar">Calendar</option>
                  <option value="github">GitHub</option>
                  <option value="email">Email</option>
                  <option value="battery">Battery Alert</option>
                </select>

                <input
                  type="text"
                  placeholder="Sender (e.g. Rahul, Papa, Slack)"
                  value={customSender}
                  onChange={(e) => setCustomSender(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Message content to read aloud..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mb-2" />
              <p className="text-sm font-semibold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No active notifications in this category. Click "+ Test Mobile Alert" or "+ Test Laptop Alert" to test.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isCurrentReading = currentReadingId === notif.id;
              const formattedTime = new Date(notif.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={notif.id}
                  layout
                  className={`p-4 rounded-xl border transition-all relative ${
                    isCurrentReading
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                      : notif.read
                      ? 'bg-white/[0.02] border-white/5 text-slate-400'
                      : 'bg-white/5 border-white/15 text-slate-200 shadow-md'
                  }`}
                >
                  {isCurrentReading && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] animate-pulse">
                      <Volume2 className="w-3 h-3" />
                      Reading Aloud
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5 p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                        {getCategoryIcon(notif.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                            {notif.device === 'mobile' ? (
                              <Smartphone className="w-3.5 h-3.5 text-emerald-400 inline" />
                            ) : (
                              <Laptop className="w-3.5 h-3.5 text-blue-400 inline" />
                            )}
                            {notif.sender || notif.title}
                          </span>

                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider font-mono">
                            {notif.category}
                          </span>

                          <span className="text-[11px] text-slate-500">{formattedTime}</span>

                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>

                        {/* Quick AI Smart Reply Pill */}
                        {notif.replyDraft && (
                          <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-cyan-300">
                              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate italic">"{notif.replyDraft}"</span>
                            </div>
                            <button
                              onClick={() => {
                                showToast(`Sent reply: "${notif.replyDraft}"`);
                                handleMarkAsRead(notif.id);
                              }}
                              className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-semibold text-[10px] flex items-center gap-1 flex-shrink-0 transition-colors"
                            >
                              <Send className="w-2.5 h-2.5" />
                              Quick Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleStartReadAloud([notif])}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Read this notification"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-300 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Voice Speech Engine: Active • Hindi & English multilingual parser</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Mobile: {mobileUnread}</span>
            <span>•</span>
            <span>Laptop: {laptopUnread}</span>
          </div>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl shadow-cyan-500/40 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
