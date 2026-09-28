import { useEffect, useState } from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import SearchBar from './SearchBar';
import LocationButton from './LocationButton';
import './TopBar.css';

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function TopBar({
  unit,
  onUnitChange,
  onSearch,
  onUseLocation,
  isLocating,
  isBusy,
  theme,
  onThemeChange,
  onDownload,
  canDownload,
}) {
  const isDark = theme === 'dark';
  const now = useClock();

  const toggleTheme = () => onThemeChange(isDark ? 'light' : 'dark');

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeLabel = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="top-bar">
      <div className="top-bar__search">
        <SearchBar onSearch={onSearch} disabled={isBusy} />
        <LocationButton onUseLocation={onUseLocation} isLocating={isLocating} disabled={isBusy} />
      </div>

      <div className="top-bar__controls">
        <div className="top-bar__unit-toggle" role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={unit === 'C' ? 'is-active' : ''}
            onClick={() => onUnitChange('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={unit === 'F' ? 'is-active' : ''}
            onClick={() => onUnitChange('F')}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          className="top-bar__theme-toggle"
          onClick={onDownload}
          disabled={!canDownload}
          title={canDownload ? 'Download Weather Report' : 'Weather data not loaded yet'}
          aria-label="Download weather report"
        >
          <Download size={17} />
        </button>

        <button
          type="button"
          className="top-bar__theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle light and dark theme"
          aria-pressed={isDark}
        >
          {isDark ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <div className="top-bar__datetime">
          <p className="top-bar__date">{dateLabel}</p>
          <p className="top-bar__time">{timeLabel}</p>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
