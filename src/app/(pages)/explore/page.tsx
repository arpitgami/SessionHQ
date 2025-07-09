"use client";
import { ExpertCard } from "@/component/ExpertCard";
import { useEffect, useState } from "react";
import useUserGuard from "@/hooks/useUserGuard";

export default function ExplorePage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  useUserGuard();
  useEffect(() => {
    document.title = "Explore - SessionHQ";
    //fetching expert data
    const fetchExperts = async () => {
      try {
        const res = await fetch("/api/expert/expertdata");
        const data = await res.json();
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
    <main className="max-w-6xl mx-auto px-4 py-10 bg-base-100 min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-base-content">
          Our Experts
        </h2>
        <p className="mt-2 text-base text-base-content opacity-80">
          Learn from professionals in your field.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-base-200 rounded-xl shadow p-4 flex flex-col gap-4"
            >
              <div className="skeleton w-full aspect-[4/3] rounded-lg"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-10 w-full rounded-md mt-2"></div>
            </div>
          ))}
        </div>
      ) : experts.length === 0 ? (
        <p className="text-center text-base-content opacity-70">
          No experts available right now.
        </p>
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
