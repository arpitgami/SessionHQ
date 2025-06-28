import connect from "@/dbconfig/dbconfig";
import { ExpertApplication } from "@/models/experts";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const body = await req.json();
    const { expertID, userID, slot, requestID } = body;
    console.log("Body of session checkout : ", body);

    await connect();

    const expert = await ExpertApplication.findOne({ clerkID: expertID });
    const slotTimestamp = new Date(slot);
    console.log("slot at final fee session req:", slot, slotTimestamp);

    if (!expert)
      return NextResponse.json({ error: "Expert not found" }, { status: 404 });

    const price = expert.hourlyRate - 5;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `1-on-1 Session with ${expert.fullName}`,
              description: `${expert.headline} · ${expert.expertise.join(
                ", "
              )}`,
              images: [expert.imageURL],
            },

            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/failed`,
      metadata: {
        sessionName: "Final Payment",
        expertID: expert.clerkID,
        clientID: userID,
        slot: JSON.stringify(slot),
        requestID,
      },
    });

    return NextResponse.json({ status: true, sessionID: session.id });
  } catch (error) {
    console.log("Error while creating Stripe session", error);
    return NextResponse.json({ status: false, error: error });
  }
}
