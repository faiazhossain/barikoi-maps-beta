'use client';

import React, { useState } from 'react';
import { AutoComplete, Button, Space } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  setSearchTerm,
  setSearchMode,
  clearDirections,
  setSuggestions,
} from '@/app/store/slices/searchSlice';
import {
  toggleDirections,
  setSelectedCountry,
} from '@/app/store/slices/mapSlice';
import CountrySelect from './CountrySelect';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, suggestions, searchMode } = useAppSelector(
    (state) => state.search
  );
  const { showDirections } = useAppSelector((state) => state.map);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = async (value: string) => {
    dispatch(setSearchTerm(value));

    if (!value) {
      dispatch(setSuggestions([])); // Clear suggestions if the input is empty
      return;
    }

    try {
      const response = await fetch(`/api/autocomplete?query=${value}`);
      if (!response.ok) {
        throw new Error('Failed to fetch autocomplete suggestions');
      }

      const data = await response.json();
      dispatch(setSuggestions(data.places || [])); // Assuming `places` is the key in the API response
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  const handleSelect = (value: string) => {
    dispatch(setSearchTerm(value));
    setIsExpanded(false); // Collapse the list after selection
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

  return (
    <div className="absolute top-2 left-0 w-screen sm:top-4 sm:left-4 z-10 sm:w-full sm:max-w-[400px]">
      <div
        className={`bg-white rounded-full transition-all duration-300 ${
          isExpanded ? 'rounded-lg' : ''
        } shadow-deep hover:shadow-custom`}
      >
        <div className="p-[2px] flex items-center gap-2">
          <div className="relative w-full">
            <AutoComplete
              className="!w-full [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!rounded-[20px] [&_.ant-select-selection-search-input]:!p-0"
              value={searchTerm}
              options={suggestions.map((item) => ({
                value: item.name,
                label: (
                  <div className="flex flex-col">
                    <span className="!font-medium">{item.name}</span>
                    <span className="!text-sm !text-gray-500">
                      {item.address}
                    </span>
                  </div>
                ),
              }))}
              onSearch={handleSearch}
              onSelect={handleSelect}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              placeholder={
                searchMode === 'directions'
                  ? 'Enter start location'
                  : 'Search places...'
              }
              size="large"
              prefix={<SearchOutlined className="!text-gray-400" />}
              dropdownStyle={{
                minWidth: '400px',
                height: '600px',
                left: '17px',
              }}
            />
          </div>
          <Space>
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
