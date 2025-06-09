import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connect from "@/dbconfig/dbconfig";
import { Request } from "@/models/Request";
import { error } from "console";
import { Meeting } from "@/models/Meeting";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const response = await JSON.parse(payload);

  const sig = req.headers.get("stripe-signature");
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
      const paymentIntentId = session.payment_intent;
      // console.log("session metdata:", session.metadata);
      const expertName = session.metadata?.expertName;
      const sessionName = session.metadata?.sessionName;
      const expertID = session.metadata?.expertID;
      const userID = session.metadata?.clientID;
      const slot = session.metadata?.slot;
      const slotISO = JSON.parse(slot!); // removes the extra quotes
      const slotDate = new Date(slotISO);
      console.log("Dateee:", slotDate, slot);

      //push the request in the backend
      if (sessionName == "Reservation Fee Payement") {
        console.log("metadata from webhook : ", session.metadata);
        await connect();
        const newRequest = await new Request({
          expertID,
          expertName,
          userID,
          slot: slotDate,
          paymentIntentID: paymentIntentId,
        });
        await newRequest.save();
      } // Create the meeting
      else if (sessionName == "Final Payment") {
        //meeting schedule
        await connect();
        const requestID = session.metadata?.requestID;

        const updatedRequest = await Request.findByIdAndUpdate(
          requestID,
          { $set: { isPayment: true } },
          { new: true }
        );

        if (!updatedRequest) {
          console.warn("No matching request found for Final Payment update");
        }
        const newMeeting = await new Meeting({
          expertID,
          userID,
          slot: slotDate,
        });
        if (!updatedRequest) {
          console.warn(" No matching request found for Final Payment update");
        } else {
          console.log(" Request updated:", updatedRequest);
        }
        await newMeeting.save();
      }
    }

    return NextResponse.json({ status: true, event: event });
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ status: false, error: error });
  }
}
