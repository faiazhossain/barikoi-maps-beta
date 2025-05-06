import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapillaryState {
  isVisible: boolean;
}

const initialState: MapillaryState = {
  isVisible: false,
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
  },
});

export const { toggleMapillaryLayer, setMapillaryVisible } =
  mapillarySlice.actions;
export default mapillarySlice.reducer;
