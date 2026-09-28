import { SearchX, MapPinOff, CloudOff, WifiOff } from 'lucide-react';
import './ErrorState.css';

const VARIANTS = {
  empty: {
    Icon: SearchX,
    title: 'Please enter a city name',
    subtitle: 'Type a city into the search bar above and hit Search.',
  },
  'not-found': {
    Icon: MapPinOff,
    title: 'City not found',
    subtitle: 'Try searching for another city, e.g. Chennai, Mumbai or Tokyo.',
  },
  unavailable: {
    Icon: CloudOff,
    title: 'Weather data unavailable',
    subtitle: "We couldn't load conditions for this location right now.",
  },
  network: {
    Icon: WifiOff,
    title: 'Network error',
    subtitle: 'Check your connection and try again.',
  },
};

function ErrorState({ variant = 'not-found', title, subtitle, onRetry }) {
  const fallback = VARIANTS[variant] || VARIANTS['not-found'];
  const Icon = fallback.Icon;

  return (
    <div className="error-state" role="status">
      <span className="error-state__icon">
        <Icon size={30} />
      </span>
      <p className="error-state__title">{title || fallback.title}</p>
      <p className="error-state__subtitle">{subtitle || fallback.subtitle}</p>
      {onRetry && (
        <button type="button" className="error-state__retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
