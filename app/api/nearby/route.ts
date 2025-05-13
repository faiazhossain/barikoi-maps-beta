import { NextRequest, NextResponse } from "next/server";
/**
 * Handles all nearby search requests by routing to the appropriate Barikoi API endpoint
 * Supports three types of searches:
 * 1. Simple nearby search - all POIs within a radius
 * 2. Category search - POIs of a specific type within a radius
 * 3. Multi-category search - POIs of multiple types within a radius
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Common parameters
  const longitude = searchParams.get("longitude");
  const latitude = searchParams.get("latitude");
  const radius = searchParams.get("radius") || "0.5"; // Default to 0.5 km
  const limit = searchParams.get("limit") || "10"; // Default to 10 results

  const categories = searchParams.get("categories");
  const API_KEY = process.env.MAP_API_ACCESS_TOKEN;

  // Validate required parameters
  if (!longitude || !latitude) {
    return NextResponse.json(
      { error: "Longitude and latitude parameters are required" },
      { status: 400 }
    );
  }

  let apiUrl = "";

  // Determine which API to call based on the parameters
  if (categories) {
    // Single category search
    apiUrl = `https://barikoi.xyz/v2/api/search/nearby/category/${radius}/${limit}?api_key=${API_KEY}&longitude=${longitude}&latitude=${latitude}&ptype=${categories}`;
  } else {
    // Default nearby search if no category is specified
    apiUrl = `https://barikoi.xyz/v2/api/search/nearby/${radius}/${limit}?api_key=${API_KEY}&longitude=${longitude}&latitude=${latitude}`;
  }

  try {
    // Add a unique cache-busting parameter to prevent duplicate requests
    const timestamp = Date.now();
    apiUrl += `&_t=${timestamp}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Nearby search API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
