import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DrawerProps } from 'antd';

interface DrawerState {
  isLeftBarOpen: boolean;

  placement: DrawerProps['placement'];
  width: number | string; // Changed to support string values like '100%'
  height: number | string; // New property for mobile height
  isExpanded: boolean; // New property to track expanded state
}

const initialState: DrawerState = {
  isLeftBarOpen: false,

  placement: 'left',
  width: 400, // Default width for desktop
  height: '100%', // Default height for desktop
  isExpanded: false, // Default collapsed state
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isLeftBarOpen = true;
    },
    openLeftBar: (state) => {
      state.isLeftBarOpen = true;
    },
    toggleDrawer: (state) => {
      state.isLeftBarOpen = !state.isLeftBarOpen;
    },
    closeDrawer: (state) => {
      state.isLeftBarOpen = false;
    },
    closeLeftBar: (state) => {
      state.isLeftBarOpen = false;
    },
    setDrawerDimensions: (
      state,
      action: PayloadAction<{
        placement?: DrawerProps['placement'];
        width?: number | string;
        height?: number | string;
        isExpanded?: boolean;
      }>
    ) => {
      if (action.payload.placement !== undefined) {
        state.placement = action.payload.placement;
      }
      if (action.payload.width !== undefined) {
        state.width = action.payload.width;
      }
      if (action.payload.height !== undefined) {
        state.height = action.payload.height;
      }
      if (action.payload.isExpanded !== undefined) {
        state.isExpanded = action.payload.isExpanded;
      }
    },
    toggleExpand: (state) => {
      state.isExpanded = !state.isExpanded;
      state.height = state.isExpanded ? '100vh' : 300;
    },
    // Keep the old setDrawerWidth for backward compatibility
    setDrawerWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
  },
});

export const {
  toggleDrawer,
  closeDrawer,
  openDrawer,
  openLeftBar,
  closeLeftBar,
  setDrawerDimensions,
  toggleExpand,
  setDrawerWidth,
} = drawerSlice.actions;

export default drawerSlice.reducer;
