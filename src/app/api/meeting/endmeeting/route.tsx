import { NextResponse } from "next/server";
import { Meeting } from "@/models/Meeting";
import connect from "@/dbconfig/dbconfig";


export async function POST(req: Request) {

    try {

        // console.log("End meeting hit....");
        await connect();
        const { meetingID } = await req.json();

        if (!meetingID) {
            return NextResponse.json({ success: false, error: "Missing meetingID" }, { status: 400 });
        }


        await Meeting.findByIdAndDelete({ _id: meetingID });
        // console.log("Meeting deleted", meetingID);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}
