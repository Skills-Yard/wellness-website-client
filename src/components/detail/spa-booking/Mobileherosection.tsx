"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import { CampaignMediaType, HomeCampaign } from "@/src/types/serviceTypes";

interface MobileHeroSectionProps {
  /** CAROUSEL_VIDEO/CAROUSEL_BANNER campaigns for this category, sorted by displayOrder. */
  campaigns?: HomeCampaign[];
  /** Used only when `campaigns` is empty — the single HIGHLIGHT_VIDEO/HIGHLIGHT_BANNER
   *  campaign, or the static placeholder as a last resort. */
  fallbackMediaSrc?: string;
  fallbackMediaType?: CampaignMediaType;
  title?: string;
  subtitle?: string;
}

type Slide = { id: string; src: string; type: CampaignMediaType };

export default function MobileHeroSection({
  campaigns = [],
  fallbackMediaSrc,
  fallbackMediaType = "IMAGE",
  title,
  subtitle,
}: MobileHeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselSlides: Slide[] = campaigns
    .filter((campaign): campaign is HomeCampaign & { cdnUrl: string } => !!campaign.cdnUrl)
    .map((campaign) => ({ id: campaign.id, src: campaign.cdnUrl, type: campaign.mediaType }));

  const slides: Slide[] =
    carouselSlides.length > 0
      ? carouselSlides
      : fallbackMediaSrc
        ? [{ id: "fallback", src: fallbackMediaSrc, type: fallbackMediaType }]
        : [];

  return (
    <div className="relative block w-full lg:hidden h-60 xs:h-[280px] sm:h-74.25 overflow-hidden bg-linear-to-br from-[#FFC09E] via-[#FFD1BF]/33 to-transparent">
      {slides.length > 0 && (
        <Swiper
          className="absolute inset-0 h-full w-full"
          // Swiper's loop mode clones slide DOM nodes outside React's control,
          // which breaks CampaignVideo's ref-based setup (see CampaignVideo).
          loop={false}
          onSlideChange={(swiper: SwiperInstance) => setActiveIndex(swiper.realIndex)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              {slide.type === "VIDEO" ? (
                <CampaignVideo
                  src={slide.src}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={title || "Hero"}
                  fill
                  priority
                  className="object-cover"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="absolute flex justify-between bottom-0 p-3 xs:p-4 inset-x-0 pt-16 xs:pt-20 z-10 pointer-events-none">
        <div className="pr-2">
          <h1 className="text-base xs:text-lg sm:text-xl font-bold text-[#25180F] mb-1.5 xs:mb-2 tracking-tight leading-tight">
            {title || "Stress Relief Starts Here"}
          </h1>
          <p className="text-xs xs:text-sm text-[#ffffff] font-semibold leading-tight">
            {subtitle || "Body therapies designed for you"}
          </p>
        </div>
        {slides.length > 1 && (
          <div className="flex gap-1 xs:gap-1.5 items-end justify-end shrink-0">
            {slides.map((slide, index) => (
              <span
                key={slide.id}
                className={`h-1 xs:h-1.5 rounded-full transition-all ${
                  index === activeIndex ? "w-4 xs:w-5 bg-white" : "w-1 xs:w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
