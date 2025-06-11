import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connect from "@/dbconfig/dbconfig";
import { ExpertAvailability } from "@/models/ExpertAvailability";
import { Request } from "@/models/Request";
import { initiateRefund } from "@/hooks/initiateRefund";

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
    const previous = await ExpertAvailability.findOne({ expertId });

    const updatedAvailability = await ExpertAvailability.findOneAndUpdate(
      { expertId },
      {
        availability,
        ...(lockedSlots && { lockedSlots }), // only update if provided
      },
      { upsert: true, new: true }
    )

    console.log("expertid , availability and updatedAvailability", expertId, availability, updatedAvailability);

    // Finding removed slots
    const removedSlots = [];

    if (previous) {
      const oldAvailability = previous.availability || new Map();

      for (const [date, oldSlots] of oldAvailability.entries()) {
        const newSlots = availability[date] || []; // incoming data

        const removed = oldSlots.filter((slot: string) => !newSlots.includes(slot));

        if (removed.length > 0) {
          removedSlots.push({ date, removed });
        }
      }
    }
    const now = new Date();

    for (const { date, removed } of removedSlots) {
      for (const time of removed) {
        const fullSlot = new Date(`${date}T${time}:00`);

        if (fullSlot > now) { //future slots only, past slots are already marked as declined

          // Marking pending request of removed slot as cancelled.
          console.log("slot changed", date, time);
          const requestsToCancel = await Request.find({
            expertID: expertId,
            slot: fullSlot,
            status: 'pending',
          });

          for (const req of requestsToCancel) {
            req.status = 'cancelled';
            await req.save();
            await initiateRefund(req.paymentIntentID);
          }
        }
      }
    }

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
