import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useAppSelector } from '@/app/store/store';
import { useMap } from 'react-map-gl/maplibre';
import { MapillaryFeature, MAPILLARY_TILE_URL } from './MapillaryUtils';
import MapillaryHoverPopup from './MapillaryHoverPopup';
import MapillarySelectedPopup from './MapillarySelectedPopup';
import MapillaryToggleButton from './MapillaryToggleButton';

const MapillaryLayer: React.FC = () => {
  const isVisible = useAppSelector((state) => state.mapillary.isVisible);
  const { current: map } = useMap();
  const mapillaryLayersAdded = useRef(false);

  // State for hovering and selection
  const [hoveredFeature, setHoveredFeature] = useState<MapillaryFeature | null>(
    null
  );
  const [selectedFeature, setSelectedFeature] =
    useState<MapillaryFeature | null>(null);

  // Handle mouse events for mapillary features
  const handleMouseEnter = useCallback(
    (e: any) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const layerId = feature.layer.id;

      // Only show hover effect for image points, not sequences
      if (layerId === 'mapillary-images' && !selectedFeature) {
        setHoveredFeature({
          type: 'image',
          coordinates: feature.geometry.coordinates,
          properties: feature.properties,
        });
        e.target.getCanvas().style.cursor = 'pointer';
      }
    },
    [selectedFeature]
  );

  const handleMouseLeave = useCallback(
    (e: any) => {
      if (!selectedFeature) {
        setHoveredFeature(null);
        e.target.getCanvas().style.cursor = '';
      }
    },
    [selectedFeature]
  );

  // Handle click on mapillary images
  const handleClick = useCallback(
    (e: any) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const layerId = feature.layer.id;

      if (layerId === 'mapillary-images') {
        // Set the selected feature, which will keep the popup open
        setSelectedFeature({
          type: 'image',
          coordinates: feature.geometry.coordinates,
          properties: feature.properties,
        });
        // Clear the hover state to avoid duplicates
        setHoveredFeature(null);
      } else if (
        !e.features.some((f) => f.layer.id === 'mapillary-images') &&
        selectedFeature
      ) {
        // If clicking elsewhere on the map (and not on another Mapillary image), clear selection
        setSelectedFeature(null);
      }
    },
    [selectedFeature]
  );

  // Clear selected feature
  const handleClosePopup = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  // Setup and cleanup map event listeners when visibility changes
  useEffect(() => {
    if (!map) return;

    if (isVisible) {
      // Add event listeners when the layer becomes visible
      map.on('mousemove', 'mapillary-images', handleMouseEnter);
      map.on('mouseleave', 'mapillary-images', handleMouseLeave);
      map.on('click', 'mapillary-images', handleClick);
      map.on('click', handleClick); // To detect clicks outside mapillary features

      // Set the layers as added
      mapillaryLayersAdded.current = true;
    }

    // Cleanup function to remove event listeners
    return () => {
      if (mapillaryLayersAdded.current) {
        map.off('mousemove', 'mapillary-images', handleMouseEnter);
        map.off('mouseleave', 'mapillary-images', handleMouseLeave);
        map.off('click', 'mapillary-images', handleClick);
        map.off('click', handleClick);
      }
    };
  }, [map, isVisible, handleMouseEnter, handleMouseLeave, handleClick]);

  return (
    <>
      {isVisible && (
        <Source
          id='mapillary'
          type='vector'
          tiles={[MAPILLARY_TILE_URL]}
          minzoom={6}
          maxzoom={14}
        >
          {/* Sequence lines */}
          <Layer
            id='mapillary-sequences'
            type='line'
            source='mapillary'
            source-layer='sequence'
            paint={{
              'line-color': '#05CB63',
              'line-width': 2,
              'line-opacity': 0.8,
            }}
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
          />

          {/* Image points with clear distinguishable styling - NO ARROW */}
          <Layer
            id='mapillary-images'
            type='circle'
            source='mapillary'
            source-layer='image'
            paint={{
              'circle-color': [
                'case',
                [
                  'boolean',
                  ['==', ['get', 'id'], selectedFeature?.properties?.id || ''],
                  false,
                ],
                '#FF8C00', // Orange for selected
                '#034748', // Green for normal state
              ],
              'circle-radius': [
                'case',
                [
                  'boolean',
                  ['==', ['get', 'id'], selectedFeature?.properties?.id || ''],
                  false,
                ],
                10, // Larger radius for selected
                6, // Default radius
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
              'circle-pitch-alignment': 'map',
            }}
          />

          {/* Removed the direction indicator arrow layer */}
        </Source>
      )}

      {/* Popup for hovering over Mapillary image points */}
      {isVisible &&
        hoveredFeature &&
        hoveredFeature.type === 'image' &&
        !selectedFeature && <MapillaryHoverPopup feature={hoveredFeature} />}

      {/* Popup for selected Mapillary image points */}
      {isVisible && selectedFeature && (
        <MapillarySelectedPopup
          feature={selectedFeature}
          onClose={handleClosePopup}
        />
      )}

      {/* Toggle button for Mapillary layer */}
      <MapillaryToggleButton />
    </>
  );
};

// Removed the AddMapImages component that was adding arrow images to the map

export default MapillaryLayer;
