import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const pinIcon = L.divIcon({
  className: 'map-pin',
  html: `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z" fill="#3b82f6"/>
      <circle cx="17" cy="17" r="7" fill="#ffffff"/>
    </svg>
  `,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -40],
});

function MapView({ lat, lon, city, region, country }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([lat, lon], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markerRef.current = L.marker([lat, lon], { icon: pinIcon }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker || lat == null || lon == null) return;

    map.setView([lat, lon], 11, { animate: true });
    marker.setLatLng([lat, lon]);
    marker
      .bindPopup(`<strong>${city}</strong><br/>${[region, country].filter(Boolean).join(', ')}`)
      .openPopup();

    setTimeout(() => map.invalidateSize(), 200);
  }, [lat, lon, city, region, country]);

  return (
    <section className="map-view card" aria-label="City map">
      <div className="map-view__header">
        <h3 className="map-view__title">Map</h3>
        <p className="map-view__subtitle">
          {city}
          {region ? `, ${region}` : ''}
          {country ? `, ${country}` : ''}
        </p>
      </div>
      <div className="map-view__canvas" ref={containerRef} />
    </section>
  );
}

export default MapView;
