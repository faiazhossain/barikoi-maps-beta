import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchTerm: string;
  suggestions: Array<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }>;
  isLoading: boolean;
  searchMode: "location" | "directions";
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
}

const initialState: SearchState = {
  searchTerm: "",
  suggestions: [],
  isLoading: false,
  searchMode: "location",
  startLocation: null,
  endLocation: null,
  selectedCategory: null,
  nearbyLocations: [],
};

const searchSlice = createSlice({
  name: "search",
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
      state.searchMode = "location";
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.suggestions = [];
    },
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
} = searchSlice.actions;

export default searchSlice.reducer;
