"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Navigation } from "@/component/Navbar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Theme setup script BEFORE hydration */}
          <Script id="theme-loader" strategy="beforeInteractive">
            {`
              try {
                const theme = localStorage.getItem('theme') || 'lofi';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `}
          </Script>
        </head>
        <body>
          <Toaster position="top-center" />
          {isMounted && !shouldHideNavbar && <Navigation />}
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen w-screen bg-base-100">
                <div className="w-[70%] h-3/6 flex flex-col gap-4">
                  <div className="skeleton h-10 w-1/3"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
