import React, { useState } from 'react'
const availability = {
    "2025-06-03": [],
    "2025-06-04": ["08:00", "11:00", "13:00", "15:00", "17:00"],
    "2025-06-05": ["12:00", "15:00", "17:00"],
    "2025-06-06": ["15:00", "16:00"],
    "2025-06-07": ["09:00", "10:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    "2025-06-08": ["10:00", "13:00", "15:00"],
    "2025-06-09": ["09:00", "11:00", "14:00", "16:00", "17:00"],
    "2025-06-10": []
};
const Slot = ({ selectedSlot, setSelectedSlot, nextStep }) => {

    const handleSlotClick = (date, time) => {
        // console.log({ date, time });    
        setSelectedSlot({ date, time });
    };

    const handleConfirm = () => {
        if (selectedSlot) {
            nextStep();
        }
    };

    return (
        <div>
            <div className="modal-box max-w-3xl">
                <h3 className="text-xl  font-semibold mb-4 ">Select a Slot</h3>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {Object.entries(availability).map(([date, slots]) => (
                        <div
                            key={date}
                            className="flex items-start gap-4 border-b pb-3"
                        >
                            <div className="w-28 text-sm font-medium text-gray-700">
                                {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>

                            {slots.length === 0 ? (
                                <div className="text-gray-400 text-sm">No slots</div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {slots.map((time) => {
                                        const isSelected = selectedSlot?.date === date && selectedSlot?.time === time;

                                        // Add 1 hour to the time string (assumes HH:MM format)
                                        const [hours, minutes] = time.split(":").map(Number);
                                        const endHour = (hours + 1) % 24;
                                        const endTime = `${endHour.toString().padStart(2, "0")}:${minutes
                                            .toString()
                                            .padStart(2, "0")}`;

                                        return (
                                            <button
                                                key={time}
                                                onClick={() => handleSlotClick(date, time)}
                                                className={`px-3 py-1 text-sm rounded-full border ${isSelected
                                                    ? "bg-neutral text-white border-neutral"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-base-300"
                                                    }`}
                                            >
                                                {time} - {endTime}
                                            </button>
                                        );
                                    })}

                                </div>
                            )}
                        </div>
                    ))}
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
    )
}

export default Slot