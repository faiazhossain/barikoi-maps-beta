'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { useAppSelector } from '@/app/store/store';
import { FaDotCircle } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';

const RouteMarkers: React.FC = () => {
  const { origin, destination } = useAppSelector((state) => state.directions);

  return (
    <>
      {origin && (
        <Marker
          longitude={origin.longitude}
          latitude={origin.latitude}
          anchor='center'
        >
          <div className='relative'>
            {/* Animated pulse effect for origin marker */}
            <div className='absolute animate-ping rounded-full h-5 w-5 bg-blue-400 opacity-75' />
            {/* Origin marker with shadow */}
            <div className='relative rounded-full h-6 w-6 flex items-center justify-center bg-white border-2 border-blue-500 shadow-lg'>
              <FaDotCircle className='text-blue-500 text-lg' />
            </div>
          </div>
        </Marker>
      )}

      {destination && (
        <Marker
          longitude={destination.longitude}
          latitude={destination.latitude}
          anchor='bottom'
        >
          <div className='relative'>
            {/* Destination marker with prominent styling */}
            <MdLocationPin
              className='text-5xl text-green-600 transform-gpu drop-shadow-lg'
              style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}
            />
          </div>
        </Marker>
      )}
    </>
  );
};

export default RouteMarkers;
