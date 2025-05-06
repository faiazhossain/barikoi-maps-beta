import React from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { FaStreetView } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { toggleMapillaryLayer } from '@/app/store/slices/mapillarySlice';

// Replace direct URL with our proxy
const MAPILLARY_TILE_URL = '/api/mapillary?z={z}&x={x}&y={y}';

const MapillaryLayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((state) => state.mapillary.isVisible);
  const isLargeScreen = useAppSelector((state) => state.ui.isLargeScreen);

  const handleToggle = () => {
    dispatch(toggleMapillaryLayer());
  };

  return (
    <>
      {isVisible && (
        <Source
          id='mapillary'
          type='vector'
          tiles={[MAPILLARY_TILE_URL]}
          minzoom={0} // Allow all zoom levels
          maxzoom={22}
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
              'circle-color': '#05CB63',
              'circle-radius': 4,
            }}
          />
        </Source>
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
