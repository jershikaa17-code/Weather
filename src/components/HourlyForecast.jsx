import { Clock, Droplet, ArrowRight } from 'lucide-react';
import { formatTemp } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';
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
          const isNow = index === 0;
          return (
            <div className={`hourly-card ${isNow ? 'hourly-card--now' : ''}`} key={hour.time}>
              <p className="hourly-card__time">{hour.time}</p>
              <WeatherIcon
                condition={hour.condition}
                size={26}
                className="hourly-card__icon"
                style={isNow ? { color: '#fff' } : undefined}
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
