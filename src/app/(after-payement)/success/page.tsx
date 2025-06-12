// app/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div data-theme="lofi" className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-700">Redirecting you to the homepage...</p>
        </div>
    );
}
