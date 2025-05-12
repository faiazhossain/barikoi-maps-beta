'use client';

import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd'; // Import Spin from Ant Design
import { FaFlag } from 'react-icons/fa';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';

// Import from our new global countries hook
import {
  useGlobalCountries,
  CountryOption,
} from '@/app/hooks/useGlobalCountries';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setSelectedCountry } from '@/app/store/slices/mapSlice'; // Fix import from countrySlice to mapSlice
import { dispatchFitCountryEvent } from '@/app/utils/eventUtils';
import { setSelectedCountryCode } from '@/app/store/slices/countrySlice';

interface CountrySelectProps {
  onCountrySelect?: (value: string) => void;
  className?: string;
  dropdownWidth?: number | string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  className = '!w-8 !mr-2 rounded-md [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!p-[6px] hover:!bg-gray-100 ',
  dropdownWidth = '160px',
}) => {
  // Use our global countries hook instead of local fetching logic
  const { countries, loading, error } = useGlobalCountries();
  const [filteredOptions, setFilteredOptions] = useState<CountryOption[]>([]);
  const [localSelectedCountry, setLocalSelectedCountry] = useState<
    string | null
  >(null);
  const dispatch = useAppDispatch();

  // Get the selected country from Redux store
  const selectedCountryFromStore = useAppSelector(
    (state) => state.map.selectedCountry
  );

  // Update local state when Redux store changes
  useEffect(() => {
    setLocalSelectedCountry(selectedCountryFromStore);
  }, [selectedCountryFromStore]);

  // Update filtered options when countries change
  useEffect(() => {
    setFilteredOptions(countries);
  }, [countries]);

  const handleCountrySelect = (name: string) => {
    const selectedCountry = countries.find((country) => country.name === name);
    console.log(
      '🚀 ~ handleCountrySelect ~ selectedCountry:',
      selectedCountry?.value
    );
    setLocalSelectedCountry(name);
    dispatch(setSelectedCountry(name));
    dispatch(setSelectedCountryCode(selectedCountry?.value || null));

    // Dispatch an event to fit the map to the selected country
    dispatchFitCountryEvent(name);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-10 !w-8 !mr-2'>
        <Spin
          indicator={<LoadingOutlined spin className='!text-primary-dark' />}
        />
      </div>
    );
  }

  if (error) {
    console.error('Error loading countries:', error);
    return <Select placeholder='Error loading countries' disabled />;
  }

  return (
    <div className='relative group'>
      <Select
        className={className}
        variant='borderless'
        dropdownStyle={{ minWidth: dropdownWidth }}
        suffixIcon={null}
        optionLabelProp='label'
        showSearch={false}
        value={localSelectedCountry}
        onChange={handleCountrySelect}
        title={localSelectedCountry || undefined}
        dropdownRender={(menu) => (
          <div>
            <div className='p-2'>
              <input
                type='text'
                placeholder='Search country...'
                className='w-full p-[3px] border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-100'
                onChange={(e) => {
                  const input = e.target.value.toLowerCase();
                  const filteredOptions = countries.filter((country) =>
                    country.name.toLowerCase().includes(input)
                  );
                  setFilteredOptions(filteredOptions);
                }}
              />
            </div>
            <div>{menu}</div>
          </div>
        )}
      >
        {filteredOptions.map((country) => (
          <Select.Option
            key={country.name}
            value={country.name}
            title={country.name}
            label={
              <div className='flex items-center gap-4 '>
                <Image
                  src={country.flag}
                  alt={`${country.name} flag`}
                  width={40}
                  height={12}
                />
              </div>
            }
          >
            <div className='flex items-center gap-2'>
              <Image
                width={20}
                height={12}
                src={country.flag}
                alt={`${country.name} flag`}
              />
              <span className='truncate max-w-[100px]'>{country.name}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
      {!localSelectedCountry && (
        <div className='absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
          <FaFlag className='text-gray-400 group-hover:text-primary transition-colors' />
        </div>
      )}
      {localSelectedCountry && countries.length > 0 && (
        <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-8 flex justify-center pointer-events-none'>
          {countries.find(
            (country) => country.name === localSelectedCountry
          ) && (
            <Image
              src={
                countries.find(
                  (country) => country.name === localSelectedCountry
                )?.flag || ''
              }
              alt={`${localSelectedCountry} flag`}
              width={20}
              height={12}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
