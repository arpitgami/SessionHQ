"use client";
import React, { useEffect, useState } from 'react';
import { FormField } from '@/component/expertform/forminputs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [formData, setFormData] = useState({});

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Attach clerkID once user is loaded
    useEffect(() => {
        if (isLoaded && user?.id) {
            updateField("clerkID", user.id);
            const email = user.emailAddresses[0].emailAddress;
            updateField("email", email) //email added
        }
    }, [isLoaded, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoaded || !user?.id) {
            console.error("User not loaded yet.");
            return;
        }
        try {
            // console.log(formData);
            const res = await fetch("/api/user/saveuserdata", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            if (!data.status) {
                console.error("error while saving the user data", data);
                return;
            }


            alert("Your profile is completed.!!")

            router.push('/')
        } catch (error) {
            console.error("Network error while saving user data", error);
        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 bg-base-100 p-6 rounded-xl"
            >
                <FormField label="Full Name" required>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Your full name"
                        value={formData.fullName || ''}
                        onChange={(e) => updateField('fullName', e.target.value)}
                    />
                </FormField>
                {/* 
                <FormField label="Email" required>
                    <input
                        type="email"
                        className="input input-bordered w-full"
                        placeholder="you@example.com"
                        value={formData.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                    />
                </FormField> */}

                <FormField label="LinkedIn Profile" required>
                    <input
                        type="url"
                        className="input input-bordered w-full"
                        placeholder="https://linkedin.com/in/your-profile"
                        value={formData.linkedinURL || ''}
                        onChange={(e) => updateField('linkedinURL', e.target.value)}
                    />
                </FormField>

                <FormField label="Twitter (optional)">
                    <input
                        type="url"
                        className="input input-bordered w-full"
                        placeholder="https://twitter.com/yourhandle"
                        value={formData.twitterURL || ''}
                        onChange={(e) => updateField('twitterURL', e.target.value)}
                    />
                </FormField>

                <FormField label="Website (optional)">
                    <input
                        type="url"
                        className="input input-bordered w-full"
                        placeholder="https://yourwebsite.com"
                        value={formData.websiteURL || ''}
                        onChange={(e) => updateField('websiteURL', e.target.value)}
                    />
                </FormField>

                <button type="submit" className="btn btn-primary w-full">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Page;
