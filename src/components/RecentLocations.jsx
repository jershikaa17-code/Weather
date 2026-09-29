import { useState } from 'react';
import { History, MapPin, ChevronDown, X } from 'lucide-react';
import './RecentLocations.css';

function RecentLocations({ locations, activeCity, onSelect, onRemove }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="recent-locations">
      <button
        type="button"
        className="sidebar__nav-item recent-locations__toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <History size={18} />
        Recent Cities
        <ChevronDown size={16} className={`recent-locations__chevron ${isOpen ? 'is-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="recent-locations__list">
          {locations.length === 0 ? (
            <p className="recent-locations__empty">Search for a city to see it here</p>
          ) : (
            locations.map((name) => (
              <div
                key={name}
                className={`recent-locations__row ${name === activeCity ? 'is-active' : ''}`}
              >
                <button
                  type="button"
                  className="recent-locations__item"
                  onClick={() => onSelect(name)}
                >
                  <MapPin size={14} />
                  <span>{name}</span>
                </button>
                <button
                  type="button"
                  className="recent-locations__remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(name);
                  }}
                  aria-label={`Remove ${name} from recent cities`}
                >
                  <X size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default RecentLocations;
