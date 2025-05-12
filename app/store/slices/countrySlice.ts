import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CountryState {
  selectedCountry: string | null;
  selectedCountryCode: string | null;
}

const initialState: CountryState = {
  selectedCountry: null,
  selectedCountryCode: null,
};

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
    },
    setSelectedCountryCode: (state, action: PayloadAction<string | null>) => {
      state.selectedCountryCode = action.payload;
    },
  },
});

export const { setSelectedCountry, setSelectedCountryCode } =
  countrySlice.actions;
export default countrySlice.reducer;
