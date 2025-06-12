"use client";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navigation } from "@/component/Navbar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/feedback",
    "/success",
    "/failed",
    "/admin",
  ];
  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) || pathname.startsWith("/room/");

  return (
    <ClerkProvider>
      <html data-theme="lofi" lang="en">
        <body>
          {/* Wait until after mount to render Navbar to avoid hydration mismatch */}

          <Toaster position="top-center" />
          {isMounted && !shouldHideNavbar && <Navigation />}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
