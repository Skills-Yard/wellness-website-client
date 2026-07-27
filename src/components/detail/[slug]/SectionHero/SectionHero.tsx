"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useState } from "react";

interface SectionHeroProps {
  service: any;
}

export default function SectionHero({ service }: SectionHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!service) return null;

  const rating = parseFloat(service.rating || "4.8");
  const startingPrice = service.price;

  return (
    <section className="mx-auto w-full border-b border-slate-100 bg-white px-0 py-0">
      {/* Hero Image */}
      <div className="relative w-full bg-slate-100 aspect-video">
        <Image
          src={service.media || "/images/hero-fallback.jpg"}
          alt={service.title}
          fill
          sizes="(max-width: 639px) 232px, 390px" // Image fills container; sizes prop optimizes for mobile (100vw) and desktop (max-width of modal)
          priority
          className="object-cover transition-transform duration-500"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <div className="bg-[#00000068] absolute inset-0 z-20 w-full h-full" />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
        )}
        
      </div>

      {/* Info Section */}
      <div className="pl-[20px] sm:px-8 mt-[19px] sm:pb-8 space-y-6">
        {/* Title & Rating */}
        <div className="">
          <h1 className="text-[16px] sm:text-3xl font-semibold leading-tight text-slate-900">
            {service.title}
          </h1>

          <div className="flex pt-[5px] items-center">
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

            <Star
              className="w-4 h-4 mr-[5px]"
              fill="url(#starGradient)"
              stroke="url(#starGradient)"
            />
            <span className=" text-[12px] text-[#666666]">
              {rating} (12K+ bookings)
            </span>
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
