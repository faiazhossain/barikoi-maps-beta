// components/SearchBar/SearchBar.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { AutoComplete, Button, Space } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import styles from '../styles/SearchBar.module.css';
import { MdCancel } from 'react-icons/md';
import {
  setSearchTerm,
  setSearchMode,
  clearDirections,
  setSuggestions,
} from '@/app/store/slices/searchSlice';
import { toggleDirections } from '@/app/store/slices/mapSlice';
import CountrySelect from './CountrySelect';
import debounce from 'lodash.debounce';

import { useSearchHandler } from '../hooks/SearchHandler';
import { getSuggestionOptions } from '../hooks/SuggestionsOption';
import { useDropdownStyles } from '../hooks/DropDownStyles';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, suggestions, searchMode } = useAppSelector(
    (state) => state.search
  );
  const { showDirections } = useAppSelector((state) => state.map);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Secondary state for animation
  const dropdownStyle = useDropdownStyles();
  const { handleSearch, loading, error } = useSearchHandler(dispatch);

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );
  const options = useMemo(
    () => getSuggestionOptions(suggestions),
    [suggestions]
  );

  useEffect(() => {
    if (suggestions.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [suggestions]);

  useEffect(() => {
    if (!isExpanded) {
      setIsAnimating(true); // Start animation when collapsing
      const timeout = setTimeout(() => {
        setIsAnimating(false); // Stop animation after 100ms
      }, 100); // 100ms delay

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [isExpanded]);

  const handleSelect = (value: string) => {
    dispatch(setSearchTerm(value));
    dispatch(setSuggestions([]));
    setIsExpanded(false);
  };

  const handleDirectionsToggle = () => {
    dispatch(toggleDirections());
    if (!showDirections) {
      dispatch(setSearchMode('directions'));
    } else {
      dispatch(clearDirections());
      dispatch(setSearchMode('location'));
    }
  };

  const handleInputChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  return (
    <div className="absolute top-2 left-0 w-screen sm:top-4 sm:left-4 z-10 sm:w-full sm:max-w-[400px]">
      <div
        className={`bg-white rounded-full transition-all duration-100 ${
          isExpanded ? 'rounded-b-md' : ''
        } shadow-deep hover:shadow-custom`}
      >
        <div className="p-[2px] flex items-center gap-2">
          <div className="relative w-full">
            <AutoComplete
              className="!w-full !ml-2
              [&_.ant-select-selector]:!border-none 
              [&_.ant-select-selector]:!shadow-none 
              [&_.ant-select-selector]:!rounded-[62px] 
              [&_.ant-select-selector]:!bg-transparent
              [&_.ant-select-selection-search-input]:!p-0"
              value={searchTerm}
              onDropdownVisibleChange={(open) => {
                if (open && suggestions.length > 0) {
                  setIsExpanded(true);
                } else {
                  setIsExpanded(false);
                }
              }}
              options={options}
              allowClear={{
                clearIcon: (
                  <MdCancel className="!text-black-500 !text-lg !bg-white !relative !top-0 !transform-none" />
                ),
              }}
              onSearch={debouncedSearch}
              onSelect={handleSelect}
              onChange={handleInputChange}
              onBlur={() => setIsExpanded(false)}
              placeholder={
                searchMode === 'directions'
                  ? 'Enter start location'
                  : 'Search places...'
              }
              size="large"
              prefix={<SearchOutlined className="!text-gray-400" />}
              dropdownRender={(menu) => (
                <div
                  className={`${styles['dropdown-animation']} ${
                    isExpanded || isAnimating ? styles['show'] : ''
                  }`}
                >
                  {menu}
                </div>
              )}
              dropdownStyle={dropdownStyle}
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
          <Space className="!mr-2">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={handleDirectionsToggle}
              className={`!transition-colors ${
                showDirections ? '!text-blue-500' : '!text-gray-500'
              } hover:!text-blue-600`}
            />
            <CountrySelect />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
