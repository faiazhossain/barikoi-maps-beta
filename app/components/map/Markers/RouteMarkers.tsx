'use client';

import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { useAppSelector } from '@/app/store/store';
import { FaDotCircle } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import { useMap } from 'react-map-gl/maplibre';

const RouteMarkers: React.FC = () => {
  const { origin, destination } = useAppSelector((state) => state.directions);
  const { current: map } = useMap();

  // Store previous values to detect changes
  const prevOriginRef = useRef<{ latitude: number; longitude: number } | null>(
    null
  );
  const prevDestinationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (!map) return;

    // Only fly to origin if it's new and destination doesn't exist
    if (
      origin &&
      (!prevOriginRef.current ||
        prevOriginRef.current.latitude !== origin.latitude ||
        prevOriginRef.current.longitude !== origin.longitude)
    ) {
      // Only fly if there's no destination yet
      if (!destination) {
        map.flyTo({
          center: [origin.longitude, origin.latitude],
          zoom: 14,
          essential: true,
          duration: 1000,
        });
      }

      // Update the previous value
      prevOriginRef.current = {
        latitude: origin.latitude,
        longitude: origin.longitude,
      };
    }
  }, [origin, destination, map]);

  useEffect(() => {
    if (!map) return;

    // Only fly to destination if it's new and origin doesn't exist
    if (
      destination &&
      (!prevDestinationRef.current ||
        prevDestinationRef.current.latitude !== destination.latitude ||
        prevDestinationRef.current.longitude !== destination.longitude)
    ) {
      // Only fly if there's no origin yet
      if (!origin) {
        map.flyTo({
          center: [destination.longitude, destination.latitude],
          zoom: 14,
          essential: true,
          duration: 1000,
        });
      }

      // Update the previous value
      prevDestinationRef.current = {
        latitude: destination.latitude,
        longitude: destination.longitude,
      };
    }
  }, [destination, origin, map]);

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
