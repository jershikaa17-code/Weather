import { CloudSun, Home, CalendarDays, MapPin, Settings, ChevronRight, Sun } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', view: 'dashboard', Icon: Home },
  { label: 'Forecast', view: 'forecast', Icon: CalendarDays },
  { label: 'Maps', view: 'map', Icon: MapPin },
  { label: 'Settings', view: 'settings', Icon: Settings },
];

function Sidebar({ city, country, activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">
          <CloudSun size={22} strokeWidth={2.25} />
        </span>
        <div>
          <p className="sidebar__brand-title">Weather</p>
          <p className="sidebar__brand-subtitle">Your daily forecast</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, view, Icon }) => (
          <button
            key={label}
            type="button"
            className={`sidebar__nav-item ${activeView === view ? 'is-active' : ''}`}
            onClick={() => onNavigate(view)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__location-card"
          onClick={() => onNavigate('map')}
        >
          <span className="sidebar__location-icon">
            <MapPin size={16} />
          </span>
          <span className="sidebar__location-text">
            <span className="sidebar__location-city">{city}</span>
            <span className="sidebar__location-country">{country}</span>
          </span>
          <ChevronRight size={16} className="sidebar__location-chevron" />
        </button>

        <p className="sidebar__tip">
          <Sun size={14} />
          Good weather brings good vibes.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
