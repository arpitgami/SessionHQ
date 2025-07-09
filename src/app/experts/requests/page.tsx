"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FaInbox } from "react-icons/fa";
import UserRequestDetails from "@/component/UserRequestDetails";
import { useRouter } from "next/navigation";

type RequestType = {
  _id: string;
  expertID: string;
  expertName: string;
  userID: string;
  slot: string;
  status: string;
  isPayment: boolean;
  paymentIntentID: string;
};
export type { RequestType };

export default function ExpertRequests() {
  const { user } = useUser();
  const router = useRouter();
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);
 useEffect(()=>{
    document.title="Requests - SessionHQ";
  },[]);
  useEffect(() => {
    const checkExpertStatus = async () => {
      const res = await fetch("/api/expert/expert-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkID: user?.id }),
      });

      const data = await res.json();
      if (data.status === "pending") {
        router.replace("/?status=pending");
      }
    };

    if (user) checkExpertStatus();
  }, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`/api/request`);
        const data = await res.json();

        if (!data.status) {
          console.log("Error fetching requests");
        } else {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Error fetching expert requests", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRequests();
    }
  }, [user?.id]);

  function handleRemoveRequest(requestId: string) {
    setRequests((prev) => prev.filter((req) => req._id !== requestId));
  }

  function handleStatusChange(
    requestId: string,
    newStatus: string,
    slot: string,
    expertID: string
  ) {
    if (newStatus === "accepted") {
      setRequests((prevRequests) =>
        prevRequests.map((req) => {
          if (req._id === requestId) {
            return { ...req, status: "accepted" };
          }
          if (
            req.expertID === expertID &&
            req.slot === slot &&
            req._id !== requestId &&
            req.status === "pending"
          ) {
            return { ...req, status: "failed" };
          }
          return req;
        })
      );
    }
  }

  const filteredRequests = requests.filter(
    (req) =>
      req.status !== "rejected" &&
      req.status !== "declined" &&
      req.status !== "failed"
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-base-content mb-6 flex justify-center items-center gap-3">
        <FaInbox className="text-primary text-4xl" />
        Expert Requests
      </h2>

      {loading ? (
          <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="bg-base-200 animate-pulse p-6 rounded-xl shadow flex flex-col gap-4"
      >
        <div className="h-4 w-40 bg-base-300 rounded" /> {/* User name or title */}
        <div className="h-4 w-28 bg-base-300 rounded" /> {/* Date or slot */}
        <div className="flex gap-4 mt-2">
          <div className="h-10 w-24 bg-base-300 rounded" /> {/* Accept button */}
          <div className="h-10 w-24 bg-base-300 rounded" /> {/* Reject button */}
        </div>
      </div>
    ))}
  </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center bg-base-200 rounded-xl p-8 shadow">
          <p className="text-lg font-semibold text-base-content">
            No requests available right now.
          </p>
          <p className="text-sm mt-2 text-base-content/60">
            You’ll see incoming session requests from users here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <UserRequestDetails
              key={req._id}
              request={req}
              onRemove={handleRemoveRequest}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
