import { RootState } from '../store';

export const selectSearchTerm = (state: RootState) => state.search.searchTerm;
export const selectSuggestions = (state: RootState) => state.search.suggestions;
export const selectIsLoading = (state: RootState) =>
  state.search.placeDetailsLoading ||
  state.search.reverseGeocodeLoading ||
  state.search.nearbyLoading;
export const selectSearchMode = (state: RootState) => state.search.searchMode;
export const selectSelectedPlace = (state: RootState) =>
  state.search.selectedPlace;
export const selectPlaceDetails = (state: RootState) =>
  state.search.placeDetails;
