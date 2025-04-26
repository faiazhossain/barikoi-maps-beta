export interface PlaceLocation {
  latitude: number;
  longitude: number;
}

export interface BasePlace extends PlaceLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  pType: string;
}

export interface PlaceSuggestion extends BasePlace {
  uCode: string;
}

export interface PlaceDetails extends PlaceSuggestion {
  subType?: string;
  postCode?: number;
  popularity_ranking?: number;
  country: string;
  country_code: string;
  distance_km?: number;
  district: string;
}

export interface PlaceApiResponse {
  status: number;
  message: string;
  place: PlaceDetails;
}
