'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { useAppSelector } from '@/app/store/store';

const RouteMarkers: React.FC = () => {
  const { origin, destination } = useAppSelector((state) => state.directions);

  return (
    <>
      {origin && (
        <Marker
          longitude={origin.longitude}
          latitude={origin.latitude}
          anchor='bottom'
        >
          <div className='w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full p-1 shadow-lg'>
            A
          </div>
        </Marker>
      )}

      {destination && (
        <Marker
          longitude={destination.longitude}
          latitude={destination.latitude}
          anchor='bottom'
        >
          <div className='w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded-full p-1 shadow-lg'>
            B
          </div>
        </Marker>
      )}
    </>
  );
};

export default RouteMarkers;
