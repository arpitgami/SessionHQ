import connect from "@/dbconfig/dbconfig";
import { initiateRefund } from "@/hooks/initiateRefund";
import { Request } from "@/models/Request";
import { NextRequest, NextResponse } from "next/server";
import { ExpertAvailability } from "@/models/ExpertAvailability";
import { currentUser } from "@clerk/nextjs/server";
export async function GET(req: NextRequest) {
  try {
    // console.log("getrequest route hit...");
    await connect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const role = user?.publicMetadata?.role as string;
    let filter: any = {};

    // Assign userId or expertId based on role
    if (role === "expert") {
      filter.expertID = userId;
    } else {
      filter.userID = userId;
    }
    let requests = await Request.find(filter);

    const now = new Date();
    const changedRequests: any[] = [];

    for (const r of requests) {
      let updated = false;

      // Pending for 48+ hours
      if (r.status === "pending") {
        const createdDiff = now.getTime() - new Date(r.createdAt).getTime();
        if (createdDiff >= 48 * 60 * 60 * 1000) {
          r.status = "declined";
          updated = true;
        }
      }

      // Accepted, but not paid for 48+ hours
      if (r.status === "accepted" && !r.isPayment) {
        const updatedDiff = now.getTime() - new Date(r.updatedAt).getTime();
        if (updatedDiff >= 48 * 60 * 60 * 1000) {
          r.status = "expired";
          updated = true;
          // UNLOCK THE SLOT
          const expertAvailability = await ExpertAvailability.findOne({
            expertId: r.expertID,
          });

          if (expertAvailability) {
            const lockedSlots = expertAvailability.lockedSlots || new Map();

            const IST_OFFSET = 5.5 * 60 * 60 * 1000;
            const slotDateUTC = new Date(r.slot);
            const slotDateIST = new Date(slotDateUTC.getTime() + IST_OFFSET);
            const isoString = slotDateIST.toISOString();
            const [dateStr, timeWithMs] = isoString.split("T");
            const time = timeWithMs.slice(0, 5);

            const updatedTimes = (lockedSlots.get(dateStr) || []).filter(
              (t: any) => t !== time
            );

            if (updatedTimes.length > 0) {
              lockedSlots.set(dateStr, updatedTimes);
            } else {
              lockedSlots.delete(dateStr);
            }

            expertAvailability.lockedSlots = lockedSlots;
            await expertAvailability.save();
          }
        }
      }

      // Meeting slot already passed
      if (!r.isPayment && now.getTime() > new Date(r.slot).getTime()) {
        if (r.status === "pending") {
          r.status = "declined";
          updated = true;
          console.log("time check");
        }
        if (r.status === "accepted") {
          r.status = "expired";
          updated = true;
        }
      }

      if (updated) {
        if (r.status === "declined" || r.status === "rejected") {
          await initiateRefund(r.paymentIntentID);
        }
        await r.save();
        changedRequests.push(r);
      }
    }

    // Fetch fresh data after update
    const updatedRequests = await Request.find(filter).sort({ slot: 1 });

    return NextResponse.json({ status: true, data: updatedRequests });
  } catch (error) {
    console.error("Error fetching/updating requests:", error);
    return NextResponse.json({ status: false, error: "Internal Server Error" });
  }
}
export async function POST(req: NextRequest) {
  await connect();

  try {
    const { requestId, status } = await req.json();

    if (!requestId || !status) {
      return NextResponse.json({
        success: false,
        message: "Missing requestId or status",
      });
    }

    const currentRequest = await Request.findById(requestId);
    if (!currentRequest) {
      return NextResponse.json({
        success: false,
        message: "Request not found",
      });
    }

    currentRequest.status = status;
    await currentRequest.save();

    if (status === "accepted") {
      // 1. Mark all other requests for the same expert and slot as "failed"
      await Request.updateMany(
        {
          _id: { $ne: requestId },
          expertID: currentRequest.expertID,
          slot: currentRequest.slot,
          status: "pending",
        },
        {
          $set: { status: "failed" },
        }
      );

      // 2. Lock the slot for the expert
      const expertAvailability = await ExpertAvailability.findOne({
        expertId: currentRequest.expertID,
      });

      if (expertAvailability) {
        const lockedSlots = expertAvailability.lockedSlots || new Map();
        const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins in ms
        const slotDateUTC = new Date(currentRequest.slot);
        const slotDateIST = new Date(slotDateUTC.getTime() + IST_OFFSET);
        const isoString = slotDateIST.toISOString(); // ensures it's a string
        const [dateStr, timeWithMs] = isoString.split("T");
        const timeStr = timeWithMs.slice(0, 5);
        const time = timeStr.slice(0, 5); // "08:00"

        const existingTimes = lockedSlots.get(dateStr) || [];

        if (!existingTimes.includes(time)) {
          lockedSlots.set(dateStr, [...existingTimes, time]);
        }

        expertAvailability.lockedSlots = lockedSlots;
        // console.log(expertAvailability);
        await expertAvailability.save();
      }
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (err) {
    console.error("Error updating request status:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
