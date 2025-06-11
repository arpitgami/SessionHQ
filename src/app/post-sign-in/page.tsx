"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function PostSignInRedirect() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;
    if (role === "expert") {
      router.replace("/experts/requests");
    } else {
      router.replace("/explore");
    }
  }, [isLoaded, user, router]);

  return <div className="text-center p-10 text-lg">Redirecting...</div>;
}
