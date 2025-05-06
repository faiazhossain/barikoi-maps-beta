import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Source, Layer, Popup } from 'react-map-gl/maplibre';
import { FaStreetView, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { toggleMapillaryLayer } from '@/app/store/slices/mapillarySlice';
import { useMap } from 'react-map-gl/maplibre';

const MAPILLARY_TILE_URL =
  'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8';

interface MapillaryFeature {
  type: 'image' | 'sequence';
  coordinates: [number, number];
  properties: any;
}

const MapillaryLayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((state) => state.mapillary.isVisible);
  const isLargeScreen = useAppSelector((state) => state.ui.isLargeScreen);
  const { current: map } = useMap();
  const mapillaryLayersAdded = useRef(false);

  // State for hovering, selection and popup
  const [hoveredFeature, setHoveredFeature] = useState<MapillaryFeature | null>(
    null
  );
  const [selectedFeature, setSelectedFeature] =
    useState<MapillaryFeature | null>(null);

  const handleToggle = () => {
    dispatch(toggleMapillaryLayer());
  };

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

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
          <Layer
            id='mapillary-sequences'
            type='line'
            source='mapillary'
            source-layer='sequence'
            paint={{
              'line-color': '#05CB63',
              'line-width': 2,
            }}
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
          />
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
                '#FF8C00', // Highlighted orange color for selected point
                '#05CB63', // Default green color
              ],
              'circle-radius': [
                'case',
                [
                  'boolean',
                  ['==', ['get', 'id'], selectedFeature?.properties?.id || ''],
                  false,
                ],
                12, // Larger size for selected point
                8, // Default size
              ],
              'circle-stroke-width': [
                'case',
                [
                  'boolean',
                  ['==', ['get', 'id'], selectedFeature?.properties?.id || ''],
                  false,
                ],
                3, // Add stroke for selected point
                0, // No stroke by default
              ],
              'circle-stroke-color': '#FFFFFF',
            }}
          />
        </Source>
      )}

      {/* Popup for hovering over Mapillary image points */}
      {isVisible &&
        hoveredFeature &&
        hoveredFeature.type === 'image' &&
        !selectedFeature && (
          <Popup
            longitude={hoveredFeature.coordinates[0]}
            latitude={hoveredFeature.coordinates[1]}
            closeButton={false}
            closeOnClick={false}
            className='mapillary-popup'
            offset={[0, -5]}
            anchor='bottom'
          >
            <div className='p-2 bg-white rounded shadow-md max-w-xs'>
              <div className='flex items-center mb-1.5 border-b pb-1.5 border-gray-100'>
                <FaImage className='text-green-600 mr-2' />
                <span className='font-medium text-sm'>Mapillary Image</span>
              </div>
              <div className='text-xs space-y-1.5'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Captured:</span>
                  <span>
                    {formatDate(hoveredFeature.properties.captured_at)}
                  </span>
                </div>
                {hoveredFeature.properties.compass_angle && (
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Direction:</span>
                    <span>
                      {Math.round(hoveredFeature.properties.compass_angle)}°
                    </span>
                  </div>
                )}
                <div className='mt-2'>
                  <a
                    href={`https://www.mapillary.com/app/?focus=photo&pKey=${hoveredFeature.properties.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 inline-block w-full text-center mt-1'
                  >
                    View on Mapillary
                  </a>
                </div>
              </div>
            </div>
          </Popup>
        )}

      {/* Popup for selected Mapillary image points */}
      {isVisible && selectedFeature && (
        <Popup
          longitude={selectedFeature.coordinates[0]}
          latitude={selectedFeature.coordinates[1]}
          closeButton={true}
          closeOnClick={false}
          className='mapillary-popup-selected'
          offset={[0, -5]}
          anchor='bottom'
          onClose={handleClosePopup}
        >
          <div className='p-2 bg-white rounded shadow-md max-w-xs'>
            <div className='flex items-center justify-between mb-1.5 border-b pb-1.5 border-gray-100'>
              <div className='flex items-center'>
                <FaImage className='text-orange-500 mr-2' />
                <span className='font-medium text-sm'>Mapillary Image</span>
              </div>
            </div>
            <div className='text-xs space-y-1.5'>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Captured:</span>
                <span>
                  {formatDate(selectedFeature.properties.captured_at)}
                </span>
              </div>
              {selectedFeature.properties.compass_angle && (
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Direction:</span>
                  <span>
                    {Math.round(selectedFeature.properties.compass_angle)}°
                  </span>
                </div>
              )}
              <div className='flex justify-between'>
                <span className='text-gray-500'>Image ID:</span>
                <span className='truncate max-w-[150px]'>
                  {selectedFeature.properties.id}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Sequence:</span>
                <span className='truncate max-w-[150px]'>
                  {selectedFeature.properties.sequence_id}
                </span>
              </div>
              <div className='mt-2'>
                <a
                  href={`https://www.mapillary.com/app/?focus=photo&pKey=${selectedFeature.properties.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 inline-block w-full text-center mt-1'
                >
                  View on Mapillary
                </a>
              </div>
            </div>
          </div>
        </Popup>
      )}

      {/* Street View Button - positioned dynamically based on screen size */}
      <div
        className={`absolute z-10 ${
          isLargeScreen ? 'bottom-36' : 'bottom-16'
        } right-2`}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <motion.button
            onClick={handleToggle}
            className={`relative group flex items-center justify-center w-8 h-8 rounded-md shadow-xl ${
              isVisible
                ? 'bg-gradient-to-tr from-green-500 to-emerald-400 border-2 border-emerald-300'
                : 'bg-gray-400'
            }`}
            title='Toggle Street View'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className='absolute inset-0 rounded-md bg-white bg-opacity-30 blur-sm'></div>
            <div className='relative z-10 flex items-center justify-center w-full h-full'>
              <motion.div
                animate={{
                  rotate: isVisible ? [0, 360] : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              >
                <FaStreetView
                  className={`text-xl ${
                    isVisible ? 'text-black' : 'text-white'
                  }`}
                />
              </motion.div>
            </div>

            {/* Animated ring */}
            {isVisible && (
              <motion.div
                className='absolute inset-0 rounded-full'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 1.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeOut',
                }}
              >
                <div className='w-full h-full rounded-full border-4 border-green-400 bg-transparent'></div>
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Tooltip - only show on larger screens */}
        {isLargeScreen && (
          <motion.div
            className='absolute right-full mr-3 top-1/2 transform -translate-y-1/2 pointer-events-none'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.5 }}
          >
            <motion.div className='px-3 py-2 rounded-lg bg-black bg-opacity-80 shadow-lg'>
              <div className='text-white text-sm font-medium whitespace-nowrap'>
                {isVisible ? 'Hide Street View' : 'Show Street View'}
              </div>
              <div className='absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-black bg-opacity-80'></div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MapillaryLayer;
