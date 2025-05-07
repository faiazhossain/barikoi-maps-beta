// Constants
export const MAPILLARY_TILE_URL =
  'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8';

export const MAPILLARY_ACCESS_TOKEN =
  'MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8';

// Types
export interface MapillaryFeature {
  type: 'image' | 'sequence';
  coordinates: [number, number];
  properties: any;
}

export interface MapillaryImageData {
  id: string;
  captured_at: number;
  compass_angle: number;
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  thumb_256_url?: string;
  thumb_1024_url?: string;
  thumb_2048_url?: string;
  thumb_original_url?: string;
  sequence?: string;
  camera_type?: string;
  height?: number;
  width?: number;
  creator?: {
    username: string;
    id: string;
  };
  is_pano?: boolean;
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

// Get thumbnail URL for an image
export const getMapillaryThumbnailUrl = (imageId: string): string => {
  return `https://graph.mapillary.com/${imageId}?access_token=${encodeURIComponent(
    MAPILLARY_ACCESS_TOKEN
  )}&fields=thumb_256_url,thumb_1024_url,thumb_2048_url,thumb_original_url`;
};

// Fetch image data from Mapillary API through our server-side API route
export const fetchMapillaryImageData = async (
  imageId: string
): Promise<MapillaryImageData | null> => {
  try {
    // Use our server-side API route instead of calling Mapillary directly
    const response = await fetch(`/api/mapillary?imageId=${imageId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch image data: ${response.status}`);
    }

    const data = await response.json();
    return data as MapillaryImageData;
  } catch (error) {
    console.error('Error fetching Mapillary image data:', error);
    return null;
  }
};

// Get the viewer URL for a specific image
export const getMapillaryViewerUrl = (imageId: string): string => {
  return `https://www.mapillary.com/app/?focus=photo&pKey=${imageId}`;
};
