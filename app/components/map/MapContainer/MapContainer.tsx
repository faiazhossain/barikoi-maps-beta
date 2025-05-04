'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapGL, { MapRef } from 'react-map-gl/maplibre';
import { useMapRef } from '../hooks/useMapRef';
import { useRouteFromUrl } from '../hooks/useRouteFromUrl';
import { useMapEventHandlers } from '../hooks/useMapEventHandlers';
import { usePlaceDetailsEffect } from '../hooks/usePlaceDetailsEffect';
import MapControls from './MapControls';
import BarikoiAttribution from './BarikoiAttribution';
import { AnimatePresence } from 'framer-motion';
import InfoCard from '../InfoCard/InfoCard';

import { setMapLoaded } from '@/app/store/slices/mapSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import ResponsiveDrawer from '../../LeftPanel/ResponsiveDrawer';
import { useUrlParams } from '@/app/hooks/useUrlParams';
import AnimatedMarker from '../Markers/AnimatedMarker';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useAppDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails } = useAppSelector((state) => state.search);

  // Use the custom hooks for event handling
  const {
    markerCoords,
    setMarkerCoords,
    hoveredFeatureId,
    selectedFeature,
    handleMapClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMapDoubleClick,
  } = useMapEventHandlers();

  // Add URL params hook
  useUrlParams();

  // Use the route hook with proper typing
  useRouteFromUrl(mapRef as React.RefObject<MapRef>);

  // Handle place details effect
  usePlaceDetailsEffect(
    placeDetails,
    mapRef as React.RefObject<MapRef>,
    setMarkerCoords
  );

  const handleMapLoad = () => {
    dispatch(setMapLoaded(true));
  };

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
        ]}
        cursor={hoveredFeatureId ? 'pointer' : 'default'}
        hash={true}
      >
        <MapControls />
        <BarikoiAttribution />
        {isLeftBarOpen && <ResponsiveDrawer />}

        {markerCoords && (
          <AnimatedMarker
            latitude={markerCoords.latitude}
            longitude={markerCoords.longitude}
            properties={markerCoords.properties}
          />
        )}
      </MapGL>

      <AnimatePresence>
        {selectedFeature && !selectedFeature.properties?.place_code && (
          <InfoCard feature={selectedFeature} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MapContainer;
