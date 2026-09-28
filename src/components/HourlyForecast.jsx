import { Clock, Droplet, ArrowRight } from 'lucide-react';
import { getConditionIcon } from '../utils/weatherIcons';
import { formatTemp } from '../utils/temperature';
import './HourlyForecast.css';

function HourlyForecast({ hours, unit }) {
  return (
    <section className="hourly-forecast card">
      <div className="hourly-forecast__header">
        <h3 className="hourly-forecast__title">
          <Clock size={17} />
          Today's Forecast
        </h3>
        <a href="#seven-day-forecast" className="hourly-forecast__link">
          7-Day Forecast <ArrowRight size={15} />
        </a>
      </div>
      <div className="hourly-forecast__row">
        {hours.map((hour, index) => {
          const { Icon, color } = getConditionIcon(hour.condition);
          const isNow = index === 0;
          return (
            <div className={`hourly-card ${isNow ? 'hourly-card--now' : ''}`} key={hour.time}>
              <p className="hourly-card__time">{hour.time}</p>
              <Icon
                className="hourly-card__icon"
                size={26}
                style={{ color: isNow ? '#fff' : color }}
                strokeWidth={2}
              />
              <p className="hourly-card__temp">{formatTemp(hour.temp, unit)}</p>
              {hour.precipitation > 0 && (
                <p className="hourly-card__precip">
                  <Droplet size={11} />
                  {hour.precipitation}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HourlyForecast;
