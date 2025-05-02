import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './SearchBar/SearchBar.module.css';
import { useDropdownStyles } from '../hooks/useDropdownStyles';
import Image from 'next/image';

interface AutoCompleteOption {
  value: string;
  label?: React.ReactNode;
  rawData?: any;
}

interface SearchInputProps {
  value: string;
  options: AutoCompleteOption[];
  placeholder: string;
  isExpanded: boolean;
  isAnimating: boolean;
  onSearch: (value: string) => void;
  onSelect: (value: string, option: any) => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onDropdownVisibleChange: (open: boolean) => void;
  onDirectSearch?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  options,
  placeholder,
  isExpanded,
  isAnimating,
  onSearch,
  onSelect,
  onChange,
  onBlur,
  onDropdownVisibleChange,
  onDirectSearch,
}) => {
  const dropdownStyle = useDropdownStyles();
  const [processedOptions, setProcessedOptions] =
    useState<AutoCompleteOption[]>(options);

  const isCoordinateSearch = (input: string): boolean => {
    if (!input) return false;

    const parts = input.split(',');
    if (parts.length !== 2) return false;

    const [first, second] = parts.map((coord) => coord?.trim());
    if (!first || !second) return false;

    const coordRegex = /^-?\d{1,3}\.\d+$/;
    if (!coordRegex.test(first) || !coordRegex.test(second)) return false;

    const firstNum = parseFloat(first);
    const secondNum = parseFloat(second);

    // Check both possible orders: lat,lng and lng,lat
    const isLatLngOrder =
      firstNum >= -90 &&
      firstNum <= 90 && // Valid latitude
      secondNum >= -180 &&
      secondNum <= 180; // Valid longitude

    const isLngLatOrder =
      firstNum >= -180 &&
      firstNum <= 180 && // Valid longitude
      secondNum >= -90 &&
      secondNum <= 90; // Valid latitude

    return isLatLngOrder || isLngLatOrder;
  };
  // Update the coordinate processing in your useEffect
  useEffect(() => {
    if (value && isCoordinateSearch(value)) {
      const parts = value.split(',');
      if (parts.length === 2) {
        const [first, second] = parts.map((coord) => coord?.trim());

        if (first && second) {
          const firstNum = parseFloat(first);
          const secondNum = parseFloat(second);

          if (!isNaN(firstNum) && !isNaN(secondNum)) {
            // Determine the correct order
            let latNum, lngNum;

            if (
              firstNum >= -90 &&
              firstNum <= 90 &&
              secondNum >= -180 &&
              secondNum <= 180
            ) {
              // First is latitude, second is longitude
              latNum = firstNum;
              lngNum = secondNum;
            } else {
              // First is longitude, second is latitude
              latNum = secondNum;
              lngNum = firstNum;
            }

            const coordinateOption = {
              value: value,
              label: (
                <div className='flex flex-col'>
                  <span>
                    Coordinates: {latNum}, {lngNum}
                  </span>
                  <span className='text-xs text-gray-500'>
                    Go to this location
                  </span>
                </div>
              ),
              rawData: {
                type: 'coordinates',
                lat: latNum,
                lng: lngNum,
                originalInput: value,
              },
            };
            // Only show the coordinate option when coordinates are detected
            setProcessedOptions([coordinateOption]);
            return;
          }
        }
      }
    }
    // Show regular options when not a coordinate search
    setProcessedOptions(options);
  }, [value, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (value && isCoordinateSearch(value)) {
        const parts = value.split(',');
        if (parts.length === 2) {
          const [first, second] = parts.map((coord) => coord?.trim());
          if (first && second) {
            const firstNum = parseFloat(first);
            const secondNum = parseFloat(second);

            if (!isNaN(firstNum) && !isNaN(secondNum)) {
              // Determine the correct order
              let latNum, lngNum;

              if (
                firstNum >= -90 &&
                firstNum <= 90 &&
                secondNum >= -180 &&
                secondNum <= 180
              ) {
                latNum = firstNum;
                lngNum = secondNum;
              } else {
                latNum = secondNum;
                lngNum = firstNum;
              }

              const coordinateOption = {
                value: `${latNum}, ${lngNum}`,
                rawData: {
                  type: 'coordinates',
                  lat: latNum,
                  lng: lngNum,
                  originalInput: value,
                },
              };
              onSelect(`${latNum}, ${lngNum}`, coordinateOption);
              return;
            }
          }
        }
      }

      if (onDirectSearch && value) {
        onDirectSearch(value);
        onDropdownVisibleChange(false);
      }
    }
  };

  return (
    <div className='relative w-full'>
      <AutoComplete
        className='searchbar_autocomplete !h-[44px] !w-full
        [&_.ant-select-selector]:!border-none 
        [&_.ant-select-selector]:!shadow-none 
        [&_.ant-select-selector]:!rounded-[62px] 
        [&_.ant-select-selector]:!bg-transparent
        [&_.ant-select-selector]:!px-6
        [&_.ant-select-selection-search-input]:!p-0'
        value={value}
        onDropdownVisibleChange={onDropdownVisibleChange}
        options={processedOptions}
        allowClear={{ clearIcon: <div className='hidden bg-none'></div> }}
        onSearch={onSearch}
        onSelect={(value, option) => onSelect(value, option)}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size='large'
        prefix={<SearchOutlined className='!text-gray-400' />}
        dropdownRender={(menu) => (
          <div className='relative pb-8'>
            <div
              className={`${styles['dropdown-animation']} ${
                isExpanded || isAnimating ? styles['show'] : ''
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
        dropdownStyle={dropdownStyle}
        popupMatchSelectWidth={true}
        defaultActiveFirstOption={false}
        showSearch={true}
        filterOption={false}
      />
    </div>
  );
};

export default SearchInput;
