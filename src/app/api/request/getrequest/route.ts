import connect from "@/dbconfig/dbconfig";
import { initiateRefund } from "@/hooks/initiateRefund";
import { Request } from "@/models/Request";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // console.log("getrequest route hit...");
        await connect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const expertId = searchParams.get("expertId");

        const filter: any = {};
        if (userId) filter.userID = userId;
        if (expertId) filter.expertID = expertId;

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
        return NextResponse.json({ status: false, error: "Internal Server Error" }, { status: 500 });
    }
}
