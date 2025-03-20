import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  selectedLocation: {
    longitude: number;
    latitude: number;
    name?: string;
  } | null;
  mapStyle: string;
  showDirections: boolean;
  selectedCountry: string | null;
}

const initialState: MapState = {
  viewport: {
    longitude: 90.3938,
    latitude: 23.8103,
    zoom: 12,
  },
  selectedLocation: null,
  mapStyle:
    "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_key",
  showDirections: false,
  selectedCountry: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setViewport: (state, action: PayloadAction<typeof state.viewport>) => {
      state.viewport = action.payload;
    },
    setSelectedLocation: (
      state,
      action: PayloadAction<typeof state.selectedLocation>
    ) => {
      state.selectedLocation = action.payload;
    },
    setMapStyle: (state, action: PayloadAction<string>) => {
      state.mapStyle = action.payload;
    },
    toggleDirections: (state) => {
      state.showDirections = !state.showDirections;
    },
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
    },
  },
});

export const {
  setViewport,
  setSelectedLocation,
  setMapStyle,
  toggleDirections,
  setSelectedCountry,
} = mapSlice.actions;

export default mapSlice.reducer;
