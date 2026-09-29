const STORAGE_KEY = 'weather_user_name';
export const DEFAULT_USER_NAME = 'Adithya';
export const MAX_NAME_LENGTH = 30;

export function loadUserName() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const trimmed = raw ? raw.trim() : '';
    return trimmed || DEFAULT_USER_NAME;
  } catch {
    return DEFAULT_USER_NAME;
  }
}

export function saveUserName(name) {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  try {
    localStorage.setItem(STORAGE_KEY, trimmed);
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — name just won't persist.
  }
  return trimmed;
}

export function isValidUserName(name) {
  return name.trim().length > 0 && name.trim().length <= MAX_NAME_LENGTH;
}
