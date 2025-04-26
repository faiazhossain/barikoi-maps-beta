import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { uCode: string } }
) {
  const { uCode } = params;

  try {
    const response = await fetch(
      `https://api.admin.barikoi.com/api/v2/place/without/auth/${uCode}`,
      {
        headers: {
          Authorization: `Bearer MjYyMzpHOVkzWFlGNjZG`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch place details`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
