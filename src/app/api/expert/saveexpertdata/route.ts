import connect from "@/dbconfig/dbconfig"
import { ExpertApplication } from "@/models/experts"
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";


export async function POST(req: NextRequest) {
    try {

        console.log("route was hit...");
        await connect();

        const body = await req.json();
        console.log("body : ", body);
        const { email, password } = body;
        console.log(email, password);
        const client = await clerkClient();
        const user = await client.users.createUser(
            {
                emailAddress: [email],
                password: password,
            }
        );

        const clerkID = user.id;
        console.log("clerkid", clerkID);
        delete body.password;
        delete body.confirmPassword;
        body.clerkID = clerkID;


        const newExpert = await new ExpertApplication(body);

        await newExpert.save();

        return NextResponse.json({
            status: true,
            message: "New expert created successfully",
        });

    } catch (error) {

        return NextResponse.json({ status: false, error: error });
    }





}

