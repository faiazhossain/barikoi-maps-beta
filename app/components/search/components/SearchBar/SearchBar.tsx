// components/SearchBar/SearchBar.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store/store';

// Redux actions and selectors
import {
  setSearchTerm,
  setSuggestions,
  setSelectedPlace,
} from '@/app/store/slices/searchSlice';
import {
  selectSearchTerm,
  selectSuggestions,
  selectSearchMode,
} from '@/app/store/selectors/searchSelectors';
import { closeDrawer, openLeftBar } from '@/app/store/slices/drawerSlice';
import { fetchPlaceDetails } from '@/app/store/thunks/searchThunks';

// Custom hooks
import { useSearchHandler } from '../../hooks/useSearchHandler';
import { getSuggestionOptions } from '../../hooks/useSuggestionsOptions';
import useWindowSize from '@/app/hooks/useWindowSize';

// Components
import ClearButton from '../ClearButton';
import DirectionsToggle from '../DirectionToggle';
import SearchInput from '../SearchInput';
import CountrySelect from '../CountrySelect/CountrySelect';
// import { AnimatePresence, motion } from 'framer-motion';

// Styles
import './styles.css';

const SearchBar: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const suggestions = useAppSelector(selectSuggestions);
  const searchMode = useAppSelector(selectSearchMode);
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  console.log('🚀 ~ placeDetails:', placeDetails);

  // Local state
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Custom hooks
  const { handleSearch } = useSearchHandler(dispatch);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 640;

  // Memoized values
  const options = useMemo(
    () => getSuggestionOptions(suggestions, searchTerm),
    [suggestions, searchTerm]
  );

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle suggestions visibility
  useEffect(() => {
    setIsExpanded(suggestions.length > 0);
  }, [suggestions]);

  // Handle animation states
  useEffect(() => {
    if (!isExpanded) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  // Add effect to update search term based on placeDetails
  useEffect(() => {
    if (placeDetails) {
      const displayText =
        placeDetails.business_name || placeDetails.address || '';
      if (displayText) {
        dispatch(setSearchTerm(displayText));
      }
    }
  }, [placeDetails, dispatch]);

  // Event handlers
  const handleSelect = (value: string, option: any) => {
    const selectedData = option.rawData;

    if (selectedData) {
      dispatch(setSelectedPlace(selectedData));
      dispatch(openLeftBar());

      // Only update URL if we have a valid place code
      if (selectedData.uCode || selectedData.place_code) {
        dispatch(
          fetchPlaceDetails(selectedData.uCode || selectedData.place_code)
        );

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set(
          'place',
          selectedData.uCode || selectedData.place_code
        );
        window.history.replaceState({}, '', currentUrl.toString());
      }
    }

    dispatch(setSearchTerm(value));
    dispatch(setSuggestions([]));
    setIsExpanded(false);
  };

  const handleInputChange = (value: string) => {
    dispatch(setSearchTerm(value));
    handleSearch(value); // Debounced search
  };

  const handleDropdownVisibility = (open: boolean) => {
    if (open && suggestions.length > 0) {
      setIsExpanded(true);
      if (isMobile) {
        dispatch(closeDrawer());
      }
    } else {
      setIsExpanded(false);
    }
  };

  const handleDirectSearch = async (value: string) => {
    try {
      // 1. Create FormData exactly like in the working project
      const formData = new FormData();
      formData.append('q', value);

      // 2. Make the request with the same parameters
      const response = await fetch('/api/rupantor', {
        method: 'POST',
        body: formData, // No headers needed for FormData
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const responseData = await response.json();

      // 3. Get the uCode from response
      const uCode = responseData.geocoded_address?.uCode;
      if (!uCode) throw new Error('No uCode found in response');

      if (uCode) {
        dispatch(fetchPlaceDetails(uCode));
        dispatch(openLeftBar());
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error; // Re-throw to handle in component
    }
  };

  return (
    <>
      {/* Main search container */}
      <div
        className={`relative left-0 w-screen ${
          isMounted
            ? windowSize.width > 823
              ? 'z-[1001]'
              : 'z-10'
            : 'z-[1001]'
        } min-w-[300px] sm:top-4 lg:left-4 sm:w-full sm:max-w-[400px]`}
      >
        {/* Search box wrapper */}
        <div
          className={`bg-white transition-all duration-100 ${
            isExpanded
              ? `${
                  isVisible ? 'rounded-none' : 'rounded-t-[20px]'
                } sm:rounded-t-[20px]`
              : 'rounded-none sm:rounded-full'
          } shadow-deep`}
        >
          <div className='flex items-center gap-2'>
            {/* Search input and clear button */}
            <div className='relative w-full'>
              <SearchInput
                value={searchTerm}
                options={options}
                placeholder={
                  searchMode === 'directions'
                    ? 'Enter start location'
                    : 'Search places...'
                }
                isExpanded={isExpanded}
                isAnimating={isAnimating}
                onSearch={handleInputChange}
                onSelect={handleSelect}
                onChange={handleInputChange}
                onBlur={() => setIsExpanded(false)}
                onDropdownVisibleChange={handleDropdownVisibility}
                onDirectSearch={handleDirectSearch}
              />
              <ClearButton searchTerm={searchTerm} />
            </div>

            {/* Additional controls */}
            <Space size={0} className='!ml-2'>
              <DirectionsToggle />
              <CountrySelect />
            </Space>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
