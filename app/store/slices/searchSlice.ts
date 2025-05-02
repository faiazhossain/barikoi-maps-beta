import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SearchState,
  SearchMode,
  Location,
  Place,
  Suggestion,
  NearbyLocation,
} from '@/app/types/search';
import { fetchPlaceDetails } from '../thunks/searchThunks';

const initialState: SearchState = {
  searchTerm: '',
  suggestions: [],
  isLoading: false,
  searchMode: 'location',
  startLocation: null,
  endLocation: null,
  selectedCategory: null,
  nearbyLocations: [],
  selectedPlace: null,
  placeDetails: null,
  placeDetailsLoading: false,
  placeDetailsError: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<Suggestion[]>) => {
      state.suggestions = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearchMode: (state, action: PayloadAction<SearchMode>) => {
      state.searchMode = action.payload;
    },
    setStartLocation: (state, action: PayloadAction<Location | null>) => {
      state.startLocation = action.payload;
    },
    setEndLocation: (state, action: PayloadAction<Location | null>) => {
      state.endLocation = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setNearbyLocations: (state, action: PayloadAction<NearbyLocation[]>) => {
      state.nearbyLocations = action.payload;
    },
    setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
      state.selectedPlace = action.payload;
    },
    clearDirections: (state) => {
      state.startLocation = null;
      state.endLocation = null;
      state.searchMode = 'location';
    },
    clearSearch: (state) => {
      // Reset all search related states to initial values
      state.searchTerm = '';
      state.suggestions = [];
      state.selectedPlace = null;
      state.placeDetails = null;
      state.placeDetailsLoading = false;
      state.placeDetailsError = null;
      state.isLoading = false;
      state.searchMode = 'location';
      state.startLocation = null;
      state.endLocation = null;
      state.selectedCategory = null;
      state.nearbyLocations = [];
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
      });
  },
});

export const {
  setSearchTerm,
  setSuggestions,
  setIsLoading,
  setSearchMode,
  setStartLocation,
  setEndLocation,
  setSelectedCategory,
  setNearbyLocations,
  clearDirections,
  clearSearch,
  setSelectedPlace,
} = searchSlice.actions;

export default searchSlice.reducer;
