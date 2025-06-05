import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connect from "@/dbconfig/dbconfig";
import { error } from "console";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {

    const payload = await req.text();
    const response = await JSON.parse(payload);

    const sig = req.headers.get('stripe-signature');
    console.log("sig: ", sig);

    try {
        let event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        const type = event.type;
        console.log("type:", type);

        return NextResponse.json({ status: true, event: event })
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ status: false, error: error });
    }
}