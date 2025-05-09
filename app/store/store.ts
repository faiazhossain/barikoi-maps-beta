'use client';

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import mapReducer from './slices/mapSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';
import drawerReducer from './slices/drawerSlice';
import mapillaryReducer from './slices/mapillarySlice';
import directionsReducer from './slices/directionsSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    search: searchReducer,
    ui: uiReducer,
    drawer: drawerReducer,
    mapillary: mapillaryReducer,
    directions: directionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
