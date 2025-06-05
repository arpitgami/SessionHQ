// hooks/useUserGuard.ts
"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useUserGuard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true); // for loading spinner

  useEffect(() => {
    if (isLoaded && user?.id) {
      (async () => {
        const res = await fetch(`/api/user/saveuserdata?userId=${user.id}`);
        const data = await res.json();

        if (!data.status) {
          console.error("API error", data.error);
          return;
        }

        if (!data.isFound) {
          router.replace("/userform"); // prevent user from coming back
        } else {
          setChecking(false);
        }
      })();
    }
  }, [user, isLoaded]);
}
