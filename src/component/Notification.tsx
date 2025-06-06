import { Bell } from "lucide-react";
import { useState } from "react";

type Request = {
  _id: string;
  expertName: string; // Assume you've populated expertName via expertID on the server
  slot: string; // ISO date string
  status: "pending" | "accepted" | "rejected" | "declined" | "expired";
  isPayment: boolean;
};

const mockRequests: Request[] = [
  {
    _id: "1",
    expertName: "Dr. Maya Singh",
    slot: "2025-06-08T10:00:00.000Z",
    status: "pending",
    isPayment: false,
  },
  {
    _id: "2",
    expertName: "John Kumar",
    slot: "2025-06-09T15:00:00.000Z",
    status: "accepted",
    isPayment: false,
  },
  {
    _id: "3",
    expertName: "Sarah Verma",
    slot: "2025-06-05T11:00:00.000Z",
    status: "rejected",
    isPayment: false,
  },
  {
    _id: "4",
    expertName: "Ravi Mehra",
    slot: "2025-06-06T17:00:00.000Z",
    status: "declined",
    isPayment: false,
  },
  {
    _id: "5",
    expertName: "Anjali Patil",
    slot: "2025-06-01T09:00:00.000Z",
    status: "expired",
    isPayment: false,
  },
];

export default function NotificationDropdown() {
  const [requests] = useState<Request[]>(mockRequests);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500 text-white";
      case "rejected":
        return "badge badge-error";
      case "declined":
        return "badge badge-warning";
      case "expired":
        return "badge badge-neutral";
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

  return (
    <div className="dropdown dropdown-end z-50">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <Bell className="h-5 w-5" />
          {requests.some((r) => r.status === "pending") && (
            <span className="badge badge-xs badge-primary indicator-item" />
          )}
        </div>
      </label>

      <div
        tabIndex={0}
        className="mt-3 dropdown-content w-96 bg-slate-100 dark:bg-slate-800 shadow-xl rounded-xl max-h-[400px] overflow-y-auto border border-slate-300 dark:border-slate-700"
      >
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2">Session Requests</h2>

          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm">No requests available.</p>
          ) : (
            requests.map((r) => (
              <div
                key={r._id}
                className={`rounded-lg p-4 mb-3 border shadow-sm hover:shadow-md transition ${
                  r.status === "accepted"
                    ? "bg-green-50 border-green-400"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-base text-gray-800">
                    {r.expertName}
                  </span>
                  <span
                    className={`capitalize px-3 py-1 text-xs font-semibold rounded-full ${
                      r.status === "accepted"
                        ? getStatusColor(r.status)
                        : `${getStatusColor(r.status)} text-white`
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{formatSlot(r.slot)}</p>

                {r.status === "accepted" && !r.isPayment && (
                  <div className="mt-2">
                    <p className="text-xs text-green-800 font-medium mb-1">
                      💰 Waiting for payment
                    </p>
                    <button
                      onClick={() =>
                        console.log(`Make payment for request ${r._id}`)
                      }
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 px-4 rounded-lg transition"
                    >
                      Make Payment
                    </button>
                  </div>
                )}
                {r.status === "pending" && (
                  <p className="text-xs text-purple-700 mt-1 font-medium">
                    ⏳ Waiting for expert to respond
                  </p>
                )}

                {r.status === "declined" && (
                  <p className="text-xs text-yellow-700 mt-1 font-medium">
                    ⚠️ Expert did not respond in time. Refund initiated.
                  </p>
                )}

                {r.status === "rejected" && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    ❌ Expert rejected the request. Refund initiated
                  </p>
                )}
                {r.status === "expired" && (
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    ⌛ Slot has expired. No Refund
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
