'use client';
import React, { useState } from 'react';
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

import {
  setMapLoaded,
  setMarkerCoords,
  setViewport,
} from '@/app/store/slices/mapSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import ResponsiveDrawer from '../../LeftPanel/ResponsiveDrawer';
import { useUrlParams } from '@/app/hooks/useUrlParams';
import AnimatedMarker from '../Markers/AnimatedMarker';
import MapContextMenu from '../ContextMenu/MapContextMenu';
import ContextMarker from '../Markers/ContextMarker';
import NearbySearchMarker from '../Markers/NearbySearchMarker';
import NearbyPlaceMarker from '../Markers/NearbyPlaceMarker';
import NearbyPlacePopup from '../Popups/NearbyPlacePopup';
import NearbyPlaceModal from '../Modals/NearbyPlaceModal';
import { NearbyPlace } from '@/app/types/map';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useAppDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails, nearbyPlaces } = useAppSelector(
    (state) => state.search
  );
  const { markerCoords, viewport } = useAppSelector((state) => state.map);
  const selectedCategories = useAppSelector(
    (state) => state.search.selectedCategories
  );
  const showNearbyResults = selectedCategories.length > 0;

  // State for selected nearby place popup and modal
  const [selectedNearbyPlace, setSelectedNearbyPlace] =
    useState<NearbyPlace | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

    // Also update viewport on initial load
    if (mapRef.current) {
      const { lng: longitude, lat: latitude } = mapRef.current.getCenter();
      dispatch(
        setViewport({
          longitude,
          latitude,
          zoom: mapRef.current.getZoom(),
        })
      );
    }
  };

  // Handle nearby place marker click
  const handleNearbyPlaceClick = (place: NearbyPlace) => {
    setSelectedNearbyPlace(place);
    setShowDetailsModal(false);
  };

  // Close popup
  const handleClosePopup = () => {
    setSelectedNearbyPlace(null);
  };

  // Show details modal
  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
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
            longitude: viewport.longitude || 90.3938,
            latitude: viewport.latitude || 23.8103,
            zoom: viewport.zoom || 12,
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
          {!showNearbyResults && markerCoords && (
            <AnimatedMarker
              latitude={markerCoords.latitude}
              longitude={markerCoords.longitude}
              properties={markerCoords.properties}
            />
          )}

          {/* Add nearby search center marker and results */}
          {showNearbyResults && (
            <>
              <NearbySearchMarker
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                categories={selectedCategories}
              />

              {/* Display nearby place markers */}
              {nearbyPlaces.map((place) => (
                <NearbyPlaceMarker
                  key={place.id}
                  place={place as NearbyPlace}
                  onClick={handleNearbyPlaceClick}
                />
              ))}

              {/* Display popup for selected nearby place */}
              {selectedNearbyPlace && (
                <NearbyPlacePopup
                  place={selectedNearbyPlace}
                  onClose={handleClosePopup}
                  onViewDetails={handleViewDetails}
                />
              )}
            </>
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

        {/* Details modal */}
        <AnimatePresence>
          {showDetailsModal && selectedNearbyPlace && (
            <NearbyPlaceModal
              place={selectedNearbyPlace}
              onClose={handleCloseModal}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MapContainer;
