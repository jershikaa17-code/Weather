import { Sun, Moon, CloudSun, Snowflake, Wind, CloudFog } from 'lucide-react';
import cloudyImage from '../assets/weather-icons/cloudy.png';
import rainyImage from '../assets/weather-icons/rainy.png';
import thunderstormImage from '../assets/weather-icons/thunderstorm.png';

// Maps a mock-data condition string to either a Lucide icon + accent color, or
// a flat illustrated image (for conditions with a dedicated artwork asset).
// Kept separate from the mock data and from the display components so either
// side can change independently later (e.g. real API condition codes).
const conditionIconMap = {
  Sunny: { Icon: Sun, color: '#fbbf24' },
  Clear: { Icon: Moon, color: '#93c5fd' },
  'Partly Cloudy': { Icon: CloudSun, color: '#fbbf24' },
  Cloudy: { image: cloudyImage },
  Rainy: { image: rainyImage },
  Thunderstorm: { image: thunderstormImage },
  Snow: { Icon: Snowflake, color: '#bae6fd' },
  Windy: { Icon: Wind, color: '#7dd3fc' },
  Foggy: { Icon: CloudFog, color: '#93a5c9' },
};

export function getConditionIcon(condition) {
  return conditionIconMap[condition] || { image: cloudyImage };
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
