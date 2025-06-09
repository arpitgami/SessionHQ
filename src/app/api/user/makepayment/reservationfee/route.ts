import connect from "@/dbconfig/dbconfig";
import { ExpertApplication } from "@/models/experts";
import { NextRequest, NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { expertID, userID, slot } = body;
        console.log("Make Payment body: ", body);

        await connect();

        const expert = await ExpertApplication.findOne({ clerkID: expertID });

        if (!expert) return NextResponse.json({ error: "Expert not found" }, { status: 404 });

        const price = expert.hourlyRate;
        const slotTimestamp = new Date(`${slot.date}T${slot.time}:00+05:30`); // saving in UTC
        // console.log("slotTimestamp from makepayment:", slotTimestamp);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Reservation Fee for 1-on-1 Session with ${expert.fullName}`,
                            description: `${expert.headline} · ${expert.expertise.join(", ")}`,
                            images: [expert.imageURL],
                        },

                        unit_amount: 5 * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/failed`,
            metadata: {
                sessionName: "Reservation Fee Payement",
                expertID: expert.clerkID,
                expertName: expert.fullName,
                clientID: userID,
                slot: JSON.stringify(slotTimestamp)
            },
        });

        return NextResponse.json({ status: true, sessionID: session.id });

    } catch (error) {
        console.log("Error while creating Stripe session", error);
        return NextResponse.json({ status: false, error: error });
    }
}
