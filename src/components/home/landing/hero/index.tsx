"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type {
  HomeCampaign,
  HomeCategory,
  HomeServiceItem,
} from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import { activeCampaigns, campaignHref } from "@/src/utils/campaign";

// Figma "Banner": a 1366×791 full-bleed hero split left/right —
//   z-0  : campaign media (image/video), full-bleed, auto-advancing
//   z-[1]: a left→right overlay, solid #FCF5EF on the left (the text
//          side) fading to fully transparent past the middle (the media
//          side)
//   z-10 : the copy (pill, headline, subcopy, CTAs, dashes)
// Copy / CTA / media come from the current campaign; the static text is
// only a fallback when there are no campaigns.
type HeroProps = {
  campaigns: HomeCampaign[];
  categories: HomeCategory[];
  services: HomeServiceItem[];
};

const AUTO_ADVANCE_MS = 7000;

const compact = (n: number) => {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M+`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}k+`;
  return `${n}`;
};

export default function Hero({ campaigns, categories, services }: HeroProps) {
  const slides = useMemo(
    () => activeCampaigns(campaigns, ["CAROUSEL_BANNER", "CAROUSEL_VIDEO"]),
    [campaigns],
  );

  const [current, setCurrent] = useState(0);

  // Auto-advance — mirrors mobile/HeroSlider (only runs with 2+ slides).
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Clamp on read so a stale index (e.g. after the campaign set changes
  // with a new zone) auto-corrects without a reset effect.
  const activeIndex = slides.length > 0 ? current % slides.length : 0;
  const activeCampaign = slides[activeIndex];

  const totalBookings = services.reduce(
    (sum, service) => sum + (service.totalBookingsCount ?? 0),
    0,
  );

  const headline =
    activeCampaign?.title ?? "Because you deserve more than ordinary";
  const subcopy =
    activeCampaign?.subtitle ??
    "Indulge in salon-quality and wellness services from certified professionals, all from the comfort of your home.";
  const primaryHref = activeCampaign
    ? campaignHref(activeCampaign, categories)
    : "#our-services";
  const primaryLabel = activeCampaign?.ctaText ?? "Explore Services";

  return (
    <section className="relative w-full overflow-hidden bg-[#FCF5EF]">
      {/* Layer z-0 — sliding campaign media (image / video). */}
      {slides.length > 0 ? (
        slides.map((campaign, index) => (
          <div
            key={campaign.id}
            className={cn(
              "absolute inset-0 z-0 transition-opacity duration-700 ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          >
            {campaign.mediaType === "VIDEO" && campaign.cdnUrl ? (
              <CampaignVideo
                src={campaign.cdnUrl}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : campaign.cdnUrl ? (
              <Image
                src={campaign.cdnUrl}
                alt={campaign.title}
                fill
                priority={index === 0}
                quality={90}
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : null}
          </div>
        ))
      ) : (
        // TODO(figma-asset): fallback hero image when no campaigns exist
        <Image
          src="/images/detail/spa_home_banner.png"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="z-0 object-cover object-right"
        />
      )}

      {/* Layer z-[1] — cream overlay. Solid #FCF5EF fills the whole left
          column, top to bottom (corners stay inside the solid stop). Its
          right edge bows out in the middle and eases back in toward the
          top and bottom, dissolving into the media with three soft stops
          so no fade edge is visible. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_97%_200%_at_1%_50%,#FCF5EF_42%,rgba(252,245,243,0.5)_50%,rgba(252,245,239,0)_70%)]" />

      {/* Layer z-10 — copy. Content block (Figma "Group 88", 760×335 at
          left 87 / top 228), sitting slightly above the vertical center. */}
      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1366px] flex-col justify-center px-6 py-16 sm:px-12 lg:min-h-[791px] lg:px-[90px]">
        <div className="max-w-[760px] -translate-y-6 lg:-translate-y-12">
          <span className="inline-flex items-center gap-1.5 rounded-[54px] border-[0.75px] border-[rgba(102,102,102,0.13)] bg-[#FFF0DA]/[0.33] px-3 py-2 text-[12px] font-medium text-[#6B4B22]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6B4B22]" />
            {totalBookings > 0
              ? `${compact(totalBookings)} bookings delivered`
              : "Loved by 70,000+ homes"}
          </span>

          <h1 className="mt-4 font-serif text-[40px] leading-[1.15] text-[#904720] sm:text-[52px] lg:text-[64px]">
            {headline}
          </h1>

          <p className="mt-6 max-w-[569px] text-[16px] leading-[1.25] text-[#25180F]">
            {subcopy}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-[72px] bg-[#25180F] px-[18px] py-2.5 text-[14px] font-medium text-white shadow-[0px_2px_2px_rgba(0,0,0,0.25)] transition-colors hover:bg-espresso-hover"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {/* TODO: point at the real app-store listing */}
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-[72px] border border-[rgba(59,58,150,0.06)] bg-[#FFF0DA] px-[18px] py-2.5 text-[14px] font-medium text-[#25180F] transition-colors hover:bg-[#ffe9c8]"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4 fill-[#25180F]"
                aria-hidden="true"
              >
                <path d="M1.6 1.2 9.9 8l-8.3 6.8c-.4-.2-.6-.6-.6-1V2.2c0-.4.2-.8.6-1Zm9.5 5.3L3.9.9l7.9 4.8-.7.8Zm1.8 1.5 2.2-1.3c.6-.4.6-1.2 0-1.6l-2.2-1.3L11.6 8l1.3 1.5Zm-1.8 1.5.7.8L3.9 15.1l7.9-4.8Z" />
              </svg>
              Download App
            </a>
          </div>

          {/* Switch lines — active dash wider and amber, the rest short grey. */}
          {slides.length > 1 && (
            <div className="mt-10 flex items-center gap-2">
              {slides.map((campaign, index) => (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    index === activeIndex
                      ? "w-7 bg-[#D38516]"
                      : "w-4 bg-[#AFAEAE]",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
