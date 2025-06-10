"use client";

import { useEffect, useState } from "react";
import {
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import type { RequestType } from "@/app/experts/requests/page";

import { format, formatDistanceToNow, isPast } from "date-fns";

type UserType = {
  _id: string;
  clerkID: string;
  fullName: string;
  email: string;
  linkedinURL: string;
  twitterURL: string;
  websiteURL: string;
};

type SessionType = {
  _id: string;
  userID: string;
  role: string;
  industry: string;
  stage: string;
  aboutStartup: string;
  helpWith: string;
  reasonToTalk: string;
};

type Props = {
  request: RequestType;
  onRemove?: (requestId: string) => void; // optional callback to remove rejected request
  onStatusChange?: (
    requestId: string,
    newStatus: string,
    slot: string,
    expertID: string
  ) => void;
};

export default function UserRequestDetails({
  request,
  onRemove,
  onStatusChange,
}: Props) {
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<SessionType | null>(null);

  // Local states for status and payment to reflect UI changes instantly
  const [status, setStatus] = useState(request.status);
  const [isPayment, setIsPayment] = useState(request.isPayment || false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, sessionRes] = await Promise.all([
          fetch(`/api/user/saveuserdata?userId=${request.userID}`),
          fetch(`/api/user/saveUserSessionData?userId=${request.userID}`),
        ]);

        const userJson = await userRes.json();
        const sessionJson = await sessionRes.json();

        if (userJson.status && userJson.userData) {
          setUser(userJson.userData);
        }

        if (sessionJson.status && sessionJson.userData) {
          setSession(sessionJson.userData);
        }
      } catch (err) {
        console.error("Error fetching user/session data", err);
      }
    };

    fetchUserData();
  }, [request.userID]);

  const slotDate = new Date(request.slot);
  const slotIsPast = isPast(slotDate);
  const formattedDate = format(slotDate, "MMMM d, yyyy, h:mm aa");
  const relativeTime = formatDistanceToNow(slotDate, { addSuffix: true });

  // API call to update status
  const updateStatus = async (newStatus: string) => {
    if (newStatus == "accepted")
      alert("Are you sure you want to accept this request?");
    else if (newStatus == "rejected")
      alert("Are you sure you want to reject this request?");
    try {
      const res = await fetch(`/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: request._id, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);

        // If rejected, remove the request from UI (if onRemove callback provided)
        // Let parent know to update state
        if (onStatusChange) {
          onStatusChange(
            request._id,
            newStatus,
            request.slot,
            request.expertID
          );
        }
        if (newStatus === "rejected" && onRemove) {
          onRemove(request._id);
        }
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status.");
    }
  };

  return (
    <div>
      <div className="bg-white mb-6 mx-6 pr-2 rounded-xl shadow-lg border border-gray-300 transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
        <details className="w-full">
          <summary className="cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 font-semibold text-lg text-gray-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <span>Request from {user?.fullName || "Unknown"}</span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  slotIsPast
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-100 text-blue-800"
                }`}
                title={`Slot time: ${formattedDate}`}
              >
                Slot: {formattedDate}{" "}
                <span className="italic">({relativeTime})</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  status === "accepted" && isPayment
                    ? "bg-green-200 text-green-800"
                    : status === "accepted"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-yellow-200 text-yellow-900"
                }`}
              >
                {status === "accepted" && isPayment
                  ? "Slot Confirmed"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus("accepted")}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white text-sm rounded-full shadow hover:bg-green-700 hover:scale-105 transition-all"
                  >
                    <FaCheck className="text-sm" /> Accept
                  </button>
                  <button
                    onClick={() => updateStatus("rejected")}
                    className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-full shadow hover:bg-red-700 hover:scale-105 transition-all"
                  >
                    <FaTimes className="text-sm" /> Reject
                  </button>
                </>
              )}
            </div>
          </summary>

          <div className="border-t border-gray-300 pt-6 px-6 pb-6">
            {/* User Profile */}
            <section className="mb-6 p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                User Profile
              </h4>
              {user ? (
                <>
                  <p className="flex items-center gap-2 text-gray-700">
                    <HiMail className="text-lg text-blue-600" />
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:underline"
                    >
                      {user.email}
                    </a>
                  </p>
                  {user.linkedinURL && (
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaLinkedin className="text-lg text-blue-700" />
                      <a
                        href={user.linkedinURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn
                      </a>
                    </p>
                  )}
                  {user.twitterURL && (
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaTwitter className="text-lg text-sky-500" />
                      <a
                        href={user.twitterURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Twitter
                      </a>
                    </p>
                  )}
                  {user.websiteURL && (
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaGlobe className="text-lg text-green-600" />
                      <a
                        href={user.websiteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Website
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500">Loading user profile...</p>
              )}
            </section>

            {/* Session Details */}
            <section className="mb-6 p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                Session Details
              </h4>
              {session ? (
                <>
                  <p>
                    <strong>Industry:</strong> {session.industry || "N/A"}
                  </p>
                  <p>
                    <strong>About Startup:</strong>{" "}
                    {session.aboutStartup || "N/A"}
                  </p>
                  <p>
                    <strong>Stage:</strong> {session.stage || "N/A"}
                  </p>

                  <p>
                    <strong>Help With:</strong> {session.helpWith || "N/A"}
                  </p>
                  <p>
                    <strong>Reason to Talk:</strong>{" "}
                    {session.reasonToTalk || "N/A"}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">Loading session details...</p>
              )}
            </section>

            {/* Payment notice if accepted but payment pending */}
            {status === "accepted" && !isPayment && (
              <p className="text-yellow-700 font-semibold">
                Accepted, waiting for user to make full payment
              </p>
            )}
            {/* slot is confirmed and payment received  */}
            {status === "accepted" && isPayment && (
              <div className="mt-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-300 font-semibold">
                Slot confirmed! Payment received.
              </div>
            )}
            {/* slot expired adn user did not make the full payment  */}
            {status === "expired" && (
              <p className="text-red-700 font-semibold mt-4">
                Time expired, user did not make the full payment
              </p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
