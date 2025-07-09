"use client"
import ExpertMeetingCard from "@/component/ExpertMeetingCard";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface Meeting {
    _id: string;
    expertID: string;
    userID: string;
    slot: Date | string;
}

export default function UpcomingSession() {

    const { user, isLoaded } = useUser();

    const [meetings, setMeetings] = useState<Meeting[] | null>(null);

useEffect(()=>{
    document.title="Meetings - SessionHQ";
  },[]);
    useEffect(() => {

        if (!user || !isLoaded) return;

        try {
            (async function getData() {
                const res = await fetch(`/api/meeting/getmeeting?expertId=${user!.id}`);
                const data = await res.json();
                setMeetings(data.data);
                // console.log("meetings:", data);

            })()
        } catch (error) {
            console.error("error fetchinf meetings", error);
        }

    }, [user, isLoaded])


    if (!isLoaded) return <div className="flex flex-col h-screen w-screen items-center justify-center bg-base-100">
      <div className="w-[80%] max-w-4xl flex flex-col gap-6">
        <div className="skeleton h-10 w-1/2 mx-auto"></div>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="skeleton h-28 w-full rounded-xl"></div>
        ))}
      </div>
    </div>

    return (



        <div className="min-h-screen bg-base-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Upcoming Sessions</h1>
            {meetings && meetings!.length > 0 && (
                meetings!.map((m) => (
                    <ExpertMeetingCard
                        key={m._id}
                        meeting={m}
                    />
                ))
            )}
            {meetings && meetings.length === 0 && (
                <p className="text-center text-base-content text-opacity-60">No meetings scheduled.</p>
            )}
        </div>
    );
}
