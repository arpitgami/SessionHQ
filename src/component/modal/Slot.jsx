"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Slot = ({ selectedSlot, setSelectedSlot, nextStep }) => {
  const { expertid } = useParams();
  const expertId = expertid;
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockedSlots, setLockedSlots] = useState({});

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(
          `/api/expert/availability?expertId=${expertId}`
        );
        const data = await res.json();
        if (!data.status) console.log("Failed to fetch availability");

        setAvailability(data.availability || {});
        setLockedSlots(data.lockedSlots || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [expertId]);

  const handleSlotClick = (date, time) => {
    setSelectedSlot({ date, time });
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      nextStep();
    }
  };

  if (loading) return <div className="p-4">Loading slots...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight for comparison
  return (
    <div>
      <div className="modal-box max-w-3xl bg-base-100 text-base-content">
        <h3 className="text-xl font-semibold mb-4">Select a Slot</h3>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(availability)
            .filter(([date]) => {
              const slotDate = new Date(date);
              slotDate.setHours(0, 0, 0, 0);
              return slotDate >= today;
            })
            .map(([date, slots]) => {
              const slotDate = new Date(date);
              slotDate.setHours(0, 0, 0, 0);

              const futureSlots = slots.filter((time) => {
                if (slotDate > today) return true;
                const [hour, minute] = time.split(":").map(Number);
                const slotDateTime = new Date(date);
                slotDateTime.setHours(hour, minute, 0, 0);
                return slotDateTime > new Date();
              });

              return (
                <div key={date} className="flex items-start gap-4 border-b border-base-300 pb-3">
                  <div className="w-28 text-sm font-medium text-base-content/80">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {futureSlots.length === 0 ? (
                    <div className="text-base-content/40 text-sm">No slots</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {futureSlots.map((time) => {
                        const isSelected =
                          selectedSlot?.date === date && selectedSlot?.time === time;

                        const isLocked = lockedSlots?.[date]?.includes(time);

                        const [hours, minutes] = time.split(":").map(Number);
                        const endHour = (hours + 1) % 24;
                        const endTime = `${endHour.toString().padStart(2, "0")}:${minutes
                          .toString()
                          .padStart(2, "0")}`;

                        return (
                          <button
                            key={time}
                            onClick={() => !isLocked && handleSlotClick(date, time)}
                            disabled={isLocked}
                            className={`px-3 py-1 text-sm rounded-full border transition
                            ${isLocked
                                ? "bg-base-300 text-base-content/40 border-base-300 cursor-not-allowed"
                                : isSelected
                                  ? "bg-primary text-primary-content border-primary"
                                  : "bg-base-100 text-base-content border-base-300 hover:bg-base-200"
                              }
                          `}
                          >
                            {time} - {endTime}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <div className="modal-action justify-between items-center">
          <form method="dialog">
            <button className="btn btn-ghost">Close</button>
          </form>
          {selectedSlot && (
            <button className="btn btn-primary" onClick={handleConfirm}>
              Confirm Slot ➤
            </button>
          )}
        </div>
      </div>
    </div>
  );

};

export default Slot;
