import { NextRequest, NextResponse } from 'next/server';
import connect from "@/dbconfig/dbconfig"
import { User } from '@/models/user'
export async function POST(req: NextRequest) {
    try {
        await connect();
        const body = await req.json();
        console.log(body);

        const user = await new User(body);
        await user.save();

        return NextResponse.json({
            status: true,
            message: "User created"
        })

    } catch (error) {
        return NextResponse.json({
            status: false,
            error: error
        })

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

        const user = await User.find({ clerkID: userId });

        if (!user || user.length === 0) {
            return NextResponse.json({
                status: true,
                isFound: false
            })
        }
        return NextResponse.json({
            status: true,
            isFound: true
        })

    } catch (error) {
        return NextResponse.json({
            status: false,
            error: error,
        })
    }
}
