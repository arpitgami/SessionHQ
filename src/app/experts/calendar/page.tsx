"use client";

import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";
const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 8AM to 8PM
const today = new Date();

export default function ExpertAvailabilityCalendar() {
  const { user } = useUser();
  const expertId = user?.id;
  const [savedAvailability, setSavedAvailability] = useState<{
    [date: string]: string[];
  }>({});
  const [lockedSlots, setLockedSlots] = useState<{ [date: string]: string[] }>(
    {}
  );
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
    if (lockedSlots[date]?.includes(timeStr)) return;
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
      const res = await fetch("/api/expert/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability, lockedSlots }),
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

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(
          `/api/expert/availability?expertId=${expertId}`
        );
        const data = await res.json();
        if (data.status) {
          const normalizedAvailability: { [date: string]: string[] } = {};
          const normalizedLocked: { [date: string]: string[] } = {};
          for (let i = 0; i < 8; i++) {
            const date = format(addDays(today, i), "yyyy-MM-dd");
            normalizedAvailability[date] = data.availability?.[date] || [];
            normalizedLocked[date] = data.lockedSlots?.[date] || [];
          }
          setAvailability(normalizedAvailability);
          setSavedAvailability(normalizedAvailability);
          setLockedSlots(normalizedLocked);
        } else {
          console.error("Failed to load availability");
        }
      } catch (err) {
        console.error("Error loading availability", err);
      }
    };
    fetchAvailability();
  }, [expertId]);
  const hasChanges = useMemo(() => {
    return JSON.stringify(availability) !== JSON.stringify(savedAvailability);
  }, [availability, savedAvailability]);
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Availability Calendar
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" /> Saved Slot
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" /> New Slot
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded" /> Removed Slot
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded" /> Locked/Past
        </div>
      </div>

      <div className="overflow-auto rounded border border-gray-300">
        <table className="min-w-max w-full border-collapse text-sm text-center">
          <thead className="sticky top-0 bg-white shadow z-10">
            <tr>
              <th className="p-2 bg-gray-50 border" />
              {[...Array(8)].map((_, i) => {
                const date = addDays(today, i);
                const dateStr = format(date, "yyyy-MM-dd");
                return (
                  <th
                    key={i}
                    className="p-2 border bg-gray-50 text-xs sm:text-sm"
                  >
                    <div className="font-semibold">{format(date, "EEE")}</div>
                    <div className="text-gray-500">{format(date, "MMM d")}</div>
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
                  <td className="p-2 border font-medium text-gray-700 bg-gray-50">
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
                    const isLocked = lockedSlots[dateStr]?.includes(timestr);

                    let bgClass = "bg-white hover:bg-blue-100";
                    if (isPast || isLocked)
                      bgClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
                    else if (wasSavedButRemoved)
                      bgClass = "bg-red-200 text-red-800";
                    else if (isUnchangedSaved)
                      bgClass = "bg-green-500 text-white";
                    else if (isNewlySelected)
                      bgClass = "bg-blue-500 text-white";

                    return (
                      <td
                        key={`${dateStr}-${hour}`}
                        className={`p-2 border cursor-pointer ${bgClass}`}
                        onClick={() => {
                          if (!isPast && !isLocked) toggleSlot(dateStr, hour);
                        }}
                      >
                        {isPast || isLocked ? "–" : isSelected ? "✓" : ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={saveAvailability}
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-lg font-semibold transition 
    ${
      hasChanges
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}
