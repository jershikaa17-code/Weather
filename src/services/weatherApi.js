// Open-Meteo integration: geocoding + forecast + normalization.
// Kept separate from UI components — every component still consumes the same
// normalized shape that src/data/mockWeatherData.js used to provide, so no
// presentation component needed to change to move off mock data.

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

export class WeatherApiError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'WeatherApiError';
    this.type = type; // 'not-found' | 'network' | 'api'
  }
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherApiError('Network request failed', 'network');
  }

  if (!response.ok) {
    throw new WeatherApiError(`Request failed with status ${response.status}`, 'api');
  }

  try {
    return await response.json();
  } catch {
    throw new WeatherApiError('Received an invalid response', 'api');
  }
}

const WEATHER_CODE_MAP = {
  0: 'Sunny', // resolved to Clear at night, see mapWeatherCode
  1: 'Partly Cloudy',
  2: 'Partly Cloudy',
  3: 'Cloudy',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Rainy',
  53: 'Rainy',
  55: 'Rainy',
  56: 'Rainy',
  57: 'Rainy',
  61: 'Rainy',
  63: 'Rainy',
  65: 'Rainy',
  66: 'Rainy',
  67: 'Rainy',
  71: 'Snow',
  73: 'Snow',
  75: 'Snow',
  77: 'Snow',
  80: 'Rainy',
  81: 'Rainy',
  82: 'Rainy',
  85: 'Snow',
  86: 'Snow',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

export function mapWeatherCode(code, isDay = 1) {
  if (code === 0) return isDay ? 'Sunny' : 'Clear';
  return WEATHER_CODE_MAP[code] || 'Cloudy';
}

const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function degreesToCompass(deg) {
  if (deg === null || deg === undefined || Number.isNaN(deg)) return '—';
  const index = Math.round(deg / 45) % 8;
  return COMPASS_POINTS[(index + 8) % 8];
}

function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDayLabel(dateStr) {
  return parseLocalDate(dateStr).toLocaleDateString(undefined, { weekday: 'short' });
}

function formatClockTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatHourLabel(date) {
  return date
    .toLocaleTimeString(undefined, { hour: 'numeric', hour12: true })
    .replace(' ', '')
    .toUpperCase();
}

function closestHourlyIndex(hourlyTimes, targetDate) {
  let bestIndex = 0;
  let bestDiff = Infinity;
  hourlyTimes.forEach((t, i) => {
    const diff = Math.abs(new Date(t).getTime() - targetDate.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  });
  return bestIndex;
}

/**
 * Look up a place name via the Open-Meteo Geocoding API.
 * Returns the best-matching result or null if nothing matched.
 */
export async function geocodeCity(query) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const data = await fetchJson(url);
  const result = data?.results?.[0];
  if (!result) return null;

  return {
    name: result.name,
    region: result.admin1 || '',
    country: result.country || '',
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

/**
 * Fetch current + hourly + daily forecast data for a coordinate pair.
 */
async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: ['temperature_2m', 'weather_code', 'precipitation_probability', 'visibility', 'uv_index'].join(
      ','
    ),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: 7,
    wind_speed_unit: 'kmh',
  });

  return fetchJson(`${FORECAST_URL}?${params.toString()}`);
}

/**
 * Best-effort reverse geocode for "Use My Location" (Open-Meteo has no
 * reverse endpoint). Falls back to a generic label if this fails — it is
 * never allowed to block showing the actual weather data.
 */
async function reverseGeocode(latitude, longitude) {
  try {
    const url = `${REVERSE_GEOCODE_URL}?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('reverse geocode failed');
    const data = await response.json();
    const address = data.address || {};
    return {
      name: address.city || address.town || address.village || address.county || 'Current Location',
      region: address.state || '',
      country: address.country || '',
    };
  } catch {
    return { name: 'Current Location', region: '', country: '' };
  }
}

function buildHourlySlots(hourly, nowDate) {
  const nowIndex = closestHourlyIndex(hourly.time, nowDate);
  const offsets = [0, 2, 4, 6, 8, 10];

  return offsets
    .map((offset) => nowIndex + offset)
    .filter((i) => i < hourly.time.length)
    .map((i, slotIndex) => ({
      time: slotIndex === 0 ? 'Now' : formatHourLabel(new Date(hourly.time[i])),
      temp: Math.round(hourly.temperature_2m[i]),
      condition: mapWeatherCode(hourly.weather_code[i], 1),
      precipitation: Math.round(hourly.precipitation_probability?.[i] ?? 0),
    }));
}

function buildDailyForecast(daily) {
  return daily.time.slice(0, 7).map((dateStr, i) => ({
    day: formatDayLabel(dateStr),
    condition: mapWeatherCode(daily.weather_code[i], 1),
    high: Math.round(daily.temperature_2m_max[i]),
    low: Math.round(daily.temperature_2m_min[i]),
    precipitation: Math.round(daily.precipitation_probability_max?.[i] ?? 0),
  }));
}

/**
 * Normalizes a geocode result + Open-Meteo forecast response into the flat
 * shape every weather component already expects (same shape the old mock
 * data module produced).
 */
function normalizeWeather(place, forecast) {
  const { current, hourly, daily } = forecast;
  const nowDate = new Date(current.time);
  const hourIndex = closestHourlyIndex(hourly.time, nowDate);

  return {
    city: place.name,
    region: place.region,
    country: place.country,
    coordinates: { lat: place.latitude, lon: place.longitude },
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    condition: mapWeatherCode(current.weather_code, current.is_day),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: degreesToCompass(current.wind_direction_10m),
    visibility: Math.round((hourly.visibility?.[hourIndex] ?? 0) / 1000),
    pressure: Math.round(current.pressure_msl),
    uvIndex: Math.round(hourly.uv_index?.[hourIndex] ?? 0),
    sunrise: formatClockTime(daily.sunrise?.[0]),
    sunset: formatClockTime(daily.sunset?.[0]),
    forecast: buildDailyForecast(daily),
    hourly: buildHourlySlots(hourly, nowDate),
  };
}

/**
 * Full search flow: city name -> geocode -> forecast -> normalized weather.
 * Throws WeatherApiError('not-found') when no city matches.
 */
export async function getWeatherForCity(query) {
  const place = await geocodeCity(query);
  if (!place) {
    throw new WeatherApiError(`No city found matching "${query}"`, 'not-found');
  }
  const forecast = await fetchForecast(place.latitude, place.longitude);
  return normalizeWeather(place, forecast);
}

/**
 * Full flow for "Use My Location": coordinates -> reverse geocode (best
 * effort, non-blocking) -> forecast -> normalized weather.
 */
export async function getWeatherForCoordinates(latitude, longitude) {
  const [place, forecast] = await Promise.all([
    reverseGeocode(latitude, longitude),
    fetchForecast(latitude, longitude),
  ]);
  return normalizeWeather({ ...place, latitude, longitude }, forecast);
}
