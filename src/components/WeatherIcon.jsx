import { getConditionIcon } from '../utils/weatherIcons';

/**
 * Renders whatever getConditionIcon(condition) resolves to — a Lucide icon
 * (tinted via `color`) or a flat illustrated PNG — behind one consistent API
 * so forecast cards, the hourly row and the hero card don't each need their
 * own image-vs-icon branching.
 */
function WeatherIcon({ condition, size = 24, className, style }) {
  const { Icon, image, color } = getConditionIcon(condition);

  if (image) {
    return (
      <img
        src={image}
        alt={condition}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain', ...style }}
      />
    );
  }

  return <Icon size={size} className={className} style={{ color, ...style }} />;
}

export default WeatherIcon;
