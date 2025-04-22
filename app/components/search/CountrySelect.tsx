'use client';

import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/app/store/store';
import { createAction } from '@reduxjs/toolkit';

export const setSelectedCountry = createAction<{ code: string; name: string }>(
  'map/setSelectedCountry'
);

interface CountryOption {
  value: string;
  label: string;
  flag: string;
  name: string;
}

interface CountrySelectProps {
  onCountrySelect?: (value: string) => void;
  className?: string;
  dropdownWidth?: number | string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  onCountrySelect,
  className = '!w-12 [&_.ant-select-selector]:!border-none',
  dropdownWidth = '160px',
}) => {
  const dispatch = useAppDispatch();
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/data/countries.geojson');
        if (!response.ok) throw new Error('Failed to fetch countries');

        const geojson = await response.json();

        const options = geojson.features
          .map((feature: any) => ({
            value: feature.properties.ISO_A2, // Using ISO_A2 as value
            name: feature.properties.ADMIN, // Country name from ADMIN
            flag:
              feature.properties.icon || // Use embedded icon if available
              `https://flagcdn.com/w40/${feature.properties.ISO_A2.toLowerCase()}.png`,
            label: feature.properties.ADMIN, // Display name
          }))
          .sort((a: CountryOption, b: CountryOption) =>
            a.name.localeCompare(b.name)
          ); // Sort alphabetically by name;

        setCountryOptions(options);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = (name: string) => {
    const selectedCountry = countryOptions.find((c) => c.name === name); // Check by name
    if (selectedCountry) {
      dispatch(
        setSelectedCountry({
          code: selectedCountry.value,
          name: selectedCountry.name,
        })
      );
      onCountrySelect?.(name);
    }
  };

  if (loading) return <Select placeholder="Loading..." disabled />;
  if (error) return <Select placeholder="Error loading countries" disabled />;

  return (
    <Select
      placeholder={<GlobalOutlined />}
      onChange={handleCountrySelect} // Pass name instead of value
      className={className}
      bordered={false}
      dropdownStyle={{ minWidth: dropdownWidth }}
      suffixIcon={null}
      optionLabelProp="label"
      showSearch
      filterOption={
        (input, option) =>
          (typeof option?.value === 'string'
            ? option.value.toLowerCase()
            : ''
          ).includes(input.toLowerCase()) // Filter by label (name)
      }
    >
      {countryOptions.map((country) => (
        <Select.Option
          key={country.name}
          value={country.name} // Use name as the value
          title={country.name} // Show popup with the country name on hover
          label={
            <div className="flex items-center gap-2">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-5 h-3 object-cover"
              />
              <span>{country.name}</span>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <img
              src={country.flag}
              alt={`${country.name} flag`}
              className="w-5 h-3 object-cover"
            />
            <span className="truncate max-w-[100px]">{country.name}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default CountrySelect;
