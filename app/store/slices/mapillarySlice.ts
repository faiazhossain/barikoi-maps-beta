import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapillaryState {
  isVisible: boolean;
  currentPosition: {
    imageId: string | null;
    lng: number | null;
    lat: number | null;
  };
}

const initialState: MapillaryState = {
  isVisible: false,
  currentPosition: {
    imageId: null,
    lng: null,
    lat: null,
  },
};

const mapillarySlice = createSlice({
  name: 'mapillary',
  initialState,
  reducers: {
    toggleMapillaryLayer: (state) => {
      state.isVisible = !state.isVisible;
    },
    setMapillaryVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    updateMapillaryPosition: (
      state,
      action: PayloadAction<{ imageId: string; lng: number; lat: number }>
    ) => {
      state.currentPosition = action.payload;
    },
  },
});

export const {
  toggleMapillaryLayer,
  setMapillaryVisible,
  updateMapillaryPosition,
} = mapillarySlice.actions;
export default mapillarySlice.reducer;
