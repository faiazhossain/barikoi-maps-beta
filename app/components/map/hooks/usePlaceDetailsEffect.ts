import { useEffect } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { MarkerCoords } from './useMapEventHandlers';

export const usePlaceDetailsEffect = (
  placeDetails: any,
  mapRef: React.RefObject<MapRef>,
  setMarkerCoords: (
    coords:
      | MarkerCoords
      | null
      | ((prev: MarkerCoords | null) => MarkerCoords | null)
  ) => void
) => {
  useEffect(() => {
    if (placeDetails?.latitude && placeDetails?.longitude) {
      const latitude = Number(placeDetails.latitude);
      const longitude = Number(placeDetails.longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Update marker coordinates
        setMarkerCoords((prev) => {
          // Only update if coordinates have changed
          if (
            !prev ||
            prev.latitude !== latitude ||
            prev.longitude !== longitude
          ) {
            return { latitude, longitude };
          }
          return prev;
        });

        // Fly to location
        const map = mapRef.current;
        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 2000,
            essential: true,
          });
        }
      }
    }
  }, [placeDetails, mapRef, setMarkerCoords]);
};
