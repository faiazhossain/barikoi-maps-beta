import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { FaSearchLocation } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface NearbySearchMarkerProps {
  latitude: number;
  longitude: number;
  categories: string[];
}

const NearbySearchMarker: React.FC<NearbySearchMarkerProps> = ({
  latitude,
  longitude,
  categories,
}) => {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor='bottom'>
      <div className='flex flex-col items-center'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-blue-600 text-white px-2 py-1 rounded-lg text-xs mb-1 shadow-md whitespace-nowrap'
        >
          Nearby: {categories.join(', ')}
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaSearchLocation className='text-3xl text-blue-600 drop-shadow-lg' />
        </motion.div>
        <motion.div
          className='absolute w-24 h-24 rounded-full border-2 border-blue-400 opacity-30'
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 2,
          }}
        />
      </div>
    </Marker>
  );
};

export default NearbySearchMarker;
