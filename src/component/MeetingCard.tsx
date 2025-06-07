// components/MeetingCard.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define the prop types
interface Expert {
    clerkID: string;
    fullName: string;
    imageURL: string;
    headline: string;
    expertise: string[];
    languages?: string[];
}
interface Meeting {
    _id: string;
    expertID: string;
    userID: string;
    slot: Date | string;
    roomID: string;
}


export default function MeetingCard({ meeting }: any) {
    const router = useRouter();
    const [remainingTime, setRemainingTime] = useState<String | null>("");
    const [canJoin, setCanJoin] = useState(false);
    const [expert, setExpert] = useState<Expert | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const startTime = new Date(meeting.slot);
            const diffMs = startTime.getTime() - now.getTime();
            const diffMin = diffMs / 60000;

            if (diffMin > 24 * 60) {
                setRemainingTime(null);
                setCanJoin(false);
                return;
            }

            const hours = Math.floor(diffMin / 60);
            const minutes = Math.floor(diffMin % 60);

            if (diffMin <= 10 && diffMin > 0) {
                setCanJoin(true);
                setRemainingTime(`Starts in ${hours > 0 ? `${hours} hr ` : ''}${minutes} min`);
            } else if (diffMin <= 0) {
                setCanJoin(true);
                setRemainingTime("Started");
            } else {
                setCanJoin(false);
                setRemainingTime(`${hours > 0 ? `${hours} hr ` : ''}${minutes} min remaining`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [meeting.slot]);

    useEffect(() => {
        try {
            (async function getData() {
                const res = await fetch(`/api/expert/expertdata?id=${meeting.expertID}`);
                const data = await res.json();
                setExpert(data.data[0]);
                console.log("expert:", data.data[0]);

            })()
        } catch (error) {
            console.error("error fetching expert data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) return <div>Loading....</div>
    return (
        expert && <div className="flex bg-base-100 shadow-md rounded-2xl p-4 my-4 gap-4 w-full max-w-4xl mx-auto ">
            <Image
                src={expert?.imageURL || "/default-avatar.png"}
                alt={expert?.fullName}
                width={100}
                height={100}
                className="rounded-xl object-cover"
            />

            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-xl font-bold">{expert?.fullName}</h2>
                    <p className="text-gray-600">{expert?.headline}</p>
                    <p className="text-sm mt-1 text-gray-500">🕒 {format(new Date(meeting.slot), "PPPp")}</p>
                    <p className="text-sm text-red-500">{remainingTime}</p>
                </div>

                <button
                    onClick={() => {
                        localStorage.setItem("sessionData", JSON.stringify(meeting));
                        router.push(`/room/${meeting.roomID}`)
                    }
                    }
                    // disabled={!canJoin}
                    className={`btn mt-4 px-4 py-2 rounded-lg order ${canJoin ? "btn-primary" : "btn-   "
                        }`}
                >
                    Join Now
                </button>
            </div>
        </div>
    );
}
