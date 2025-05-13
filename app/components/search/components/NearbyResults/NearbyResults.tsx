"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchNearbyPlaces } from "@/app/store/thunks/searchThunks";
import {
  setCurrentRadius,
  setSelectedCategories,
  setHoveredNearbyPlace,
} from "@/app/store/slices/searchSlice";
import {
  FaMapMarkerAlt,
  FaSpinner,
  FaSearch,
  FaWalking,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Tooltip } from "antd";
import { NearbyPlace } from "@/app/types/map";
import NearbyPlaceModal from "@/app/components/map/Modals/NearbyPlaceModal";

// Place card component for displaying individual nearby places
const PlaceCard = ({
  place,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: {
  place: NearbyPlace;
  onSelect: (place: NearbyPlace) => void;
  onHoverStart: (place: NearbyPlace) => void;
  onHoverEnd: () => void;
}) => {
  // Convert distance string to number and divide by 1000 to get km
  const distanceInKm = place.distance_in_meters
    ? (parseFloat(place.distance_in_meters) / 1000).toFixed(2)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-lg shadow-sm p-2.5 mb-2 hover:bg-gray-100 hover:shadow-md transition-shadow border border-gray-50 cursor-pointer'
      onClick={() => onSelect(place)}
      onMouseEnter={() => onHoverStart(place)}
      onMouseLeave={() => onHoverEnd()}
    >
      <div className='flex items-start'>
        <div className='p-1.5 rounded-full bg-blue-50 mr-2.5 flex-shrink-0'>
          <FaMapMarkerAlt className='text-blue-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-gray-800 text-sm truncate'>
            {place.name}
          </h3>
          <p className='text-xs text-gray-600 line-clamp-1 mt-0.5'>
            {place.Address}
          </p>
          <div className='flex items-center mt-1.5 gap-2'>
            <span className='text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium'>
              {place.pType}
            </span>
            {distanceInKm && (
              <span className='text-xs text-gray-500 flex items-center'>
                <FaWalking className='mr-1 text-gray-400' />
                {distanceInKm} km
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// CategoryPill component to reuse styling and behavior
const CategoryPill = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
      isActive
        ? "bg-blue-600 text-white font-medium"
        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

const NearbyFilters = ({
  radius,
  setRadius,
  selectedCategory,
  onCategoryChange,
  onCategorySubmit,
  onCategorySelect,
  predefinedCategories,
}: {
  radius: number;
  setRadius: (r: number) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onCategorySubmit: () => void;
  onCategorySelect: (category: string) => void;
  predefinedCategories: string[];
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm p-3 border border-gray-100'>
      {/* Radius slider - more compact */}
      <div className='mb-2.5'>
        <div className='flex justify-between items-center mb-1'>
          <label className='text-xs font-medium text-gray-700'>
            Search radius
          </label>
          <span className='text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium'>
            {radius} km
          </span>
        </div>
        <input
          type='range'
          min='0.1'
          max='5'
          step='0.1'
          value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value))}
          className='w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600'
        />
        <div className='flex justify-between text-xs text-gray-400 mt-0.5'>
          <span>0.1</span>
          <span>5 km</span>
        </div>
      </div>

      {/* Category search input - more compact */}
      <div className='mb-2.5'>
        <div className='flex mb-1.5'>
          <Input
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder='Search for any category...'
            size='small'
            className='flex-grow text-sm'
            onPressEnter={onCategorySubmit}
            prefix={<FaSearch className='text-gray-400 mr-1' size={12} />}
            allowClear
          />
          <Tooltip title='Search'>
            <button
              onClick={onCategorySubmit}
              className='ml-1.5 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center justify-center'
            >
              <FaSearch size={14} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Common categories - horizontal scrollable on small screens */}
      <div>
        <label className='text-xs font-medium text-gray-700 mb-1.5 block'>
          Popular categories:
        </label>
        <div className='flex gap-1.5 flex-wrap'>
          {predefinedCategories.map((category) => (
            <CategoryPill
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => onCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Common categories for quick selection
const COMMON_CATEGORIES = [
  "Restaurant",
  "Hotel",
  "Cafe",
  "Hospital",
  "Bank",
  "ATM",
  "Pharmacy",
  "Shop",
];

const NearbyResults = () => {
  const dispatch = useAppDispatch();

  // Local state for search term
  const [searchTerm, setSearchTerm] = useState("");
  // State for panel expansion
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  // State for selected place to show in modal
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);

  // Redux state
  const {
    nearbyPlaces,
    nearbyLoading,
    nearbyError,
    currentRadius,
    selectedCategories,
    searchCenter,
  } = useAppSelector((state) => state.search);

  // Handle place selection
  const handlePlaceSelect = (place: NearbyPlace) => {
    setSelectedPlace(place);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedPlace(null);
  };

  // Handle hover for map marker highlight
  const handlePlaceHoverStart = (place: NearbyPlace) => {
    dispatch(setHoveredNearbyPlace(place.id.toString()));
  };

  const handlePlaceHoverEnd = () => {
    dispatch(setHoveredNearbyPlace(null));
  };

  // Handle search term change
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      dispatch(setSelectedCategories([searchTerm.trim()]));
    }
  };

  // Direct category select handler
  const handleCategorySelect = (category: string) => {
    setSearchTerm(category);
    dispatch(setSelectedCategories([category]));
  };

  // Set up radius state
  const handleRadiusChange = (radius: number) => {
    dispatch(setCurrentRadius(radius));
  };

  // Fetch nearby places when coordinates, radius, or search term change
  useEffect(() => {
    if (selectedCategories.length > 0 && searchCenter) {
      const categoryToSearch = selectedCategories[0];

      dispatch(
        fetchNearbyPlaces({
          latitude: searchCenter.latitude,
          longitude: searchCenter.longitude,
          radius: currentRadius,
          categories: categoryToSearch,
        })
      );
    }
  }, [searchCenter, currentRadius, selectedCategories, dispatch]);

  useEffect(() => {
    // Set the input field to match the current selection
    if (selectedCategories.length > 0) {
      setSearchTerm(selectedCategories[0] ?? "");
    }
  }, [selectedCategories]);

  if (!searchCenter) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-gray-500 p-4'>
        <FaMapMarkerAlt className='text-4xl mb-3' />
        <p className='text-center text-sm'>
          No location selected. Click on the map to search nearby places.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col max-h-full relative'>
      <AnimatePresence initial={false}>
        {isPanelExpanded && (
          <motion.div
            className='flex flex-col'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters section */}
            <div className='p-2.5'>
              <NearbyFilters
                radius={currentRadius}
                setRadius={handleRadiusChange}
                selectedCategory={searchTerm}
                onCategoryChange={handleSearchTermChange}
                onCategorySubmit={handleSearchSubmit}
                onCategorySelect={handleCategorySelect}
                predefinedCategories={COMMON_CATEGORIES}
              />
            </div>

            {/* Results section */}
            <div className='px-2.5 pb-2.5 overflow-y-auto'>
              {nearbyLoading ? (
                <div className='flex flex-col items-center justify-center h-24 text-gray-500'>
                  <FaSpinner className='text-xl animate-spin mb-2' />
                  <p className='text-sm'>Loading nearby places...</p>
                </div>
              ) : nearbyError ? (
                <div className='bg-red-50 text-red-700 p-2.5 rounded-lg text-sm'>
                  <p>Error: {nearbyError}</p>
                </div>
              ) : nearbyPlaces.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-24 text-gray-500'>
                  <p className='text-sm text-center'>
                    No places found nearby. Try increasing the radius or
                    changing your search.
                  </p>
                </div>
              ) : (
                <div>
                  <div className='flex justify-between items-center mb-2.5'>
                    <p className='text-xs text-gray-500'>
                      {nearbyPlaces.length} places found
                    </p>
                    {selectedCategories.length > 0 && (
                      <span className='text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium'>
                        {selectedCategories[0]}
                      </span>
                    )}
                  </div>
                  <div className='overflow-y-auto max-h-[calc(100vh-240px)]'>
                    {nearbyPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place as NearbyPlace}
                        onSelect={handlePlaceSelect}
                        onHoverStart={handlePlaceHoverStart}
                        onHoverEnd={handlePlaceHoverEnd}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <div className='sticky bottom-0 w-full bg-white border-t border-gray-100 shadow-sm'>
        <button
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          className='w-full py-2 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
        >
          {isPanelExpanded ? (
            <>
              <FaChevronUp className='mr-1.5' />
              <span className='text-xs font-medium'>Minimize</span>
            </>
          ) : (
            <>
              <FaChevronDown className='mr-1.5' />
              <span className='text-xs font-medium'>
                {nearbyPlaces.length > 0
                  ? `Show ${nearbyPlaces.length} places`
                  : "Expand"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Place details modal */}
      <AnimatePresence>
        {selectedPlace && (
          <NearbyPlaceModal place={selectedPlace} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearbyResults;
