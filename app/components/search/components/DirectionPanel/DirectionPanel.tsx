'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete, Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import {
  FaDirections,
  FaWalking,
  FaBicycle,
  FaCar,
  FaTimes,
} from 'react-icons/fa';
import { TbCurrentLocation } from 'react-icons/tb';
import { GiPositionMarker } from 'react-icons/gi';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import styles from './styles/DirectionPanel.module.css';
import { fetchReverseGeocode } from '@/app/store/thunks/searchThunks';
import { setSearchMode } from '@/app/store/slices/searchSlice';
import { toggleDirections } from '@/app/store/slices/mapSlice';
import {
  fetchRoute,
  setOrigin,
  setDestination,
  swapLocations,
  setOriginSearch,
  setDestinationSearch,
  clearDirections,
  setTransportMode,
} from '@/app/store/slices/directionsSlice';

interface DirectionPanelProps {
  onClose: () => void;
}

interface AutocompleteSuggestion {
  id: string;
  name: string;
  address: string;
  pType: string;
  subType: string;
  latitude: number;
  longitude: number;
  area: string;
  city: string;
  uCode: string;
}

interface AutocompleteResponse {
  places: AutocompleteSuggestion[];
  status: number;
}

const DirectionPanel: React.FC<DirectionPanelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  // Get the directions state from Redux
  const {
    origin,
    destination,
    originSearch,
    destinationSearch,
    route,
    transportMode,
  } = useAppSelector((state) => state.directions);

  // State for dropdown visibility
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  // Local state for autocomplete suggestions
  const [originSuggestions, setOriginSuggestions] = useState<
    AutocompleteSuggestion[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    AutocompleteSuggestion[]
  >([]);

  // State for search loading state
  const [originSearchLoading, setOriginSearchLoading] = useState(false);
  const [destinationSearchLoading, setDestinationSearchLoading] =
    useState(false);

  // Debounce refs
  const originSearchRef = useRef<NodeJS.Timeout | null>(null);
  const destinationSearchRef = useRef<NodeJS.Timeout | null>(null);

  // Process suggestions into autocomplete options
  const getOptionsFromSuggestions = (
    suggestions: AutocompleteSuggestion[],
    value: string
  ) => {
    const suggestionOptions = suggestions.map((suggestion) => ({
      value: suggestion.address,
      label: (
        <div className='flex flex-col p-1'>
          <span className='font-medium'>{suggestion.name}</span>
          <span className='text-xs text-gray-500'>{suggestion.address}</span>
          <span className='text-xs text-gray-400'>
            {suggestion.area}, {suggestion.city}
          </span>
        </div>
      ),
      rawData: suggestion,
    }));

    // Check if input might be coordinates
    const coords = validateCoordinates(value);
    if (coords) {
      const coordinateOption = {
        value: value,
        label: (
          <div className='flex flex-col p-1'>
            <span className='font-medium'>
              Coordinates: {coords.lat}, {coords.lng}
            </span>
            <span className='text-xs text-gray-500'>Go to this location</span>
          </div>
        ),
        rawData: {
          type: 'coordinates',
          lat: coords.lat,
          lng: coords.lng,
          originalInput: value,
        },
      };
      return [coordinateOption, ...suggestionOptions];
    }

    return suggestionOptions;
  };

  // Validate coordinates
  const validateCoordinates = (input: string) => {
    const parts = input.split(',');
    if (parts.length !== 2) return null;

    const [first, second] = parts.map((coord) => coord?.trim());
    if (!first || !second) return null;

    const firstNum = parseFloat(first);
    const secondNum = parseFloat(second);

    if (isNaN(firstNum) || isNaN(secondNum)) return null;

    // Check both possible orders: lat,lng and lng,lat
    if (
      firstNum >= -90 &&
      firstNum <= 90 &&
      secondNum >= -180 &&
      secondNum <= 180
    ) {
      return { lat: firstNum, lng: secondNum };
    }

    if (
      firstNum >= -180 &&
      firstNum <= 180 &&
      secondNum >= -90 &&
      secondNum <= 90
    ) {
      return { lat: secondNum, lng: firstNum };
    }

    return null;
  };

  // Handle searching for places
  const handleSearch = async (
    value: string,
    type: 'origin' | 'destination'
  ) => {
    if (!value.trim()) {
      // Clear suggestions if search term is empty
      if (type === 'origin') {
        setOriginSuggestions([]);
        dispatch(setOriginSearch(''));
      } else {
        setDestinationSuggestions([]);
        dispatch(setDestinationSearch(''));
      }
      return;
    }

    // Update the respective search term in Redux
    if (type === 'origin') {
      dispatch(setOriginSearch(value));
      setOriginSearchLoading(true);
    } else {
      dispatch(setDestinationSearch(value));
      setDestinationSearchLoading(true);
    }

    try {
      // Call the autocomplete API
      const response = await fetch(
        `/api/autocomplete?query=${encodeURIComponent(value)}`
      );
      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data: AutocompleteResponse = await response.json();

      if (data.places && Array.isArray(data.places)) {
        // Set suggestions based on type
        if (type === 'origin') {
          setOriginSuggestions(data.places);
          setOriginSearchLoading(false);
        } else {
          setDestinationSuggestions(data.places);
          setDestinationSearchLoading(false);
        }
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      // Reset loading state
      if (type === 'origin') {
        setOriginSearchLoading(false);
      } else {
        setDestinationSearchLoading(false);
      }
    }
  };

  // Handle location selection
  const handleSelect = (
    value: string,
    option: any,
    type: 'origin' | 'destination'
  ) => {
    const selectedData = option.rawData;

    if (selectedData) {
      // Handle coordinates selection
      if (selectedData.type === 'coordinates') {
        handleCoordinateSelect(selectedData.lat, selectedData.lng, type);
        return;
      }

      // Handle regular place selection
      const location = {
        latitude: selectedData.latitude,
        longitude: selectedData.longitude,
        address: selectedData.address,
        placeCode: selectedData.uCode,
      };

      if (type === 'origin') {
        dispatch(setOrigin(location));
        dispatch(setOriginSearch(selectedData.address));
        setFromDropdownOpen(false);
      } else {
        dispatch(setDestination(location));
        dispatch(setDestinationSearch(selectedData.address));
        setToDropdownOpen(false);
      }

      // If we have both origin and destination, calculate the route
      if (
        (type === 'origin' && destination) ||
        (type === 'destination' && origin)
      ) {
        calculateRoute();
      }
    }
  };

  // Handle coordinate input
  const handleCoordinateSelect = async (
    lat: number,
    lng: number,
    type: 'origin' | 'destination'
  ) => {
    try {
      // Do reverse geocoding to get the address
      const response = await dispatch(
        fetchReverseGeocode({
          latitude: lat,
          longitude: lng,
        })
      ).unwrap();

      const location = {
        latitude: lat,
        longitude: lng,
        address: response.address || `${lat}, ${lng}`,
        placeCode: response.uCode || response.place_code,
      };

      if (type === 'origin') {
        dispatch(setOrigin(location));
        dispatch(setOriginSearch(location.address));
      } else {
        dispatch(setDestination(location));
        dispatch(setDestinationSearch(location.address));
      }

      // If we have both origin and destination, calculate the route
      if (
        (type === 'origin' && destination) ||
        (type === 'destination' && origin)
      ) {
        calculateRoute();
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  // Calculate route
  const calculateRoute = () => {
    if (origin && destination) {
      dispatch(fetchRoute({ origin, destination, mode: transportMode }));
    }
  };

  // Handle keyboard input
  const handleKeyDown = async (
    e: React.KeyboardEvent,
    type: 'origin' | 'destination',
    value: string
  ) => {
    if (e.key === 'Enter') {
      // Process coordinates
      const coords = validateCoordinates(value);
      if (coords) {
        handleCoordinateSelect(coords.lat, coords.lng, type);
        return;
      }

      // Direct search via rupantor if not coordinates
      if (value.trim()) {
        try {
          // Use Rupantor API to convert search text to a location
          const formData = new FormData();
          formData.append('q', value);

          const response = await fetch('/api/rupantor', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
          }

          const responseData = await response.json();
          const uCode = responseData.geocoded_address?.uCode;

          if (!uCode) {
            console.warn('No uCode found in rupantor response');
            return;
          }

          // Fetch additional details about the place
          const placeResponse = await fetch(`/api/place/${uCode}`);
          if (!placeResponse.ok) {
            throw new Error(
              `Place request failed with status: ${placeResponse.status}`
            );
          }

          const placeData = await placeResponse.json();

          // Create location object from the response
          const location = {
            latitude:
              placeData.latitude || responseData.geocoded_address?.latitude,
            longitude:
              placeData.longitude || responseData.geocoded_address?.longitude,
            address:
              placeData.address ||
              responseData.geocoded_address?.address ||
              value,
            placeCode: uCode,
          };

          // Set the location based on type
          if (type === 'origin') {
            dispatch(setOrigin(location));
            dispatch(setOriginSearch(location.address));
            setFromDropdownOpen(false);
          } else {
            dispatch(setDestination(location));
            dispatch(setDestinationSearch(location.address));
            setToDropdownOpen(false);
          }

          // Calculate route if both origin and destination are set
          if (
            (type === 'origin' && destination) ||
            (type === 'destination' && origin)
          ) {
            calculateRoute();
          }
        } catch (error) {
          console.error('Error in rupantor search:', error);
        }
      }
    }
  };

  // Swap origin and destination
  const handleSwapLocations = () => {
    dispatch(swapLocations());
    if (origin && destination) {
      calculateRoute();
    }
  };

  // Clear the directions and go back to regular search
  const handleCloseDirections = () => {
    dispatch(clearDirections());
    dispatch(toggleDirections());
    dispatch(setSearchMode('search'));
    onClose();
  };

  // Filter suggestions based on typing
  const handleOptionFilterProp = (inputValue: string, option: any) => {
    return option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
  };

  // Format route distance in a user-friendly way
  const formatDistance = (distanceInMeters: number) => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(2)} km`;
    }
  };

  // Format route time in a user-friendly way (converts from milliseconds)
  const formatTime = (timeInMilliseconds: number) => {
    const totalMinutes = Math.round(timeInMilliseconds / 60000);
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours} hr ${minutes} min`;
    }
  };

  // Debounce search for origin
  useEffect(() => {
    if (originSearch && originSearch.trim().length > 0) {
      if (originSearchRef.current) {
        clearTimeout(originSearchRef.current);
      }
      setOriginSearchLoading(true);
      originSearchRef.current = setTimeout(() => {
        handleSearch(originSearch, 'origin');
      }, 300);
    } else {
      setOriginSuggestions([]);
      setOriginSearchLoading(false);
    }

    return () => {
      if (originSearchRef.current) {
        clearTimeout(originSearchRef.current);
      }
    };
  }, [originSearch]);

  // Debounce search for destination
  useEffect(() => {
    if (destinationSearch && destinationSearch.trim().length > 0) {
      if (destinationSearchRef.current) {
        clearTimeout(destinationSearchRef.current);
      }
      setDestinationSearchLoading(true);
      destinationSearchRef.current = setTimeout(() => {
        handleSearch(destinationSearch, 'destination');
      }, 300);
    } else {
      setDestinationSuggestions([]);
      setDestinationSearchLoading(false);
    }

    return () => {
      if (destinationSearchRef.current) {
        clearTimeout(destinationSearchRef.current);
      }
    };
  }, [destinationSearch]);

  return (
    <div className='p-3 bg-white rounded-lg shadow-md direction-panel'>
      <div className='flex justify-between items-center mb-2'>
        <h3 className='text-lg font-medium flex items-center'>
          <FaDirections className='mr-2 text-blue-600' />
          Directions
        </h3>
        <button
          onClick={handleCloseDirections}
          className='p-1 hover:bg-gray-100 rounded-full transition-colors'
          aria-label='Close directions'
        >
          <FaTimes className='text-gray-600' />
        </button>
      </div>

      <div className='flex mb-1 space-x-2'>
        <div className='flex-1'>
          <div className='mb-3 relative flex'>
            <div className='absolute left-1 top-2.5 z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full'>
              <TbCurrentLocation className='text-blue-600' size={16} />
            </div>
            <AutoComplete
              value={originSearch}
              className={styles.autocompleteInput}
              placeholder='Choose starting point'
              onSelect={(value, option) =>
                handleSelect(value, option, 'origin')
              }
              onChange={(value) => {
                dispatch(setOriginSearch(value));
                // Ensure dropdown stays open while typing
                if (value && value.length > 0) {
                  setFromDropdownOpen(true);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, 'origin', originSearch)}
              options={getOptionsFromSuggestions(
                originSuggestions,
                originSearch
              )}
              open={
                fromDropdownOpen &&
                (originSuggestions.length > 0 ||
                  originSearchLoading ||
                  !!validateCoordinates(originSearch))
              }
              onDropdownVisibleChange={(open) => {
                // Keep dropdown open if we have suggestions, are loading, or have coordinate input
                if (
                  !open ||
                  (!originSuggestions.length &&
                    !originSearchLoading &&
                    !validateCoordinates(originSearch))
                ) {
                  setFromDropdownOpen(false);
                } else {
                  setFromDropdownOpen(true);
                }
              }}
              popupClassName={styles.autocompleteDropdown}
              popupMatchSelectWidth={true}
              size='large'
              allowClear
              suffixIcon={
                originSearchLoading ? (
                  <span className='anticon anticon-loading anticon-spin' />
                ) : null
              }
              filterOption={handleOptionFilterProp}
            />
          </div>

          <div className='relative flex'>
            <div className='absolute left-1 top-2.5 z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full'>
              <GiPositionMarker className='text-green-700' size={16} />
            </div>
            <AutoComplete
              value={destinationSearch}
              className={styles.autocompleteInput}
              placeholder='Choose destination'
              onSelect={(value, option) =>
                handleSelect(value, option, 'destination')
              }
              onChange={(value) => {
                dispatch(setDestinationSearch(value));
                // Ensure dropdown stays open while typing
                if (value && value.length > 0) {
                  setToDropdownOpen(true);
                }
              }}
              onKeyDown={(e) =>
                handleKeyDown(e, 'destination', destinationSearch)
              }
              options={getOptionsFromSuggestions(
                destinationSuggestions,
                destinationSearch
              )}
              open={
                toDropdownOpen &&
                (destinationSuggestions.length > 0 ||
                  destinationSearchLoading ||
                  !!validateCoordinates(destinationSearch))
              }
              onDropdownVisibleChange={(open) => {
                // Keep dropdown open if we have suggestions, are loading, or have coordinate input
                if (
                  !open ||
                  (!destinationSuggestions.length &&
                    !destinationSearchLoading &&
                    !validateCoordinates(destinationSearch))
                ) {
                  setToDropdownOpen(false);
                } else {
                  setToDropdownOpen(true);
                }
              }}
              popupClassName={styles.autocompleteDropdown}
              popupMatchSelectWidth={true}
              size='large'
              allowClear
              suffixIcon={
                destinationSearchLoading ? (
                  <span className='anticon anticon-loading anticon-spin' />
                ) : null
              }
              filterOption={handleOptionFilterProp}
            />
          </div>
        </div>

        <div className='flex items-center justify-center mt-3'>
          <Button
            icon={<SwapOutlined />}
            onClick={handleSwapLocations}
            className='flex items-center justify-center h-9 w-9 p-0 border-gray-300'
            shape='circle'
            title='Swap origin and destination'
          />
        </div>
      </div>

      {/* Show route summary if available */}
      {route && (
        <div className='mt-2 mb-2 p-2 bg-gray-50 rounded-lg text-sm'>
          <div className='flex justify-between items-center'>
            <div>
              <span className='font-medium'>Distance: </span>
              <span>{formatDistance(route.distance)}</span>
            </div>
            <div>
              <span className='font-medium'>Time: </span>
              <span>{formatTime(route.time)}</span>
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-between mt-4'>
        <div className='flex space-x-1'>
          <Button
            shape='round'
            icon={<FaCar />}
            className='flex items-center'
            type={transportMode === 'car' ? 'primary' : 'default'}
            onClick={() => {
              dispatch(setTransportMode('car'));
              if (origin && destination) calculateRoute();
            }}
          >
            Car
          </Button>
          <Button
            shape='round'
            icon={<FaBicycle />}
            className='flex items-center'
            type={transportMode === 'bike' ? 'primary' : 'default'}
            onClick={() => {
              dispatch(setTransportMode('bike'));
              if (origin && destination) calculateRoute();
            }}
          >
            Bike
          </Button>
          <Button
            shape='round'
            icon={<FaWalking />}
            className='flex items-center'
            type={transportMode === 'motorcycle' ? 'primary' : 'default'}
            onClick={() => {
              dispatch(setTransportMode('motorcycle'));
              if (origin && destination) calculateRoute();
            }}
          >
            Motorcycle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectionPanel;
