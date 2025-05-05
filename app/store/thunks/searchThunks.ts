import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  setNearbyPlaces,
  setNearbyLoading,
  setNearbyError,
} from '../slices/searchSlice';

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
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
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
        return data.place;
      }

      return null;
    } catch (error) {
      console.error('Error fetching reverse geocode:', error);
      throw error;
    }
  }
);

/**
 * Fetch nearby places based on coordinates and optional filters
 */
export const fetchNearbyPlaces = createAsyncThunk(
  'search/fetchNearbyPlaces',
  async (
    {
      latitude,
      longitude,
      radius = 0.5,
      limit = 10,
      type = '',
      categories = '',
    }: {
      latitude?: number;
      longitude?: number;
      radius?: number;
      limit?: number;
      type?: string;
      categories?: string;
    },
    { dispatch, getState }
  ) => {
    try {
      dispatch(setNearbyLoading(true));

      // Get the state to access map viewport
      const state = getState() as RootState;

      // Use provided coordinates or fall back to viewport coordinates from Redux
      const lat = latitude || state.map.viewport.latitude;
      const lng = longitude || state.map.viewport.longitude;

      // Build query parameters
      const params = new URLSearchParams();
      params.append('latitude', lat.toString());
      params.append('longitude', lng.toString());
      params.append('radius', radius.toString());
      params.append('limit', limit.toString());

      if (type) {
        params.append('type', type);
      }

      if (categories) {
        params.append('categories', categories);
      }

      // Make API request
      const response = await fetch(`/api/nearby?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch nearby places: ${response.status}`);
      }

      const data = await response.json();

      // Format and store places
      const places = data.places || [];
      dispatch(setNearbyPlaces(places));
      dispatch(setNearbyError(null));

      return places;
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      dispatch(
        setNearbyError(error instanceof Error ? error.message : 'Unknown error')
      );
      throw error;
    } finally {
      dispatch(setNearbyLoading(false));
    }
  }
);

// Add other thunks here
