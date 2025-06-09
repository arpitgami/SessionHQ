'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function FeedbackForm() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // console.log({ rating, feedback });
        router.push("/")
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center bg-base-100 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center">We value your feedback</h2>

                {/* DaisyUI Rating Stars */}
                <div>Rate the session</div>
                <div className="rating rating-lg flex justify-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <input
                            key={value}
                            type="radio"
                            name="rating"
                            className="mask mask-star-2 bg-primary"
                            checked={rating === value}
                            onChange={() => setRating(value)}
                        />
                    ))}
                </div>

                {/* Textarea */}
                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Any issues or say something..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />

                {/* Submit Button */}
                <button className="btn btn-primary w-full" type="submit">
                    Submit
                </button>
                <div className='btn btn-ghost btn-sm' onClick={() => router.push("/")}>Skip</div>
            </form>
        </div>
    );
}
