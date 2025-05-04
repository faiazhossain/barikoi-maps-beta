import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  fetchPlaceDetails,
  fetchReverseGeocode,
} from '@/app/store/thunks/searchThunks';
import { closeLeftBar, openLeftBar } from '@/app/store/slices/drawerSlice';
import { clearSearch } from '@/app/store/slices/searchSlice';
import { setMarkerCoords } from '@/app/store/slices/mapSlice';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  lngLat: {
    lng: number;
    lat: number;
  } | null;
}

export const useMapEventHandlers = () => {
  const dispatch = useAppDispatch();
  const { markerCoords } = useAppSelector((state) => state.map);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    lngLat: null,
  });

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleMapClick = useCallback(
    (event: any) => {
      // Close context menu if it's open
      if (contextMenu.visible) {
        closeContextMenu();
        return;
      }

      // Get all features at click point
      const features = event.target.queryRenderedFeatures(event.point);

      const feature = features.length > 0 ? features[0] : null;
      const clickedLngLat = event.lngLat;

      if (feature) {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;

        if (properties?.place_code) {
          // Clear selectedFeature when clicking on a POI
          setSelectedFeature(null);

          // Check if we're clicking the same marker
          if (markerCoords?.properties?.place_code !== properties.place_code) {
            dispatch(
              setMarkerCoords({
                latitude: coordinates[1],
                longitude: coordinates[0],
                properties: {
                  place_code: properties.place_code,
                  name_en: properties['name:en'],
                  name_bn: properties['name:bn'],
                  type: properties.type,
                  subtype: properties.subtype,
                  source: 'mapLayer',
                },
              })
            );
          }

          dispatch(fetchPlaceDetails(properties.place_code));
          dispatch(openLeftBar());
        } else {
          // No place_code - clear URL parameters but keep hash
          const pathname = window.location.pathname;
          const hash = window.location.hash;
          window.history.replaceState({}, '', `${pathname}${hash}`);

          // Make sure we properly set the selected feature regardless of source
          setSelectedFeature({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: [clickedLngLat.lng, clickedLngLat.lat],
            },
          });

          dispatch(
            setMarkerCoords({
              latitude: clickedLngLat.lat,
              longitude: clickedLngLat.lng,
              properties: {
                source: 'mapClick',
              },
            })
          );

          dispatch(closeLeftBar());
          dispatch(clearSearch());
        }
      } else {
        // No feature - clear URL parameters but keep hash
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        window.history.replaceState({}, '', `${pathname}${hash}`);

        // Clear selected feature and marker when clicking on empty areas
        dispatch(setMarkerCoords(null));
        setSelectedFeature(null);
        dispatch(clearSearch());
        dispatch(closeLeftBar());
      }
    },
    [dispatch, contextMenu.visible, closeContextMenu, markerCoords]
  );

  // Handle right-click to show context menu
  const handleContextMenu = useCallback((event: any) => {
    // Prevent default context menu
    event.preventDefault();

    const clickedLngLat = event.lngLat;

    if (clickedLngLat) {
      setContextMenu({
        visible: true,
        x: event.point.x,
        y: event.point.y,
        lngLat: {
          lng: clickedLngLat.lng,
          lat: clickedLngLat.lat,
        },
      });
    }
  }, []);

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
      setSelectedFeature(null);
      if (clickedLngLat) {
        // Get the precise coordinates of the click
        const latitude = clickedLngLat.lat;
        const longitude = clickedLngLat.lng;

        // Set marker at clicked location immediately for better UX
        dispatch(
          setMarkerCoords({
            latitude,
            longitude,
            properties: {
              source: 'doubleClick',
            },
          })
        );

        // Open the left bar immediately instead of waiting for API response
        dispatch(openLeftBar());

        // Dispatch the reverse geocode action
        dispatch(fetchReverseGeocode({ latitude, longitude }))
          .unwrap()
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
    hoveredFeatureId,
    selectedFeature,
    setSelectedFeature,
    handleMapClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMapDoubleClick,
    handleContextMenu,
    contextMenu,
    closeContextMenu,
    handleMapLoad,
  };
};
