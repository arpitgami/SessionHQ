// /app/api/expert-status/route.ts
import { NextResponse } from "next/server";
import connect from "@/dbconfig/dbconfig";
import { ExpertApplication } from "@/models/experts";

export async function POST(req: Request) {
  const { clerkID } = await req.json();

  if (!clerkID) {
    return NextResponse.json({ error: "Missing clerkID" }, { status: 400 });
  }

  try {
    await connect();
    const expert = await ExpertApplication.findOne({ clerkID });

    if (!expert) {
      return NextResponse.json({ status: null });
    }

    return NextResponse.json({ status: expert.status });
  } catch (error) {
    console.error("Error getting expert status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
