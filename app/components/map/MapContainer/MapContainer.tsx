'use client';
import React, { useState, useCallback } from 'react';
import maplibregl, { LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapGL, { MapRef } from 'react-map-gl/maplibre';
import { useMapRef } from '../hooks/useMapRef';
import { useRouteFromUrl } from '../hooks/useRouteFromUrl';
import { useMapEventHandlers } from '../hooks/useMapEventHandlers';
import { usePlaceDetailsEffect } from '../hooks/usePlaceDetailsEffect';
import MapControls from './MapControls';
import BarikoiAttribution from './BarikoiAttribution';
import MapLayerSwitcher from './MapLayerSwitcher';
import { AnimatePresence } from 'framer-motion';
import InfoCard from '../InfoCard/InfoCard';

import {
  setMapLoaded,
  setMapStyle,
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
import MapillaryLayer from '../Mapillary/MapillaryLayer';
import RouteLayer from '../Layers/RouteLayer';
import RouteMarkers from '../Markers/RouteMarkers';

const MapContainer: React.FC = () => {
  const mapRef = useMapRef();
  const dispatch = useAppDispatch();
  const { isLeftBarOpen } = useAppSelector((state) => state.drawer);
  const { placeDetails, nearbyPlaces } = useAppSelector(
    (state) => state.search
  );
  const { markerCoords, viewport, mapStyle, showDirections } = useAppSelector(
    (state) => state.map
  );
  const { route, origin, destination } = useAppSelector(
    (state) => state.directions
  );
  const selectedCategories = useAppSelector(
    (state) => state.search.selectedCategories
  );
  const isMapillaryVisible = useAppSelector(
    (state) => state.mapillary.isVisible
  );
  const showNearbyResults = selectedCategories.length > 0;

  // Local state for current map style url
  const [currentMapStyle, setCurrentMapStyle] = useState(
    mapStyle || '/map-styles/light-style.json'
  );

  // Handle map style change
  const handleMapStyleChange = useCallback(
    (styleUrl: string) => {
      setCurrentMapStyle(styleUrl);
      dispatch(setMapStyle(styleUrl));
    },
    [dispatch]
  );

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

    // Access the actual maplibre-gl map instance
    if (mapRef.current) {
      const map = mapRef.current;

      // Also update viewport on initial load
      const { lng: longitude, lat: latitude } = map.getCenter();
      dispatch(
        setViewport({
          longitude,
          latitude,
          zoom: map.getZoom(),
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

  // Add this helper function for nearby places
  const fitMarkersInView = React.useCallback(() => {
    if (!mapRef.current || !nearbyPlaces.length) return;

    const bounds = new LngLatBounds();

    // Extend bounds to include all nearby places
    nearbyPlaces.forEach((place) => {
      bounds.extend([parseFloat(place.longitude), parseFloat(place.latitude)]);
    });

    // Add some padding to the bounds
    mapRef.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 16,
      duration: 1000,
    });
  }, [nearbyPlaces, mapRef]);

  // Add helper function for route bounds
  const fitRouteBoundsInView = React.useCallback(() => {
    if (!mapRef.current || !route?.bbox || !origin || !destination) return;

    // If we have route bounding box, use that
    if (route.bbox && route.bbox.length === 4) {
      const [west, south, east, north] = route.bbox;

      // Make sure all values are defined before creating bounds
      if (
        typeof west === 'number' &&
        typeof south === 'number' &&
        typeof east === 'number' &&
        typeof north === 'number'
      ) {
        const bounds = new LngLatBounds([west, south], [east, north]);

        mapRef.current.fitBounds(bounds, {
          padding: 80,
          maxZoom: 16,
          duration: 1000,
        });
      }
    }
    // Otherwise fit to just origin and destination
    else if (origin && destination) {
      const bounds = new LngLatBounds();
      bounds.extend([origin.longitude, origin.latitude]);
      bounds.extend([destination.longitude, destination.latitude]);

      mapRef.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 16,
        duration: 1000,
      });
    }
  }, [route, origin, destination, mapRef]);

  // Add useEffect to trigger bounds fitting when nearby places change
  React.useEffect(() => {
    if (showNearbyResults && nearbyPlaces.length > 0) {
      fitMarkersInView();
    }
  }, [showNearbyResults, nearbyPlaces, fitMarkersInView]);

  // Add useEffect to fit route bounds when route changes
  React.useEffect(() => {
    if (showDirections && route) {
      fitRouteBoundsInView();
    }
  }, [showDirections, route, fitRouteBoundsInView]);

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
          mapStyle={currentMapStyle || '/map-styles/light-style.json'}
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
            'mapillary-images',
            'mapillary-sequences',
          ]}
          cursor={hoveredFeatureId ? 'pointer' : 'default'}
          hash={true}
        >
          <MapControls />
          <BarikoiAttribution />
          {isLeftBarOpen && !isMapillaryVisible && <ResponsiveDrawer />}

          {/* Display directions route and markers */}
          {showDirections && !isMapillaryVisible && (
            <>
              <RouteLayer />
              <RouteMarkers />
            </>
          )}

          {/* Display regular marker if we have coordinates and not in directions or nearby mode */}
          {!showNearbyResults &&
            !showDirections &&
            markerCoords &&
            !isMapillaryVisible && (
              <AnimatedMarker
                latitude={markerCoords.latitude}
                longitude={markerCoords.longitude}
                properties={markerCoords.properties}
              />
            )}

          {/* Add nearby search center marker and results */}
          {showNearbyResults && !isMapillaryVisible && (
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
          {contextMenu.visible && contextMenu.lngLat && !isMapillaryVisible && (
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
          {/* Updated MapillaryLayer - no props needed */}
          <MapillaryLayer />

          {/* Add the Map Layer Switcher */}

          <MapLayerSwitcher
            onStyleChange={handleMapStyleChange}
            currentStyleUrl={currentMapStyle}
          />
        </MapGL>

        {!isMapillaryVisible && (
          <AnimatePresence>
            {selectedFeature && !selectedFeature.properties?.place_code && (
              <InfoCard
                feature={selectedFeature}
                onClose={handleCloseInfoCard}
              />
            )}
          </AnimatePresence>
        )}

        {/* Details modal */}
        {!isMapillaryVisible && (
          <AnimatePresence>
            {showDetailsModal && selectedNearbyPlace && (
              <NearbyPlaceModal
                place={selectedNearbyPlace}
                onClose={handleCloseModal}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default MapContainer;
