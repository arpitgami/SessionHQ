"use client"
import Image from 'next/image';
import React from 'react';

export default function RequestLifecycleSection() {
    return (
        <>
            <section className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-4 text-center text-primary">Request Lifecycle</h2>
                <p className="text-center text-base-content mb-12">
                    This diagram outlines how a user’s request transitions through various states — from initial submission to final resolution.
                </p>

                {/* Diagram */}
                <div className="flex justify-center mb-8">
                    <img
                        src="Video Call.png"
                        alt="Request Flow Diagram"
                        className="w-full max-w-7xl border-2 rounded-2xl p-2"
                    />
                </div>

                {/* Status List */}
                <div className="overflow-x-auto mb-12">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200 text-base-content">
                            <tr>
                                <th className="p-4 font-semibold text-secondary">Status</th>
                                <th className="p-4 font-semibold text-secondary">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { status: 'pending', desc: 'Initial request state after reservation fee payment, awaiting expert action.' },
                                { status: 'accepted', desc: 'Expert approved the request, waiting for user payment final payment.' },
                                { status: 'rejected', desc: 'Expert manually declined the request. Refund is initiated.' },
                                { status: 'declined', desc: 'System declined due to timeout e.g., no response within 48 hrs or slot time passed. Refund is initiated.' },
                                { status: 'expired', desc: 'User failed to pay within 48 hrs of acceptance or the slot has passed. No refund.' },
                                { status: 'failed', desc: 'Other competing requests for the same slot (after one is accepted) are marked as failed. Refund is initiated.' },
                                { status: 'cancelled', desc: 'The expert removed the slot. Pending requests for this slot are cancelled and refunded.' },
                            ].map(({ status, desc }) => (
                                <tr key={status}>
                                    <td className="p-4 font-mono font-semibold text-primary  rounded-lg">{status}</td>
                                    <td className="p-4 text-base-content">{desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Automation Explanation */}
                <div className="bg-base-200 p-6 rounded-2xl ">
                    <h3 className="text-xl font-bold mb-4 text-secondary">Automation & Realtime Status Handling</h3>
                    <ul className="list-disc list-inside space-y-2 text-base-content">
                        <li>
                            Every time a request is fetched from the database—whether by a user or admin—it undergoes a set of validation checks to determine if it has expired or timed out. If the request fails any check, it is immediately updated in the database before being sent back to the client.
                        </li>
                        <li>
                            This on-the-fly validation eliminates the need for background cron jobs or schedulers, ensuring that the client UI always reflects the most accurate and up-to-date request status in real-time.
                        </li>
                    </ul>

                </div>
            </section>
            <div className="flex justify-center ">
                <div className="divider divider-accent w-md" />
            </div>
            <section className="max-w-6xl space-y-10 mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary">Meeting & Chat System Architecture</h2>
                    <p className="text-base-content mt-2">A real-time peer-to-peer video call and chat setup powered by <span className="font-semibold">Socket.io</span> and <span className="font-semibold">PeerJS</span>.</p>
                </div>

                {/* Video Flow Diagram */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-3">Video Call Flow</h3>
                    <div className="w-full max-w-7xl border-2 rounded-2xl p-2">
                        <Image
                            src="/Video Call.png"
                            alt="Video Call Flow"
                            width={1400}
                            height={600}
                            className="w-full max-w-7xl border-2 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Chat Flow Diagram */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-3">Chat Messaging Flow</h3>
                    <div className="w-full max-w-7xl border-2 rounded-2xl p-10">
                        <Image
                            src="/Chat Section.png"
                            alt="Chat Flow"
                            width={1200}
                            height={500}
                            className=""
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
