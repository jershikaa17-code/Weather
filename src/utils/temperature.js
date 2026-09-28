export function convertTemp(celsius, unit) {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

export function formatTemp(celsius, unit) {
  return `${convertTemp(celsius, unit)}°`;
}
