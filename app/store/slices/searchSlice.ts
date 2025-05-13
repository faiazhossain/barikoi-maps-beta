import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPlaceDetails, fetchReverseGeocode } from "../thunks/searchThunks";
import { NearbyPlace } from "@/app/types/map";

interface SearchState {
  searchTerm: string;
  suggestions: any[];
  searchMode: "search" | "directions";
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
  hoveredNearbyPlaceId: string | null; // Add this property
  selectedInternationalPlace: {
    id: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  } | null;
}

const initialState: SearchState = {
  searchTerm: "",
  suggestions: [],
  searchMode: "search",
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
  hoveredNearbyPlaceId: null, // Add initial value
  selectedInternationalPlace: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<any[]>) => {
      state.suggestions = action.payload;
    },
    setSearchMode: (state, action: PayloadAction<"search" | "directions">) => {
      state.searchMode = action.payload;
    },
    setSelectedPlace: (state, action: PayloadAction<any | null>) => {
      state.selectedPlace = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.suggestions = [];
      state.selectedPlace = null;
      state.placeDetails = null;
      state.placeDetailsError = null;
      state.selectedInternationalPlace = null;
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
      state.searchTerm = "";
      state.suggestions = [];
      // Add any other direction-specific state you want to clear
    },
    setPlaceDetails: (state, action: PayloadAction<any | null>) => {
      state.placeDetails = action.payload;
    },
    setHoveredNearbyPlace: (state, action: PayloadAction<string | null>) => {
      state.hoveredNearbyPlaceId = action.payload;
    },
    setSelectedInternationalPlace: (
      state,
      action: PayloadAction<SearchState["selectedInternationalPlace"]>
    ) => {
      state.selectedInternationalPlace = action.payload;
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
          action.error.message || "Failed to fetch details";
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
          action.error.message || "Failed to reverse geocode";
      });
  },
});

export const {
  setSearchTerm,
  setSuggestions,
  setSearchMode,
  setSelectedPlace,
  clearSearch,
  clearDirections,
  setNearbyPlaces,
  setNearbyLoading,
  setNearbyError,
  setSelectedCategories,
  setCurrentRadius,
  clearNearbySearch,
  setPlaceDetails, // Add this line
  setHoveredNearbyPlace, // Add this line
  setSelectedInternationalPlace,
} = searchSlice.actions;

export default searchSlice.reducer;
