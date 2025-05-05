/**
 * Interface representing nearby place data from the API
 */
export interface NearbyPlace {
  id: number;
  name: string;
  distance_in_meters: string;
  longitude: string;
  latitude: string;
  city: string;
  area: string;
  pType: string;
  subType: string;
  postCode: string;
  Address: string;
  uCode: string;
  // Add any other properties that might exist in the API response
}
