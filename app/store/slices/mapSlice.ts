import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define marker coordinates interface
export interface MarkerCoords {
  latitude: number;
  longitude: number;
  properties?: {
    place_code?: string;
    name_en?: string;
    name_bn?: string;
    type?: string;
    subtype?: string;
    source?: string;
  };
}

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
  isMapLoaded: boolean;
  markerCoords: MarkerCoords | null;
}

const initialState: MapState = {
  viewport: {
    longitude: 90.3938,
    latitude: 23.8103,
    zoom: 12,
  },
  selectedLocation: null,
  mapStyle: "",
  showDirections: false,
  selectedCountry: null,
  isMapLoaded: false,
  markerCoords: null,
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
    setMapLoaded: (state, action: PayloadAction<boolean>) => {
      state.isMapLoaded = action.payload;
    },
    setMarkerCoords: (state, action: PayloadAction<MarkerCoords | null>) => {
      state.markerCoords = action.payload;
    },
  },
});

export const {
  setViewport,
  setSelectedLocation,
  setMapStyle,
  toggleDirections,
  setSelectedCountry,
  setMapLoaded,
  setMarkerCoords,
} = mapSlice.actions;

export default mapSlice.reducer;
