export class GeolocationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeolocationError';
  }
}

// A pending permission prompt keeps getCurrentPosition's own `timeout` option
// from ever firing (its clock only starts once permission is resolved), so a
// user who never responds to the browser prompt would hang the UI forever
// without this independent safety-net timeout.
const HARD_TIMEOUT_MS = 20000;

function getRawPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });
}

export async function getCurrentPosition() {
  if (!navigator.geolocation) {
    throw new GeolocationError('Geolocation is not supported by this browser.');
  }

  let position;
  try {
    position = await Promise.race([
      getRawPosition(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new GeolocationError('Location request timed out. Please try again.')),
          HARD_TIMEOUT_MS
        )
      ),
    ]);
  } catch (error) {
    if (error instanceof GeolocationError) throw error;
    if (error.code === error.PERMISSION_DENIED) {
      throw new GeolocationError('Location access was denied. Enable it in your browser settings.');
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      throw new GeolocationError('Your location could not be determined.');
    }
    if (error.code === error.TIMEOUT) {
      throw new GeolocationError('Location request timed out. Please try again.');
    }
    throw new GeolocationError('Unable to get your location.');
  }

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
