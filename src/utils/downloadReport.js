import { formatTemp } from './temperature';

function locationLine(weather) {
  return [weather.city, weather.region, weather.country].filter(Boolean).join(', ');
}

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Builds the plain-text weather report from the app's already-loaded,
 * normalized weather object (see src/services/weatherApi.js). Pure function
 * so it never needs a fresh network request — it only reads state the
 * dashboard already has.
 */
export function buildWeatherReportText(weather, unit) {
  const temp = (celsius) => `${formatTemp(celsius, unit)}${unit}`;
  const lines = [];

  lines.push('Weather Report');
  lines.push('---------------');
  lines.push(`Location: ${locationLine(weather)}`);
  lines.push(`Date: ${formatDateLabel(new Date())}`);
  lines.push('');
  lines.push('Current Weather');
  lines.push(`Temperature: ${temp(weather.temperature)}`);
  lines.push(`Feels Like: ${temp(weather.feelsLike)}`);
  lines.push(`Condition: ${weather.condition}`);
  lines.push(`Humidity: ${weather.humidity}%`);
  lines.push(`Wind: ${weather.windSpeed} km/h ${weather.windDirection}`);
  lines.push(`Visibility: ${weather.visibility} km`);
  lines.push(`Pressure: ${weather.pressure} hPa`);
  lines.push(`UV Index: ${weather.uvIndex}`);
  lines.push('');
  lines.push('7-Day Forecast');
  lines.push('--------------');
  weather.forecast.forEach((day) => {
    lines.push(`${day.day} - ${day.condition} - High: ${temp(day.high)} - Low: ${temp(day.low)}`);
  });
  lines.push('');
  lines.push('Overview');
  lines.push('--------');
  weather.forecast.forEach((day) => {
    lines.push(`${day.day}: High ${temp(day.high)} / Low ${temp(day.low)}`);
  });
  lines.push('');

  return lines.join('\n');
}

function sanitizeForFilename(value) {
  const cleaned = value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return cleaned || 'location';
}

function buildFilename(city) {
  const datePart = new Date().toISOString().slice(0, 10);
  return `weather-report-${sanitizeForFilename(city)}-${datePart}.txt`;
}

/**
 * Triggers a client-side .txt download of the current weather report.
 * Pure browser Blob/ObjectURL mechanism — no backend, works identically on
 * localhost and any static host.
 */
export function downloadWeatherReport(weather, unit) {
  if (!weather) return;

  const text = buildWeatherReportText(weather, unit);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = buildFilename(weather.city);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
