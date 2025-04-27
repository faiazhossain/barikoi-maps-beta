import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchPlaceDetails = createAsyncThunk(
  'search/fetchPlaceDetails',
  async (uCode: string) => {
    const response = await fetch(`/api/place/${uCode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch place details');
    }
    const data = await response.json();
    return data;
  }
);

interface SearchState {
  searchTerm: string;
  suggestions: Array<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    area: string;
    pType: string;
  }>;
  isLoading: boolean;
  searchMode: 'location' | 'directions';
  startLocation: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  endLocation: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  selectedCategory: string | null;
  nearbyLocations: Array<{
    id: string;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  }>;
  selectedPlace: {
    id: string;
    name: string;
    address: string;
    pType: string;
    subType?: string;
    postCode?: number;
    popularity_ranking?: number;
    country: string;
    country_code: string;
    latitude: number;
    longitude: number;
    distance_km?: number;
    district: string;
    area: string;
    city: string;
    uCode: string;
  } | null;
  placeDetails: any | null;
  placeDetailsLoading: boolean;
  placeDetailsError: string | null;
}

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
    setSuggestions: (
      state,
      action: PayloadAction<typeof state.suggestions>
    ) => {
      state.suggestions = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearchMode: (state, action: PayloadAction<typeof state.searchMode>) => {
      state.searchMode = action.payload;
    },
    setStartLocation: (
      state,
      action: PayloadAction<typeof state.startLocation>
    ) => {
      state.startLocation = action.payload;
    },
    setEndLocation: (
      state,
      action: PayloadAction<typeof state.endLocation>
    ) => {
      state.endLocation = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setNearbyLocations: (
      state,
      action: PayloadAction<typeof state.nearbyLocations>
    ) => {
      state.nearbyLocations = action.payload;
    },
    clearDirections: (state) => {
      state.startLocation = null;
      state.endLocation = null;
      state.searchMode = 'location';
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.suggestions = [];
    },
    setSelectedPlace: (
      state,
      action: PayloadAction<typeof state.selectedPlace>
    ) => {
      state.selectedPlace = action.payload;
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
