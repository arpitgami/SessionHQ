"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FaInbox } from "react-icons/fa";
import UserRequestDetails from "@/component/UserRequestDetails";

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
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

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
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req._id !== requestId)
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 flex justify-center items-center gap-3">
        <FaInbox className="text-indigo-600 text-4xl" />
        Expert Requests
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : requests.filter((req) => req.status !== "rejected").length === 0 ? (
        <div className="text-center text-gray-600 bg-gray-100 rounded-lg p-8 shadow-inner">
          <p className="text-lg">No requests available right now.</p>
          <p className="text-sm mt-2 text-gray-500">
            You’ll see incoming session requests from users here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests
            .filter((req) => req.status !== "rejected")
            .map((req) => (
              <UserRequestDetails
                key={req._id}
                request={req}
                onRemove={handleRemoveRequest}
              />
            ))}
        </div>
      )}
    </div>
  );
}
