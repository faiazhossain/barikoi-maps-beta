import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isTopPanelVisible: boolean;
}

const initialState: UIState = {
  isTopPanelVisible: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTopPanel: (state) => {
      state.isTopPanelVisible = !state.isTopPanelVisible;
    },
    setTopPanelVisibility: (state, action) => {
      state.isTopPanelVisible = action.payload;
    },
  },
});

export const { toggleTopPanel, setTopPanelVisibility } = uiSlice.actions;
export default uiSlice.reducer;
