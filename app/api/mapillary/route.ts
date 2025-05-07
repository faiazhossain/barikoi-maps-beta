import { NextRequest, NextResponse } from 'next/server';

const MAPILLARY_ACCESS_TOKEN =
  'MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageId = searchParams.get('imageId');

  if (!imageId) {
    return NextResponse.json(
      { error: 'Image ID is required' },
      { status: 400 }
    );
  }

  try {
    // Request specific fields including thumbnail URLs
    const fields = [
      'id',
      'captured_at',
      'compass_angle',
      'geometry',
      'thumb_256_url',
      'thumb_1024_url',
      'thumb_2048_url',
      'thumb_original_url',
      'sequence',
      'camera_type',
      'height',
      'width',
      'creator',
      'is_pano',
    ].join(',');

    // Fetch data from Mapillary API
    const response = await fetch(
      `https://graph.mapillary.com/${imageId}?access_token=${MAPILLARY_ACCESS_TOKEN}&fields=${fields}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(
        `Mapillary API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Mapillary data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Mapillary data' },
      { status: 500 }
    );
  }
}
