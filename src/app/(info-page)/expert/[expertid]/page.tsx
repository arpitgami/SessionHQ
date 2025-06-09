"use client"
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

import Slot from "@/component/modal/Slot"
import AboutYou from "@/component/modal/AboutYou"
import SessionIntent from "@/component/modal/SessionIntent"
import LockYourSlot from "@/component/modal/LockYourSlot"
import { useUser } from "@clerk/nextjs";

interface Expert {
  clerkID: string;
  fullName: string;
  headline: string;
  bio: string;
  imageURL: string;
  hourlyRate: number;
  expertise: string[];
  languages: string[];
  email: string;
  experience: string;
  linkedin: string;
  twitter?: string;
  socialProofs?: {
    url: string;
    description?: string;
  }[];
}


export default function ExpertProfile() {
  const { expertid } = useParams();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { user, isLoaded } = useUser();
  const [sessionLoaded, setSessionLoaded] = useState(false);



  useEffect(() => {
    if (!expertid) return;
    (async function fetchExpert() {
      try {
        const res = await fetch(`/api/expert/expertdata?id=${expertid}`);
        const data = await res.json();
        if (!data.status) {
          console.error("error fetching expert data:", data.error);
          return;
        }
        console.log(data.data[0]);
        setExpert(data.data[0]);

      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    })()


  }, [expertid]);

  //load previous usersession data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/user/saveUserSessionData?userId=${user?.id}`);
        const data = await res.json();

        if (data.status && data.isFound) {
          setFormData(data.userData);
          setSessionLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching session data", err);
      }
    })();
  }, [user, isLoaded])


  function nextStep() {
    setStep((prev) => prev + 1);
  }
  function prevStep() {
    setStep((prev) => prev - 1);
  }



  if (!expert) return <div className="flex flex-col h-screen w-screen items-center justify-center ">
    <div className="flex w-[70%] h-3/6 flex-col gap-4">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  </div>

  return (
    <>

      <div>
        <dialog id="my_modal" className="modal">

          {step == 1 && <Slot selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} nextStep={nextStep} />}
          {step == 2 && <AboutYou formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} sessionLoaded={sessionLoaded} setSessionLoaded={setSessionLoaded} />}
          {step == 3 && <SessionIntent formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
          {step == 4 && <LockYourSlot expert={expert} selectedSlot={selectedSlot} prevStep={prevStep} user={user} formData={formData} />}

        </dialog>


      </div>

      <div className="min-h-[80%] flex items-start justify-center bg-base-100 px-4 py-7">
        <div className="max-w-6xl w-full p-6 bg-base-100 rounded-2xl shadow-lg flex flex-col items-center md:flex-row gap-6">

          {/* Left: Profile Image */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative w-[100%] aspect-[4/5] overflow-hidden rounded-xl shadow">
              <Image
                src={expert.imageURL || "/default-avatar.png"}
                alt={expert.fullName}
                fill
                className="object-cover"
              />
            </div>

          </div>


          {/* Right: Info */}
          <div className="flex flex-col justify-between w-full md:w-2/3">
            <div>
              <h2 className="text-4xl font-extrabold mb-2 text-primary">{expert.fullName}</h2>
              <p className="text-base text-secondary mb-1">{expert.headline}</p>
              <p className="text-base mb-4">{expert.bio}</p>

              {/* Expertise Pills */}
              {expert.expertise?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-base-100 border border-bg-primary text-black text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1  gap-3 text-sm">
                <div className="font-medium" >{expert.languages?.join(", ")}</div>
                <div className="font-medium">{expert.experience} years of experience.</div>
                <div className="flex flex-row gap-2">
                  <div><a href={expert.linkedin} target="_blank" className="text-bg-100 underline"><FaLinkedin className="size-5" /></a></div>
                  {expert.twitter && (
                    <div> <a href={expert.twitter} target="_blank" className="text-primary underline"><FaXTwitter className="size-5" /></a></div>
                  )}
                </div>
              </div>

              {/* Social Proofs */}
              {expert.socialProofs && expert.socialProofs.length > 0 && (
                <div className="mt-4">
                  {/* <strong className="block mb-1">Social Proofs:</strong> */}
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {expert.socialProofs.map((proof, idx) => (
                      <li key={idx}>
                        <a href={proof.url} target="_blank" className="text-primary underline">
                          {proof.description || proof.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Appointment Button + Rate */}
              <div className="flex flex-col sm:flex-row w-full items-center justify-end px-6 py-4 text-lg mt-4">
                <div className="text-3xl font-semibold mr-5">${expert.hourlyRate}/hr</div>
                <button className="btn btn-primary " onClick={() => (document.getElementById("my_modal") as HTMLDialogElement).showModal()} > Book an Appointment</button>
              </div>
            </div>
          </div>
        </div>
      </div>




    </>
  );

}


