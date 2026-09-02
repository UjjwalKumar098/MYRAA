import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Battery,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface BatteryState {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  isSupported: boolean;
}

export const BatteryIndicator: React.FC = () => {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 100,
    charging: false,
    chargingTime: 0,
    dischargingTime: Infinity,
    isSupported: false,
  });

  const [showWarningTip, setShowWarningTip] = useState<boolean>(false);

  useEffect(() => {
    let batteryInstance: any = null;

    const updateBattery = (battery: any) => {
      setBatteryState({
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        isSupported: true,
      });
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          batteryInstance = battery;
          updateBattery(battery);

          const onLevelChange = () => updateBattery(battery);
          const onChargingChange = () => updateBattery(battery);
          const onChargingTimeChange = () => updateBattery(battery);
          const onDischargingTimeChange = () => updateBattery(battery);

          battery.addEventListener('levelchange', onLevelChange);
          battery.addEventListener('chargingchange', onChargingChange);
          battery.addEventListener('chargingtimechange', onChargingTimeChange);
          battery.addEventListener('dischargingtimechange', onDischargingTimeChange);
        })
        .catch(() => {
          setBatteryState((prev) => ({ ...prev, isSupported: false }));
        });
    } else {
      setBatteryState((prev) => ({ ...prev, isSupported: false }));
    }

    return () => {
      if (batteryInstance) {
        try {
          batteryInstance.removeEventListener('levelchange', () => {});
          batteryInstance.removeEventListener('chargingchange', () => {});
        } catch {
          // cleanup fallback
        }
      }
    };
  }, []);

  const { level, charging, isSupported } = batteryState;
  const displayLevel = isSupported ? level : 100;
  const isCriticallyLow = displayLevel <= 20 && !charging;

  // Determine color scheme based on battery level and charging status
  const getColorClasses = () => {
    if (charging) {
      return {
        badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
        bar: 'bg-emerald-400',
        glow: 'shadow-[0_0_12px_rgba(52,211,153,0.35)]',
      };
    }
    if (isCriticallyLow) {
      return {
        badge: 'border-rose-500/60 bg-rose-950/50 text-rose-300 ring-1 ring-rose-500/40',
        bar: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]',
      };
    }
    if (displayLevel <= 50) {
      return {
        badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        bar: 'bg-amber-400',
        glow: 'shadow-[0_0_10px_rgba(251,191,36,0.2)]',
      };
    }
    return {
      badge: 'border-cyan-500/20 bg-white/5 text-cyan-200',
      bar: 'bg-cyan-400',
      glow: 'shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    };
  };

  const colors = getColorClasses();

  const renderIcon = () => {
    if (charging) {
      return <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />;
    }
    if (isCriticallyLow) {
      return <BatteryLow className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
    }
    if (displayLevel <= 50) {
      return <BatteryWarning className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (displayLevel <= 85) {
      return <BatteryMedium className="w-3.5 h-3.5 text-cyan-300" />;
    }
    return <Battery className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="relative flex items-center">
      {/* Battery Pill */}
      <button
        type="button"
        id="header-battery-indicator"
        onClick={() => setShowWarningTip((prev) => !prev)}
        onMouseEnter={() => setShowWarningTip(true)}
        onMouseLeave={() => setShowWarningTip(false)}
        className={`relative flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md transition-all cursor-pointer select-none ${colors.badge} ${colors.glow}`}
        title={
          isSupported
            ? `Device Battery: ${level}% ${
                charging ? '(Charging)' : isCriticallyLow ? '(Critically Low)' : '(On Battery)'
              }`
            : 'Battery monitoring active'
        }
      >
        {/* Warning ping beacon for critical level */}
        {isCriticallyLow && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {renderIcon()}
          <span
            className={`text-xs font-mono font-medium tracking-tight ${
              isCriticallyLow ? 'text-rose-200 font-bold' : ''
            }`}
          >
            {displayLevel}%
          </span>
        </div>

        {/* Micro Level Meter Bar */}
        <div className="hidden sm:block w-7 h-1.5 rounded-full bg-white/10 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
            style={{ width: `${Math.max(10, Math.min(100, displayLevel))}%` }}
          />
        </div>

        {/* Critical tag for high awareness on medium+ screens */}
        {isCriticallyLow && (
          <div className="hidden md:flex items-center gap-1 text-[10px] font-semibold text-rose-300 uppercase tracking-wider bg-rose-500/20 px-1.5 py-0.5 rounded-full">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
            <span>Low Power</span>
          </div>
        )}
      </button>

      {/* Floating Low-Battery Session Notice Tooltip / Dropdown */}
      <AnimatePresence>
        {(showWarningTip || isCriticallyLow) && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 z-50 pointer-events-none w-64 p-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              isCriticallyLow
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100'
                : 'bg-neutral-900/90 border-white/10 text-neutral-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isCriticallyLow ? (
                <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
              ) : charging ? (
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
              ) : (
                <div className="p-1.5 rounded-xl bg-white/10 text-cyan-300 shrink-0 mt-0.5">
                  <Battery className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div className="flex-1 text-left">
                <div className="text-xs font-semibold tracking-wide">
                  {isCriticallyLow
                    ? 'Battery Below 20%'
                    : charging
                    ? 'Device Charging'
                    : `Battery: ${displayLevel}%`}
                </div>
                <p className="text-[11px] leading-relaxed mt-0.5 opacity-80">
                  {isCriticallyLow
                    ? 'Energy is critically low. Active voice & audio streaming may disconnect soon.'
                    : charging
                    ? 'Connected to power. Voice session will run uninterrupted.'
                    : 'Monitoring device power consumption during active live sessions.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
