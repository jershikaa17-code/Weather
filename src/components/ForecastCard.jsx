import { Droplet } from 'lucide-react';
import { formatTemp } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';
import './ForecastCard.css';

function ForecastCard({ day, condition, high, low, precipitation, unit, isHighlighted }) {
  return (
    <div className={`forecast-card ${isHighlighted ? 'forecast-card--active' : ''}`}>
      <p className="forecast-card__day">{day}</p>
      <div className="forecast-card__icon">
        <WeatherIcon condition={condition} size={30} />
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
