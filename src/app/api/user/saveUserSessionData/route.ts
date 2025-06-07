import connect from "@/dbconfig/dbconfig"
import UserSessionData from "@/models/UserSessionData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const body = await req.json();
        // console.log(body);
        const { userID } = body;

        const existingData = await UserSessionData.findOne({ userID: userID });
        if (existingData) {
            await UserSessionData.findOneAndReplace({ userID }, body);
            return NextResponse.json({ status: true });;
        }

        const newData = await new UserSessionData(body);
        await newData.save();

        return NextResponse.json({ status: true });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ status: false, error });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                status: false,
                error: 'Missing userId parameter',
            });
        }

        const user = await UserSessionData.findOne({ userID: userId });

        if (!user) {
            return NextResponse.json({
                status: true,
                isFound: false
            })
        }
        return NextResponse.json({
            status: true,
            isFound: true,
            userData: user
        })

    } catch (error) {
        return NextResponse.json({
            status: false,
            error: error,
        })
    }
}

