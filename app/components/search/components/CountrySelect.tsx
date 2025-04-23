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
  const [filteredOptions, setFilteredOptions] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
        setFilteredOptions(options);
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
      showSearch={false} // Disable default search behavior
      value={
        filteredOptions.find((country) => country.name === searchTerm)?.name
      }
      title={
        filteredOptions.find((country) => country.name === searchTerm)?.name
      } // Show the name on hover
      dropdownRender={(menu) => (
        <div>
          <div className="p-2">
            <input
              type="text"
              placeholder="Search country..."
              className="w-full p-[3px] border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-100"
              onChange={(e) => {
                const input = e.target.value.toLowerCase();
                const filteredOptions = countryOptions.filter((country) =>
                  country.name.toLowerCase().includes(input)
                );
                setFilteredOptions(filteredOptions); // Update filtered options
                setSearchTerm(input);
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
          value={country.name} // Use name as the value
          title={country.name} // Show popup with the country name on hover
          label={
            <div className="flex items-center gap-4">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-5 h-5 object-cover"
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
