// Constants
export const MAPILLARY_TILE_URL =
  'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8';

// Types
export interface MapillaryFeature {
  type: 'image' | 'sequence';
  coordinates: [number, number];
  properties: any;
}

// Helper functions
export const formatDate = (timestamp: number): string => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
