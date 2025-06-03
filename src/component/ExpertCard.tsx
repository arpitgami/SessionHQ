// components/ExpertCard.tsx
import Image from "next/image";
import Link from "next/link";

interface Expert {
  _id: string;
  fullName: string;
  Headline: string;
  bio: string;
  imageURL: string;
  hourlyRate: string;
  expertise: string[];
  languages: string[];
}

export const ExpertCard = ({ expert }: { expert: Expert }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full transition hover:shadow-lg">
      {/* Top: Avatar + Name */}
      <div className="flex items-center gap-4">
        <Image
          src={expert.imageURL || "/default-avatar.png"}
          alt={expert.fullName}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {expert.fullName}
          </h2>
          <p className="text-sm text-gray-500">{expert.Headline}</p>
        </div>
        <div className="text-right">
          <p className="text-green-600 font-bold text">
            {expert.hourlyRate} $/hr
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-700 mt-3 line-clamp-3">{expert.bio}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {expert.expertise.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Languages (compact inline) */}
      <div className="mt-2 text-xs text-gray-500">
        🗣️ {expert.languages.join(", ")}
      </div>

      {/* View Profile Button */}
      <Link
        href={`/expert/${expert._id}`}
        className="mt-4 inline-block w-full text-center bg-black text-white py-2 text-sm rounded-lg hover:bg-black transition"
      >
        View Profile
      </Link>
    </div>
  );
};
