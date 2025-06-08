import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbconfig/dbconfig";
import { Meeting } from "@/models/Meeting";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";


export async function GET(req: NextRequest) {

    try {

        await connect();

        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { status: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        const userId = user.id;
        let role = user?.publicMetadata?.role as String;

        if (!role) role = "user";
        // console.log("role", role)

        const searchParams = req.nextUrl.searchParams;
        const meetingId = searchParams.get("id");
        // console.log("meetingId", meetingId);

        if (!meetingId) {
            return NextResponse.json({ status: false, message: "Missing meeting ID" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return NextResponse.json({ status: false, message: "Invalid meeting ID" }, { status: 400 });
        }

        const meeting = await Meeting.findOne({ _id: meetingId });
        if (!meeting) {
            return NextResponse.json({ status: false, message: "Meeting not found" }, { status: 404 });
        }

        // Check if user matches either expert or user field depending on role
        const isAuthorized =
            (role === "expert" && meeting.expertID === userId) || (role === "user" && meeting.userID === userId);

        if (!isAuthorized) return NextResponse.json({ success: false, message: "Unauthorized Access" });

        return NextResponse.json({ status: true, meetingData: meeting });
    } catch (error) {
        return NextResponse.json({ status: false, message: error });
    }

}
