"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdCallEnd } from "react-icons/md";

export default function EndCallButton({ meetingID }: { meetingID: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLeave() {
        const confirmed = window.confirm(
            "Are you sure you want to leave the meeting?\nThis meeting will be marked as closed."
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            const res = await fetch("/api/meeting/endmeeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ meetingID }),
            });

            const result = await res.json();
            if (!result.success) {
                console.error(result.error);
                return;
            }

            router.push("/meetings");
        } catch (err) {
            alert("Failed to end meeting. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleLeave}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-5 mx-2 my-2 rounded-lg "
        >
            {loading ? "Ending..." : <MdCallEnd />}
        </button>
    );
}
