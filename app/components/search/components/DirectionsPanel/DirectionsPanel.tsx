'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  FaExchangeAlt,
  FaLocationArrow,
  FaCar,
  FaMotorcycle,
  FaBiking,
  FaChevronDown,
  FaChevronUp,
  FaRoute,
  FaExpandAlt,
  FaCompressAlt,
} from 'react-icons/fa';
import { Button, Badge } from 'antd';
import Image from 'next/image';

// Redux actions
import {
  swapLocations,
  setOrigin,
  setDestination,
  setOriginSearch,
  setDestinationSearch,
  setTransportMode,
  fetchRoute,
} from '@/app/store/slices/directionsSlice';

// Custom components
import DirectionsSearchInput from '../DirectionsSearchInput/DirectionsSearchInput';

// Styles
import './styles.css';

const DirectionsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    origin,
    destination,
    originSearch,
    destinationSearch,
    transportMode,
    route,
  } = useAppSelector((state) => state.directions);
  const [userAskedLocation, setUserAskedLocation] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  // Handle location retrieval when component mounts
  useEffect(() => {
    if (!userAskedLocation) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          getCurrentLocation();
        }
      });
    }
  }, []);

  // Get current location function
  const getCurrentLocation = () => {
    setUserAskedLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(
            setOrigin({
              latitude,
              longitude,
              address: 'Current Location',
            })
          );
          dispatch(setOriginSearch('Current Location'));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Handle swap button
  const handleSwap = () => {
    dispatch(swapLocations());
  };

  // Handle transport mode change
  const handleTransportModeChange = (e: any) => {
    dispatch(setTransportMode(e.target.value));

    // If both origin and destination are set, recalculate route
    if (origin && destination) {
      dispatch(
        fetchRoute({
          origin,
          destination,
          mode: e.target.value,
        })
      );
    }
  };

  // Toggle minimized state
  const toggleMinimized = () => {
    setMinimized(!minimized);
    if (maximized) setMaximized(false);
  };

  // Toggle maximized state
  const toggleMaximized = () => {
    setMaximized(!maximized);
    if (minimized) setMinimized(false);
  };

  // Format distance and duration
  const formatDistance = (distance: number) => {
    return distance < 1000
      ? `${Math.round(distance)} m`
      : `${(distance / 1000).toFixed(1)} km`;
  };

  const formatDuration = (time: number) => {
    const minutes = Math.floor(time / 60000);
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr ${
        remainingMinutes > 0 ? `${remainingMinutes} min` : ''
      }`;
    }
  };

  // Render directions info if route exists
  const renderRouteInfo = () => {
    if (!route) return null;

    return (
      <div className='route-info p-3 mt-2 bg-white rounded-lg shadow-sm border border-gray-100'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col items-center'>
            <FaRoute className='text-primary mb-1' />
            <p className='text-xs text-gray-500 mb-1'>Distance</p>
            <p className='text-sm font-semibold'>
              {formatDistance(route.distance)}
            </p>
          </div>
          <div className='h-8 w-px bg-gray-200'></div>
          <div className='flex flex-col items-center'>
            <Badge color='blue' count={transportMode} className='mb-1' />
            <p className='text-xs text-gray-500 mb-1'>Duration</p>
            <p className='text-sm font-semibold'>
              {formatDuration(route.time)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`directions-panel transition-all duration-300 bg-white rounded-lg shadow-lg `}
    >
      {/* Header with transport modes */}
      <div className='panel-header p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-gray-100'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-center text-primary font-medium flex items-center justify-center flex-1'>
            <FaRoute className='mr-2' /> Direction Finder
          </h3>
          <Button
            type='text'
            size='small'
            icon={maximized ? <FaCompressAlt /> : <FaExpandAlt />}
            onClick={toggleMaximized}
            className='maximize-btn text-gray-400 hover:text-primary'
            title={maximized ? 'Normal size' : 'Maximize'}
          />
        </div>

        <div className='transport-modes flex justify-center'>
          <div className='transport-mode-container p-1 bg-white rounded-full shadow-sm flex space-x-1'>
            <Button
              type={transportMode === 'car' ? 'primary' : 'default'}
              shape='circle'
              icon={<FaCar />}
              onClick={() =>
                handleTransportModeChange({ target: { value: 'car' } })
              }
              className={`mode-btn ${
                transportMode === 'car' ? 'active-mode' : ''
              }`}
            />
            <Button
              type={transportMode === 'motorcycle' ? 'primary' : 'default'}
              shape='circle'
              icon={<FaMotorcycle />}
              onClick={() =>
                handleTransportModeChange({ target: { value: 'motorcycle' } })
              }
              className={`mode-btn ${
                transportMode === 'motorcycle' ? 'active-mode' : ''
              }`}
            />
            <Button
              type={transportMode === 'bike' ? 'primary' : 'default'}
              shape='circle'
              icon={<FaBiking />}
              onClick={() =>
                handleTransportModeChange({ target: { value: 'bike' } })
              }
              className={`mode-btn ${
                transportMode === 'bike' ? 'active-mode' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {!minimized && (
        <div className='panel-content p-3'>
          <div className='search-inputs relative'>
            {/* From input with location button */}
            <div className='flex items-center mb-2'>
              <div className='origin-marker mr-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-sm'>
                A
              </div>
              <div className='flex-1'>
                <DirectionsSearchInput
                  value={originSearch}
                  placeholder='Enter start location'
                  onChange={(value) => dispatch(setOriginSearch(value))}
                  onLocationSelect={(location) => {
                    dispatch(setOrigin(location));
                    // Check if we can calculate route
                    if (destination) {
                      dispatch(
                        fetchRoute({
                          origin: location,
                          destination,
                          mode: transportMode,
                        })
                      );
                    }
                  }}
                  className='origin-input'
                />
              </div>
              <Button
                type='primary'
                size='small'
                icon={<FaLocationArrow />}
                onClick={getCurrentLocation}
                className='ml-1 location-btn'
                title='Use current location'
              />
            </div>

            {/* Swap button */}
            <Button
              type='default'
              size='small'
              icon={<FaExchangeAlt />}
              onClick={handleSwap}
              className='swap-btn absolute left-3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rotate-90 bg-white shadow-md rounded-full w-6 h-6 flex items-center justify-center p-0'
            />

            {/* To input */}
            <div className='flex items-center'>
              <div className='dest-marker mr-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm'>
                B
              </div>
              <div className='flex-1'>
                <DirectionsSearchInput
                  value={destinationSearch}
                  placeholder='Enter destination'
                  onChange={(value) => dispatch(setDestinationSearch(value))}
                  onLocationSelect={(location) => {
                    dispatch(setDestination(location));
                    // Check if we can calculate route
                    if (origin) {
                      dispatch(
                        fetchRoute({
                          origin,
                          destination: location,
                          mode: transportMode,
                        })
                      );
                    }
                  }}
                  className='destination-input'
                />
              </div>
            </div>
          </div>

          {/* Route information */}
          {renderRouteInfo()}

          {/* Attribution */}
          <div className='attribution mt-2 text-right'>
            <a
              href='https://barikoi.com/directions'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-end gap-1 text-gray-400 hover:text-primary transition-colors text-xs'
            >
              <span>Directions by</span>
              <Image
                src='/images/barikoi-logo.svg'
                alt='Barikoi'
                width={34}
                height={20}
              />
            </a>
          </div>
        </div>
      )}

      {/* Minimize button */}
      <div className='minimize-control flex justify-center border-t border-gray-100'>
        <Button
          type='text'
          icon={minimized ? <FaChevronUp /> : <FaChevronDown />}
          onClick={toggleMinimized}
          className='minimize-btn text-gray-400 hover:text-primary w-full rounded-none rounded-b-lg'
        >
          {minimized ? 'Expand' : 'Minimize'}
        </Button>
      </div>
    </div>
  );
};

export default DirectionsPanel;
