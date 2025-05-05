import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './SearchBar/SearchBar.module.css';
import { useDropdownStyles } from '../hooks/useDropdownStyles';
import Image from 'next/image';
import { useAppDispatch } from '@/app/store/store';
import { fetchReverseGeocode } from '@/app/store/thunks/searchThunks';
import { openLeftBar } from '@/app/store/slices/drawerSlice';

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
  const dispatch = useAppDispatch();
  const dropdownStyle = useDropdownStyles();
  const [processedOptions, setProcessedOptions] =
    useState<AutoCompleteOption[]>(options);
  const [isCoordinate, setIsCoordinate] = useState(false);

  // Add ref for the input element
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

  useEffect(() => {
    if (!value) {
      setIsCoordinate(false);
      setProcessedOptions([]);
      return;
    }

    const coords = validateCoordinates(value);
    if (coords) {
      setIsCoordinate(true);
      const coordinateOption = {
        value: value,
        label: (
          <div className='flex flex-col'>
            <span>
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
      setProcessedOptions([coordinateOption]);
    } else {
      setIsCoordinate(false);
      setProcessedOptions(options);
    }
  }, [value, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const coords = validateCoordinates(value);
      if (coords) {
        const coordinateOption = {
          value: `${coords.lat}, ${coords.lng}`,
          rawData: {
            type: 'coordinates',
            lat: coords.lat,
            lng: coords.lng,
            originalInput: value,
          },
        };
        onSelect(`${coords.lat}, ${coords.lng}`, coordinateOption);
        return;
      }

      if (onDirectSearch && value) {
        onDirectSearch(value);
        onDropdownVisibleChange(false);
      }
    }
  };

  const handleCoordinateSelect = async (lat: number, lng: number) => {
    try {
      await dispatch(
        fetchReverseGeocode({
          latitude: lat,
          longitude: lng,
        })
      ).unwrap();
      dispatch(openLeftBar());
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
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

    if (option.rawData?.type === 'coordinates') {
      const { lat, lng } = option.rawData;
      handleCoordinateSelect(lat, lng);
    }
    onSelect(value, option);
  };

  return (
    <div className='relative w-full'>
      <AutoComplete
        ref={inputRef}
        className='searchbar_autocomplete !h-[44px] !w-full
        [&_.ant-select-selector]:!border-none 
        [&_.ant-select-selector]:!shadow-none 
        [&_.ant-select-selector]:!rounded-[62px] 
        [&_.ant-select-selector]:!bg-transparent
        [&_.ant-select-selector]:!px-6
        [&_.ant-select-selection-search-input]:!p-0'
        value={value}
        onDropdownVisibleChange={(open) => {
          // Only show dropdown if we have options or it's a coordinate
          if (!open || (!processedOptions.length && !isCoordinate)) {
            onDropdownVisibleChange(false);
          } else {
            onDropdownVisibleChange(true);
          }
        }}
        options={processedOptions}
        allowClear={{ clearIcon: <div className='hidden bg-none'></div> }}
        onSearch={onSearch}
        onSelect={handleSelect}
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
