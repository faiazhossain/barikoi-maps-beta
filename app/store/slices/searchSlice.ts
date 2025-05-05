import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPlaceDetails, fetchReverseGeocode } from '../thunks/searchThunks';

// Define nearby place interface
export interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  pType: string;
  city: string;
  area: string;
  postCode: string;
  uCode: string;
  distance: number;
  latitude: number;
  longitude: number;
}

interface SearchState {
  searchTerm: string;
  suggestions: any[];
  searchMode: 'search' | 'directions';
  selectedPlace: any | null;
  placeDetails: any | null;
  placeDetailsLoading: boolean;
  placeDetailsError: string | null;
  reverseGeocodeLoading: boolean; // Add this property
  nearbyPlaces: NearbyPlace[];
  nearbyLoading: boolean;
  nearbyError: string | null;
  selectedCategories: string[];
  currentRadius: number;
}

const initialState: SearchState = {
  searchTerm: '',
  suggestions: [],
  searchMode: 'search',
  selectedPlace: null,
  placeDetails: null,
  placeDetailsLoading: false,
  placeDetailsError: null,
  reverseGeocodeLoading: false, // Add initial value
  nearbyPlaces: [],
  nearbyLoading: false,
  nearbyError: null,
  selectedCategories: [],
  currentRadius: 0.5, // Default 0.5 km radius
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<any[]>) => {
      state.suggestions = action.payload;
    },
    setSearchMode: (state, action: PayloadAction<'search' | 'directions'>) => {
      state.searchMode = action.payload;
    },
    setSelectedPlace: (state, action: PayloadAction<any | null>) => {
      state.selectedPlace = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.suggestions = [];
      state.selectedPlace = null;
      state.placeDetails = null;
      state.placeDetailsError = null;
    },
    // Nearby search actions
    setNearbyPlaces: (state, action: PayloadAction<NearbyPlace[]>) => {
      state.nearbyPlaces = action.payload;
    },
    setNearbyLoading: (state, action: PayloadAction<boolean>) => {
      state.nearbyLoading = action.payload;
    },
    setNearbyError: (state, action: PayloadAction<string | null>) => {
      state.nearbyError = action.payload;
    },
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    setCurrentRadius: (state, action: PayloadAction<number>) => {
      state.currentRadius = action.payload;
    },
    clearNearbySearch: (state) => {
      state.nearbyPlaces = [];
      state.nearbyError = null;
      state.selectedCategories = [];
    },
    // Add this new action
    clearDirections: (state) => {
      // Reset direction-related state
      state.searchTerm = '';
      state.suggestions = [];
      // Add any other direction-specific state you want to clear
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceDetails.pending, (state) => {
        state.placeDetailsLoading = true;
        state.placeDetailsError = null;
      })
      .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
        state.placeDetailsLoading = false;
        state.placeDetails = action.payload;
      })
      .addCase(fetchPlaceDetails.rejected, (state, action) => {
        state.placeDetailsLoading = false;
        state.placeDetailsError =
          action.error.message || 'Failed to fetch details';
      })
      .addCase(fetchReverseGeocode.pending, (state) => {
        state.reverseGeocodeLoading = true; // Use the new property
        state.placeDetailsError = null;
      })
      .addCase(fetchReverseGeocode.fulfilled, (state, action) => {
        state.reverseGeocodeLoading = false; // Use the new property
        state.placeDetails = action.payload;
      })
      .addCase(fetchReverseGeocode.rejected, (state, action) => {
        state.reverseGeocodeLoading = false; // Use the new property
        state.placeDetailsError =
          action.error.message || 'Failed to reverse geocode';
      });
  },
});

export const {
  setSearchTerm,
  setSuggestions,
  setSearchMode,
  setSelectedPlace,
  clearSearch,
  clearDirections, // Add this export
  setNearbyPlaces,
  setNearbyLoading,
  setNearbyError,
  setSelectedCategories,
  setCurrentRadius,
  clearNearbySearch,
} = searchSlice.actions;

export default searchSlice.reducer;
