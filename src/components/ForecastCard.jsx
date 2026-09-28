import { Droplet } from 'lucide-react';
import { getConditionIcon } from '../utils/weatherIcons';
import { formatTemp } from '../utils/temperature';
import './ForecastCard.css';

function ForecastCard({ day, condition, high, low, precipitation, unit, isHighlighted }) {
  const { Icon, color } = getConditionIcon(condition);

  return (
    <div className={`forecast-card ${isHighlighted ? 'forecast-card--active' : ''}`}>
      <p className="forecast-card__day">{day}</p>
      <div className="forecast-card__icon" style={{ color }}>
        <Icon size={30} strokeWidth={2} />
      </div>
      <p className="forecast-card__condition">{condition}</p>
      <div className="forecast-card__temps">
        <span className="forecast-card__high">{formatTemp(high, unit)}</span>
        <span className="forecast-card__low">{formatTemp(low, unit)}</span>
      </div>
      {typeof precipitation === 'number' && precipitation > 0 && (
        <p className="forecast-card__precip">
          <Droplet size={11} />
          {precipitation}%
        </p>
      )}
    </div>
  );
}

export default ForecastCard;
