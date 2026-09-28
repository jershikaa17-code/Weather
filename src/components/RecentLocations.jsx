import { History } from 'lucide-react';
import './RecentLocations.css';

function RecentLocations({ locations, activeCity, onSelect }) {
  if (!locations.length) return null;

  return (
    <div className="recent-locations">
      <span className="recent-locations__label">
        <History size={14} />
        Recent
      </span>
      <div className="recent-locations__chips">
        {locations.map((name) => (
          <button
            key={name}
            type="button"
            className={`recent-locations__chip ${name === activeCity ? 'is-active' : ''}`}
            onClick={() => onSelect(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentLocations;
