// components/SearchBar/SearchBar.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Space } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import './styles.css';
import { setSearchTerm, setSuggestions } from '@/app/store/slices/searchSlice';
import { useSearchHandler } from '../../hooks/useSearchHandler';
import ClearButton from '../ClearButton';
import DirectionsToggle from '../DirectionToggle';
import SearchInput from '../SearchInput';
import CountrySelect from '../CountrySelect/CountrySelect';
import { getSuggestionOptions } from '../../hooks/useSuggestionsOptions';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, suggestions, searchMode } = useAppSelector(
    (state) => state.search
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { handleSearch } = useSearchHandler(dispatch);

  const options = getSuggestionOptions(suggestions);

  useEffect(() => {
    if (suggestions.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [suggestions]);

  useEffect(() => {
    if (!isExpanded) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  const handleSelect = (value: string) => {
    dispatch(setSearchTerm(value));
    dispatch(setSuggestions([]));
    setIsExpanded(false);
  };

  const handleInputChange = (value: string) => {
    dispatch(setSearchTerm(value));
    handleSearch(value); // Debounced search
  };

  return (
    <div className="absolute top-2 left-0 w-screen sm:top-4 sm:left-4 z-10 sm:w-full sm:max-w-[400px]">
      <div
        className={`bg-white transition-all duration-100 ${
          isExpanded ? 'rounded-t-[20px]' : 'rounded-full'
        } shadow-deep`}
      >
        <div className="p-[2px] flex items-center gap-2">
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
              onSearch={handleInputChange} // Changed this
              onSelect={handleSelect}
              onChange={handleInputChange}
              onBlur={() => setIsExpanded(false)}
              onDropdownVisibleChange={(open) => {
                if (open && suggestions.length > 0) {
                  setIsExpanded(true);
                } else {
                  setIsExpanded(false);
                }
              }}
            />
            <ClearButton searchTerm={searchTerm} />
            {/* {error && <div className="text-red-500 text-sm mt-2">{error}</div>} */}
          </div>
          <Space size={0} className="!ml-2">
            <DirectionsToggle />
            <CountrySelect />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
