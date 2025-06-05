import connect from "@/dbconfig/dbconfig";
import { ExpertApplication } from "@/models/experts";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // console.log("route was hit...");
    await connect();

    const body = await req.json();
    // console.log("body : ", body);
    const { email, password } = body;
    // console.log(email, password);
    const client = await clerkClient();
    const user = await client.users.createUser({
      emailAddress: [email],
      password: password,
    });

    const clerkID = user.id;
    // console.log("clerkid", clerkID);
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
export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      const experts = await ExpertApplication.find({ status: "pending" }).select(
        "-_id -__v -createdAt -updatedAt"
      );
      // console.log(experts);
      return NextResponse.json({ status: true, data: experts });
    }
    // console.log("id:", id);

    const expert = await ExpertApplication.find({ clerkID: id });
    return NextResponse.json({ status: true, data: expert });


  } catch (error) {
    console.error("GET /api/experts error:", error);
    return NextResponse.json(
      { status: false, error: error }
    );
  }
}
