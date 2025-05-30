"use client";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navigation } from "@/component/Navbar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/login", "/signup", "/experts/calendar"];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) || pathname.startsWith("/room/");

  useEffect(() => {
    console.log("pathname : ", pathname, shouldHideNavbar);
  }, []);

  return (
    <ClerkProvider>
      <html data-theme="fantasy" lang="en">
        <body>
          {!shouldHideNavbar && <Navigation />}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
