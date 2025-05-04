import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: 'Latitude and longitude parameters are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.admin.barikoi.com/api/v2/search/reverse/geocode?latitude=${latitude}&longitude=${longitude}`,
      {
        headers: {
          Authorization: `Bearer MjYyMzpHOVkzWFlGNjZG`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch reverse geocode data: ${response.status}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reverse geocode data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reverse geocode data' },
      { status: 500 }
    );
  }
}
