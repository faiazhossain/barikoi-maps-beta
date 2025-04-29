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
import { closeDrawer } from '@/app/store/slices/drawerSlice';
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
import { AnimatePresence, motion } from 'framer-motion';

// Styles
import './styles.css';

const SearchBar: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const suggestions = useAppSelector(selectSuggestions);
  const searchMode = useAppSelector(selectSearchMode);
  const isVisible = useAppSelector((state) => state.ui.isTopPanelVisible);

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

  // Event handlers
  const handleSelect = (value: string, option: any) => {
    const selectedData = option.rawData;

    if (selectedData) {
      dispatch(setSelectedPlace(selectedData));
      if (selectedData.uCode) {
        dispatch(fetchPlaceDetails(selectedData.uCode));
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

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm sm:hidden`}
            onClick={() => {
              setIsExpanded(false);
              dispatch(closeDrawer());
            }}
          />
        )}
      </AnimatePresence>

      {/* Main search container */}
      <div
        className={`relative left-0 w-screen ${
          isMounted
            ? windowSize.width > 823
              ? 'z-[2001]'
              : 'z-10'
            : 'z-[2001]'
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
          <div className="flex items-center gap-2">
            {/* Search input and clear button */}
            <div className="relative w-full">
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
              />
              <ClearButton searchTerm={searchTerm} />
            </div>

            {/* Additional controls */}
            <Space size={0} className="!ml-2">
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
