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

import { setMapLoaded, setMarkerCoords } from '@/app/store/slices/mapSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import ResponsiveDrawer from '../../LeftPanel/ResponsiveDrawer';
import { useUrlParams } from '@/app/hooks/useUrlParams';
import AnimatedMarker from '../Markers/AnimatedMarker';
import MapContextMenu from '../ContextMenu/MapContextMenu';
import ContextMarker from '../Markers/ContextMarker';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useAppDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails } = useAppSelector((state) => state.search);
  const { markerCoords } = useAppSelector((state) => state.map);
  // Use the custom hooks for event handling
  const {
    hoveredFeatureId,
    selectedFeature,
    handleMapClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMapDoubleClick,
    handleContextMenu,
    contextMenu,
    closeContextMenu,
    setSelectedFeature,
  } = useMapEventHandlers();

  // Add URL params hook
  useUrlParams();

  // Use the route hook with proper typing
  useRouteFromUrl(mapRef as React.RefObject<MapRef>);

  // Handle place details effect
  usePlaceDetailsEffect(placeDetails, mapRef as React.RefObject<MapRef>);

  const handleMapLoad = () => {
    dispatch(setMapLoaded(true));
  };

  // Add event handler to close the context menu when clicking outside
  const handleMapContainerClick = React.useCallback(() => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
  }, [contextMenu.visible, closeContextMenu]);

  const handleCloseInfoCard = React.useCallback(() => {
    setSelectedFeature(null);
    dispatch(setMarkerCoords(null)); // Clear marker coordinates when closing the info card
  }, [setSelectedFeature, dispatch]);

  return (
    <>
      <div onClick={handleMapContainerClick}>
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
          onContextMenu={handleContextMenu}
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

          {/* Display regular marker if we have coordinates */}
          {markerCoords && (
            <AnimatedMarker
              latitude={markerCoords.latitude}
              longitude={markerCoords.longitude}
              properties={markerCoords.properties}
            />
          )}

          {/* Context menu marker and popup */}
          {contextMenu.visible && contextMenu.lngLat && (
            <>
              <ContextMarker
                longitude={contextMenu.lngLat.lng}
                latitude={contextMenu.lngLat.lat}
              />
              <MapContextMenu
                longitude={contextMenu.lngLat.lng}
                latitude={contextMenu.lngLat.lat}
                onClose={closeContextMenu}
              />
            </>
          )}
        </MapGL>

        <AnimatePresence>
          {selectedFeature && !selectedFeature.properties?.place_code && (
            <InfoCard feature={selectedFeature} onClose={handleCloseInfoCard} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MapContainer;
