'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  FaCar,
  FaMotorcycle,
  FaBiking,
  FaChevronDown,
  FaChevronUp,
  FaRoute,
  FaTimes,
  FaRegDotCircle,
} from 'react-icons/fa';
import { VscKebabVertical } from 'react-icons/vsc';
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
  clearDirections,
} from '@/app/store/slices/directionsSlice';
import { toggleDirections } from '@/app/store/slices/mapSlice';
import { setSearchMode } from '@/app/store/slices/searchSlice';

// Custom components
import DirectionsSearchInput from '../DirectionsSearchInput/DirectionsSearchInput';

// Styles
import './styles.css';
import { MdLocationPin, MdMyLocation, MdOutlineSwapVert } from 'react-icons/md';

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
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  // Get current location function
  const getCurrentLocation = () => {
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
          setIsUsingCurrentLocation(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsUsingCurrentLocation(false);
        }
      );
    }
  };

  // Handle swap button
  const handleSwap = () => {
    dispatch(swapLocations());

    // Reset current location state if we swap
    if (isUsingCurrentLocation) {
      setIsUsingCurrentLocation(false);
    }

    // Recalculate route after swapping if both origin and destination exist
    const swappedOrigin = destination;
    const swappedDestination = origin;

    if (swappedOrigin && swappedDestination) {
      dispatch(
        fetchRoute({
          origin: swappedOrigin,
          destination: swappedDestination,
          mode: transportMode,
        })
      );
    }
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
      className={`directions-panel transition-all duration-300 bg-white rounded-lg shadow-lg min-w-[390px]`}
    >
      {/* Header with transport modes */}
      <div className='panel-header rounded-t-lg border-b border-gray-100'>
        <div className='transport-modes flex justify-around w-full items-center py-2'>
          <div className='transport-mode-container p-1 bg-white rounded-full shadow-sm w-full !justify-evenly space-x-1'>
            <Button
              type={transportMode === 'car' ? 'primary' : 'default'}
              shape='circle'
              icon={<FaCar className='text-xl' />}
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
              icon={<FaMotorcycle className='text-xl' />}
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
              icon={<FaBiking className='text-xl' />}
              onClick={() =>
                handleTransportModeChange({ target: { value: 'bike' } })
              }
              className={`mode-btn ${
                transportMode === 'bike' ? 'active-mode' : ''
              }`}
            />
          </div>
          <Button
            type='text'
            icon={<FaTimes />}
            onClick={() => {
              dispatch(clearDirections());
              dispatch(toggleDirections());
              dispatch(setSearchMode('search'));
            }}
            className='close-btn text-gray-400 hover:text-primary'
          />
        </div>
      </div>

      {!minimized && (
        <div className='panel-content p-3'>
          <div className='search-inputs relative gap-4'>
            {/* From input with location button */}
            <div className='flex items-center mb-2'>
              <FaRegDotCircle className='mr-2 text-xl' />
              <div className='flex-1 pr-6'>
                <DirectionsSearchInput
                  value={originSearch}
                  placeholder='Enter start location'
                  onChange={(value) => {
                    dispatch(setOriginSearch(value));
                    if (isUsingCurrentLocation) {
                      setIsUsingCurrentLocation(false);
                    }
                  }}
                  onLocationSelect={(location) => {
                    dispatch(setOrigin(location));
                    setIsUsingCurrentLocation(false);
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
                  className='origin-input text-sm'
                />
              </div>
            </div>
            <VscKebabVertical className='!absolute left-[2px] top-1/2 transform -translate-y-1/2 !text-xl hover:text-green-600 cursor-pointer z-10' />
            <MdOutlineSwapVert
              onClick={handleSwap}
              className='swap-btn !absolute -right-2 top-1/2 transform -translate-y-1/2 hover:text-green-600 cursor-pointer z-10 rounded-full w-8 h-8 flex items-center justify-center p-0 outline-none'
            />
            {/* To input */}
            <div className='flex items-center'>
              <MdLocationPin className='mr-2 text-2xl' />
              <div className='flex-1 pr-6'>
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
                  className='destination-input text-sm'
                />
              </div>
            </div>
          </div>

          {/* Route information */}
          {renderRouteInfo()}

          {/* Attribution */}
          <div className='attribution mt-2 text-right'>
            <div
              rel='noopener noreferrer'
              className='flex items-center justify-between text-gray-400 hover:text-primary transition-colors text-xs'
            >
              <div
                className={`flex items-center gap-2 rounded-md cursor-pointer transition-all duration-200
                  `}
                onClick={getCurrentLocation}
              >
                <Button
                  type={isUsingCurrentLocation ? 'primary' : 'default'}
                  shape='circle'
                  size='small'
                  icon={
                    <MdMyLocation
                      className={`text-lg ${
                        isUsingCurrentLocation ? 'text-white' : ''
                      }`}
                    />
                  }
                  className={`shadow-sm ${
                    isUsingCurrentLocation ? 'bg-primary' : 'bg-white'
                  }`}
                />
                <p
                  className={`text-sm ${
                    isUsingCurrentLocation ? 'text-primary' : 'text-black'
                  } font-medium`}
                >
                  {isUsingCurrentLocation
                    ? 'Using current location'
                    : 'Use current location'}
                </p>
              </div>
              <a
                href='https://docs.barikoi.com/api#tag/v2.0/operation/route_with_routing_algorithm'
                target='_blank'
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
        </div>
      )}

      {/* Minimize button */}
      <div className='minimize-control flex justify-center border-t border-gray-100'>
        <Button
          type='text'
          icon={minimized ? <FaChevronDown /> : <FaChevronUp />}
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
