import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const MAP_API_ACCESS_TOKEN = process.env.MAP_API_ACCESS_TOKEN;

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://barikoi.xyz/v1/api/search/autocomplete/${MAP_API_ACCESS_TOKEN}/place?q=${query}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch autocomplete data');
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the data to the frontend
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
