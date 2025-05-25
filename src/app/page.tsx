"use client"

import { useSocket } from "@/context/socket";
import { useEffect } from "react";

export default function Home() {
  const socket = useSocket();

  useEffect(() => {
    console.log(socket);
  }, [socket])

  return (
    <>yoo</>
  );
}
