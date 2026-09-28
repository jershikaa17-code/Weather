import { Sparkles, Thermometer, PersonStanding, Droplets, Wind, Gauge, Sun } from 'lucide-react';
import { formatTemp } from '../utils/temperature';
import './TodaysHighlights.css';

function TodaysHighlights({ temperature, feelsLike, humidity, windSpeed, windDirection, pressure, uvIndex, unit }) {
  const items = [
    { icon: Thermometer, label: 'Current Temp', value: `${formatTemp(temperature, unit)}${unit}` },
    { icon: PersonStanding, label: 'Feels Like', value: `${formatTemp(feelsLike, unit)}${unit}` },
    { icon: Droplets, label: 'Humidity', value: `${humidity}%` },
    { icon: Wind, label: 'Wind', value: `${windSpeed} km/h ${windDirection}` },
    { icon: Gauge, label: 'Pressure', value: `${pressure} hPa` },
    { icon: Sun, label: 'UV Index', value: uvIndex },
  ];

  return (
    <section className="highlights card">
      <h3 className="highlights__title">
        <Sparkles size={17} />
        Today's Highlights
      </h3>
      <ul className="highlights__list">
        {items.map(({ icon: Icon, label, value }) => (
          <li className="highlights__item" key={label}>
            <span className="highlights__icon">
              <Icon size={16} />
            </span>
            <span className="highlights__label">{label}</span>
            <span className="highlights__value">{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TodaysHighlights;
