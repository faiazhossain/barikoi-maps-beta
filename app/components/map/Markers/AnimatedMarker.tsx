import React, { useState, useEffect, useCallback } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedMarkerProps {
  latitude: number;
  longitude: number;
  pulseDelay?: number; // Make delay configurable
}

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  latitude,
  longitude,
  pulseDelay = 5000, // Default to 5 seconds
}) => {
  const [shouldPulse, setShouldPulse] = useState(false);

  // Memoize the animation variants to prevent unnecessary recalculations
  const pulseAnimation = useCallback(
    () => ({
      scale: shouldPulse ? [1, 1.2, 1] : 1,
      opacity: shouldPulse ? [0.4, 0.3, 0.4] : 0.4,
    }),
    [shouldPulse]
  );

  const rippleAnimation = useCallback(
    () => ({
      scale: shouldPulse ? [1, 1.4, 1] : 1.5,
      opacity: shouldPulse ? [0.5, 0, 0.5] : 0,
    }),
    [shouldPulse]
  );

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
          className='absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/40 rounded-full blur-md'
          initial={{ scale: 0, opacity: 0 }}
          animate={pulseAnimation()}
          transition={transition}
        />

        {/* Marker Element */}
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{
            scale: shouldPulse ? [1, 1.4, 1] : 1,
            y: 0,
          }}
          style={{
            filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 1px 3px 4px)',
          }}
          className='relative w-12 h-12'
        >
          <Image
            src='/images/barikoi-marker.svg'
            alt='Location Marker'
            width={48}
            height={48}
            className='w-full h-full object-contain'
            priority // If this is above-the-fold content
          />
          <motion.div
            className='absolute inset-0 z-[-1]'
            initial={{ scale: 1, opacity: 0.5 }}
            animate={rippleAnimation()}
            transition={transition}
          >
            <Image
              src='/images/barikoi-marker.svg'
              alt='Marker Effect'
              width={48}
              height={48}
              className='w-full h-full object-contain opacity-25'
            />
          </motion.div>
        </motion.div>
      </div>
    </Marker>
  );
};

export default React.memo(AnimatedMarker);
