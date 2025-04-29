import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPlaceDetails = createAsyncThunk(
  'search/fetchPlaceDetails',
  async (uCode: string) => {
    const response = await fetch(`/api/place/${uCode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch place details');
    }
    return response.json();
  }
);

// Add other thunks here
