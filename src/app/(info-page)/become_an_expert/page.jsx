"use client";
import { useEffect, useState } from "react";

import Step1 from "@/component/expertform/step1";
import Step2 from "@/component/expertform/step2";
import Step3 from "@/component/expertform/step3";
import uploadImage from "@/hooks/uploadImage";
import { useRouter } from "next/navigation";

export default function ExpertApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const [formData, setFormData] = useState({});
  const [expertImage, setExpertImage] = useState(null);
  const [loadFrom, setLoadForm] = useState(false);

  // useEffect(() => {
  //     console.log(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
  // }, []);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.linkedin ||
      !formData.headline ||
      !formData.expertise ||
      !formData.experience
    ) {
      alert("Please fill out all required fields in Step 1.");
      return;
    }

    if (
      !formData.bio ||
      !formData.hourlyRate ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill out all required fields in Steps 2 and 3.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!expertImage) {
      alert("Upload image.");
      return;
    }

    // ✅ If everything is valid
    console.log("Submitting:", formData);

    //uploading image to cloudinary
    if (!formData.imageURL) {
      console.log("expert image before calling uplaodimage", expertImage);
      const { imageURL, public_id } = await uploadImage(
        expertImage,
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
      );
      updateField("imageURL", imageURL);
      updateField("publicID", public_id);
    }

    try {
      const res = await fetch("/api/expert/expertdata", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!data.status) {
        console.log("error while saving", data.error);
        alert(data.error.errors[0].longMessage);
        return;
      }

      alert(
        "Your response have been recorded. We will notify you through email!!"
      );

      router.push("/");

      // console.log("Expert form data respose : ", data.status);
    } catch (error) {
      console.log("Network  ", error);
    }
  };

  return loadFrom ? (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        {/* Form */}
        {step === 1 && <Step1 formData={formData} updateField={updateField} />}

        {step === 2 && (
          <Step2
            formData={formData}
            updateField={updateField}
            setExpertImage={setExpertImage}
            expertImage={expertImage}
          />
        )}

        {step === 3 && <Step3 formData={formData} updateField={updateField} />}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button type="button" className="btn" onClick={prevStep}>
              Back
            </button>
          )}
          {step < totalSteps && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextStep}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          )}
        </div>
      </form>

      {/* Steps on right */}
      <div className="w-full md:w-60">
        <ul className="steps steps-vertical">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
            Basic Info
          </li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
            About You
          </li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
            Account Setup
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <section className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">
          Join a network of Vetted Experts!!
        </h1>
        <p className="text-lg mb-8">Helping the next generation of founders.</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setLoadForm(true)}
        >
          Join Now
        </button>
      </div>
    </section>
  );
}
