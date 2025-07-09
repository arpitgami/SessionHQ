"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useUserGuard from "@/hooks/useUserGuard";
import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
export default function Home() {
  useUserGuard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false); //toprevent duplicate
  useEffect(() => {
    document.title = "SessionHQ";},[]);
  useEffect(() => {
    const status = searchParams.get("status");
    const toastType = searchParams.get("toast");
    if (hasShownToast.current) return;
    if (status === "pending") {
      toast.error("Your expert profile is under review.");
      hasShownToast.current = true;
    }

    if (toastType === "restricted") {
      toast.error("Experts are not allowed to access client pages.");
      hasShownToast.current = true;
    }

    if (toastType === "restricted_expert") {
      toast.error("You must be an expert to access this page.");
      hasShownToast.current = true;
    }
    if (toastType === "login_required") {
      toast.error("Please log in to access this page.");
      hasShownToast.current = true;
    }
    if (toastType === "admin_only") {
      toast.error("You are not authorized to view this page.");
    }
  }, [searchParams]);
  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="bg-base-100 text-base-content py-25 px-6 relative">
        <div className="absolute top-1 right-30">
          <div className="btn bg-accent/10 border-base-content rounded-2xl  " onClick={() => router.push("/engineering")}>Engineering Page</div>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              The Future of{" "}
              <span className="text-primary">Expert Guidance</span>
              <br />
              Starts with <span className="text-accent">One Call</span>
            </h1>
            <p className="text-lg text-base-content/80 mb-8">
              Book one-on-one sessions with seasoned professionals to elevate
              your ideas into reality.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <a href="/explore" className="btn btn-primary rounded-none">
                Explore
              </a>
              <SignUpButton mode="modal">
                <button className="btn btn-outline border border-base-content rounded-none">
                  Join Now
                </button>
              </SignUpButton>
            </div>

          </div>

          {/* Right Grid with Image and Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-none overflow-hidden border border-base-300">
              <Image
                src="https://res.cloudinary.com/drhmsjhpq/image/upload/v1749457344/art-attack-Qqn9VFkdV6E-unsplash_cwsbem.png" alt="Consultation"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-rows-3 gap-4">
              <div className="bg-base-200 p-4 border border-base-300">
                <h3 className="text-xl font-bold">Built for Founders</h3>
                <p className="text-sm">Personalized guidance from real startup operators</p>
              </div>
              <div className="bg-success/20 p-4 border border-success text-success-content">
                <h3 className="text-xl font-bold">No Spam. No Noise.</h3>
                <p className="text-sm">Every session request is thoughtful & curated</p>
              </div>
              <div className="bg-secondary text-secondary-content p-4 border border-base-300">
                <h3 className="text-xl font-bold">Respectful by Design</h3>
                <p className="text-sm">Protected time for experts, value-first for users</p>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-base-200 text-base-content">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 border border-base-content rounded-none p-6">
              <h3 className="text-xl font-semibold mb-2">1. Find an Expert</h3>
              <p>
                Browse curated profiles of vetted professionals from various
                industries.
              </p>
            </div>
            <div className="card bg-base-100 border border-base-content rounded-none p-6">
              <h3 className="text-xl font-semibold mb-2">2. Book a Session</h3>
              <p>
                Request a call, leave a message, and pay a small reservation fee
                to confirm.
              </p>
            </div>
            <div className="card bg-base-100 border border-base-content rounded-none p-6">
              <h3 className="text-xl font-semibold mb-2">3. Get Advice</h3>
              <p>
                Join the scheduled call and receive actionable insights tailored
                to your startup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-secondary text-secondary-content py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Leap?</h2>
          <p className="mb-6">
            SessionHQ helps founders connect with the right mentors—easily and
            effectively.
          </p>
          <SignUpButton mode="modal">
            <button className="btn btn-primary border border-base-content rounded-none">
              Join Now
            </button>
          </SignUpButton>
        </div>
      </section>
      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10 ">
        <aside>
          <h1 className="font-black text-3xl ">SessionHQ</h1>
        </aside>
        <nav>
          <h6 className="footer-title ">Created By </h6>
          <div className="flex gap-10">
            <a
              href="https://github.com/arpitgami"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-row gap-2 hover:text-gray-400 transition">
                <div className="font-mono text-md ">Arpit Gami</div>
                <FaGithub className="text-xl " />
              </div>
            </a>
            <a
              href="https://github.com/aditya-gup780"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-row gap-2 hover:text-gray-400 transition">
                <div className="font-mono text-md ">Aditya Gupta</div>
                <FaGithub className="text-xl " />
              </div>
            </a>
          </div>
        </nav>
      </footer>
    </main>
  );
}
