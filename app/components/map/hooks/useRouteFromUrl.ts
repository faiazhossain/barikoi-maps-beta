import { useEffect } from 'react';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { MapRef } from 'react-map-gl/maplibre';

export const useRouteFromUrl = (mapRef: React.RefObject<MapRef>) => {
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap() as MaplibreMap;

    const handleInitialRoute = () => {
      const hash = window.location.hash;
      if (hash) {
        const match = hash.match(/#(\d+)\/([-\d.]+)\/([-\d.]+)/);
        if (match) {
          const zoom = parseFloat(match[1] ?? '0');
          const lat = parseFloat(match[2] ?? '0');
          const lng = parseFloat(match[3] ?? '0');

          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            map.flyTo({
              center: [lng, lat],
              zoom,
              essential: true,
            });
          }
        }
      }
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
