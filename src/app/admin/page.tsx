"use client";
import { useEffect, useState } from "react";
import ExpertCard from "@/component/Adminexpertcard";

type Expert = {
  _id: string;
  clerkID: string;
  imageURL: string;
  fullName: string;
  email: string;
  linkedin: string;
  twitter: string;
  headline: string;
  expertise: string[];
  experience: string;
  bio: string;
  languages: string[];
  hourlyRate: number;
  socialProofs: string[];
  status: string;
};

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  // Fetch pending experts
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch("/api/admin/experts");
        const data = await res.json();
        setExperts(data.experts || []);
      } catch (err) {
        console.error("Error fetching experts:", err);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchExperts();
  }, []);

  // Approve handler
  const handleApprove = async (expertId: string, expertfullname: string) => {
    setLoadingId(expertId);
    try {
      const res = await fetch("/api/admin/experts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expertId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Expert ${expertfullname} has been approved.`);
        setExperts((prev) => prev.filter((exp) => exp._id !== expertId));
      }
    } catch (err) {
      console.error("Approval error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Pending Expert Approvals</h1>

      {loadingPage ? (
        <p>Loading experts...</p>
      ) : experts.length === 0 ? (
        <p className="text-gray-500">No pending experts to approve.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {" "}
          {experts.map((expert) => (
            <ExpertCard
              key={expert._id}
              expert={expert}
              onApprove={handleApprove}
              isLoading={loadingId === expert._id}
            />
          ))}{" "}
        </div>
      )}
    </div>
  );
}
