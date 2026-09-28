import { Droplets, Wind, Navigation, Eye, Gauge, Sun } from 'lucide-react';
import './WeatherDetails.css';

function WeatherDetails({ humidity, windSpeed, windDirection, visibility, pressure, uvIndex }) {
  const items = [
    { icon: Droplets, label: 'Humidity', value: `${humidity}%` },
    { icon: Wind, label: 'Wind Speed', value: `${windSpeed} km/h` },
    { icon: Navigation, label: 'Wind Direction', value: windDirection },
    { icon: Eye, label: 'Visibility', value: `${visibility} km` },
    { icon: Gauge, label: 'Pressure', value: `${pressure} hPa` },
    { icon: Sun, label: 'UV Index', value: uvIndex },
  ];

  return (
    <div className="weather-details">
      {items.map(({ icon: Icon, label, value }) => (
        <div className="weather-details__item" key={label}>
          <Icon size={17} className="weather-details__icon" />
          <div>
            <p className="weather-details__label">{label}</p>
            <p className="weather-details__value">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeatherDetails;
