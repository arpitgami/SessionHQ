import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function initiateRefund(paymentIntentID: string) {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentID,
        });

        console.log("Refund successful:", refund.id);
        return { success: true, refund };
    } catch (error) {
        console.error("Refund failed:", error);
        return { success: false, error };
    }
}