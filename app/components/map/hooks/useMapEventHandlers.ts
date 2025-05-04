import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/app/store/store';
import {
  fetchPlaceDetails,
  fetchReverseGeocode,
} from '@/app/store/thunks/searchThunks';
import { closeLeftBar, openLeftBar } from '@/app/store/slices/drawerSlice';
import { clearSearch } from '@/app/store/slices/searchSlice';

export interface MarkerCoords {
  latitude: number;
  longitude: number;
  properties?: {
    place_code?: string;
    name_en?: string;
    name_bn?: string;
    type?: string;
    subtype?: string;
  };
}

export const useMapEventHandlers = () => {
  const dispatch = useAppDispatch();
  const [markerCoords, setMarkerCoords] = useState<MarkerCoords | null>(null);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const handleMapClick = useCallback(
    (event: any) => {
      const feature = event.target.queryRenderedFeatures(event.point)[0];

      if (feature) {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;
        const clickedLngLat = event.lngLat;

        if (properties?.place_code) {
          // Clear selectedFeature when clicking on a POI
          setSelectedFeature(null);

          setMarkerCoords((prev) => {
            if (prev?.properties?.place_code === properties.place_code) {
              return prev;
            }
            return {
              latitude: coordinates[1],
              longitude: coordinates[0],
              properties: {
                place_code: properties.place_code,
                name_en: properties['name:en'],
                name_bn: properties['name:bn'],
                type: properties.type,
                subtype: properties.subtype,
              },
            };
          });
          dispatch(fetchPlaceDetails(properties.place_code));
          dispatch(openLeftBar());
        } else {
          setMarkerCoords({
            latitude: clickedLngLat.lat,
            longitude: clickedLngLat.lng,
          });
          setSelectedFeature((prev: any) => {
            if (prev?.id === feature.id) return prev;
            return {
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates: [clickedLngLat.lng, clickedLngLat.lat],
              },
            };
          });
          dispatch(closeLeftBar());
          dispatch(clearSearch());
        }
      } else {
        setMarkerCoords(null);
        setSelectedFeature(null);
        dispatch(clearSearch());
        dispatch(closeLeftBar());
      }
    },
    [dispatch]
  );

  const handleMouseEnter = useCallback((event: any) => {
    const feature = event.features?.[0];
    if (feature && feature.properties.place_code) {
      // Change the cursor style
      event.target.getCanvas().style.cursor = 'pointer';
      setHoveredFeatureId(feature.properties.place_code);
    }
  }, []);

  const handleMouseLeave = useCallback((event: any) => {
    // Reset cursor
    event.target.getCanvas().style.cursor = '';
    setHoveredFeatureId(null);
  }, []);

  const handleMapDoubleClick = useCallback(
    (event: any) => {
      const clickedLngLat = event.lngLat;

      if (clickedLngLat) {
        // Get the precise coordinates of the click
        const latitude = clickedLngLat.lat;
        const longitude = clickedLngLat.lng;

        // Set marker at clicked location immediately for better UX
        setMarkerCoords({
          latitude,
          longitude,
        });

        // Dispatch the reverse geocode action
        dispatch(fetchReverseGeocode({ latitude, longitude }))
          .unwrap()
          .then(() => {
            // If we got a valid place with a place_code
            dispatch(openLeftBar());
          })
          .catch((error) => {
            console.error('Reverse geocode error:', error);
          });
      }
    },
    [dispatch]
  );

  const handleMapLoad = useCallback(() => {
    // This is intentionally left empty since it will be implemented
    // in the main component with setMapLoaded
  }, []);

  return {
    markerCoords,
    setMarkerCoords,
    hoveredFeatureId,
    selectedFeature,
    setSelectedFeature,
    handleMapClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMapDoubleClick,
    handleMapLoad,
  };
};
