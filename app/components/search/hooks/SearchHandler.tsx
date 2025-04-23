// components/SearchBar/SearchHandler.tsx
'use client';
import { useState } from 'react';
import { setSuggestions } from '@/app/store/slices/searchSlice';
import { AppDispatch } from '@/app/store/store';

export const useSearchHandler = (dispatch: AppDispatch) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (value: string) => {
    if (!value) {
      dispatch(setSuggestions([]));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/autocomplete?query=${value}`);
      if (!response.ok) {
        throw new Error('Failed to fetch autocomplete suggestions');
      }
      const data = await response.json();
      dispatch(setSuggestions(data.places || []));
      setError(null);
    } catch (err) {
      console.error('Error fetching autocomplete suggestions:', err);
      setError('Failed to load suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { handleSearch, loading, error };
};
