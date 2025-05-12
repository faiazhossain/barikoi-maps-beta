import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountryState {
  selectedCountry: string | null;
}

const initialState: CountryState = {
  selectedCountry: null,
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
    },
  },
});

export const { setSelectedCountry } = countrySlice.actions;
export default countrySlice.reducer;
