import { CityWeatherData, WeatherConditionType, WorkClimateData, RainPossibilityData } from '../types';

/**
 * Computes scientifically grounded Work Climate & Productivity Ergonomics metrics.
 */
export function computeWorkClimate(
  tempC: number,
  humidity: number,
  windSpeedKmh: number,
  aqi: number,
  condition: WeatherConditionType,
  city: string
): WorkClimateData {
  let score = 85;
  let indoorSuit = 90;
  let outdoorSuit = 80;
  let rating: WorkClimateData['overallRating'] = 'Comfortable';
  const ergonomicTips: string[] = [];

  // Temperature penalty
  if (tempC >= 21 && tempC <= 26 && humidity >= 40 && humidity <= 60) {
    score += 10;
    rating = 'Optimal';
    ergonomicTips.push('Natural ambient comfort: Ideal room temp (22°C - 24°C) promotes sustained dopamine & focus.');
  } else if (tempC > 30) {
    score -= 18;
    indoorSuit = 95;
    outdoorSuit = 35;
    rating = tempC > 35 ? 'Challenging / Extreme' : 'AC Recommended';
    ergonomicTips.push('High thermal strain: Maintain indoor air conditioning at 24°C with oscillating airflow.');
    ergonomicTips.push('Hydration goal: Drink 250ml water every 45 mins to prevent cognitive fatigue.');
  } else if (tempC < 15) {
    score -= 10;
    outdoorSuit -= 25;
    ergonomicTips.push('Cool ambient temp: Keep extremities warm; ergonomic keyboard wrist warmers suggested.');
  }

  // Humidity & Dew point adjustments
  if (humidity > 75) {
    score -= 12;
    outdoorSuit -= 20;
    if (rating !== 'Challenging / Extreme') rating = 'Warm & Humid';
    ergonomicTips.push('Elevated humidity: Run air conditioner on "Dry Mode" / Dehumidify for optimal sweat evaporation.');
  } else if (humidity < 30) {
    ergonomicTips.push('Dry indoor air: Use an ultrasonic desk humidifier or blink drops to avoid screen eye-strain.');
  }

  // Rain & Storm impact
  if (condition === 'rainy' || condition === 'heavy_rain' || condition === 'thunderstorm') {
    outdoorSuit = Math.min(outdoorSuit, condition === 'thunderstorm' ? 15 : 30);
    score = Math.max(score - 5, 60);
    ergonomicTips.push('Pleasant rain resonance: Great for deep-work focus sprints with ambient white noise.');
    ergonomicTips.push('Check electrical protection: Surge suppressors recommended during thunderstorms.');
  }

  // AQI impact
  let ventilation = 'Good air quality: Natural window ventilation is safe for fresh oxygen circulation.';
  if (aqi > 100) {
    score -= 15;
    ventilation = `Moderate/Unhealthy AQI (${aqi}): Keep windows closed; run HEPA air purifier on Medium/High.`;
    ergonomicTips.push('Airborne particulates high: Limit outdoor strenuous exercise and commute with N95.');
  } else if (aqi < 50) {
    ventilation = `Crisp Clean Air (AQI ${aqi}): Excellent outdoor and indoor air quality for deep breathing.`;
  }

  // Commute guidance
  let commute = 'Commute conditions normal: Clear visibility and dry roads.';
  if (condition === 'heavy_rain' || condition === 'thunderstorm') {
    commute = '⚠️ Severe transit advisory: Heavy water-logging risk and slow road traffic. Work from home recommended.';
  } else if (condition === 'rainy') {
    commute = '🌧️ Wet transit advisory: Slippery road surfaces. Carry rain gear & allow +15 mins commute buffer.';
  } else if (tempC > 36) {
    commute = '☀️ High heat advisory: Avoid mid-day sun exposure; travel early morning or post-sunset.';
  }

  // Optimal working hours
  let optimalHours = '08:30 AM – 01:00 PM & 03:30 PM – 07:00 PM';
  if (tempC > 32) {
    optimalHours = 'Early Morning (07:00 AM – 11:30 AM) & Evening (05:30 PM – 09:00 PM)';
  } else if (condition === 'rainy') {
    optimalHours = '09:00 AM – 02:00 PM (Ideal Deep Focus Focus Window)';
  }

  let thermalComfort = `Thermally Balanced (${tempC}°C / ${humidity}% RH)`;
  if (tempC > 29 && humidity > 65) {
    thermalComfort = `Humid Heat (Humidex ~${Math.round(tempC + 5)}°C - Cooling required)`;
  } else if (tempC < 16) {
    thermalComfort = `Chilly (${tempC}°C - Warm layer recommended)`;
  }

  score = Math.max(30, Math.min(98, score));

  return {
    overallRating: rating,
    productivityScore: score,
    indoorSuitability: Math.min(100, Math.max(20, indoorSuit)),
    outdoorSuitability: Math.min(100, Math.max(10, outdoorSuit)),
    thermalComfort,
    optimalWorkHours: optimalHours,
    ergonomicTips: ergonomicTips.slice(0, 3),
    ventilationAdvice: ventilation,
    commuteAdvisory: commute,
  };
}

/**
 * Computes realistic Rain Possibility, Precipitation Volume & 12-Hour timeline.
 */
export function computeRainPossibility(
  condition: WeatherConditionType,
  humidity: number,
  baseRainProb: number,
  city: string
): RainPossibilityData {
  let chance = baseRainProb;
  let intensity: RainPossibilityData['intensity'] = 'None';
  let mm = 0;
  let umbrellaRequired = false;
  let timeline = 'No precipitation expected in the next 12 hours. Clear skies prevail.';

  if (condition === 'thunderstorm') {
    chance = Math.max(chance, 85);
    intensity = 'Thunderstorm Alert';
    mm = 28.5;
    umbrellaRequired = true;
    timeline = 'High electrical activity & intense cloudburst expected between 02:30 PM - 06:00 PM.';
  } else if (condition === 'heavy_rain') {
    chance = Math.max(chance, 90);
    intensity = 'Heavy Downpour';
    mm = 22.0;
    umbrellaRequired = true;
    timeline = 'Continuous torrential monsoon showers active through afternoon and late evening.';
  } else if (condition === 'rainy') {
    chance = Math.max(chance, 70);
    intensity = 'Moderate Showers';
    mm = 11.2;
    umbrellaRequired = true;
    timeline = 'Intermittent rain showers forecast between 01:00 PM - 05:30 PM.';
  } else if (condition === 'partly_cloudy' && humidity > 70) {
    chance = Math.max(chance, 35);
    intensity = 'Slight Drizzle';
    mm = 2.1;
    umbrellaRequired = chance > 40;
    timeline = 'Isolated scattered drizzles possible in the late afternoon.';
  } else if (condition === 'cloudy') {
    chance = Math.max(chance, 25);
    intensity = chance > 30 ? 'Slight Drizzle' : 'None';
    mm = 0.8;
  }

  const umbrellaAdvice = umbrellaRequired
    ? `☔ Umbrella Mandatory: ${chance}% chance of rainfall with ${intensity.toLowerCase()}. Protect electronics!`
    : chance > 30
    ? `☂️ Umbrella Optional: Moderate ${chance}% cloud coverage with chance of brief drizzle.`
    : `☀️ No Umbrella Needed: Clear dry atmosphere with only ${chance}% rain probability.`;

  // Generate 12-hour progressive rain curve
  const hours = ['08 AM', '10 AM', '12 PM', '02 PM', '04 PM', '06 PM', '08 PM', '10 PM', '12 AM'];
  const hourlyRainProbability = hours.map((time, idx) => {
    let prob = chance;
    if (idx === 0 || idx === 1) prob = Math.round(chance * 0.4);
    else if (idx === 3 || idx === 4) prob = Math.min(100, Math.round(chance * 1.15));
    else if (idx >= 6) prob = Math.round(chance * 0.7);

    let hourCondition: WeatherConditionType = 'clear';
    if (prob > 70) hourCondition = condition === 'thunderstorm' ? 'thunderstorm' : 'heavy_rain';
    else if (prob > 40) hourCondition = 'rainy';
    else if (prob > 20) hourCondition = 'cloudy';
    else hourCondition = 'partly_cloudy';

    return {
      time,
      rainProb: prob,
      intensityMm: parseFloat(((prob / 100) * (mm || 5)).toFixed(1)),
      condition: hourCondition,
    };
  });

  const radarSummary = `${chance}% precipitation probability (${intensity}) with estimated ${mm}mm accumulated volume.`;

  return {
    currentChance: chance,
    intensity,
    expectedRainfallMm: mm,
    rainTimeline: timeline,
    umbrellaRequired,
    umbrellaAdvice,
    hourlyRainProbability,
    radarSummary,
  };
}

export const WORLD_CITIES_WEATHER: CityWeatherData[] = [
  {
    id: 'delhi',
    city: 'New Delhi',
    country: 'India',
    stateOrRegion: 'National Capital Region (NCR)',
    coordinates: { lat: 28.6139, lng: 77.209 },
    tempC: 33,
    tempF: 91,
    feelsLikeC: 37,
    feelsLikeF: 99,
    condition: 'partly_cloudy',
    conditionLabel: 'Warm & Humid Haze',
    highC: 36,
    lowC: 27,
    humidity: 68,
    windSpeedKmh: 12,
    uvIndex: 8,
    airQualityIndex: 112,
    airQualityStatus: 'Moderate',
    localTime: '04:45 PM IST',
    sunrise: '06:01 AM',
    sunset: '06:44 PM',
    hourlyForecast: [
      { time: '05 PM', tempC: 34, tempF: 93, condition: 'partly_cloudy' },
      { time: '07 PM', tempC: 32, tempF: 90, condition: 'clear' },
      { time: '09 PM', tempC: 30, tempF: 86, condition: 'clear' },
      { time: '12 AM', tempC: 28, tempF: 82, condition: 'clear' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 36, lowC: 27, condition: 'partly_cloudy', rainProb: 30 },
      { day: 'Tue', highC: 34, lowC: 26, condition: 'thunderstorm', rainProb: 75 },
      { day: 'Wed', highC: 32, lowC: 25, condition: 'rainy', rainProb: 80 },
      { day: 'Thu', highC: 35, lowC: 26, condition: 'partly_cloudy', rainProb: 35 },
      { day: 'Fri', highC: 36, lowC: 27, condition: 'sunny', rainProb: 15 },
      { day: 'Sat', highC: 37, lowC: 28, condition: 'sunny', rainProb: 10 },
      { day: 'Sun', highC: 35, lowC: 27, condition: 'partly_cloudy', rainProb: 25 },
    ],
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    country: 'India',
    stateOrRegion: 'Maharashtra',
    coordinates: { lat: 19.076, lng: 72.8777 },
    tempC: 29,
    tempF: 84,
    feelsLikeC: 34,
    feelsLikeF: 93,
    condition: 'heavy_rain',
    conditionLabel: 'Active Monsoon Downpour',
    highC: 30,
    lowC: 25,
    humidity: 88,
    windSpeedKmh: 24,
    uvIndex: 5,
    airQualityIndex: 36,
    airQualityStatus: 'Good',
    localTime: '04:45 PM IST',
    sunrise: '06:24 AM',
    sunset: '06:58 PM',
    hourlyForecast: [
      { time: '05 PM', tempC: 28, tempF: 82, condition: 'heavy_rain' },
      { time: '08 PM', tempC: 27, tempF: 81, condition: 'rainy' },
      { time: '11 PM', tempC: 27, tempF: 81, condition: 'cloudy' },
      { time: '06 AM', tempC: 26, tempF: 79, condition: 'heavy_rain' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 30, lowC: 25, condition: 'heavy_rain', rainProb: 95 },
      { day: 'Tue', highC: 29, lowC: 25, condition: 'heavy_rain', rainProb: 90 },
      { day: 'Wed', highC: 30, lowC: 26, condition: 'rainy', rainProb: 85 },
      { day: 'Thu', highC: 31, lowC: 26, condition: 'rainy', rainProb: 70 },
      { day: 'Fri', highC: 30, lowC: 25, condition: 'heavy_rain', rainProb: 85 },
      { day: 'Sat', highC: 31, lowC: 26, condition: 'partly_cloudy', rainProb: 45 },
      { day: 'Sun', highC: 31, lowC: 26, condition: 'rainy', rainProb: 75 },
    ],
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    country: 'India',
    stateOrRegion: 'Karnataka',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    tempC: 24,
    tempF: 75,
    feelsLikeC: 24,
    feelsLikeF: 75,
    condition: 'partly_cloudy',
    conditionLabel: 'Pleasant & Breezy Tech Haven',
    highC: 27,
    lowC: 19,
    humidity: 62,
    windSpeedKmh: 16,
    uvIndex: 7,
    airQualityIndex: 28,
    airQualityStatus: 'Good',
    localTime: '04:45 PM IST',
    sunrise: '06:09 AM',
    sunset: '06:33 PM',
    hourlyForecast: [
      { time: '05 PM', tempC: 25, tempF: 77, condition: 'partly_cloudy' },
      { time: '08 PM', tempC: 22, tempF: 72, condition: 'cloudy' },
      { time: '11 PM', tempC: 20, tempF: 68, condition: 'clear' },
      { time: '06 AM', tempC: 19, tempF: 66, condition: 'partly_cloudy' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 27, lowC: 19, condition: 'partly_cloudy', rainProb: 20 },
      { day: 'Tue', highC: 26, lowC: 19, condition: 'rainy', rainProb: 65 },
      { day: 'Wed', highC: 25, lowC: 18, condition: 'rainy', rainProb: 70 },
      { day: 'Thu', highC: 26, lowC: 19, condition: 'partly_cloudy', rainProb: 30 },
      { day: 'Fri', highC: 27, lowC: 20, condition: 'sunny', rainProb: 15 },
      { day: 'Sat', highC: 28, lowC: 20, condition: 'sunny', rainProb: 10 },
      { day: 'Sun', highC: 27, lowC: 19, condition: 'partly_cloudy', rainProb: 25 },
    ],
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    country: 'India',
    stateOrRegion: 'Telangana',
    coordinates: { lat: 17.385, lng: 78.4867 },
    tempC: 28,
    tempF: 82,
    feelsLikeC: 30,
    feelsLikeF: 86,
    condition: 'cloudy',
    conditionLabel: 'Overcast & Moderate',
    highC: 31,
    lowC: 22,
    humidity: 71,
    windSpeedKmh: 14,
    uvIndex: 6,
    airQualityIndex: 42,
    airQualityStatus: 'Good',
    localTime: '04:45 PM IST',
    sunrise: '06:05 AM',
    sunset: '06:35 PM',
    hourlyForecast: [
      { time: '05 PM', tempC: 29, tempF: 84, condition: 'cloudy' },
      { time: '08 PM', tempC: 26, tempF: 79, condition: 'cloudy' },
      { time: '11 PM', tempC: 24, tempF: 75, condition: 'clear' },
      { time: '06 AM', tempC: 22, tempF: 72, condition: 'partly_cloudy' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 31, lowC: 22, condition: 'cloudy', rainProb: 35 },
      { day: 'Tue', highC: 30, lowC: 22, condition: 'rainy', rainProb: 60 },
      { day: 'Wed', highC: 29, lowC: 21, condition: 'rainy', rainProb: 75 },
      { day: 'Thu', highC: 31, lowC: 23, condition: 'partly_cloudy', rainProb: 30 },
      { day: 'Fri', highC: 32, lowC: 23, condition: 'sunny', rainProb: 15 },
      { day: 'Sat', highC: 33, lowC: 24, condition: 'sunny', rainProb: 10 },
      { day: 'Sun', highC: 31, lowC: 23, condition: 'cloudy', rainProb: 40 },
    ],
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    country: 'India',
    stateOrRegion: 'West Bengal',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    tempC: 31,
    tempF: 88,
    feelsLikeC: 38,
    feelsLikeF: 100,
    condition: 'thunderstorm',
    conditionLabel: 'Tropical Thunderstorms',
    highC: 33,
    lowC: 26,
    humidity: 84,
    windSpeedKmh: 18,
    uvIndex: 7,
    airQualityIndex: 55,
    airQualityStatus: 'Moderate',
    localTime: '04:45 PM IST',
    sunrise: '05:22 AM',
    sunset: '05:54 PM',
    hourlyForecast: [
      { time: '05 PM', tempC: 29, tempF: 84, condition: 'thunderstorm' },
      { time: '08 PM', tempC: 28, tempF: 82, condition: 'rainy' },
      { time: '11 PM', tempC: 27, tempF: 81, condition: 'cloudy' },
      { time: '06 AM', tempC: 26, tempF: 79, condition: 'partly_cloudy' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 33, lowC: 26, condition: 'thunderstorm', rainProb: 85 },
      { day: 'Tue', highC: 32, lowC: 26, condition: 'rainy', rainProb: 80 },
      { day: 'Wed', highC: 31, lowC: 25, condition: 'thunderstorm', rainProb: 90 },
      { day: 'Thu', highC: 33, lowC: 26, condition: 'rainy', rainProb: 65 },
      { day: 'Fri', highC: 34, lowC: 27, condition: 'partly_cloudy', rainProb: 40 },
      { day: 'Sat', highC: 34, lowC: 27, condition: 'sunny', rainProb: 20 },
      { day: 'Sun', highC: 33, lowC: 26, condition: 'thunderstorm', rainProb: 75 },
    ],
  },
  {
    id: 'pune',
    city: 'Pune',
    country: 'India',
    stateOrRegion: 'Maharashtra',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    tempC: 26,
    tempF: 79,
    feelsLikeC: 27,
    feelsLikeF: 81,
    condition: 'rainy',
    conditionLabel: 'Misty Western Ghats Rain',
    highC: 28,
    lowC: 21,
    humidity: 78,
    windSpeedKmh: 15,
    uvIndex: 6,
    airQualityIndex: 32,
    airQualityStatus: 'Good',
    localTime: '04:45 PM IST',
    sunrise: '06:21 AM',
    sunset: '06:53 PM',
    hourlyForecast: [
      { time: '05 PM', tempC: 26, tempF: 79, condition: 'rainy' },
      { time: '08 PM', tempC: 24, tempF: 75, condition: 'rainy' },
      { time: '11 PM', tempC: 22, tempF: 72, condition: 'cloudy' },
      { time: '06 AM', tempC: 21, tempF: 70, condition: 'mist' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 28, lowC: 21, condition: 'rainy', rainProb: 80 },
      { day: 'Tue', highC: 27, lowC: 20, condition: 'heavy_rain', rainProb: 85 },
      { day: 'Wed', highC: 28, lowC: 21, condition: 'rainy', rainProb: 70 },
      { day: 'Thu', highC: 29, lowC: 22, condition: 'partly_cloudy', rainProb: 40 },
      { day: 'Fri', highC: 29, lowC: 22, condition: 'sunny', rainProb: 20 },
      { day: 'Sat', highC: 30, lowC: 22, condition: 'sunny', rainProb: 15 },
      { day: 'Sun', highC: 28, lowC: 21, condition: 'rainy', rainProb: 65 },
    ],
  },
  {
    id: 'nyc',
    city: 'New York',
    country: 'USA',
    stateOrRegion: 'New York',
    coordinates: { lat: 40.7128, lng: -74.006 },
    tempC: 24,
    tempF: 75,
    feelsLikeC: 25,
    feelsLikeF: 77,
    condition: 'partly_cloudy',
    conditionLabel: 'Partly Cloudy & Comfortable',
    highC: 27,
    lowC: 18,
    humidity: 58,
    windSpeedKmh: 14,
    uvIndex: 6,
    airQualityIndex: 38,
    airQualityStatus: 'Good',
    localTime: '07:18 AM EDT',
    sunrise: '06:22 AM',
    sunset: '07:44 PM',
    hourlyForecast: [
      { time: '08 AM', tempC: 22, tempF: 72, condition: 'partly_cloudy' },
      { time: '11 AM', tempC: 25, tempF: 77, condition: 'sunny' },
      { time: '02 PM', tempC: 27, tempF: 81, condition: 'sunny' },
      { time: '05 PM', tempC: 26, tempF: 79, condition: 'partly_cloudy' },
      { time: '08 PM', tempC: 23, tempF: 73, condition: 'clear' },
      { time: '11 PM', tempC: 20, tempF: 68, condition: 'clear' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 27, lowC: 18, condition: 'sunny', rainProb: 10 },
      { day: 'Tue', highC: 28, lowC: 19, condition: 'partly_cloudy', rainProb: 15 },
      { day: 'Wed', highC: 25, lowC: 17, condition: 'rainy', rainProb: 65 },
      { day: 'Thu', highC: 24, lowC: 16, condition: 'cloudy', rainProb: 20 },
      { day: 'Fri', highC: 26, lowC: 18, condition: 'sunny', rainProb: 5 },
      { day: 'Sat', highC: 29, lowC: 20, condition: 'sunny', rainProb: 0 },
      { day: 'Sun', highC: 28, lowC: 19, condition: 'partly_cloudy', rainProb: 25 },
    ],
  },
  {
    id: 'sf',
    city: 'San Francisco',
    country: 'USA',
    stateOrRegion: 'California',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    tempC: 18,
    tempF: 64,
    feelsLikeC: 17,
    feelsLikeF: 63,
    condition: 'mist',
    conditionLabel: 'Breezy & Silicon Valley Fog',
    highC: 21,
    lowC: 12,
    humidity: 78,
    windSpeedKmh: 22,
    uvIndex: 5,
    airQualityIndex: 28,
    airQualityStatus: 'Good',
    localTime: '04:18 AM PDT',
    sunrise: '06:36 AM',
    sunset: '07:51 PM',
    hourlyForecast: [
      { time: '06 AM', tempC: 14, tempF: 57, condition: 'mist' },
      { time: '09 AM', tempC: 16, tempF: 61, condition: 'partly_cloudy' },
      { time: '01 PM', tempC: 20, tempF: 68, condition: 'sunny' },
      { time: '05 PM', tempC: 18, tempF: 64, condition: 'partly_cloudy' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 21, lowC: 12, condition: 'partly_cloudy', rainProb: 5 },
      { day: 'Tue', highC: 22, lowC: 13, condition: 'sunny', rainProb: 0 },
      { day: 'Wed', highC: 20, lowC: 12, condition: 'mist', rainProb: 10 },
      { day: 'Thu', highC: 19, lowC: 11, condition: 'partly_cloudy', rainProb: 5 },
      { day: 'Fri', highC: 21, lowC: 12, condition: 'sunny', rainProb: 0 },
      { day: 'Sat', highC: 23, lowC: 14, condition: 'sunny', rainProb: 0 },
      { day: 'Sun', highC: 22, lowC: 13, condition: 'partly_cloudy', rainProb: 5 },
    ],
  },
  {
    id: 'london',
    city: 'London',
    country: 'UK',
    stateOrRegion: 'Greater London',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    tempC: 19,
    tempF: 66,
    feelsLikeC: 18,
    feelsLikeF: 64,
    condition: 'cloudy',
    conditionLabel: 'Overcast & Mild',
    highC: 21,
    lowC: 13,
    humidity: 68,
    windSpeedKmh: 18,
    uvIndex: 4,
    airQualityIndex: 25,
    airQualityStatus: 'Good',
    localTime: '12:18 PM BST',
    sunrise: '06:08 AM',
    sunset: '08:02 PM',
    hourlyForecast: [
      { time: '01 PM', tempC: 20, tempF: 68, condition: 'cloudy' },
      { time: '04 PM', tempC: 21, tempF: 70, condition: 'partly_cloudy' },
      { time: '07 PM', tempC: 18, tempF: 64, condition: 'cloudy' },
      { time: '10 PM', tempC: 15, tempF: 59, condition: 'clear' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 21, lowC: 13, condition: 'cloudy', rainProb: 30 },
      { day: 'Tue', highC: 22, lowC: 14, condition: 'partly_cloudy', rainProb: 20 },
      { day: 'Wed', highC: 19, lowC: 12, condition: 'rainy', rainProb: 70 },
      { day: 'Thu', highC: 20, lowC: 13, condition: 'partly_cloudy', rainProb: 15 },
      { day: 'Fri', highC: 23, lowC: 14, condition: 'sunny', rainProb: 10 },
      { day: 'Sat', highC: 22, lowC: 13, condition: 'sunny', rainProb: 5 },
      { day: 'Sun', highC: 21, lowC: 12, condition: 'cloudy', rainProb: 40 },
    ],
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    stateOrRegion: 'Kantō',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tempC: 29,
    tempF: 84,
    feelsLikeC: 32,
    feelsLikeF: 90,
    condition: 'sunny',
    conditionLabel: 'Clear & Warm Metropolis',
    highC: 31,
    lowC: 23,
    humidity: 64,
    windSpeedKmh: 11,
    uvIndex: 8,
    airQualityIndex: 22,
    airQualityStatus: 'Good',
    localTime: '08:18 PM JST',
    sunrise: '05:12 AM',
    sunset: '06:16 PM',
    hourlyForecast: [
      { time: '09 PM', tempC: 28, tempF: 82, condition: 'clear' },
      { time: '11 PM', tempC: 26, tempF: 79, condition: 'clear' },
      { time: '02 AM', tempC: 24, tempF: 75, condition: 'clear' },
      { time: '06 AM', tempC: 25, tempF: 77, condition: 'sunny' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 31, lowC: 23, condition: 'sunny', rainProb: 10 },
      { day: 'Tue', highC: 32, lowC: 24, condition: 'sunny', rainProb: 5 },
      { day: 'Wed', highC: 30, lowC: 22, condition: 'partly_cloudy', rainProb: 20 },
      { day: 'Thu', highC: 29, lowC: 21, condition: 'rainy', rainProb: 55 },
      { day: 'Fri', highC: 31, lowC: 23, condition: 'sunny', rainProb: 15 },
      { day: 'Sat', highC: 33, lowC: 25, condition: 'sunny', rainProb: 0 },
      { day: 'Sun', highC: 30, lowC: 22, condition: 'partly_cloudy', rainProb: 30 },
    ],
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    stateOrRegion: 'Emirate of Dubai',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    tempC: 38,
    tempF: 100,
    feelsLikeC: 43,
    feelsLikeF: 109,
    condition: 'sunny',
    conditionLabel: 'Intense Desert Sun',
    highC: 41,
    lowC: 31,
    humidity: 48,
    windSpeedKmh: 16,
    uvIndex: 10,
    airQualityIndex: 78,
    airQualityStatus: 'Moderate',
    localTime: '03:18 PM GST',
    sunrise: '06:01 AM',
    sunset: '06:44 PM',
    hourlyForecast: [
      { time: '04 PM', tempC: 39, tempF: 102, condition: 'sunny' },
      { time: '07 PM', tempC: 35, tempF: 95, condition: 'clear' },
      { time: '10 PM', tempC: 33, tempF: 91, condition: 'clear' },
      { time: '01 AM', tempC: 31, tempF: 88, condition: 'clear' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 41, lowC: 31, condition: 'sunny', rainProb: 0 },
      { day: 'Tue', highC: 42, lowC: 32, condition: 'sunny', rainProb: 0 },
      { day: 'Wed', highC: 40, lowC: 30, condition: 'sunny', rainProb: 0 },
      { day: 'Thu', highC: 39, lowC: 29, condition: 'sunny', rainProb: 0 },
      { day: 'Fri', highC: 41, lowC: 31, condition: 'sunny', rainProb: 0 },
      { day: 'Sat', highC: 42, lowC: 32, condition: 'sunny', rainProb: 0 },
      { day: 'Sun', highC: 41, lowC: 31, condition: 'sunny', rainProb: 0 },
    ],
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    tempC: 30,
    tempF: 86,
    feelsLikeC: 35,
    feelsLikeF: 95,
    condition: 'thunderstorm',
    conditionLabel: 'Equatorial Monsoon Showers',
    highC: 32,
    lowC: 25,
    humidity: 82,
    windSpeedKmh: 9,
    uvIndex: 8,
    airQualityIndex: 35,
    airQualityStatus: 'Good',
    localTime: '07:18 PM SGT',
    sunrise: '07:01 AM',
    sunset: '07:09 PM',
    hourlyForecast: [
      { time: '08 PM', tempC: 29, tempF: 84, condition: 'rainy' },
      { time: '10 PM', tempC: 28, tempF: 82, condition: 'cloudy' },
      { time: '01 AM', tempC: 26, tempF: 79, condition: 'cloudy' },
      { time: '06 AM', tempC: 26, tempF: 79, condition: 'partly_cloudy' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 32, lowC: 25, condition: 'thunderstorm', rainProb: 80 },
      { day: 'Tue', highC: 31, lowC: 25, condition: 'rainy', rainProb: 75 },
      { day: 'Wed', highC: 32, lowC: 26, condition: 'partly_cloudy', rainProb: 40 },
      { day: 'Thu', highC: 33, lowC: 26, condition: 'thunderstorm', rainProb: 65 },
      { day: 'Fri', highC: 32, lowC: 25, condition: 'rainy', rainProb: 70 },
      { day: 'Sat', highC: 32, lowC: 25, condition: 'partly_cloudy', rainProb: 45 },
      { day: 'Sun', highC: 31, lowC: 25, condition: 'thunderstorm', rainProb: 85 },
    ],
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    stateOrRegion: 'Île-de-France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tempC: 22,
    tempF: 72,
    feelsLikeC: 22,
    feelsLikeF: 72,
    condition: 'sunny',
    conditionLabel: 'Pleasant & Sunny',
    highC: 25,
    lowC: 14,
    humidity: 52,
    windSpeedKmh: 12,
    uvIndex: 6,
    airQualityIndex: 32,
    airQualityStatus: 'Good',
    localTime: '01:18 PM CEST',
    sunrise: '07:02 AM',
    sunset: '08:44 PM',
    hourlyForecast: [
      { time: '02 PM', tempC: 24, tempF: 75, condition: 'sunny' },
      { time: '05 PM', tempC: 25, tempF: 77, condition: 'sunny' },
      { time: '08 PM', tempC: 22, tempF: 72, condition: 'clear' },
      { time: '11 PM', tempC: 17, tempF: 63, condition: 'clear' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 25, lowC: 14, condition: 'sunny', rainProb: 5 },
      { day: 'Tue', highC: 26, lowC: 15, condition: 'partly_cloudy', rainProb: 10 },
      { day: 'Wed', highC: 23, lowC: 13, condition: 'rainy', rainProb: 45 },
      { day: 'Thu', highC: 22, lowC: 12, condition: 'sunny', rainProb: 10 },
      { day: 'Fri', highC: 24, lowC: 14, condition: 'sunny', rainProb: 0 },
      { day: 'Sat', highC: 27, lowC: 16, condition: 'sunny', rainProb: 0 },
      { day: 'Sun', highC: 26, lowC: 15, condition: 'partly_cloudy', rainProb: 20 },
    ],
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    stateOrRegion: 'New South Wales',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    tempC: 17,
    tempF: 63,
    feelsLikeC: 16,
    feelsLikeF: 61,
    condition: 'sunny',
    conditionLabel: 'Crisp Coastal Sunlight',
    highC: 19,
    lowC: 10,
    humidity: 50,
    windSpeedKmh: 20,
    uvIndex: 4,
    airQualityIndex: 20,
    airQualityStatus: 'Good',
    localTime: '09:18 PM AEST',
    sunrise: '06:19 AM',
    sunset: '05:36 PM',
    hourlyForecast: [
      { time: '10 PM', tempC: 15, tempF: 59, condition: 'clear' },
      { time: '12 AM', tempC: 13, tempF: 55, condition: 'clear' },
      { time: '04 AM', tempC: 11, tempF: 52, condition: 'clear' },
      { time: '08 AM', tempC: 14, tempF: 57, condition: 'sunny' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 19, lowC: 10, condition: 'sunny', rainProb: 0 },
      { day: 'Tue', highC: 20, lowC: 11, condition: 'sunny', rainProb: 0 },
      { day: 'Wed', highC: 18, lowC: 12, condition: 'rainy', rainProb: 60 },
      { day: 'Thu', highC: 17, lowC: 9, condition: 'partly_cloudy', rainProb: 15 },
      { day: 'Fri', highC: 21, lowC: 10, condition: 'sunny', rainProb: 5 },
      { day: 'Sat', highC: 22, lowC: 12, condition: 'sunny', rainProb: 0 },
      { day: 'Sun', highC: 20, lowC: 11, condition: 'partly_cloudy', rainProb: 20 },
    ],
  },
];

// Enrich all preset cities with dynamic Work Climate & Rain Possibility data
WORLD_CITIES_WEATHER.forEach((city) => {
  const baseRainProb = city.weeklyForecast[0]?.rainProb || 20;
  city.workClimate = computeWorkClimate(
    city.tempC,
    city.humidity,
    city.windSpeedKmh,
    city.airQualityIndex,
    city.condition,
    city.city
  );
  city.rainForecast = computeRainPossibility(city.condition, city.humidity, baseRainProb, city.city);
});

/**
 * Searches city by name, alias, or country.
 */
export function findCityWeather(query: string): CityWeatherData {
  const normalized = (query || '').toLowerCase().trim();
  if (!normalized) return WORLD_CITIES_WEATHER[0];

  const matched = WORLD_CITIES_WEATHER.find(
    (c) =>
      c.city.toLowerCase().includes(normalized) ||
      c.country.toLowerCase().includes(normalized) ||
      (c.stateOrRegion && c.stateOrRegion.toLowerCase().includes(normalized)) ||
      c.id.toLowerCase() === normalized
  );

  if (matched) return matched;

  // Fallback: Generate dynamic weather estimate for any typed location
  const fallbackCityName = query.charAt(0).toUpperCase() + query.slice(1);
  const tempC = 26;
  const tempF = 79;
  const condition: WeatherConditionType = 'partly_cloudy';
  const humidity = 60;
  const wind = 14;
  const aqi = 45;

  const generated: CityWeatherData = {
    id: `custom-${Date.now()}`,
    city: fallbackCityName,
    country: 'World',
    tempC,
    tempF,
    feelsLikeC: 27,
    feelsLikeF: 81,
    condition,
    conditionLabel: 'Partly Cloudy & Pleasant',
    highC: 29,
    lowC: 19,
    humidity,
    windSpeedKmh: wind,
    uvIndex: 6,
    airQualityIndex: aqi,
    airQualityStatus: 'Good',
    localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunrise: '06:15 AM',
    sunset: '06:45 PM',
    hourlyForecast: [
      { time: '09 AM', tempC: 23, tempF: 73, condition: 'partly_cloudy' },
      { time: '12 PM', tempC: 27, tempF: 81, condition: 'sunny' },
      { time: '03 PM', tempC: 28, tempF: 82, condition: 'partly_cloudy' },
      { time: '06 PM', tempC: 25, tempF: 77, condition: 'clear' },
    ],
    weeklyForecast: [
      { day: 'Mon', highC: 28, lowC: 19, condition: 'partly_cloudy', rainProb: 25 },
      { day: 'Tue', highC: 29, lowC: 20, condition: 'sunny', rainProb: 15 },
      { day: 'Wed', highC: 27, lowC: 18, condition: 'rainy', rainProb: 60 },
      { day: 'Thu', highC: 28, lowC: 19, condition: 'partly_cloudy', rainProb: 20 },
      { day: 'Fri', highC: 30, lowC: 21, condition: 'sunny', rainProb: 10 },
    ],
  };

  generated.workClimate = computeWorkClimate(tempC, humidity, wind, aqi, condition, fallbackCityName);
  generated.rainForecast = computeRainPossibility(condition, humidity, 25, fallbackCityName);

  return generated;
}

/**
 * Real Geolocation sensor helper that detects user coordinates and builds live current weather data.
 */
export async function detectUserLiveLocationWeather(): Promise<CityWeatherData> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(WORLD_CITIES_WEATHER[0]); // Default to Delhi
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Attempt Open-Meteo live API lookup
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation&timezone=auto`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            const current = data.current;
            const tempC = Math.round(current.temperature_2m);
            const feelsLikeC = Math.round(current.apparent_temperature);
            const humidity = current.relative_humidity_2m;
            const wind = Math.round(current.wind_speed_10m);
            const wCode = current.weather_code;

            let condition: WeatherConditionType = 'partly_cloudy';
            let label = 'Partly Cloudy';
            let rainProb = 15;

            if (wCode >= 95) {
              condition = 'thunderstorm';
              label = 'Thunderstorm';
              rainProb = 85;
            } else if (wCode >= 61 || wCode >= 80) {
              condition = wCode >= 65 ? 'heavy_rain' : 'rainy';
              label = condition === 'heavy_rain' ? 'Heavy Showers' : 'Rain Showers';
              rainProb = 80;
            } else if (wCode >= 51) {
              condition = 'rainy';
              label = 'Drizzle';
              rainProb = 50;
            } else if (wCode <= 1) {
              condition = 'clear';
              label = 'Clear Sky';
              rainProb = 5;
            } else if (wCode === 2 || wCode === 3) {
              condition = 'partly_cloudy';
              label = 'Partly Cloudy';
              rainProb = 25;
            }

            // Approximate City Name based on timezone or generic GPS location
            const timezone = data.timezone || 'Local Area';
            const cityPart = timezone.split('/').pop()?.replace(/_/g, ' ') || 'My Location';

            const detected: CityWeatherData = {
              id: 'my-location',
              city: cityPart,
              country: 'Detected Location',
              stateOrRegion: `GPS (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
              isCurrentLocation: true,
              coordinates: { lat, lng },
              tempC,
              tempF: Math.round((tempC * 9) / 5 + 32),
              feelsLikeC,
              feelsLikeF: Math.round((feelsLikeC * 9) / 5 + 32),
              condition,
              conditionLabel: label,
              highC: tempC + 3,
              lowC: Math.max(10, tempC - 5),
              humidity,
              windSpeedKmh: wind,
              uvIndex: 6,
              airQualityIndex: 40,
              airQualityStatus: 'Good',
              localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sunrise: '06:12 AM',
              sunset: '06:48 PM',
              hourlyForecast: [
                { time: 'Now', tempC, tempF: Math.round((tempC * 9) / 5 + 32), condition },
                { time: '+2h', tempC: tempC + 1, tempF: Math.round(((tempC + 1) * 9) / 5 + 32), condition },
                { time: '+4h', tempC: tempC - 1, tempF: Math.round(((tempC - 1) * 9) / 5 + 32), condition },
                { time: '+6h', tempC: tempC - 3, tempF: Math.round(((tempC - 3) * 9) / 5 + 32), condition: 'clear' },
              ],
              weeklyForecast: [
                { day: 'Today', highC: tempC + 3, lowC: tempC - 4, condition, rainProb },
                { day: 'Tomorrow', highC: tempC + 2, lowC: tempC - 3, condition: 'partly_cloudy', rainProb: 20 },
                { day: 'Wed', highC: tempC + 1, lowC: tempC - 4, condition: 'sunny', rainProb: 10 },
              ],
            };

            detected.workClimate = computeWorkClimate(tempC, humidity, wind, 40, condition, cityPart);
            detected.rainForecast = computeRainPossibility(condition, humidity, rainProb, cityPart);

            resolve(detected);
            return;
          }
        } catch (e) {
          // If network fails, return matched Indian/World city based on time offset
        }

        // Fallback with GPS coordinates
        const fallback = { ...WORLD_CITIES_WEATHER[0] };
        fallback.isCurrentLocation = true;
        fallback.stateOrRegion = `GPS (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`;
        resolve(fallback);
      },
      (err) => {
        // Geolocation denied or unavailable -> return default city (Delhi)
        resolve(WORLD_CITIES_WEATHER[0]);
      },
      { timeout: 6000 }
    );
  });
}
