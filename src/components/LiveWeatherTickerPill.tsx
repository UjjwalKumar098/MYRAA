import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Briefcase, Umbrella } from 'lucide-react';
import { ContrastMode, WeatherConditionType } from '../types';
import { WORLD_CITIES_WEATHER } from '../utils/weatherData';

interface LiveWeatherTickerPillProps {
  contrastMode?: ContrastMode;
  onClick: () => void;
}

export const LiveWeatherTickerPill: React.FC<LiveWeatherTickerPillProps> = ({
  contrastMode = 'cosmic',
  onClick,
}) => {
  const [cityIndex, setCityIndex] = useState<number>(0);
  const isTrueBlack = contrastMode === 'true-black';

  // Rotate between prominent cities every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCityIndex((prev) => (prev + 1) % WORLD_CITIES_WEATHER.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const city = WORLD_CITIES_WEATHER[cityIndex] || WORLD_CITIES_WEATHER[0];
  const rainChance = city.rainForecast?.currentChance ?? city.weeklyForecast[0]?.rainProb ?? 20;

  const renderIcon = (condition: WeatherConditionType) => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'rainy':
      case 'heavy_rain':
        return <CloudRain className="w-3.5 h-3.5 text-blue-400" />;
      case 'thunderstorm':
        return <CloudLightning className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Cloud className="w-3.5 h-3.5 text-cyan-300" />;
    }
  };

  return (
    <button
      id="live-weather-ticker-pill"
      onClick={onClick}
      title="Climate & Rain Radar: Click to view work climate metrics, precipitation probability & global locations"
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all duration-300 active:scale-95 shadow-md ${
        isTrueBlack
          ? 'border-white/20 bg-black/90 text-white hover:border-sky-400/50'
          : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/90 backdrop-blur-md hover:border-sky-400/40'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="p-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
          {renderIcon(city.condition)}
        </span>
        <span className="font-semibold text-white/90 tracking-tight">{city.city}</span>
      </div>

      <div className="flex items-center gap-1 font-mono font-bold text-sky-300">
        <span>{city.tempC}°C</span>
      </div>

      {/* Quick Rain or Work Climate Tag */}
      {rainChance > 40 ? (
        <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-semibold">
          <Umbrella className="w-2.5 h-2.5" />
          {rainChance}%
        </span>
      ) : (
        <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
          <Briefcase className="w-2.5 h-2.5" />
          {city.workClimate?.productivityScore || 85}% Focus
        </span>
      )}

      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
    </button>
  );
};
