// app/client/explore/page.tsx
"use client";
import { ExpertCard } from "@/component/ExpertCard";
import { useEffect, useState } from "react";
import useUserGuard from "@/hooks/useUserGuard";
export default function ExplorePage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  useUserGuard();

  // if (checking) return <p>Loading...</p>;

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch("/api/expert/expertdata");
        const data = await res.json();
        console.log(data);
        if (data.status) {
          setExperts(data.data);
        } else {
          console.error("Failed to fetch experts:", data.error);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);
  return (
    <main className="max-w-6xl mx-auto px-4 bg-base-100 min-h-screen">
      {/* <h1 className="text-xl font-bold text-gray-900 text-center">
        LEARN FROM PROFESSIONALS FROM YOUR INDUSTRY!!
      </h1> */}
      {/* <p className="text-xl text-gray-900 text-center">
        Learn from professionals from your industry{" "}
      </p> */}
      <br />
      <br />
      {loading ? (
        <p className="text-center text-gray-500">Loading experts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert: any) => (
            <ExpertCard key={expert.clerkID} expert={expert} />
          ))}
        </div>
      )}
    </main>
  );
}
