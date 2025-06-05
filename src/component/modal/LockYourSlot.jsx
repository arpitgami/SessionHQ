"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const LockYourSlot = ({ selectedSlot, expert, prevStep, user, formData }) => {
    const searchParams = useSearchParams();


    const date = selectedSlot.date;
    const time = selectedSlot.time;

    const expertName = expert.fullName;

    // Format date
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const formattedTime = `${time} ${parseInt(time) >= 12 ? "PM" : "AM"}`;

    async function saveuserSessionData() {
        try {
            const res = await fetch("/api/user/saveUserSessionData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, userID: user.id }),
            });

            const data = await res.json();

            if (!data.status) {
                console.error("Error saving usersessiondata", data.error);
                return;
            }

        } catch (error) {
            console.error("Network error saving usersessiondata:", error);
        }
    };


    async function makePayment() {

        //form data save 
        await saveuserSessionData();
        //stripe checkout
        try {
            const res = await fetch("/api/user/makepayment/reservationfee", {
                method: "POST",
                body: JSON.stringify({
                    expertID: expert.clerkID,
                    userID: user.id,
                    slot: selectedSlot,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json();
            console.log("session data:", data);
            if (!data.status) {
                console.error("Error while getting session url:", data.error);
                return;
            }


            const stripe = await stripePromise;
            const result = await stripe?.redirectToCheckout({
                sessionId: data.sessionID,
            });

            if (result?.error) {
                console.error("Stripe checkout redirect error:", result.error.message);
            }



        } catch (error) {
            console.error("Error during connection for getting session url:", error);
        }
    }

    return (
        <div className="modal-box max-w-md space-y-6 bg-white p-6 flex flex-col justify-center items-center px-4">
            <div className="bg-white p-8 rounded-2xl  w-full max-w-lg text-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Lock your slot on
                </h2>
                <p className="text-lg text-gray-600">
                    <strong>{formattedDate}</strong> at <strong>{formattedTime}</strong> <br />
                    with expert <strong>{expertName}</strong>
                </p>

                <div className='flex flex-row justify-between'>
                    <button className="btn btn-base-100" onClick={() => prevStep()}>Back</button>
                    <button className="btn btn-primary" onClick={makePayment}>Pay Now</button>
                </div>
            </div>
        </div>
    );
};

export default LockYourSlot;
