'use client';

import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/app/store/store';
import { setSelectedCountry } from '@/app/store/slices/mapSlice';
import { useCountries } from '@/hooks/useCountries';

interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

interface CountrySelectProps {
  onCountrySelect?: (value: string) => void;
  className?: string;
  dropdownWidth?: number | string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  onCountrySelect,
  className = '!w-12 [&_.ant-select-selector]:!border-none',
  dropdownWidth = '120px',
}) => {
  const dispatch = useAppDispatch();
  const { countries, loading, error } = useCountries();

  const countryOptions: CountryOption[] = React.useMemo(() => {
    return countries.map((country) => ({
      value: country.iso,
      label: country.name,
      flag: country.flag,
    }));
  }, [countries]);

  const handleCountrySelect = (value: string) => {
    dispatch(setSelectedCountry(value));
    onCountrySelect?.(value);
  };

  if (loading) return <Select placeholder="Loading..." disabled />;
  if (error) return <Select placeholder="Error loading countries" disabled />;

  return (
    <Select
      placeholder={<GlobalOutlined />}
      onChange={handleCountrySelect}
      className={className}
      bordered={false}
      dropdownStyle={{ minWidth: dropdownWidth }}
      suffixIcon={null}
      options={countryOptions.map((country) => ({
        value: country.value,
        label: (
          <div className="flex items-center gap-2">
            <img
              src={country.flag}
              alt={`${country.label} flag`}
              className="w-5 h-3 object-cover"
            />
            <span className="truncate max-w-[100px]">{country.label}</span>
          </div>
        ),
      }))}
    />
  );
};

export default CountrySelect;
