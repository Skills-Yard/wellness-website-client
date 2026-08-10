import Image from "next/image";
import { Star } from "lucide-react";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import { CampaignMediaType } from "@/src/types/serviceTypes";

interface DesktopHeroProps {
  title: string;
  rating: string | number;
  reviews: string | number;
  media: string;
  mediaType?: CampaignMediaType;
  subtitle?: string;
}

export default function DesktopHero({
  title,
  rating,
  reviews,
  media,
  mediaType = "IMAGE",
  subtitle,
}: DesktopHeroProps) {
  return (
    <div className="hidden lg:block relative w-full h-87.5 xl:h-100 bg-slate-900 overflow-hidden rounded-3xl shadow-sm mb-12">
      {mediaType === "VIDEO" ? (
        <CampaignVideo
          src={media}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      ) : (
        <Image
          src={media || "/images/hero-fallback.jpg"}
          alt={title}
          fill
          priority
          className="object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-14 w-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center pl-1 border border-white/50 shadow-lg">
          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 sm:px-8 lg:px-12 pt-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
          {title}
        </h1>
        {subtitle ? (
          <p className="mb-3 max-w-2xl text-sm sm:text-base text-slate-200">
            {subtitle}
          </p>
        ) : null}
        <p className="flex items-center text-sm sm:text-base text-slate-200">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1.5" />
          <span className="font-bold text-white mr-1.5">{rating}</span>(
          {reviews})
        </p>
      </div>
    </div>
  );
}
