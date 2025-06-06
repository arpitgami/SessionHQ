import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connect from "@/dbconfig/dbconfig";
import { Request } from "@/models/Request";
import { error } from "console";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {

    const payload = await req.text();
    const response = await JSON.parse(payload);

    const sig = req.headers.get('stripe-signature');
    // console.log("sig: ", sig);

    try {
        let event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        const type = event.type;
        // console.log("type:", type);

        if (type == "checkout.session.completed") {

            const session = event.data.object as Stripe.Checkout.Session;
            const sessionName = session.metadata?.sessionName;
            const expertID = session.metadata?.expertID;
            const userID = session.metadata?.clientID;
            const slot = JSON.parse(session.metadata?.slot || "{}");

            // console.log("metadata from webhook : ", session.metadata);

            //push the request in the backend
            if (sessionName == "Reservation Fee Payement") {

                await connect();
                const newRequest = await new Request({ expertID, userID, slot });
                await newRequest.save();

            }// Create the meeting
            else if (sessionName == "Final Payement") {
                //meeting schedule
            }

        }

        return NextResponse.json({ status: true, event: event })
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ status: false, error: error });
    }
}