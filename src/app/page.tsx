"use client"

import { useUser } from "@clerk/nextjs";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const { user, isLoaded } = useUser();

  useEffect(() => {

    // console.log(user, isLoaded);

    if (user?.id && isLoaded) {
      // console.log("checking user data...");

      (async function checkUser() {

        const res = await fetch(`/api/user/saveuserdata?userId=${user.id}`, {
          method: "GET",
        });

        const data = await res.json();
        // console.log("user data :", data);
        if (!data.status) {
          console.error("Error while getting user info", data.error);
          return;
        }

        if (!data.isFound) {
          router.push("/userform");
        }

      })()


    }
  }, [user, isLoaded])


  return (
    <>
      yoo
    </>
  );
}
