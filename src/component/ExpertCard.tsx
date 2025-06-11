// components/ExpertCard.tsx
import Image from "next/image";
import Link from "next/link";

interface Expert {
  clerkID: string;
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
    <div className="bg-base-100 text-base-content rounded-xl shadow p-4 flex flex-col justify-between h-full transition hover:shadow-lg">
      {/* Top: Avatar + Name */}
      <div className="flex items-center gap-4">
        <Image
          src={expert.imageURL}
          alt={expert.fullName}
          width={56}
          height={56}
          className="rounded-full aspect-square object-cover"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{expert.fullName}</h2>
          <p className="text-sm text-neutral">{expert.Headline}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary">{expert.hourlyRate} $/hr</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm mt-3 line-clamp-3 text-base-content/70">
        {expert.bio}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {expert.expertise.map((tag, idx) => (
          <span
            key={idx}
            className="bg-base-200 text-base-content text-xs px-2 py-0.5 rounded-full border border-base-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Languages (compact inline) */}
      <div className="mt-2 text-xs text-base-content/50">
        {expert.languages.join(", ")}
      </div>

      {/* View Profile Button */}
      <Link
        href={`/expert/${expert.clerkID}`}
        className="mt-4 inline-block w-full text-center bg-primary text-primary-content py-2 text-sm rounded-lg transition-colors duration-300 hover:bg-secondary hover:text-secondary-content"
      >
        View Profile
      </Link>
    </div>
  );
};
