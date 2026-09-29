const STORAGE_KEY = 'weather-dashboard:recent-locations';
const MAX_RECENT = 5;

export function loadRecentLocations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentLocation(cityName, list) {
  const deduped = [cityName, ...list.filter((name) => name !== cityName)].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — recent list just won't persist.
  }
  return deduped;
}

export function removeRecentLocation(cityName, list) {
  const filtered = list.filter((name) => name !== cityName);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — recent list just won't persist.
  }
  return filtered;
}
