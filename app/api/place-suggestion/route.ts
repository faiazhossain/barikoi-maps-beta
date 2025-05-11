import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BARIKOI_API_TOKEN = 'MjYyMzpHOVkzWFlGNjZG';
const PLACE_SUGGESTION_API =
  'https://api.admin.barikoi.com/api/v2/add-place-suggestion';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Make the API request to Barikoi
    const response = await axios.post(PLACE_SUGGESTION_API, body, {
      headers: {
        Authorization: `Bearer ${BARIKOI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the successful response
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Place suggestion API error:', error);

    // Handle axios errors
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'API request failed' },
        { status: error.response.status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
