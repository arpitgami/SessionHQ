import connect from "@/dbconfig/dbconfig";
import { Meeting } from "@/models/Meeting";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        // console.log("getmeeting route hit...");
        await connect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const expertId = searchParams.get("expertId");

        const filter: any = {};
        if (userId) filter.userID = userId;
        if (expertId) filter.expertID = expertId;

        const now = new Date();

        // Fetch meetings matching filter
        const meetings = await Meeting.find(filter);
        // console.log(meetings)
        const upcomingMeetings = [];
        for (const meeting of meetings) {
            if ((new Date(meeting.slot).getTime()) + 60 * 60 * 1000 > now.getTime()) {
                upcomingMeetings.push(meeting);
            } else {
                // Delete expired/old meeting
                console.log("meeting deleted ", meeting);
                await Meeting.findByIdAndDelete(meeting._id);
            }
        }

        return NextResponse.json({ status: true, data: upcomingMeetings });
    } catch (error) {
        return NextResponse.json(
            { status: false, error: error },
        );
    }
}
