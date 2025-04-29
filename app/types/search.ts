export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Suggestion {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  pType: string;
}

export interface NearbyLocation {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  pType: string;
  subType?: string;
  postCode?: number;
  popularity_ranking?: number;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  district: string;
  area: string;
  city: string;
  uCode: string;
}

export type SearchMode = 'location' | 'directions';

export interface SearchState {
  searchTerm: string;
  suggestions: Suggestion[];
  isLoading: boolean;
  searchMode: SearchMode;
  startLocation: Location | null;
  endLocation: Location | null;
  selectedCategory: string | null;
  nearbyLocations: NearbyLocation[];
  selectedPlace: Place | null;
  placeDetails: any | null;
  placeDetailsLoading: boolean;
  placeDetailsError: string | null;
}
