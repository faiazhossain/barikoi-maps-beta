// components/SearchBar/SearchHandler.tsx
'use client';
import { useMemo } from 'react';
import { setSuggestions } from '@/app/store/slices/searchSlice';
import { AppDispatch } from '@/app/store/store';
import debounce from 'lodash.debounce';

export const useSearchHandler = (dispatch: AppDispatch) => {
  const performSearch = async (value: string) => {
    if (!value) {
      dispatch(setSuggestions([]));
      return;
    }

    try {
      const response = await fetch(`/api/autocomplete?query=${value}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      dispatch(setSuggestions(data.places || []));
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleSearch = useMemo(
    () => debounce(performSearch, 300),
    [dispatch] // Only recreate if dispatch changes
  );

  return { handleSearch };
};
