import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const countryCode = searchParams.get("country_code") || "BD";
  const longitude = searchParams.get("longitude");
  const latitude = searchParams.get("latitude");
  const MAP_API_ACCESS_TOKEN = process.env.MAP_API_ACCESS_TOKEN;

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    let apiUrl;

    if (countryCode === "BD") {
      // Use existing API for Bangladesh
      apiUrl = `https://barikoi.xyz/api/v2/autocomplete/new?country_code=BD&key=${MAP_API_ACCESS_TOKEN}&q=${query}&source=barikoi&focus_lon=90.3836733&focus_lat=23.8222929`;
    } else {
      // Use different API for other countries
      apiUrl = `https://barikoi.xyz/v1/api/search/autocomplete/${MAP_API_ACCESS_TOKEN}/place?q=${query}&country_code=${countryCode}`;

      // Add boundary circle parameters if coordinates are provided
      if (longitude && latitude) {
        apiUrl += `&boundary.circle.lon=${longitude}&boundary.circle.lat=${latitude}`;
      }
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch autocomplete data");
    }

    const data = await response.json();
    console.log("🚀 ~ GET ~ data:", data);

    // Transform the response for non-BD countries to match the BD response format
    if (countryCode !== "BD") {
      const transformedData = {
        places: data.places.map((place: any) => ({
          id: place.id,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address,
          city: place.city || "",
          area: place.area || "",
          pType: "Custom", // Add a default place type
          uCode: place.id, // Use the place id as uCode
          confidence: 1,
        })),
        status: 200,
      };
      return NextResponse.json(transformedData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching autocomplete data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
