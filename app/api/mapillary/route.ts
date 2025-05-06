import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const z = searchParams.get('z');
  const x = searchParams.get('x');
  const y = searchParams.get('y');

  if (!z || !x || !y) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Your API key is now stored server-side
  const API_KEY = 'MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8';

  try {
    const response = await fetch(
      `https://tiles.mapillary.com/maps/vtp/mly1_public/2/${z}/${x}/${y}?access_token=${API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('Failed to fetch mapillary tiles');
    }

    // Get the response as array buffer for vector tiles
    const buffer = await response.arrayBuffer();

    // Return with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching mapillary tiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tiles' },
      { status: 500 }
    );
  }
}
