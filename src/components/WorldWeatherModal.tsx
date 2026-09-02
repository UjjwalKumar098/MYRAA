import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Search,
  Sunrise,
  Sunset,
  ShieldCheck,
  RefreshCw,
  Globe,
  Sparkles,
  MapPin,
  Briefcase,
  Umbrella,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Navigation,
  Layers,
} from 'lucide-react';
import { ContrastMode, CityWeatherData, WeatherConditionType } from '../types';
import {
  WORLD_CITIES_WEATHER,
  findCityWeather,
  detectUserLiveLocationWeather,
  computeWorkClimate,
  computeRainPossibility,
} from '../utils/weatherData';

interface WorldWeatherModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialCity?: string;
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
}

export type WeatherModalTab = 'overview' | 'work_climate' | 'rain_radar' | 'locations';

export const WorldWeatherModal: React.FC<WorldWeatherModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialCity = 'New Delhi',
  onClose,
  onLogVoiceCommand,
}) => {
  const [activeTab, setActiveTab] = useState<WeatherModalTab>('overview');
  const [activeWeather, setActiveWeather] = useState<CityWeatherData>(WORLD_CITIES_WEATHER[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [locationStatus, setLocationStatus] = useState<string>('');

  const isTrueBlack = contrastMode === 'true-black';

  useEffect(() => {
    if (isOpen) {
      if (initialCity && initialCity !== 'current') {
        const match = findCityWeather(initialCity);
        setActiveWeather(match);
      }
    }
  }, [initialCity, isOpen]);

  // Handle GPS location auto-detection
  const handleDetectCurrentLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus('Detecting GPS coordinates...');
    try {
      const liveLocation = await detectUserLiveLocationWeather();
      setActiveWeather(liveLocation);
      setLocationStatus(`Locked: ${liveLocation.city} (${liveLocation.stateOrRegion || 'GPS'})`);
      onLogVoiceCommand?.(
        `Detected current location weather: ${liveLocation.city}`,
        'general',
        `${liveLocation.tempC}°C • Rain: ${liveLocation.rainForecast?.currentChance || 0}%`,
        'system'
      );
    } catch (e) {
      setLocationStatus('GPS detection failed. Using nearest regional station.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      onLogVoiceCommand?.(
        `Refreshed climate & rain radar for ${activeWeather.city}`,
        'general',
        `${activeWeather.tempC}°C / ${activeWeather.tempF}°F • Rain: ${activeWeather.rainForecast?.currentChance}%`,
        'system'
      );
    }, 500);
  };

  const filteredCities = WORLD_CITIES_WEATHER.filter(
    (c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.stateOrRegion && c.stateOrRegion.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  const renderWeatherIcon = (condition: WeatherConditionType, sizeClass = 'w-6 h-6') => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${sizeClass} text-amber-400`} />;
      case 'partly_cloudy':
        return <Cloud className={`${sizeClass} text-cyan-300`} />;
      case 'cloudy':
      case 'mist':
        return <Cloud className={`${sizeClass} text-slate-400`} />;
      case 'rainy':
        return <CloudRain className={`${sizeClass} text-blue-400`} />;
      case 'heavy_rain':
        return <CloudRain className={`${sizeClass} text-indigo-400`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${sizeClass} text-purple-400`} />;
      case 'snowy':
        return <CloudSnow className={`${sizeClass} text-sky-200`} />;
      default:
        return <Sun className={`${sizeClass} text-amber-400`} />;
    }
  };

  const workClimate =
    activeWeather.workClimate ||
    computeWorkClimate(
      activeWeather.tempC,
      activeWeather.humidity,
      activeWeather.windSpeedKmh,
      activeWeather.airQualityIndex,
      activeWeather.condition,
      activeWeather.city
    );

  const rainForecast =
    activeWeather.rainForecast ||
    computeRainPossibility(
      activeWeather.condition,
      activeWeather.humidity,
      activeWeather.weeklyForecast[0]?.rainProb || 25,
      activeWeather.city
    );

  const currentTemp = unit === 'C' ? `${activeWeather.tempC}°C` : `${activeWeather.tempF}°F`;
  const feelsLike = unit === 'C' ? `${activeWeather.feelsLikeC}°C` : `${activeWeather.feelsLikeF}°F`;
  const highTemp = unit === 'C' ? `${activeWeather.highC}°C` : `${Math.round((activeWeather.highC * 9) / 5 + 32)}°F`;
  const lowTemp = unit === 'C' ? `${activeWeather.lowC}°C` : `${Math.round((activeWeather.lowC * 9) / 5 + 32)}°F`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isTrueBlack
            ? 'bg-black border-neutral-800 text-white'
            : 'bg-gradient-to-b from-slate-900/95 via-[#0d1627]/95 to-[#080d1a]/95 border-white/10 text-white backdrop-blur-2xl'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Climate, Weather & Rain Radar
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-sky-500/20 text-sky-300 rounded-full border border-sky-500/30 uppercase tracking-wider">
                  Live Station
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                Work Ergonomics, Precipitation Radar & High-Precision Location Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GPS Auto-Detect Button */}
            <button
              id="detect-gps-location-btn"
              onClick={handleDetectCurrentLocation}
              disabled={isDetectingLocation}
              title="Detect My Real-Time Location (GPS)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin text-sky-400' : ''}`} />
              <span className="hidden sm:inline">My Location</span>
            </button>

            {/* Unit Toggle °C / °F */}
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5">
              <button
                onClick={() => setUnit('C')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === 'C' ? 'bg-sky-500 text-white shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === 'F' ? 'bg-sky-500 text-white shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Climate & Weather Station"
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-white/10 bg-white/[0.01] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Weather Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('work_climate')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'work_climate'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>Work Climate & Productivity</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {workClimate.productivityScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rain_radar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'rain_radar'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Umbrella className="w-3.5 h-3.5 text-blue-400" />
            <span>Rain Possibility & Radar</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
              {rainForecast.currentChance}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'locations'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span>Locations & Cities</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Quick Active Location Header Card */}
          <div className="relative rounded-3xl p-5 sm:p-6 border border-white/10 bg-gradient-to-br from-sky-500/15 via-indigo-950/40 to-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-sky-300 text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{activeWeather.city}</span>
                    <span className="text-white/40">•</span>
                    <span>{activeWeather.country}</span>
                  </div>
                  {activeWeather.stateOrRegion && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-white/80 font-mono">
                      {activeWeather.stateOrRegion}
                    </span>
                  )}
                  {activeWeather.isCurrentLocation && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      GPS Detected
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {activeWeather.city}
                  </h1>
                  <span className="text-xs text-white/50 font-mono">Local: {activeWeather.localTime}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-sm font-semibold text-white/90">{activeWeather.conditionLabel}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70">
                    Feels like {feelsLike}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      rainForecast.currentChance > 60
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : rainForecast.currentChance > 25
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    🌧️ {rainForecast.currentChance}% Rain Chance
                  </span>
                </div>
              </div>

              {/* Temperature & Icon */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                  {renderWeatherIcon(activeWeather.condition, 'w-12 h-12')}
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                    {currentTemp}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60 font-mono mt-0.5">
                    <span className="text-rose-300 font-bold">H: {highTemp}</span>
                    <span>•</span>
                    <span className="text-sky-300 font-bold">L: {lowTemp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Micro-Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/10">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>Humidity</span>
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{activeWeather.humidity}%</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{activeWeather.windSpeedKmh} km/h</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>UV Index</span>
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{activeWeather.uvIndex}</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Air Quality</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono">{activeWeather.airQualityIndex}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      activeWeather.airQualityStatus === 'Good'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {activeWeather.airQualityStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: WORK CLIMATE & PRODUCTIVITY */}
          {activeTab === 'work_climate' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">Work Climate & Productivity Index</h3>
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      Thermal ergonomics, indoor/outdoor suitability & cognitive focus windows
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      Rating: {workClimate.overallRating}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-mono text-xs font-bold">
                      {workClimate.productivityScore}/100 Score
                    </span>
                  </div>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70 font-semibold flex items-center gap-1.5">
                        🏢 Indoor Remote & Desk Work
                      </span>
                      <span className="font-mono font-bold text-emerald-300">{workClimate.indoorSuitability}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${workClimate.indoorSuitability}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-white/50">{workClimate.thermalComfort}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70 font-semibold flex items-center gap-1.5">
                        🚶 Outdoor Field & Commute
                      </span>
                      <span className="font-mono font-bold text-amber-300">{workClimate.outdoorSuitability}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                        style={{ width: `${workClimate.outdoorSuitability}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-white/50">{workClimate.commuteAdvisory}</p>
                  </div>
                </div>
              </div>

              {/* Work Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Optimal High-Performance Working Hours</span>
                  </div>
                  <div className="text-sm font-semibold text-white bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono">
                    {workClimate.optimalWorkHours}
                  </div>
                  <p className="text-xs text-white/60">
                    Peak circadian & cognitive focus based on ambient temperature and diurnal cycle.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <span>Ventilation & Air Quality Guidance</span>
                  </div>
                  <div className="text-xs text-white/80 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    {workClimate.ventilationAdvice}
                  </div>
                </div>
              </div>

              {/* Ergonomic & Environmental Action Checklist */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Personalized Climate Action Points</span>
                </div>
                <div className="space-y-2">
                  {workClimate.ergonomicTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RAIN POSSIBILITY & PRECIPITATION RADAR */}
          {activeTab === 'rain_radar' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 sm:p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Umbrella className="w-5 h-5 text-blue-400" />
                      <h3 className="text-base font-bold text-white">Rain Possibility & Precipitation Radar</h3>
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      Hour-by-hour rain probability curve, precipitation volume & gear advisory
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold font-mono">
                      {rainForecast.currentChance}% Rain Chance
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold">
                      {rainForecast.intensity}
                    </span>
                  </div>
                </div>

                {/* Umbrella & Travel Advisory */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Umbrella className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{rainForecast.umbrellaAdvice}</div>
                    <div className="text-[11px] text-white/60 mt-0.5">
                      {rainForecast.rainTimeline} • Estimated Volume: {rainForecast.expectedRainfallMm} mm
                    </div>
                  </div>
                </div>

                {/* 12-Hour Rain Probability Bar Chart */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="font-semibold text-white/80">12-Hour Precipitation Probability Timeline</span>
                    <span className="text-[11px]">0% to 100% chance</span>
                  </div>

                  <div className="grid grid-cols-9 gap-1.5 items-end h-28 p-2 rounded-2xl bg-black/30 border border-white/5">
                    {rainForecast.hourlyRainProbability.map((slot, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-end h-full gap-1 group">
                        <span className="text-[9px] font-mono text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          {slot.rainProb}%
                        </span>
                        <div className="w-full bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end h-16">
                          <div
                            className={`w-full rounded-t-md transition-all duration-500 ${
                              slot.rainProb > 70
                                ? 'bg-gradient-to-t from-blue-600 to-indigo-400'
                                : slot.rainProb > 40
                                ? 'bg-gradient-to-t from-sky-500 to-blue-400'
                                : 'bg-gradient-to-t from-slate-600 to-sky-400/50'
                            }`}
                            style={{ height: `${Math.max(8, slot.rainProb)}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-semibold text-white/60 whitespace-nowrap">{slot.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rain Safety & Commute Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Commute & Road Safety</span>
                  </div>
                  <p className="text-xs text-white/70">
                    {rainForecast.currentChance > 50
                      ? 'High precipitation expected. Waterlogged lanes possible on low-lying avenues. Allow 15-20 min buffer.'
                      : 'Roads are mostly dry with minimal hydroplaning risk. Standard commute intervals apply.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span>Accumulated Precipitation</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Expected accumulation: <span className="font-bold text-white font-mono">{rainForecast.expectedRainfallMm} mm</span>. Runoff levels moderate to low across municipal drainage systems.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: WEATHER OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Hourly Temperature Progression */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-sky-400" />
                  <span>Today's Hourly Temperature & Condition Progression</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeWeather.hourlyForecast.map((hour, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center space-y-2 hover:bg-white/10 transition-all"
                    >
                      <span className="text-[11px] font-semibold text-white/60">{hour.time}</span>
                      <div className="p-1.5 rounded-xl bg-white/5">{renderWeatherIcon(hour.condition, 'w-5 h-5')}</div>
                      <span className="text-sm font-bold text-white font-mono">
                        {unit === 'C' ? `${hour.tempC}°C` : `${hour.tempF}°F`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7-Day Extended Forecast */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <span>7-Day Atmospheric & Rain Outlook</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeWeather.weeklyForecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 font-bold text-xs text-white">{day.day}</div>
                        <div className="p-1 rounded-lg bg-white/5">{renderWeatherIcon(day.condition, 'w-4 h-4')}</div>
                        {day.rainProb > 0 && (
                          <span className="text-[10px] font-mono text-blue-300 font-semibold flex items-center gap-0.5">
                            <Droplets className="w-3 h-3" />
                            {day.rainProb}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-white">
                          {unit === 'C' ? `${day.highC}°` : `${Math.round((day.highC * 9) / 5 + 32)}°`}
                        </span>
                        <span className="text-white/40">/</span>
                        <span className="text-white/50">
                          {unit === 'C' ? `${day.lowC}°` : `${Math.round((day.lowC * 9) / 5 + 32)}°`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sunrise & Sunset */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Sunrise className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/50">Sunrise</div>
                    <div className="text-sm font-bold text-white font-mono">{activeWeather.sunrise}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                    <Sunset className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/50">Sunset</div>
                    <div className="text-sm font-bold text-white font-mono">{activeWeather.sunset}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATIONS & CITIES SWITCHER */}
          {activeTab === 'locations' && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, state, or country (e.g., Delhi, Mumbai, Bengaluru, Tokyo, London, San Francisco)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400 transition-all"
                />
              </div>

              {locationStatus && (
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{locationStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setActiveWeather(city);
                      setActiveTab('overview');
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      activeWeather.id === city.id
                        ? 'bg-sky-500/20 border-sky-400 shadow-md'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{city.city}</div>
                      <div className="text-[10px] text-white/50">
                        {city.country} {city.stateOrRegion ? `• ${city.stateOrRegion}` : ''}
                      </div>
                      <div className="text-[10px] text-blue-300 font-mono mt-1">
                        🌧️ {city.rainForecast?.currentChance || city.weeklyForecast[0]?.rainProb || 0}% rain
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="p-1.5 rounded-xl bg-white/5">
                        {renderWeatherIcon(city.condition, 'w-4 h-4')}
                      </div>
                      <span className="text-xs font-bold text-white font-mono mt-1">
                        {unit === 'C' ? `${city.tempC}°C` : `${city.tempF}°F`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-white/50 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Voice prompt: "What is the work climate today?" or "बारिश की संभावना बताओ"</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Updated: {lastRefreshedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
