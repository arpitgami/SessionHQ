"use client";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Request = {
  _id: string;
  expertID: string;
  expertName: string;
  userID: string;
  slot: string;
  status: string;
  isPayment: boolean;
  paymentIntentID: string;
};

export default function NotificationDropdown() {
  console.log("NotificationDropdown rendered");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("NotificationDropdown mounted");
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/request");
      const data = await res.json();
      if (data.status) {
        setRequests(data.data);
        console.log(data);
      } else {
        console.log("Error fetching requests:", data.message);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      fetchRequests();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Auto refresh every 60 seconds when open
  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        fetchRequests();
      }, 60000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "declined":
        return "bg-yellow-500 text-white";
      case "expired":
        return "bg-gray-500 text-white";
      default:
        return "bg-purple-500 text-white"; // pending
    }
  };

  const formatSlot = (slot: string) => {
    const date = new Date(slot);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  async function handleMakePayment(request: Request) {
    try {
      const res = await fetch("/api/user/makepayment/sessionfee", {
        method: "POST",
        body: JSON.stringify({
          expertID: request.expertID,
          userID: request.userID,
          slot: request.slot,
          requestID: request._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

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
      console.error("Error during Stripe checkout:", error);
    }
  }
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="btn btn-ghost btn-circle"
        onClick={handleDropdownToggle}
      >
        <div className="indicator">
          <Bell className="h-5 w-5" />
          {requests.some((r) => r.status === "pending") && (
            <span className="badge badge-xs badge-accent rounded-full indicator-item" />
          )}
        </div>
      </button>

      <div
        className={`absolute right-0 mt-2 w-96 bg-base-100 shadow-xl rounded-xl max-h-[400px] overflow-y-auto border border-neutral  z-50 transition-all duration-300 ease-in-out transform  ${isOpen
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2 text-base-content">
            Session Requests
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="bg-secondary loading loading-spinner loading-xs"></span>
              <span className="ml-2 text-sm text-base-content">Loading...</span>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-base-content text-sm text-center py-8">
              No requests available.
            </p>
          ) : (
            requests.map((r) => (
              <div
                key={r._id}
                className={`rounded-lg p-4 mb-3 border shadow-sm hover:shadow-md transition ${r.status === "accepted"
                  ? "bg-success/10 border-success"
                  : "bg-base-200 border-base-300"
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-base text-base-content">
                    {r.expertName}
                  </span>
                  <span
                    className={`capitalize px-3 py-1 text-xs font-semibold rounded-full ${r.status === "accepted" && r.isPayment
                      ? "bg-info text-info-content"
                      : getStatusColor(r.status)
                      }`}
                  >
                    {r.status === "accepted" && r.isPayment
                      ? "Confirmed"
                      : r.status}
                  </span>
                </div>

                <p className="text-sm text-base-content/70">
                  {formatSlot(r.slot)}
                </p>

                {r.status === "accepted" && !r.isPayment && (
                  <div className="mt-2">
                    <p className="text-xs text-success-content font-medium mb-1">
                      Waiting for payment
                    </p>
                    <button
                      onClick={() => handleMakePayment(r)}
                      className="w-full bg-success hover:bg-success-content text-success-content hover:text-base-100 font-semibold text-sm py-2 px-4 rounded-lg transition"
                    >
                      Make Payment
                    </button>
                  </div>
                )}

                {r.status === "accepted" && r.isPayment && (
                  <p className="text-xs text-info mt-1 font-medium">
                    Your meeting has been confirmed
                  </p>
                )}
                {r.status === "pending" && (
                  <p className="text-xs text-primary mt-1 font-medium">
                    Waiting for expert to respond
                  </p>
                )}
                {r.status === "declined" && (
                  <p className="text-xs text-warning mt-1 font-medium">
                    Expert did not respond in time. Refund initiated.
                  </p>
                )}
                {r.status === "rejected" && (
                  <p className="text-xs text-error mt-1 font-medium">
                    ❌ Expert rejected the request. Refund initiated
                  </p>
                )}
                {r.status === "expired" && (
                  <>
                    <p className="text-xs text-neutral mt-1 font-medium">
                      Slot has expired. No Refund
                    </p>
                    <p className="text-xs text-neutral/70 mt-1 font-medium italic">
                      Time expired, user did not make the full payment
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

}
