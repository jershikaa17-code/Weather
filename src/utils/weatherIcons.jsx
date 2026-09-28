import {
  Sun,
  Moon,
  CloudSun,
  Cloudy,
  CloudRain,
  Zap,
  Snowflake,
  Wind,
  CloudFog,
} from 'lucide-react';

// Maps a mock-data condition string to a Lucide icon component + accent color.
// Kept separate from the mock data and from the display components so either
// side can change independently later (e.g. real API condition codes).
const conditionIconMap = {
  Sunny: { Icon: Sun, color: '#fbbf24' },
  Clear: { Icon: Moon, color: '#93c5fd' },
  'Partly Cloudy': { Icon: CloudSun, color: '#fbbf24' },
  Cloudy: { Icon: Cloudy, color: '#94a3b8' },
  Rainy: { Icon: CloudRain, color: '#38bdf8' },
  Thunderstorm: { Icon: Zap, color: '#6d5ef0' },
  Snow: { Icon: Snowflake, color: '#bae6fd' },
  Windy: { Icon: Wind, color: '#7dd3fc' },
  Foggy: { Icon: CloudFog, color: '#93a5c9' },
};

export function getConditionIcon(condition) {
  return conditionIconMap[condition] || { Icon: Cloudy, color: '#94a3b8' };
}

const conditionBlurbMap = {
  Sunny: 'Pleasant weather today. Enjoy your day!',
  Clear: 'Clear skies tonight. A calm one ahead.',
  'Partly Cloudy': 'Mild and comfortable — a great day to be outside.',
  Cloudy: 'Overcast skies today. Stay cozy.',
  Rainy: "Rain expected. Don't forget your umbrella.",
  Thunderstorm: 'Storms possible today. Stay safe indoors.',
  Snow: 'Snow today. Bundle up and stay warm.',
  Windy: 'Breezy conditions today. Hold onto your hat!',
  Foggy: 'Reduced visibility this morning. Drive safe.',
};

export function getConditionBlurb(condition) {
  return conditionBlurbMap[condition] || 'Have a wonderful day!';
}
