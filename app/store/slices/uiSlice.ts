import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isTopPanelVisible: boolean;
  isLargeScreen: boolean;
  // ...other UI state
}

const initialState: UiState = {
  isTopPanelVisible: true,
  isLargeScreen: true, // Default value, will be updated on mount
  // ...other UI initial state
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTopPanelVisible: (state, action: PayloadAction<boolean>) => {
      state.isTopPanelVisible = action.payload;
    },
    setIsLargeScreen: (state, action: PayloadAction<boolean>) => {
      state.isLargeScreen = action.payload;
    },
    // ...other UI reducers
  },
});

export const { setTopPanelVisible, setIsLargeScreen } = uiSlice.actions;
export default uiSlice.reducer;
