"use client";

import React, { useState } from "react";
import { format, addDays } from "date-fns";

const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 8AM to 8PM
const today = new Date();

export default function ExpertAvailabilityCalendar({
  expertId,
}: {
  expertId: string;
}) {
  const [savedAvailability, setSavedAvailability] = useState<{
    [date: string]: string[];
  }>({});

  const [availability, setAvailability] = useState(() => {
    const initial: { [date: string]: string[] } = {};
    for (let i = 0; i < 8; i++) {
      const date = format(addDays(today, i), "yyyy-MM-dd");
      initial[date] = [];
    }
    return initial;
  });

  const toggleSlot = (date: string, hour: number) => {
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    setAvailability((prev) => {
      const daySlots = prev[date] || [];
      const updated = daySlots.includes(timeStr)
        ? daySlots.filter((t) => t !== timeStr)
        : [...daySlots, timeStr];

      return { ...prev, [date]: updated };
    });
  };

  const saveAvailability = async () => {
    try {
      expertId = "123243";
      const res = await fetch("/api/expert/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expertId, availability }),
      });

      const data = await res.json();

      if (!data.status) {
        console.log("error while saving", data.error);
        alert(data.error.errors[0].longMessage);
        return;
      }
      setSavedAvailability({ ...availability });

      alert("Availability saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save availability");
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
        Set Availability
      </h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-max table-auto border-collapse w-full border border-gray-300">
          <thead>
            <tr>
              <th className="bg-white"></th>
              {/* empty array and iterate from 0 to 7 */}
              {[...Array(8)].map((_, i) => {
                const date = addDays(today, i);
                const dateStr = format(date, "yyyy-MM-dd");
                return (
                  <th key={i} className="border p-2 bg-gray-100 text-center">
                    {format(date, "EEEE (MMM d)")}
                    <div className="text-sm text-gray-500">{dateStr}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => {
              const timeStr = format(new Date(0, 0, 0, hour), "h a");
              return (
                <tr key={hour}>
                  <td className="border border-gray-300 p-2 font-medium text-center">
                    {timeStr}
                  </td>
                  {[...Array(8)].map((_, i) => {
                    const currentDate = addDays(today, i);
                    const dateStr = format(currentDate, "yyyy-MM-dd");
                    const slotDateTime = new Date(currentDate);
                    slotDateTime.setHours(hour, 0, 0, 0);
                    const now = new Date();
                    const timestr = `${hour.toString().padStart(2, "0")}:00`;
                    const isPast = slotDateTime < now;
                    const isSelected = availability[dateStr]?.includes(timestr);
                    const isSaved =
                      savedAvailability[dateStr]?.includes(timestr);
                    const wasSavedButRemoved = !isSelected && isSaved;
                    const isNewlySelected = isSelected && !isSaved;
                    const isUnchangedSaved = isSelected && isSaved;
                    return (
                      <td
                        key={dateStr + hour}
                        className={`border border-gray-300 text-center py-2 ${
                          isPast
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : wasSavedButRemoved
                            ? "bg-red-200 text-red-700 cursor-pointer" // ❌ Removed after being saved
                            : isUnchangedSaved
                            ? "bg-green-500 text-white cursor-pointer" // ✅ Still saved and selected
                            : isNewlySelected
                            ? "bg-blue-500 text-white cursor-pointer" // 🔵 New selection
                            : "bg-white hover:bg-blue-100 cursor-pointer" // ⚪ Default
                        }`}
                        onClick={() => {
                          if (!isPast) toggleSlot(dateStr, hour);
                        }}
                      >
                        {isPast ? "–" : isSelected ? "✓" : ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={saveAvailability}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Availability
      </button>
    </div>
  );
}
