import { Settings } from 'lucide-react';
import './SettingsPanel.css';

function SettingsPanel({ unit, onUnitChange, theme, onThemeChange }) {
  return (
    <section className="settings-panel card" aria-label="Forecast settings">
      <h3 className="settings-panel__title">
        <Settings size={17} />
        Forecast Settings
      </h3>

      <div className="settings-panel__row">
        <div>
          <p className="settings-panel__label">Temperature Unit</p>
          <p className="settings-panel__hint">
            Switches every temperature shown across the dashboard — current weather, hourly and
            7-day forecast.
          </p>
        </div>
        <div className="settings-panel__toggle" role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={unit === 'C' ? 'is-active' : ''}
            onClick={() => onUnitChange('C')}
          >
            Celsius (°C)
          </button>
          <button
            type="button"
            className={unit === 'F' ? 'is-active' : ''}
            onClick={() => onUnitChange('F')}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      <div className="settings-panel__divider" />

      <div className="settings-panel__row">
        <div>
          <p className="settings-panel__label">Appearance</p>
          <p className="settings-panel__hint">Switch between a light and dark dashboard theme.</p>
        </div>
        <div className="settings-panel__toggle" role="group" aria-label="Theme">
          <button
            type="button"
            className={theme === 'light' ? 'is-active' : ''}
            onClick={() => onThemeChange('light')}
          >
            Light Mode
          </button>
          <button
            type="button"
            className={theme === 'dark' ? 'is-active' : ''}
            onClick={() => onThemeChange('dark')}
          >
            Dark Mode
          </button>
        </div>
      </div>
    </section>
  );
}

export default SettingsPanel;
