import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the location interface
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  placeCode?: string;
}

// Interface for route instructions
export interface RouteInstruction {
  distance: number;
  heading?: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
}

// Interface for route data
export interface Route {
  distance: number;
  time: number;
  points: {
    type: string;
    coordinates: [number, number][];
  };
  bbox: number[];
  instructions: RouteInstruction[];
}

// State interface
interface DirectionsState {
  origin: Location | null;
  destination: Location | null;
  waypoints: Location[];
  route: Route | null;
  routeLoading: boolean;
  routeError: string | null;
  originSearch: string;
  destinationSearch: string;
  transportMode: 'car' | 'bike' | 'motorcycle';
}

// Initial state
const initialState: DirectionsState = {
  origin: null,
  destination: null,
  waypoints: [],
  route: null,
  routeLoading: false,
  routeError: null,
  originSearch: '',
  destinationSearch: '',
  transportMode: 'car',
};

// Async thunk for fetching route
export const fetchRoute = createAsyncThunk(
  'directions/fetchRoute',
  async (
    {
      origin,
      destination,
      waypoints = [],
      mode = 'car',
    }: {
      origin: Location;
      destination: Location;
      waypoints?: Location[];
      mode?: 'car' | 'bike' | 'motorcycle';
    },
    { rejectWithValue }
  ) => {
    try {
      // Build the URL with points
      let url = 'https://geoserver.bmapsbd.com/gh/route?';

      // Add origin
      url += `point=${origin.latitude},${origin.longitude}`;

      // Add waypoints if any
      waypoints.forEach((point) => {
        url += `&point=${point.latitude},${point.longitude}`;
      });

      // Add destination
      url += `&point=${destination.latitude},${destination.longitude}`;

      // Add other parameters with the selected transport mode
      url += `&locale=en-us&elevation=false&profile=${mode}&optimize=true&use_miles=false&layer=Barikoi&points_encoded=false`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data = await response.json();
      return data.paths[0] as Route;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch route');
    }
  }
);

// Create the directions slice
const directionsSlice = createSlice({
  name: 'directions',
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<Location | null>) => {
      state.origin = action.payload;
    },
    setDestination: (state, action: PayloadAction<Location | null>) => {
      state.destination = action.payload;
    },
    addWaypoint: (state, action: PayloadAction<Location>) => {
      state.waypoints.push(action.payload);
    },
    removeWaypoint: (state, action: PayloadAction<number>) => {
      state.waypoints.splice(action.payload, 1);
    },
    clearRoute: (state) => {
      state.route = null;
      state.routeError = null;
    },
    clearDirections: () => {
      return initialState;
    },
    swapLocations: (state) => {
      const temp = state.origin;
      state.origin = state.destination;
      state.destination = temp;

      // Also swap the search terms
      const tempSearch = state.originSearch;
      state.originSearch = state.destinationSearch;
      state.destinationSearch = tempSearch;
    },
    setOriginSearch: (state, action: PayloadAction<string>) => {
      state.originSearch = action.payload;
    },
    setDestinationSearch: (state, action: PayloadAction<string>) => {
      state.destinationSearch = action.payload;
    },
    setTransportMode: (
      state,
      action: PayloadAction<'car' | 'bike' | 'motorcycle'>
    ) => {
      state.transportMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoute.pending, (state) => {
        state.routeLoading = true;
        state.routeError = null;
      })
      .addCase(fetchRoute.fulfilled, (state, action) => {
        state.routeLoading = false;
        state.route = action.payload;
      })
      .addCase(fetchRoute.rejected, (state, action) => {
        state.routeLoading = false;
        state.routeError = action.payload as string;
      });
  },
});

// Export actions
export const {
  setOrigin,
  setDestination,
  addWaypoint,
  removeWaypoint,
  clearRoute,
  clearDirections,
  swapLocations,
  setOriginSearch,
  setDestinationSearch,
  setTransportMode,
} = directionsSlice.actions;

// Export reducer
export default directionsSlice.reducer;
