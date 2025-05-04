import { createAsyncThunk } from '@reduxjs/toolkit';
import { setPlaceDetails } from '../slices/searchSlice';

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

export const fetchReverseGeocode = createAsyncThunk(
  'search/reverseGeocode',
  async (
    { latitude, longitude }: { latitude: number; longitude: number },
    { dispatch }
  ) => {
    try {
      // Use our server-side API route instead of calling directly
      const response = await fetch(
        `/api/geocode/reverse?latitude=${latitude}&longitude=${longitude}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reverse geocode data');
      }

      const data = await response.json();

      if (data.status === 200 && data.place) {
        // Dispatch action to update place details in Redux store
        dispatch(setPlaceDetails(data.place));
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching reverse geocode:', error);
      throw error;
    }
  }
);

// Add other thunks here
