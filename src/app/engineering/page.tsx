"use client";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import React from "react";

export default function RequestLifecycleSection() {
  return (
    <>
      <section className="bg-base-200 py-20 px-6 sm:px-10 md:px-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-2">
              SessionHQ
            </h1>
            <p className="text-base-content text-lg">
              High-signal 1:1 sessions for early-stage founders.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-4">
              Why We Built This
            </h2>
            <p className="text-base-content text-lg leading-relaxed">
              What if there was a platform where you could openly discuss your
              early-stage startup problems with seasoned operators — founders
              who’ve built, failed, scaled, and shipped?
              <br className="hidden sm:block" />
              <br />
              SessionHQ brings that to life: a curated 1:1 session platform
              engineered to connect early-stage founders with experienced
              experts in a noise-free, structured environment. Our focus is on
              thoughtful onboarding, frictionless scheduling, and seamless
              meetings — respecting both the founder’s hustle and the expert’s
              time.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-6xl space-y-10 mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">
            High Level Diagram
          </h2>
        </div>

        <div>
          <div className="w-full max-w-7xl rounded-2xl p-2">
            <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
              <Image
                src="/High Level Diagram Dark.png"
                alt="High Level Diagram"
                width={1400}
                height={600}
                className="w-full max-w-7xl border-2 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center ">
        <div className="divider divider-secondary w-3xl" />
      </div>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          User/Expert Flow
        </h2>
        <p className="text-center text-base-content mb-12">
          This diagram outlines overall approximate user/expert flow in the
          project.
        </p>
        {/* Diagram */}
        <div className="flex justify-center mb-4">
          <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
            <img
              src="userexpertdark.svg"
              alt="userexpertdark.svg"
              className="w-full max-w-3xl rounded-2xl p-2"
            />
          </div>
        </div>
      </section>
      <div className="flex justify-center ">
        <div className="divider divider-secondary w-3xl" />
      </div>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Request Lifecycle
        </h2>
        <p className="text-center text-base-content mb-12">
          This diagram outlines how a user’s request transitions through various
          states — from initial submission to final resolution.
        </p>

        {/* Diagram */}
        <div className="flex justify-center mb-8">
          <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
            <img
              src="Request Flow Dark.png"
              alt="Request Flow Diagram"
              className="w-full max-w-7xl rounded-2xl p-2"
            />
          </div>
        </div>

        {/* Status List */}
        <div className="overflow-x-auto mb-12">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th className="p-4 font-semibold text-base-content">Status</th>
                <th className="p-4 font-semibold text-base-content">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  status: "pending",
                  desc: "Initial request state after reservation fee payment, awaiting expert action.",
                },
                {
                  status: "accepted",
                  desc: "Expert approved the request, waiting for user payment final payment.",
                },
                {
                  status: "rejected",
                  desc: "Expert manually declined the request. Refund is initiated.",
                },
                {
                  status: "declined",
                  desc: "System declined due to timeout e.g., no response within 48 hrs or slot time passed. Refund is initiated.",
                },
                {
                  status: "expired",
                  desc: "User failed to pay within 48 hrs of acceptance or the slot has passed. No refund.",
                },
                {
                  status: "failed",
                  desc: "Other competing requests for the same slot (after one is accepted) are marked as failed. Refund is initiated.",
                },
                {
                  status: "cancelled",
                  desc: "The expert removed the slot. Pending requests for this slot are cancelled and refunded.",
                },
              ].map(({ status, desc }) => (
                <tr key={status}>
                  <td className="p-4 font-mono font-semibold text-primary  rounded-lg">
                    {status}
                  </td>
                  <td className="p-4 text-base-content">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Automation Explanation */}
        <div className="bg-base-200 p-6 rounded-2xl ">
          <h3 className="text-xl font-bold mb-4 text-base-content">
            Automation & Realtime Status Handling
          </h3>
          <ul className="list-disc list-inside space-y-2 text-base-content">
            <li>
              Every time a request is fetched from the database—whether by a
              user or admin—it undergoes a set of validation checks to determine
              if it has expired or timed out. If the request fails any check, it
              is immediately updated in the database before being sent back to
              the client.
            </li>
            <li>
              This on-the-fly validation eliminates the need for background cron
              jobs or schedulers, ensuring that the client UI always reflects
              the most accurate and up-to-date request status in real-time.
            </li>
          </ul>
        </div>
      </section>

      <div className="flex justify-center ">
        <div className="divider divider-secondary w-3xl" />
      </div>

      <section className="max-w-6xl space-y-10 mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">
            Meeting & Chat System Architecture
          </h2>
          <p className="text-base-content mt-2">
            A real-time peer-to-peer video call and chat setup powered by{" "}
            <span className="font-semibold">Socket.io</span> and{" "}
            <span className="font-semibold">PeerJS</span>.
          </p>
        </div>

        {/* Video Flow Diagram */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-base-content mb-3">
            Video Call Flow
          </h3>
          <div className="w-full max-w-7xl rounded-2xl p-2">
            <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
              <Image
                src="/Video Call Dark.png"
                alt="Video Call Flow"
                width={1400}
                height={600}
                className="w-full max-w-7xl border-2 rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Chat Flow Diagram */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-base-content mb-3">
            Chat Messaging Flow
          </h3>
          <div className="w-full max-w-7xl rounded-2xl p-10">
            <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
              <Image
                src="/Chat Section Dark.png"
                alt="Chat Flow"
                width={1200}
                height={500}
                className=""
              />
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center ">
        <div className="divider divider-secondary w-3xl" />
      </div>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Database Model
        </h2>
        <p className="text-center text-base-content mb-12">
          This diagram outlines overall approximate database flow wherein each
          database has been labelled and represents several Primary Key(PK)
          and/or Foriegn Key(FK) respectively.
        </p>
        {/* Diagram */}
        <div className="flex justify-center mb-4">
          <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
            <img
              src="databasemodel.svg"
              alt="databasemodel.svg"
              className="w-full max-w-5xl rounded-2xl p-2"
            />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-6 bg-gradient-to-br from-base-200 to-base-300 rounded-3xl shadow-lg ring-1 ring-base-300/60 backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold mb-10 text-center text-primary tracking-tight">
          Tech Stack Overview
        </h2>
        <div className="grid grid-cols-1 divide-y divide-base-300">
          {[
            { label: "Language", value: "TypeScript" },
            { label: "Framework", value: "Next.js" },
            { label: "Realtime & Video", value: "WebRTC, PeerJS, Socket.IO" },
            { label: "Styling", value: "TailwindCSS, DaisyUI" },
            { label: "Database", value: "MongoDB" },
            { label: "Payments & Media", value: "Stripe, Cloudinary" },
            { label: "Authentication & Email", value: "Clerk, Nodemailer" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center py-4 px-2 hover:bg-base-100/30 transition rounded-md"
            >
              <span className="text-md font-medium text-base-content">
                {label}
              </span>
              <span className="text-sm text-primary font-semibold tracking-wide bg-primary/10 px-3 py-1 rounded-full">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content mt-10 p-10 ">
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
    </>
  );
}
