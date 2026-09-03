"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { ServiceItem } from "@/src/types/serviceItemTypes";
import {
  formatPrice,
  formatRating,
  formatBookingsLabel,
  getLowestDurationPrice,
} from "@/src/utils/service/card";

// Generic over the concrete item type so the caller's exact shape
// (e.g. HomeServiceItem, whose `name` is required) flows back through
// `onSelect` without widening to bare ServiceItem.
type ServiceCardProps<T extends ServiceItem> = {
  service: T;
  // Fallback for the image alt / placeholder initial when the service has
  // no title of its own.
  categoryName: string;
  // Clicking the card hands the raw service back to the caller, which owns
  // the <SubDetailPopUp> mount (same as category-services does today).
  onSelect: (service: T) => void;
  // Caller passes its own next/image `sizes` — the slide width differs
  // between the category row and the "Most Popular" row.
  imageSizes?: string;
  className?: string;
};

// Matches the category row's slide widths (2.12 → 5.15 across breakpoints).
const DEFAULT_IMAGE_SIZES =
  "(max-width: 639px) 45vw, (max-width: 767px) 45vw, (max-width: 1023px) 30vw, (max-width: 1279px) 23vw, 19vw";

export default function ServiceCard<T extends ServiceItem>({
  service,
  categoryName,
  onSelect,
  imageSizes = DEFAULT_IMAGE_SIZES,
  className = "",
}: ServiceCardProps<T>) {
  const image = service.media ?? service.thumbnailKey;
  const lowestDurationPrice = getLowestDurationPrice(service);
  const title =
    service.cardTitle ?? service.title ?? service.name ?? "Wellness service";
  const altText =
    service.cardTitle ?? service.title ?? service.name ?? categoryName;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`group block h-full cursor-pointer ${className}`}
    >
      <div className="relative mb-[7px] aspect-[168/97] w-full overflow-hidden rounded-[7px] bg-stone-100">
        {image ? (
          <Image
            src={image}
            alt={altText}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-2xl font-bold text-amber-500">
            {altText.charAt(0)}
          </span>
        )}
      </div>
      {/* min-h reserves 2 lines so the rating row below lands at the same
          height across every card in the row regardless of title length —
          items-end bottom-aligns the title inside that reserved box. */}
      <div className="flex min-h-[32px] items-end">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[116%] text-black transition-colors group-hover:text-amber-600">
          {title}
        </h3>
      </div>
      {/* One row — star, rating, then bookings in parens. */}
      <div className="mt-[6px] flex items-center gap-1 text-[12px] leading-[116%] text-[#666]">
        <Star className="h-3.5 w-3.5 shrink-0 fill-[#ffb318] text-[#ff9d00]" />
        <span className="font-medium text-black">
          {formatRating(service.averageRating ?? service.rating)}
        </span>
        <span>({formatBookingsLabel(service.totalBookingsCount)})</span>
      </div>
      <div className="mt-[6px] flex items-center gap-1 text-[14px] font-medium leading-[116%] text-black">
        <span>Starts at {formatPrice(lowestDurationPrice)}</span>
        <span className="text-[12px] text-[#666] line-through">
          {formatPrice(service.originalPrice)}
        </span>
      </div>
    </div>
  );
}
