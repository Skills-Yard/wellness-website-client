"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import { activeCampaigns, campaignHref } from "@/src/utils/campaign";

// Figma "Frame 392": an espresso (#25180F) rounded-32 panel with an amber
// eyebrow, an Aboreto headline in tan (#CE9B5A), an "Explore Plans" pill,
// media on the right, and dash "switch lines" below. It slides through
// the SPOTLIGHT campaigns — the same data the mobile "In The Spotlight"
// carousel uses — with the title (and the rest of the copy) coming live
// from the current campaign. Falls back to the standing first-order offer
// when there are no spotlight campaigns.
type FirstServiceOfferProps = {
  campaigns: HomeCampaign[];
  categories: HomeCategory[];
};

const AUTO_ADVANCE_MS = 7000;
const FALLBACK_IMAGE = "/images/spotlight1.png";

export default function FirstServiceOffer({
  campaigns,
  categories,
}: FirstServiceOfferProps) {
  const slides = useMemo(
    () => activeCampaigns(campaigns, ["SPOTLIGHT"]),
    [campaigns],
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const isCarousel = slides.length > 1;
  const activeIndex = slides.length > 0 ? current % slides.length : 0;
  const campaign = slides[activeIndex];

  const eyebrow = campaign?.subtitle?.toUpperCase() ?? "NEW HERE?";
  const headline = campaign?.title ?? "Enjoy 15% off, on your first service";
  const ctaLabel = campaign?.ctaText ?? "Explore Plans";
  const ctaHref = campaign ? campaignHref(campaign, categories) : "#our-services";

  // Real pagination for 2+ spotlight campaigns; a decorative 3-dot row
  // (matching the Figma) otherwise.
  const dashCount = isCarousel ? slides.length : 3;

  return (
    <section id="first-service-offer" className="w-full scroll-mt-[80px] bg-white">
      <div className="mx-auto max-w-[1366px] px-4 py-16 sm:px-6 md:py-20 lg:px-[91px]">
        <div className="relative flex min-h-[260px] items-center overflow-hidden rounded-[32px] bg-espresso px-8 py-10 sm:px-12 lg:min-h-[302px] lg:px-[72px]">
          {/* Faint decorative waves (Figma background flourish). */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
            preserveAspectRatio="none"
            viewBox="0 0 1184 302"
          >
            <path
              d="M-40 250C180 150 320 350 560 250S940 90 1240 210"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
            <path
              d="M-40 300C220 220 360 400 620 300S980 160 1240 270"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>

          <div className="relative z-10 max-w-[44%] max-lg:max-w-[60%]">
            <span className="text-[14px] font-medium tracking-wide text-[#FFC558]">
              {eyebrow}
            </span>
            <h2 className="mt-3 max-w-[434px] font-serif text-[24px] uppercase leading-[1.31] text-[#CE9B5A] sm:text-[30px] lg:text-[36px]">
              {headline}
            </h2>
            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-[18px] py-2.5 text-[14px] font-medium text-espresso shadow-[0px_2px_2px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.02]"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Media, right side, contained within the panel (Figma: 396×258
              at the right, not bleeding). Cross-fades between slides. */}
          {slides.length > 0 ? (
            slides.map((slideCampaign, index) => (
              <div
                key={slideCampaign.id}
                className={cn(
                  "pointer-events-none absolute right-[11%] top-1/2 hidden aspect-[396/258] w-[40%] max-w-[396px] -translate-y-1/2 overflow-hidden rounded-[24px] transition-opacity duration-700 lg:block",
                  index === activeIndex ? "opacity-100" : "opacity-0",
                )}
              >
                {slideCampaign.mediaType === "VIDEO" && slideCampaign.cdnUrl ? (
                  <CampaignVideo
                    src={slideCampaign.cdnUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={slideCampaign.cdnUrl ?? FALLBACK_IMAGE}
                    alt=""
                    fill
                    sizes="396px"
                    className="object-cover"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="pointer-events-none absolute right-[11%] top-1/2 hidden aspect-[396/258] w-[40%] max-w-[396px] -translate-y-1/2 overflow-hidden rounded-[24px] lg:block">
              <Image
                src={FALLBACK_IMAGE}
                alt=""
                fill
                sizes="396px"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Switch lines — Figma "Line 7 / 8 / 9". */}
        <div className="mt-10 flex items-center justify-center gap-2.5">
          {Array.from({ length: dashCount }).map((_, index) => {
            const isActive = isCarousel ? index === activeIndex : index === 0;
            return (
              <button
                key={index}
                type="button"
                onClick={isCarousel ? () => setCurrent(index) : undefined}
                disabled={!isCarousel}
                aria-label={`Offer ${index + 1}`}
                className={cn(
                  "h-[6px] rounded-full transition-all duration-300",
                  isActive ? "w-[26px] bg-[#D38516]" : "w-4 bg-[#AFAEAE]",
                  isCarousel ? "cursor-pointer" : "cursor-default",
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
