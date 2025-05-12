// app/api/autocomplete_planet/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const countryCode = searchParams.get('country_code') || 'BD'; // Default to Bangladesh
  const longitude = searchParams.get('lon');
  const latitude = searchParams.get('lat');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Construct the Barikoi API URL with parameters
    let apiUrl = `https://barikoi.xyz/v1/api/search/autocomplete/MjYyMzpHOVkzWFlGNjZG/place?q=${encodeURIComponent(
      query
    )}&country_code=${countryCode}`;

    // Add location parameters if provided
    if (longitude && latitude) {
      apiUrl += `&boundary.circle.lon=${longitude}&boundary.circle.lat=${latitude}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Barikoi API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match your expected format
    const places = data.places.map((place) => ({
      id: place.id,
      name: place.address,
      address: place.address,
      longitude: place.longitude,
      latitude: place.latitude,
      type: place.type,
    }));

    return NextResponse.json({ places });
  } catch (error) {
    console.error('Error fetching from Barikoi API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch autocomplete results' },
      { status: 500 }
    );
  }
}
