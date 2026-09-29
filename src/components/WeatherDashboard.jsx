import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import Forecast from './Forecast';
import GreetingCard from './GreetingCard';
import TodaysHighlights from './TodaysHighlights';
import StayPreparedTip from './StayPreparedTip';
import MapView from './MapView';
import SettingsPanel from './SettingsPanel';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { getWeatherForCity, getWeatherForCoordinates, WeatherApiError } from '../services/weatherApi';
import { getCurrentPosition, GeolocationError } from '../utils/geolocation';
import { loadRecentLocations, saveRecentLocation, removeRecentLocation } from '../utils/recentLocations';
import { downloadWeatherReport } from '../utils/downloadReport';
import { useInstallPrompt } from '../utils/pwaInstall';
import { loadUserName, saveUserName } from '../utils/userName';
import './WeatherDashboard.css';

const DEFAULT_CITY = 'Chennai';

function describeError(err) {
  if (err instanceof GeolocationError) return err.message;
  if (err instanceof WeatherApiError) {
    if (err.type === 'network') return 'Network error. Check your connection and try again.';
    if (err.type === 'api') return 'Weather service is unavailable right now. Please try again shortly.';
  }
  return 'Something went wrong. Please try again.';
}

function errorVariant(err) {
  if (err instanceof WeatherApiError && err.type === 'network') return 'network';
  return 'unavailable';
}

function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'empty' | 'not-found' | 'error'
  const [lastQuery, setLastQuery] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);
  const [unit, setUnit] = useState('C');
  const [recentLocations, setRecentLocations] = useState(loadRecentLocations);
  const [isLocating, setIsLocating] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  );
  const [userName, setUserName] = useState(loadUserName);
  const requestIdRef = useRef(0);
  const lastActionRef = useRef(null);

  const handleSearch = async (query) => {
    const trimmed = query.trim();

    if (!trimmed) {
      setStatus('empty');
      return;
    }

    lastActionRef.current = { type: 'search', query: trimmed };
    const requestId = ++requestIdRef.current;
    setStatus('loading');

    try {
      const result = await getWeatherForCity(trimmed);
      if (requestIdRef.current !== requestId) return;
      setWeather(result);
      setStatus('ok');
      setRecentLocations((prev) => saveRecentLocation(result.city, prev));
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      if (err instanceof WeatherApiError && err.type === 'not-found') {
        setLastQuery(trimmed);
        setStatus('not-found');
      } else {
        setErrorInfo({ message: describeError(err), variant: errorVariant(err) });
        setStatus('error');
      }
    }
  };

  const handleUseLocation = async () => {
    lastActionRef.current = { type: 'location' };
    const requestId = ++requestIdRef.current;
    setIsLocating(true);
    setStatus('loading');

    try {
      const { latitude, longitude } = await getCurrentPosition();
      const result = await getWeatherForCoordinates(latitude, longitude);
      if (requestIdRef.current !== requestId) return;
      setWeather(result);
      setStatus('ok');
      setRecentLocations((prev) => saveRecentLocation(result.city, prev));
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      const variant = err instanceof GeolocationError ? 'unavailable' : errorVariant(err);
      setErrorInfo({ message: describeError(err), variant });
      setStatus('error');
    } finally {
      if (requestIdRef.current === requestId) setIsLocating(false);
    }
  };

  const handleSelectRecent = (cityName) => {
    setActiveView('dashboard');
    handleSearch(cityName);
  };

  const handleRemoveRecent = (cityName) => {
    setRecentLocations((prev) => removeRecentLocation(cityName, prev));
  };

  const handleRetry = () => {
    const action = lastActionRef.current;
    if (!action) return;
    if (action.type === 'search') handleSearch(action.query);
    else if (action.type === 'location') handleUseLocation();
  };

  const handleNavigate = (view) => {
    if (view === 'forecast') {
      setActiveView('dashboard');
      // Clear then reset the fragment so the browser's native anchor-scroll
      // fires every time, even on repeat clicks with the same target.
      window.location.hash = '';
      setTimeout(() => {
        window.location.hash = 'seven-day-forecast';
      }, 0);
      return;
    }
    setActiveView(view);
  };

  useEffect(() => {
    handleSearch(DEFAULT_CITY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();

  const isBusy = status === 'loading';
  const canDownload = status === 'ok' && !!weather;
  const handleDownload = () => downloadWeatherReport(weather, unit);
  const handleUserNameChange = (name) => setUserName(saveUserName(name));

  return (
    <div className="app-shell">
      <Sidebar
        city={weather?.city ?? '—'}
        country={weather?.country ?? 'Search a city'}
        activeView={activeView}
        onNavigate={handleNavigate}
        recentLocations={recentLocations}
        activeCity={status === 'ok' ? weather.city : null}
        onSelectRecent={handleSelectRecent}
        onRemoveRecent={handleRemoveRecent}
      />

      <div className="app-main">
        <TopBar
          unit={unit}
          onUnitChange={setUnit}
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          isLocating={isLocating}
          isBusy={isBusy}
          theme={theme}
          onThemeChange={setTheme}
          onInstall={promptInstall}
          canInstall={canInstall}
          isInstalled={isInstalled}
        />

        {status === 'loading' && <LoadingState />}

        {status === 'empty' && <ErrorState variant="empty" />}

        {status === 'not-found' && (
          <ErrorState
            variant="not-found"
            subtitle={`No results for "${lastQuery}". Try Chennai, Mumbai, Delhi, Bengaluru, Kolkata, New York or Tokyo.`}
          />
        )}

        {status === 'error' && errorInfo && (
          <ErrorState variant={errorInfo.variant} subtitle={errorInfo.message} onRetry={handleRetry} />
        )}

        {status === 'ok' && weather && (
          <div className="app-grid">
            <div className="app-grid__main">
              {activeView === 'map' ? (
                <MapView
                  lat={weather.coordinates.lat}
                  lon={weather.coordinates.lon}
                  city={weather.city}
                  region={weather.region}
                  country={weather.country}
                />
              ) : activeView === 'settings' ? (
                <SettingsPanel
                  unit={unit}
                  onUnitChange={setUnit}
                  theme={theme}
                  onThemeChange={setTheme}
                  onDownloadReport={handleDownload}
                  canDownloadReport={canDownload}
                  userName={userName}
                  onUserNameChange={handleUserNameChange}
                />
              ) : (
                <>
                  <CurrentWeather data={weather} unit={unit} />
                  <HourlyForecast hours={weather.hourly} unit={unit} />
                  <Forecast days={weather.forecast} unit={unit} />
                </>
              )}
            </div>

            <div className="app-grid__side">
              <GreetingCard condition={weather.condition} userName={userName} />
              <TodaysHighlights
                temperature={weather.temperature}
                feelsLike={weather.feelsLike}
                humidity={weather.humidity}
                windSpeed={weather.windSpeed}
                windDirection={weather.windDirection}
                pressure={weather.pressure}
                uvIndex={weather.uvIndex}
                unit={unit}
              />
              <StayPreparedTip precipitation={weather.forecast[0]?.precipitation ?? 0} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard;
