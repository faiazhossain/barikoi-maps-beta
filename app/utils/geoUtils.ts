/**
 * Utility functions for geographic operations
 */

// Cache for country-point lookups to improve performance
let countriesCache: any = null;
let countriesCachePromise: Promise<any> | null = null;

// Define proper types for GeoJSON structures
type Position = [number, number];
type LinearRing = Position[];
type Polygon = LinearRing[];
type MultiPolygon = Polygon[];

/**
 * Point in Polygon check using ray casting algorithm
 */
export function pointInPolygon(
  point: Position,
  multiPolygon: MultiPolygon
): boolean {
  // For MultiPolygon geometries, check each polygon
  for (const polygon of multiPolygon) {
    // For Polygons, check the outer ring (first array)
    const outerRing = polygon[0];

    // If the point is in the outer ring, return true
    if (outerRing && pointInRing(point, outerRing)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a point is inside a single polygon ring
 */
function pointInRing(point: Position, ring: LinearRing): boolean {
  if (!ring || ring.length < 3) return false;

  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i]?.[0];
    const yi = ring[i]?.[1];
    const xj = ring[j]?.[0];
    const yj = ring[j]?.[1];

    // If any coordinates are undefined, skip this iteration
    if (
      xi === undefined ||
      yi === undefined ||
      xj === undefined ||
      yj === undefined
    ) {
      continue;
    }

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Loads the countries GeoJSON data, with caching
 */
async function loadCountriesData(): Promise<any> {
  if (countriesCache) {
    return countriesCache;
  }

  // If there's already a promise loading the data, return it
  if (countriesCachePromise) {
    return countriesCachePromise;
  }

  // Create a new promise to load the data
  countriesCachePromise = fetch('/data/countries.geojson')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch countries data');
      return response.json();
    })
    .then((data) => {
      countriesCache = data; // Cache the data
      countriesCachePromise = null; // Clear the promise
      return data;
    })
    .catch((error) => {
      console.error('Error loading countries data:', error);
      countriesCachePromise = null; // Clear the promise on error
      throw error;
    });

  return countriesCachePromise;
}

/**
 * Checks if a point is inside any country in a GeoJSON collection
 * @param lng Longitude
 * @param lat Latitude
 * @returns The country object if found, null otherwise
 */
export async function findCountryAtPoint(
  lng: number,
  lat: number
): Promise<any> {
  try {
    // Get the cached GeoJSON data or load it
    const geojson = await loadCountriesData();
    const point: Position = [lng, lat];

    // Check each country's geometry
    for (const feature of geojson.features) {
      const geometry = feature.geometry;

      if (geometry.type === 'Polygon') {
        if (pointInRing(point, geometry.coordinates[0])) {
          return feature;
        }
      } else if (geometry.type === 'MultiPolygon') {
        if (pointInPolygon(point, geometry.coordinates)) {
          return feature;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding country at point:', error);
    return null;
  }
}

/**
 * Finds a country by its name in the GeoJSON data
 * @param countryName The name of the country to find
 * @returns The country feature if found, null otherwise
 */
export async function findCountryByName(countryName: string): Promise<any> {
  try {
    // Get the cached GeoJSON data or load it
    const geojson = await loadCountriesData();

    // Find the country by name (ADMIN property)
    const feature = geojson.features.find(
      (feature: any) => feature.properties.ADMIN === countryName
    );

    return feature || null;
  } catch (error) {
    console.error('Error finding country by name:', error);
    return null;
  }
}

/**
 * Calculates the bounding box of a country's geometry
 * @param geometry The GeoJSON geometry object
 * @returns An array of [west, south, east, north] coordinates
 */
export function calculateBoundingBox(
  geometry: any
): [number, number, number, number] {
  let minLng = 180;
  let minLat = 90;
  let maxLng = -180;
  let maxLat = -90;
  const processCoordinates = (coordinates: Array<number | undefined>) => {
    const [lng, lat] = coordinates;

    // Check if lng and lat are defined before comparing
    if (typeof lng === 'number' && typeof lat === 'number') {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  };
  const processPolygon = (polygonCoordinates: any[]) => {
    // Process each ring of coordinates
    for (const ring of polygonCoordinates) {
      if (Array.isArray(ring)) {
        for (const coordinate of ring) {
          if (Array.isArray(coordinate) && coordinate.length >= 2) {
            processCoordinates(coordinate);
          }
        }
      }
    }
  };

  if (geometry.type === 'Polygon') {
    processPolygon(geometry.coordinates);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      processPolygon(polygon);
    }
  }

  return [minLng, minLat, maxLng, maxLat];
}
