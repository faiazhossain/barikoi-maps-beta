import { useEffect } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

export const usePlaceDetailsEffect = (
  placeDetails: any,
  mapRef: React.RefObject<MapRef>,
  setMarkerCoords: (coords: any) => void
) => {
  useEffect(() => {
    if (!placeDetails || !mapRef.current) return;

    if (placeDetails) {
      // Get coordinates from place details
      const { latitude, longitude, place_name, uCode } = placeDetails;

      if (latitude && longitude) {
        // Only update marker if coordinates are valid
        setMarkerCoords({
          latitude,
          longitude,
          properties: {
            place_code: uCode,
            name_en: place_name,
            type: placeDetails.pType,
            source: 'placeAPI',
          },
        });

        // Fly to the location with animation
        mapRef.current.getMap().flyTo({
          center: [longitude, latitude],
          zoom: 16,
          essential: true,
        });
      }
    }
  }, [placeDetails, mapRef, setMarkerCoords]);
};
