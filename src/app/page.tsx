"use client";

import { useSearchParams } from "next/navigation";
import useUserGuard from "@/hooks/useUserGuard";
import { useEffect } from "react";
export default function Home() {
  useUserGuard();
  const searchParams = useSearchParams();
  const authError = searchParams.get("authError");

  useEffect(() => {
    if (authError) {
      alert("Please sign in before to go that page.....");
    }
  }, [authError]);

  // if (checking) return <p>Loading...</p>;

  return <>yoo</>;
}
