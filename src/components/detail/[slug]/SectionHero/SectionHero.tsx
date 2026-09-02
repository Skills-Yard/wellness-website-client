"use client";

import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/src/components/ui/skeleton";

interface SectionHeroProps {
  service: any;
  /** Category name (e.g. "Spa") — rendered as a badge overlaid on the hero
   *  image itself, in the same visual row as the popup's close button
   *  (mainfile.tsx), rather than in a separate strip above the image. */
  categoryLabel?: string;
}

export default function SectionHero({ service, categoryLabel }: SectionHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!service) return null;

  // Always shown, defaulting to 0 — both when the service genuinely has no
  // rating/bookings yet and when the field is simply missing/non-numeric
  // (services.tsx's DynamicService mapping falls back to the string "—"
  // when neither averageRating nor rating exist).
  const rating = typeof service.rating === "number" ? service.rating : 0;
  // totalBookingsCount — the real bookings field (see ServiceItem in
  // serviceItemTypes.ts), not reviews (that's the rating count).
  const bookingsCount =
    typeof service.totalBookingsCount === "number" ? service.totalBookingsCount : 0;
  const startingPrice = service.price;

  return (
    <section className="mx-auto w-full border-b border-slate-100 bg-white px-0 py-0">
      {/* Hero Image — a fixed, capped height (not aspect-video, which at
          this popup's own max-w-4xl/~896px width was rendering ~500px
          tall, taller than a hero image needs to be inside a compact
          popup) so it stays a reasonable size instead of growing with
          width. */}
      <div className="relative h-56 w-full bg-slate-100 xs:h-64 sm:h-72 md:h-80">
        <Image
          src={service.media || "/images/hero-fallback.jpg"}
          alt={service.title}
          fill
          // Matches how wide this image can actually render — this popup
          // is capped at max-w-4xl (~896px) from sm: up, full viewport
          // width below that.
          sizes="(max-width: 639px) 100vw, 896px"
          priority
          className="object-cover transition-transform duration-500"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <div className="bg-[#00000068] absolute inset-0 z-20 w-full h-full" />
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 rounded-none bg-slate-200" />
        )}
        {categoryLabel && (
          <span className="absolute left-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="pl-[20px] sm:px-8 mt-[19px] sm:pb-8 space-y-6">
        {/* Title & Rating */}
        <div className="">
          <h1 className="text-[16px] sm:text-3xl font-semibold leading-tight text-slate-900">
            {service.title}
          </h1>

          <div className="pt-[5px]">
            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id="starGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#FF6F47" />
                  <stop offset="100%" stopColor="#FFCD0F" />
                </linearGradient>
              </defs>
            </svg>

            <span className="block text-[12px] text-[#666666]">
              {bookingsCount.toLocaleString("en-IN")} bookings
            </span>

            <div className="mt-1 flex items-center">
              <Star
                className="w-4 h-4 mr-[5px]"
                fill="url(#starGradient)"
                stroke="url(#starGradient)"
              />
              <span className="text-[12px] text-[#666666]">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-[8px] font-semibold">
            <span className="text-[14px] text-[#000000]">
              Starts at {startingPrice}
            </span>
          </div>
        </div>
      </div>
      <div className=" mx-[16px] mt-[23px] h-px bg-[#F3EFEB]" />
    </section>
  );
}
