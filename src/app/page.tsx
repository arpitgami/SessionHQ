"use client";

import useUserGuard from "@/hooks/useUserGuard";
export default function Home() {
  useUserGuard();

  // if (checking) return <p>Loading...</p>;

  return <>yoo</>;
}
