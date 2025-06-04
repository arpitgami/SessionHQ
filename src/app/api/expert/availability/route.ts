import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connect from "@/dbconfig/dbconfig";
import { ExpertAvailability } from "@/models/ExpertAvailability";

export async function POST(req: NextRequest) {
  // const { userId, redirectToSignIn } = await auth();
  // if (!userId) return redirectToSignIn();
  // if (!userId) {
  //   return NextResponse.json({
  //     status: false,
  //     error: "Unauthorized",
  //   });
  // }

  try {
    await connect();

    const { expertId, availability } = await req.json();

    if (!availability || typeof availability !== "object") {
      return NextResponse.json({
        status: false,
        error: "Invalid availability data",
      });
    }
    console.log(expertId, availability);
    const updatedAvailability = await ExpertAvailability.findOneAndUpdate(
      { expertId: expertId },
      { availability },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      status: true,
      availability: updatedAvailability,
    });
  } catch (err) {
    console.error("POST /api/expert/availability error:", err);
    return NextResponse.json({
      status: false,
      error: "Internal Server Error",
    });
  }
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const expertId = searchParams.get("expertId");

  if (!expertId) {
    return NextResponse.json({
      status: false,
      error: "Missing expertId",
    });
  }

  try {
    await connect();
    const availability = await ExpertAvailability.findOne({ expertId });

    if (!availability) {
      return NextResponse.json({
        status: true,
        availability: null, // or empty {} if preferred
      });
    }

    return NextResponse.json({
      status: true,
      availability,
    });
  } catch (err) {
    console.error("GET /api/expert/availability error:", err);
    return NextResponse.json({
      status: false,
      error: "Internal Server Error",
    });
  }
}
