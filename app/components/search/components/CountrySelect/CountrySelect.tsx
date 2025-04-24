'use client';

import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { createAction } from '@reduxjs/toolkit';
import { FaFlag } from 'react-icons/fa';

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
  className = '!w-8 !mr-2 rounded-md [&_.ant-select-selector]:!border-none hover:!bg-gray-100 ',
  dropdownWidth = '160px',
}) => {
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/data/countries.geojson');
        if (!response.ok) throw new Error('Failed to fetch countries');

        const geojson = await response.json();

        const options = geojson.features
          .map(
            (feature: {
              properties: { ISO_A2: string; ADMIN: string; icon?: string };
            }) => ({
              value: feature.properties.ISO_A2,
              name: feature.properties.ADMIN,
              flag:
                feature.properties.icon ||
                `https://flagcdn.com/w40/${feature.properties.ISO_A2.toLowerCase()}.png`,
              label: feature.properties.ADMIN,
            })
          )
          .sort((a: CountryOption, b: CountryOption) =>
            a.name.localeCompare(b.name)
          );

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
    setSelectedCountry(name);
    // dispatch(setSelectedCountry({ code: value, name }));
    // onCountrySelect?.(name);
  };

  if (loading) return <Select placeholder="Loading.." disabled />;
  if (error) return <Select placeholder="Error loading countries" disabled />;

  return (
    <div className="relative group">
      <Select
        className={`${className}`}
        variant="borderless"
        dropdownStyle={{ minWidth: dropdownWidth }}
        suffixIcon={null}
        optionLabelProp="label"
        showSearch={false}
        value={selectedCountry}
        onChange={handleCountrySelect}
        title={selectedCountry || undefined}
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
                  setFilteredOptions(filteredOptions);
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
            value={country.name}
            title={country.name}
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
      {!selectedCountry && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FaFlag className="text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
