import { useEffect } from 'react';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { MapRef } from 'react-map-gl/maplibre';

export const useRouteFromUrl = (mapRef: React.RefObject<MapRef>) => {
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap() as MaplibreMap;

    const handleInitialRoute = () => {
      const hash = window.location.hash;
      if (!hash) return;

      // Check for the traditional hash format: #zoom/lat/lng
      const traditionalMatch = hash.match(/#(\d+)\/([-\d.]+)\/([-\d.]+)/);
      if (traditionalMatch) {
        const zoom = parseFloat(traditionalMatch[1] ?? '0');
        const lat = parseFloat(traditionalMatch[2] ?? '0');
        const lng = parseFloat(traditionalMatch[3] ?? '0');

        if (isValidCoordinates(lat, lng)) {
          map.flyTo({
            center: [lng, lat],
            zoom,
            essential: true,
          });
        }
        return;
      }

      // Check for simple lat,lng format: #lat,lng
      const simpleMatch = hash.match(/#([-\d.]+),([-\d.]+)/);
      if (simpleMatch) {
        const lat = parseFloat(simpleMatch[1] ?? '0');
        const lng = parseFloat(simpleMatch[2] ?? '0');

        if (isValidCoordinates(lat, lng)) {
          map.flyTo({
            center: [lng, lat],
            zoom: 16, // Use a good zoom level for viewing points
            essential: true,
          });
        }
      }
    };

    // Helper function to validate coordinates
    const isValidCoordinates = (lat: number, lng: number) => {
      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    };

    const updateUrl = () => {
      const center = map.getCenter();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}#${Math.round(
          map.getZoom()
        )}/${center.lat.toFixed(4)}/${center.lng.toFixed(4)}`
      );
    };

    handleInitialRoute();
    map.on('moveend', updateUrl);

    return () => {
      map.off('moveend', updateUrl);
    };
  }, [mapRef]);
};
