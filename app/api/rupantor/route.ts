import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the raw FormData
    const formData = await request.formData();

    // Forward directly to Barikoi API
    const response = await fetch(
      'https://barikoi.xyz/v2/api/search/rupantor/geocode?api_key=MjYyMzpHOVkzWFlGNjZG',
      {
        method: 'POST',
        body: formData, // Pass through the FormData directly
        headers: {
          // Let the browser set Content-Type with boundary automatically
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Rupantor API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    );
  }
}
