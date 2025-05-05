'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchNearbyPlaces } from '@/app/store/thunks/searchThunks';
import {
  setCurrentRadius,
  setSelectedCategories,
} from '@/app/store/slices/searchSlice';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Place card component for displaying individual nearby places
const PlaceCard = ({ place }: { place: any }) => {
  // Convert distance string to number and divide by 1000 to get km
  const distanceInKm = place.distance_in_meters
    ? (parseFloat(place.distance_in_meters) / 1000).toFixed(2)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-lg shadow-md p-3 mb-3 hover:shadow-lg transition-shadow'
    >
      <div className='flex items-start'>
        <div className='p-2 rounded-full bg-blue-50 mr-3'>
          <FaMapMarkerAlt className='text-blue-600' />
        </div>
        <div className='flex-1'>
          <h3 className='font-medium text-gray-800'>{place.name}</h3>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {place.Address || place.address}
          </p>
          <div className='flex items-center mt-2'>
            <span className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'>
              {place.pType}
            </span>
            {distanceInKm && (
              <span className='text-xs text-gray-500 ml-3'>
                {distanceInKm} km away
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Filter component for radius and category selection
const NearbyFilters = ({
  radius,
  setRadius,
  categories,
  selectedCategories,
  onCategoryChange,
}: {
  radius: number;
  setRadius: (r: number) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (cat: string) => void;
}) => {
  return (
    <div className='mb-4 bg-white rounded-lg shadow-sm p-3'>
      <h3 className='font-medium text-gray-700 mb-2'>Filters</h3>

      {/* Radius slider */}
      <div className='mb-3'>
        <label className='text-sm text-gray-600 block mb-1'>
          Search radius: {radius} km
        </label>
        <input
          type='range'
          min='0.1'
          max='5'
          step='0.1'
          value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value))}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600'
        />
        <div className='flex justify-between text-xs text-gray-500 mt-1'>
          <span>0.1 km</span>
          <span>5 km</span>
        </div>
      </div>

      {/* Category filters */}
      <div>
        <label className='text-sm text-gray-600 block mb-1'>Categories:</label>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const NearbyResults = () => {
  const dispatch = useAppDispatch();

  // Get coordinates from the map state instead of URL
  const { viewport } = useAppSelector((state) => state.map);
  const lat = viewport.latitude.toString();
  const lng = viewport.longitude.toString();

  // Get nearby places from Redux store
  const {
    nearbyPlaces,
    nearbyLoading,
    nearbyError,
    currentRadius,
    selectedCategories,
  } = useAppSelector((state) => state.search);

  // Common POI categories
  const categories = [
    'Restaurant',
    'Hotel',
    'Cafe',
    'Hospital',
    'School',
    'Shopping',
    'Bank',
    'Pharmacy',
  ];

  // Set up radius state
  const handleRadiusChange = (radius: number) => {
    dispatch(setCurrentRadius(radius));
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    dispatch(setSelectedCategories(newSelection));
  };

  // Fetch nearby places when coordinates, radius, or categories change
  useEffect(() => {
    if (selectedCategories.length > 0) {
      dispatch(
        fetchNearbyPlaces({
          // Use viewport coordinates from Redux
          latitude: viewport.latitude,
          longitude: viewport.longitude,
          radius: currentRadius,
          categories: selectedCategories.join(','),
        })
      );
    }
  }, [
    viewport.latitude,
    viewport.longitude,
    currentRadius,
    selectedCategories,
    dispatch,
  ]);

  if (!lat || !lng) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-gray-500 p-4'>
        <FaMapMarkerAlt className='text-4xl mb-3' />
        <p>No location selected. Click on the map to search nearby places.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col max-h-full'>
      {/* Filters */}
      <div className='p-3'>
        <NearbyFilters
          radius={currentRadius}
          setRadius={handleRadiusChange}
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Results with fixed height */}
      <div className='p-3 overflow-y-auto'>
        {nearbyLoading ? (
          <div className='flex flex-col items-center justify-center h-32 text-gray-500'>
            <FaSpinner className='text-2xl animate-spin mb-3' />
            <p>Loading nearby places...</p>
          </div>
        ) : nearbyError ? (
          <div className='bg-red-50 text-red-700 p-3 rounded-lg'>
            <p>Error: {nearbyError}</p>
          </div>
        ) : nearbyPlaces.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-32 text-gray-500'>
            <p>
              No places found nearby. Try increasing the radius or changing
              categories.
            </p>
          </div>
        ) : (
          <div>
            <p className='text-sm text-gray-500 mb-3'>
              Found {nearbyPlaces.length} places nearby
            </p>
            <div className='overflow-y-auto max-h-[40vh]'>
              {nearbyPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyResults;
