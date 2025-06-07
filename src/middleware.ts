// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the shape of your user metadata
interface UserMetadata {
  role?: "expert"; // Only experts have role defined, clients have no role property
}

// Define route matchers
const isPublicRoute = createRouteMatcher([
  "/",
  "/explore",
  "/sign-in",
  "/sign-up",
  "/become_an_expert",
  '/api/expert/(.*)',
  '/api/stripe/webhook',
  '/api/request/getrequest',
  '/api/meeting/getmeeting'
]);

const isExpertRoute = createRouteMatcher([
  "/experts/requests",
  "/experts/calendar",
  "/experts/upcomingmeetings",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Get user role from session claims.
  const role = sessionClaims?.role;

  console.log("Found role:", role); // Debug log

  const isExpert = role === "expert";

  // If user is not authenticated and trying to access protected routes direct to sign-in and then go to requested route
  if (!userId && !isPublicRoute(req)) {
    const homeUrl = new URL("/", req.url);
    homeUrl.searchParams.set("authError", "true");
    return NextResponse.redirect(homeUrl);
  }

  // If user is authenticated, handle role-based redirections
  if (userId) {
    // Redirect expert away from client routes
    const clientPages = ["/", "/explore", "/become_an_expert"];
    if (isExpert && clientPages.includes(pathname)) {
      url.pathname = "/experts/calendar";
      return NextResponse.redirect(url);
    }

    // Redirect non-expert users (clients) away from expert-only routes
    if (!isExpert && isExpertRoute(req)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
