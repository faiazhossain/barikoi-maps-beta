'use client';
import React, { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapGL, { MapRef } from 'react-map-gl/maplibre';
import { useMapRef } from '../hooks/useMapRef';
import { useRouteFromUrl } from '../hooks/useRouteFromUrl';
import MapControls from './MapControls';
import BarikoiAttribution from './BarikoiAttribution';
import { AnimatePresence } from 'framer-motion';
import InfoCard from '../InfoCard/InfoCard';

import { setMapLoaded } from '@/app/store/slices/mapSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import ResponsiveDrawer from '../../LeftPanel/ResponsiveDrawer';
import { useUrlParams } from '@/app/hooks/useUrlParams';
import AnimatedMarker from '../Markers/AnimatedMarker';
import {
  fetchPlaceDetails,
  fetchReverseGeocode,
} from '@/app/store/thunks/searchThunks';
import { closeLeftBar, openLeftBar } from '@/app/store/slices/drawerSlice';
import { clearSearch } from '@/app/store/slices/searchSlice';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useAppDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails } = useAppSelector((state) => state.search);
  // Add state for marker coordinates
  const [markerCoords, setMarkerCoords] = useState<{
    latitude: number;
    longitude: number;
    properties?: {
      place_code?: string;
      name_en?: string;
      name_bn?: string;
      type?: string;
      subtype?: string;
    };
  } | null>(null);

  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  // Add state for feature info
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // Add URL params hook
  useUrlParams();

  // Use the route hook with proper typing
  useRouteFromUrl(mapRef as React.RefObject<MapRef>);

  // Handle coordinate changes
  useEffect(() => {
    // Only update if placeDetails has changed and is not null
    if (placeDetails?.latitude && placeDetails?.longitude) {
      const latitude = Number(placeDetails.latitude);
      const longitude = Number(placeDetails.longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Update marker coordinates
        setMarkerCoords((prev) => {
          // Only update if coordinates have changed
          if (prev?.latitude !== latitude || prev?.longitude !== longitude) {
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
  }, [placeDetails]); // Only depend on placeDetails

  const handleMapLoad = () => {
    dispatch(setMapLoaded(true));
  };

  // Update handleMapClick to prevent unnecessary state updates
  const handleMapClick = React.useCallback(
    (event) => {
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
          setSelectedFeature((prev) => {
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
  ); // Only depend on dispatch

  // Add mouse enter handler
  const handleMouseEnter = (event) => {
    const feature = event.features?.[0];
    if (feature && feature.properties.place_code) {
      // Change the cursor style
      event.target.getCanvas().style.cursor = 'pointer';
      setHoveredFeatureId(feature.properties.place_code);
    }
  };

  // Add mouse leave handler
  const handleMouseLeave = (event) => {
    // Reset cursor
    event.target.getCanvas().style.cursor = '';
    setHoveredFeatureId(null);
  };

  const handleMapDoubleClick = React.useCallback(
    (event) => {
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

  return (
    <>
      <MapGL
        ref={mapRef as unknown as React.RefObject<MapRef>}
        mapLib={maplibregl}
        initialViewState={{
          longitude: 90.3938,
          latitude: 23.8103,
          zoom: 12,
        }}
        style={{ width: '100vw', height: '100dvh' }}
        mapStyle='/map-styles/light-style.json'
        np
        attributionControl={false}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDblClick={handleMapDoubleClick}
        interactiveLayerIds={[
          'recreation',
          'commercial',
          'residential',
          'education',
          'health',
          'government',
          'religious',
          // Add other POI layer IDs you want to interact with
        ]}
        cursor={hoveredFeatureId ? 'pointer' : 'default'}
        hash={true}
      >
        <MapControls />
        <BarikoiAttribution />
        {isLeftBarOpen && <ResponsiveDrawer />}

        {/* Add the animated marker */}
        {markerCoords && (
          <AnimatedMarker
            latitude={markerCoords.latitude}
            longitude={markerCoords.longitude}
            properties={markerCoords.properties}
          />
        )}
      </MapGL>

      <AnimatePresence>
        {selectedFeature && !selectedFeature.properties.place_code && (
          <InfoCard feature={selectedFeature} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MapContainer;
