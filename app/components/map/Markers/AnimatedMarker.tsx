import React, { useState, useEffect } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedMarkerProps {
  latitude: number;
  longitude: number;
  properties?: {
    place_code?: string;
    name_en?: string;
    name_bn?: string;
    type?: string;
    subtype?: string;
  };
  pulseDelay?: number;
}

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  latitude,
  longitude,
  pulseDelay = 5000,
}) => {
  console.log('🚀 ~ longitude:', longitude);
  console.log('🚀 ~ latitude:', latitude);
  const [shouldPulse, setShouldPulse] = useState(false);

  const transition = {
    duration: 1,
    repeat: shouldPulse ? Infinity : 0,
    repeatDelay: 4,
    ease: 'easeInOut',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPulse(true);
    }, pulseDelay);

    return () => clearTimeout(timer);
  }, [pulseDelay]);

  return (
    <Marker latitude={latitude} longitude={longitude} anchor='bottom'>
      <div className='relative'>
        {/* Enhanced Shadow Element */}
        <motion.div
          className='absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/60 rounded-full blur-md'
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: shouldPulse ? [1, 1.2, 1] : 1,
            opacity: shouldPulse ? [0.4, 0.3, 0.4] : 0.4,
          }}
          transition={transition}
        />

        {/* New Tail Shadow */}
        <motion.div
          className='absolute -bottom-1 left-[33%] -translate-x-1/2 w-4 h-4 bg-black/80 rounded-full'
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: shouldPulse ? [1, 1.2, 1] : 1,
            opacity: shouldPulse ? [0.6, 0.3, 0.6] : 0.6,
          }}
          transition={transition}
        />

        {/* Marker Element */}
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{
            scale: shouldPulse ? [1, 1.4, 1] : 1,
            y: 0,
          }}
          transition={transition}
          className='relative w-12 h-12'
        >
          <Image
            src='/images/barikoi-marker.svg'
            alt='Location Marker'
            width={48}
            height={48}
            className='w-full h-full object-contain'
            priority
          />
        </motion.div>
      </div>
    </Marker>
  );
};

export default React.memo(AnimatedMarker);
