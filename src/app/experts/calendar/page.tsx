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
 useEffect(()=>{
    document.title="Calendar - SessionHQ";
  },[])
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
    <div className="p-4 sm:p-6 bg-base-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-base-content mb-8">
        Availability Calendar
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm text-base-content/70">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success rounded" /> Saved Slot
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent rounded" /> New Slot
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error/30 rounded" /> Removed Slot
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-base-300 rounded" /> Locked/Past
        </div>
      </div>

      <div
        className="overflow-auto rounded border border-neutral
"
      >
        <table className="min-w-max w-full border-collapse text-sm text-center">
          <thead className="sticky top-0 bg-base-100 z-10 shadow">
            <tr>
              <th
                className="p-2 border border-neutral
 bg-base-200"
              />
              {[...Array(8)].map((_, i) => {
                const date = addDays(today, i);
                return (
                  <th
                    key={i}
                    className="p-2 border border-neutral
 bg-base-200 text-xs sm:text-sm"
                  >
                    <div className="font-semibold">{format(date, "EEE")}</div>
                    <div className="text-base-content/60">
                      {format(date, "MMM d")}
                    </div>
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
                  <td
                    className="p-2 border border-neutral
 font-medium text-base-content bg-base-200"
                  >
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

                    let bgClass = "bg-base-200 hover:bg-base-300";
                    if (isPast || isLocked)
                      bgClass =
                        "bg-base-300 text-base-content/40 cursor-not-allowed";
                    else if (wasSavedButRemoved)
                      bgClass = "bg-error/20 text-error";
                    else if (isUnchangedSaved)
                      bgClass = "bg-success text-success-content";
                    else if (isNewlySelected)
                      bgClass = "bg-accent text-primary-content";

                    return (
                      <td
                        key={`${dateStr}-${hour}`}
                        className={`p-2 border border-neutral
 cursor-pointer ${bgClass}`}
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
        ${hasChanges
              ? "bg-primary hover:bg-primary/80 text-primary-content"
              : "bg-base-200 text-base-content/40 cursor-not-allowed"
            }
      `}
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}
