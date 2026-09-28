import { MapPin } from 'lucide-react';
import { getConditionIcon } from '../utils/weatherIcons';
import { formatTemp } from '../utils/temperature';
import WeatherDetails from './WeatherDetails';
import heroBg from '../assets/hero-bg.jpg';
import './CurrentWeather.css';

const heroBackgroundStyle = {
  backgroundImage: `linear-gradient(120deg, rgba(37,99,235,0.75) 0%, rgba(59,130,246,0.65) 35%, rgba(96,165,250,0.55) 65%, rgba(147,197,253,0.4) 100%), url(${heroBg})`,
};

function CurrentWeather({ data, unit }) {
  const {
    city,
    region,
    country,
    temperature,
    feelsLike,
    condition,
    humidity,
    windSpeed,
    windDirection,
    visibility,
    pressure,
    uvIndex,
  } = data;
  const { Icon: ConditionIcon, color: conditionColor } = getConditionIcon(condition);

  return (
    <section className="current-weather" style={heroBackgroundStyle} aria-label="Current weather">
      <div className="current-weather__body">
        <div className="current-weather__main">
          <div className="current-weather__location">
            <MapPin size={16} />
            <span className="current-weather__city">{city}</span>
          </div>
          <p className="current-weather__region">
            {region}, {country}
          </p>

          <div className="current-weather__reading">
            <ConditionIcon
              className="current-weather__icon"
              size={72}
              strokeWidth={1.6}
              style={{ color: conditionColor }}
            />
            <div>
              <div className="current-weather__temp">
                {formatTemp(temperature, unit)}
                <span className="current-weather__temp-unit">{unit}</span>
              </div>
            </div>
          </div>

          <p className="current-weather__condition">{condition}</p>
          <p className="current-weather__feels-like">
            Feels like {formatTemp(feelsLike, unit)}
            {unit}
          </p>
        </div>

        <WeatherDetails
          humidity={humidity}
          windSpeed={windSpeed}
          windDirection={windDirection}
          visibility={visibility}
          pressure={pressure}
          uvIndex={uvIndex}
        />
      </div>
    </section>
  );
}

export default CurrentWeather;
