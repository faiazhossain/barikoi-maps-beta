'use client';

import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';

// Components and styles
import styles from './DirectionsSearchInput.module.css';

// Types
import { Location } from '@/app/store/slices/directionsSlice';

// // Custom dropdown styles for direction inputs
// const useDirectionDropdownStyles = () => {
//   const baseStyles = useDropdownStyles();
//   return {
//     ...baseStyles,
//     // CSS module class will handle most of the styling
//     // We only need to override some properties from the base styles
//     borderRadius: '0 0 20px 20px',
//   };
// };

interface AutoCompleteOption {
  value: string;
  label?: React.ReactNode;
  rawData?: any;
}

interface DirectionsSearchInputProps {
  value: string;
  placeholder: string;
  className?: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
}

const DirectionsSearchInput: React.FC<DirectionsSearchInputProps> = ({
  value,
  placeholder,
  className,
  onChange,
  onLocationSelect,
}) => {
  // const dropdownStyle = useDirectionDropdownStyles();
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Input ref for blurring
  const inputRef = React.useRef<any>(null);

  // Move coordinate check to a separate function
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

  // Fetch suggestions when the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value === 'Current Location') {
        setOptions([]);
        return;
      }

      // Check if the input is coordinates
      const coords = validateCoordinates(value);
      if (coords) {
        const coordinateOption = {
          value: value,
          label: (
            <div className='flex flex-col'>
              <span>
                Coordinates: {coords.lat}, {coords.lng}
              </span>
              <span className='text-xs text-gray-500'>Use this location</span>
            </div>
          ),
          rawData: {
            type: 'coordinates',
            lat: coords.lat,
            lng: coords.lng,
            latitude: coords.lat,
            longitude: coords.lng,
            originalInput: value,
          },
        };
        setOptions([coordinateOption]);
        return;
      }

      setIsSearching(true);

      try {
        // Call the autocomplete API
        const response = await fetch(
          `/api/autocomplete?query=${encodeURIComponent(value)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();

        if (data && data.places && Array.isArray(data.places)) {
          // Convert API response to autocomplete options
          const suggestions = data.places.map((place: any) => ({
            value: place.address,
            label: (
              <div className='flex flex-col'>
                <div className='font-medium'>{place.name}</div>
                <div className='text-xs text-gray-500'>{place.address}</div>
              </div>
            ),
            rawData: {
              ...place,
              latitude: place.latitude,
              longitude: place.longitude,
              address: place.address,
              placeCode: place.uCode,
            },
          }));

          setOptions(suggestions);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setOptions([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the API call
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Check if it's coordinates first
      const coords = validateCoordinates(value);
      if (coords) {
        onLocationSelect({
          latitude: coords.lat,
          longitude: coords.lng,
          address: `${coords.lat}, ${coords.lng}`,
        });
        setIsExpanded(false);
        return;
      }

      // If not coordinates, try to rupantor (direct search)
      if (value && value !== 'Current Location') {
        try {
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
          const geocodedAddress = responseData.geocoded_address;

          if (
            geocodedAddress &&
            geocodedAddress.latitude &&
            geocodedAddress.longitude
          ) {
            onLocationSelect({
              latitude: geocodedAddress.latitude,
              longitude: geocodedAddress.longitude,
              address: geocodedAddress.address || value,
              placeCode: geocodedAddress.uCode,
            });
          }
        } catch (error) {
          console.error('Rupantor search error:', error);
        }

        setIsExpanded(false);
      }
    }
  };

  const handleSelect = (value: string, option: AutoCompleteOption) => {
    // Blur the input to dismiss keyboard on mobile
    if (inputRef.current?.blur) {
      inputRef.current.blur();
    }

    // Close virtual keyboard on mobile
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (option.rawData) {
      onLocationSelect({
        latitude: option.rawData.latitude,
        longitude: option.rawData.longitude,
        address: option.rawData.address || value,
        placeCode: option.rawData.placeCode || option.rawData.uCode,
      });
    }

    setIsExpanded(false);
  };

  const handleDropdownVisibleChange = (open: boolean) => {
    if (open && options.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`relative w-full ${className || ''}`}>
      <AutoComplete
        ref={inputRef}
        className='directions_autocomplete h-[44px] w-full
        [&_.ant-select-selector]:!border-none 
        [&_.ant-select-selector]:!shadow-none 
        [&_.ant-select-selector]:!rounded-[62px] 
        [&_.ant-select-selector]:!bg-transparent
        [&_.ant-select-selector]:!px-6
        [&_.ant-select-selection-search-input]:!p-0'
        value={value}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        options={options}
        allowClear={{ clearIcon: <div className='hidden bg-none'></div> }}
        onSearch={onChange}
        onSelect={handleSelect}
        onChange={onChange}
        onBlur={() => setIsExpanded(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size='large'
        prefix={<SearchOutlined className='!text-gray-400' />}
        dropdownRender={(menu) => (
          <div className='relative pb-8 w-[334px] max-h-[300px] overflow-hidden'>
            <div
              className={`${styles.dropdownAnimation} ${
                isExpanded
                  ? styles.dropdownAnimationShow
                  : styles.dropdownAnimationHide
              }`}
            >
              {menu}
            </div>
            <div className='absolute bottom-0 right-0 flex items-center gap-1 text-gray-500 text-[11px] p-2'>
              <a
                href='https://docs.barikoi.com/api#tag/v2.0/operation/autocomplete_v2'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-gray-500 hover:text-primary transition-colors'
              >
                <span>Autocomplete by</span>
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
        dropdownClassName={styles.directionDropdown}
        popupMatchSelectWidth={false}
        defaultActiveFirstOption={false}
        showSearch={true}
        filterOption={false}
        notFoundContent={isSearching ? 'Searching...' : 'No results found'}
      />
    </div>
  );
};

export default DirectionsSearchInput;
