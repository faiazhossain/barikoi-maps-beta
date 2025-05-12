// components/SearchBar/SearchHandler.tsx
'use client';
import { useEffect, useMemo } from 'react';
import { setSuggestions } from '@/app/store/slices/searchSlice';
import { AppDispatch, RootState, useAppSelector } from '@/app/store/store';
import debounce from 'lodash.debounce';

export const useSearchHandler = (dispatch: AppDispatch) => {
  // Get all needed state from Redux
  const { selectedCountry } = useAppSelector((state: RootState) => ({
    selectedCountry: state.map.selectedCountry,
  }));
  const selectedCountryCode = useAppSelector(
    (state) => state.country.selectedCountryCode
  );

  const { longitude, latitude } = useAppSelector(
    (state) => state.map.viewport || {}
  );

  const performSearch = async (value: string) => {
    if (!value?.trim()) {
      dispatch(setSuggestions([]));
      return;
    }

    try {
      const query = encodeURIComponent(value.trim());

      if (selectedCountry === 'Bangladesh') {
        const response = await fetch(`/api/autocomplete?query=${query}`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        dispatch(setSuggestions(data.places || []));
      } else {
        // Build URL with all available parameters
        const params = new URLSearchParams();
        params.append('query', query);

        if (selectedCountryCode) {
          params.append('country_code', selectedCountryCode);
        }

        if (longitude && latitude) {
          params.append('lon', longitude.toString());
          params.append('lat', latitude.toString());
        }

        const url = `/api/autocomplete_planet?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        dispatch(setSuggestions(data.places || []));
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      dispatch(setSuggestions([])); // Clear suggestions on error
    }
  };

  // Memoize the debounced search function with all dependencies
  const handleSearch = useMemo(
    () => debounce(performSearch, 300),
    [dispatch, selectedCountry, selectedCountryCode, longitude, latitude]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return { handleSearch };
};
