import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connect from "@/dbconfig/dbconfig";
import { ExpertAvailability } from "@/models/ExpertAvailability";

export async function POST(req: NextRequest) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  try {
    await connect();
    const expertId = userId;
    const { availability, lockedSlots } = await req.json();

    if (!availability || typeof availability !== "object") {
      return NextResponse.json({
        status: false,
        error: "Invalid availability data",
      });
    }

    // Optional: validate lockedSlots too if you expect it always
    if (lockedSlots && typeof lockedSlots !== "object") {
      return NextResponse.json({
        status: false,
        error: "Invalid lockedSlots data",
      });
    }

    const updatedAvailability = await ExpertAvailability.findOneAndUpdate(
      { expertId },
      {
        availability,
        ...(lockedSlots && { lockedSlots }), // only update if provided
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      status: true,
      availability: updatedAvailability.availability,
      lockedSlots: updatedAvailability.lockedSlots,
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
    const availabilityDoc = await ExpertAvailability.findOne({ expertId });

    if (!availabilityDoc) {
      return NextResponse.json({
        status: true,
        availability: {},
        lockedSlots: {},
      });
    }

    return NextResponse.json({
      status: true,
      availability: availabilityDoc.availability || {},
      lockedSlots: availabilityDoc.lockedSlots || {},
    });
  } catch (err) {
    console.error("GET /api/expert/availability error:", err);
    return NextResponse.json({
      status: false,
      error: "Internal Server Error",
    });
  }
}
