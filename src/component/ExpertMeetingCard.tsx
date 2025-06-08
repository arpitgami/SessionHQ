"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

interface UserDetails {
    clerkID: string;
    fullName: string;
    email: string;
    linkedinURL: string;
    twitterURL?: string;
    websiteURL?: string;
}

interface SessionDetails {
    role: string;
    industry: string;
    stage: string;
    aboutStartup: string;
    helpWith: string;
    reasonToTalk: string;
    createdAt: string;
}

interface Meeting {
    _id: string;
    expertID: string;
    userID: string;
    slot: string | Date;
}

export default function ExpertMeetingCard({ meeting }: { meeting: Meeting }) {
    const router = useRouter();
    const [remainingTime, setRemainingTime] = useState<string | null>("");
    const [canJoin, setCanJoin] = useState(false);


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


    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [userSessionData, setUserSessionData] = useState<SessionDetails | null>(null);

    useEffect(() => {
        (async function getData() {
            try {
                const res = await fetch(`/api/user/saveuserdata?userId=${meeting.userID}`);
                const data = await res.json();
                setUserData(data.userData);
                const sessionRes = await fetch(`/api/user/saveUserSessionData?userId=${meeting.userID}`);
                const sessionData = await sessionRes.json();
                setUserSessionData(sessionData.userData);
                console.log("user data :", data, sessionData)

            } catch (error) {
                console.error("error fetching meeting data:", error);
            }

        })()

    }, [])

    if (!userData || !userSessionData) return <div>Loading</div>;

    return (
        <div className="flex bg-base-100 shadow-md rounded-2xl p-4 my-4 gap-4 w-full max-w-4xl mx-auto">
            <div className="w-[50px] h-[50px] flex items-center justify-center bg-primary rounded-full text-xl font-bold text-base-100">
                {userData.fullName.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-xl font-bold">{userData.fullName}</h2>
                    <p className="text-gray-600">{userData.email}</p>
                    <p className="text-sm mt-1 text-gray-500">
                        {format(new Date(meeting.slot), "PPPp")}
                    </p>
                    <p className="text-sm text-red-500">{remainingTime}</p>

                    <div className="flex items-center gap-2 mt-2">
                        {userData.linkedinURL && (
                            <a href={userData.linkedinURL} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className=" text-lg" />
                            </a>
                        )}
                        {userData.twitterURL && (
                            <a href={userData.twitterURL} target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="text-lg" />
                            </a>
                        )}
                    </div>

                    <div className="mt-1 space-y-0.5 text-sm">
                        <div className="flex flex-wrap gap-4">
                            <p><span className="font-medium">Role:</span> {userSessionData.role}</p>
                            <p><span className="font-medium">Industry:</span> {userSessionData.industry}</p>
                            <p><span className="font-medium">Stage:</span> {userSessionData.stage}</p>

                        </div>
                        <p><span className="font-medium">About Startup:</span> {userSessionData.aboutStartup}</p>
                        <p><span className="font-medium">Help With:</span> {userSessionData.helpWith}</p>
                        <p><span className="font-medium">Reason to Talk:</span> {userSessionData.reasonToTalk}</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        router.push(`/room/${meeting._id}`);
                    }}
                    className={`btn mt-4 px-4 py-2 rounded-lg ${canJoin ? "btn-primary" : "btn-disabled"}`}
                >
                    Join Now
                </button>
            </div>
        </div>
    );
}
