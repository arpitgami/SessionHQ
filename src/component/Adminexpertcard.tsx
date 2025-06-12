"use client";
import React from "react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

type Expert = {
  _id: string;
  clerkID: string;
  imageURL: string;
  fullName: string;
  email: string;
  linkedin: string;
  twitter: string;
  headline: string;
  expertise: string[];
  experience: string;
  bio: string;
  languages: string[];
  hourlyRate: number;
  socialProofs: string[];
  status: string;
};

type Props = {
  expert: Expert;
  onApprove: (expertId: string, expertfullname: string) => void;
  isLoading: boolean;
};

const ExpertCard: React.FC<Props> = ({ expert, onApprove, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full">
      {/* Content Body */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={expert.imageURL}
            alt={expert.fullName}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-lg font-semibold">{expert.fullName}</h2>
            <p className="text-sm text-gray-600 italic">{expert.headline}</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">{expert.bio}</p>

        <div className="text-sm space-y-1 mb-4">
          <p>
            <strong>Email:</strong> {expert.email}
          </p>
          <p>
            <strong>Experience:</strong> {expert.experience} years
          </p>
          <p>
            <strong>Rate:</strong> ${expert.hourlyRate}/hr
          </p>
          <p>
            <strong>Languages:</strong> {expert.languages.join(", ")}
          </p>
          <p>
            <strong>Expertise:</strong> {expert.expertise.join(", ")}
          </p>
        </div>
      </div>

      {/* Footer Section: Links + Button */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex gap-4">
          {expert.linkedin && (
            <a
              href={expert.linkedin}
              className="text-blue-600 hover:text-blue-800 transition"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
          )}
          {expert.twitter && (
            <a
              href={expert.twitter}
              className="text-sky-400 hover:text-sky-600 transition"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter size={22} />
            </a>
          )}
        </div>

        <button
          onClick={() => onApprove(expert._id, expert.fullName)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-60 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Approving..." : "Approve Expert"}
        </button>
      </div>
    </div>
  );
};

export default ExpertCard;
