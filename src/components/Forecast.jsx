import { CalendarDays } from 'lucide-react';
import ForecastCard from './ForecastCard';
import './Forecast.css';

function Forecast({ days, unit }) {
  return (
    <section className="forecast card" id="seven-day-forecast">
      <div className="forecast__header">
        <h3 className="forecast__title">
          <CalendarDays size={17} />
          7-Day Forecast
        </h3>
      </div>
      <div className="forecast__grid">
        {days.map((day, index) => (
          <ForecastCard
            key={day.day}
            day={day.day}
            condition={day.condition}
            high={day.high}
            low={day.low}
            precipitation={day.precipitation}
            unit={unit}
            isHighlighted={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

export default Forecast;
