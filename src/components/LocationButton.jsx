import { LocateFixed } from 'lucide-react';
import './LocationButton.css';

function LocationButton({ onUseLocation, isLocating, disabled }) {
  return (
    <button
      type="button"
      className="location-button"
      onClick={onUseLocation}
      disabled={isLocating || disabled}
      title="Use my location"
      aria-label="Use my location"
    >
      <LocateFixed size={18} className={isLocating ? 'location-button__icon--spin' : ''} />
    </button>
  );
}

export default LocationButton;
