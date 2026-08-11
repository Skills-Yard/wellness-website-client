"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";

import "swiper/css";

interface InspotlightProps {
  campaigns: HomeCampaign[];
  categories: HomeCategory[];
}

// Always returns a usable href — a global campaign (no categoryId) with no
// ctaDeeplink set previously made this return null, which hid the CTA button
// entirely even though ctaText was present. Falls back to "/" instead so the
// button never silently disappears.
const campaignHref = (campaign: HomeCampaign, categories: HomeCategory[]) => {
  const category = categories.find((item) => item.id === campaign.categoryId);
  if (category) {
    const params = new URLSearchParams({ categoryId: category.id });
    if (campaign.subCategoryId)
      params.set("subCategoryId", campaign.subCategoryId);
    if (campaign.serviceItemId) {
      params.set("id", campaign.serviceItemId);
    }
    return `/detail/${category.slug}?${params.toString()}`;
  }

  return campaign.ctaDeeplink?.startsWith("/") ? campaign.ctaDeeplink : "/";
};

// Static per-category color treatment, matching the Figma spec's 3 example
// cards. Card content (image/video, title, subtitle, CTA) stays fully
// dynamic — only this styling is fixed. "spa" also serves as the fallback
// for global (no-category) campaigns and any future category.
type SpotlightVariant = {
  gradient: string;
  mirrored: boolean;
  eyebrowColor: string;
  titleColor: string;
  buttonBg: string;
};

const SPOTLIGHT_VARIANTS: Record<"physio" | "massage" | "spa", SpotlightVariant> = {
  physio: {
    gradient:
      "linear-gradient(84.48deg, #8AA7DF -0.65%, rgba(139, 158, 197, 0.54) 50.88%, rgba(140, 141, 142, 0) 75.67%)",
    mirrored: false,
    eyebrowColor: "rgba(0, 0, 0, 0.74)",
    titleColor: "#204390",
    buttonBg: "#000000",
  },
  massage: {
    gradient:
      "linear-gradient(81.09deg, rgba(165, 116, 55, 0) 41.02%, rgba(250, 164, 143, 0.48) 70.43%, rgba(250, 164, 143, 0.305652) 86.76%, #FFC558 108.97%)",
    mirrored: true,
    eyebrowColor: "#FFFFFF",
    titleColor: "#FFC558",
    buttonBg: "#25180F",
  },
  spa: {
    gradient:
      "linear-gradient(78.26deg, rgba(165, 116, 55, 0) 0.09%, rgba(147, 104, 49, 0.109289) 15.93%, rgba(144, 102, 48, 0.129159) 18.81%, rgba(132, 93, 44, 0.202018) 29.37%, rgba(120, 85, 40, 0.278189) 40.4%, rgba(115, 81, 38, 0.305652) 44.38%, rgba(100, 71, 33, 0.401144) 50.48%, rgba(76, 54, 25, 0.549933) 59.98%, rgba(74, 52, 24, 0.565801) 59.99%, rgba(65, 46, 21, 0.617293) 63.82%, rgba(60, 42, 19, 0.650889) 66.32%, rgba(52, 37, 17, 0.699956) 69.96%, rgba(38, 27, 12, 0.783968) 79.94%, rgba(22, 15, 7, 0.885983) 89.92%, #040201 99.91%)",
    mirrored: true,
    eyebrowColor: "#FFFFFF",
    titleColor: "#FFC558",
    buttonBg: "#25180F",
  },
};

const getSpotlightVariant = (
  campaign: HomeCampaign,
  categories: HomeCategory[],
): SpotlightVariant => {
  const category = categories.find((item) => item.id === campaign.categoryId);
  const key = `${category?.name ?? ""} ${category?.slug ?? ""}`.toLowerCase();
  if (key.includes("physio")) return SPOTLIGHT_VARIANTS.physio;
  if (key.includes("massage")) return SPOTLIGHT_VARIANTS.massage;
  return SPOTLIGHT_VARIANTS.spa;
};

export default function Inspotlight({
  campaigns,
  categories,
}: InspotlightProps) {
  const spotlightCampaigns = useMemo(
    () =>
      [...campaigns]
        .filter(
          (campaign) =>
            campaign.type === "SPOTLIGHT" && campaign.isActive !== false,
        )
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [campaigns],
  );

  if (spotlightCampaigns.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto select-none overflow-hidden bg-white py-7 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-8 lg:py-20">
      <div className="relative mb-5 flex justify-between gap-4 px-5 sm:mb-8 sm:flex-row sm:items-end sm:gap-6 sm:px-0 md:mb-10">
        <div className="flex-1 pr-16 sm:pr-0">
          <h2 className="text-[25px] font-bold leading-tight tracking-tight text-black sm:text-2xl md:text-3xl lg:text-xl">
            In The Spotlight
          </h2>
          <p className="mt-2 text-xs font-medium leading-relaxed text-gray-600 max-sm:hidden sm:mt-2.5 sm:text-sm md:text-base">
            Handpicked premium experiences and consultations curated just for
            you
          </p>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        // Swiper's loop mode clones slide DOM nodes outside React's control,
        // which breaks CampaignVideo's ref-based setup (the clone the user
        // ends up looking at never gets a src/HLS attach — see CampaignVideo).
        loop={false}
        breakpoints={{
          // CenteredSlides natively handles the left/right peek seen in the image
          0: { slidesPerView: 1.08, spaceBetween: 14, centeredSlides: false },
          480: { slidesPerView: 1.12, spaceBetween: 16, centeredSlides: false },
          640: { slidesPerView: 1.5, spaceBetween: 14, centeredSlides: false },
          768: { slidesPerView: 2, spaceBetween: 16, centeredSlides: false },
          1024: { slidesPerView: 2.5, spaceBetween: 16, centeredSlides: false },
          1280: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
        }}
        className="w-full px-5 sm:px-0"
      >
        {spotlightCampaigns.map((campaign) => {
          const href = campaignHref(campaign, categories);
          const variant = getSpotlightVariant(campaign, categories);

          return (
            <SwiperSlide key={campaign.id} className="h-auto">
              <article className="relative flex h-[145px] overflow-hidden rounded-[8px] bg-stone-900 shadow-none sm:h-55">
                {campaign.cdnUrl && campaign.mediaType === "VIDEO" ? (
                  <CampaignVideo
                    src={campaign.cdnUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : campaign.cdnUrl ? (
                  <Image
                    src={campaign.cdnUrl}
                    alt={campaign.title ?? "Promotional campaign"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
                {/* Gradient tint overlay, matching the Figma variant for this campaign's category */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: variant.gradient,
                    transform: variant.mirrored ? "scaleX(-1)" : undefined,
                  }}
                />
                <div className="relative z-10 flex h-full w-full flex-col p-6">
                  {campaign.subtitle && (
                    <p
                      className="truncate text-xs font-medium leading-[15px]"
                      style={{ color: variant.eyebrowColor }}
                    >
                      {campaign.subtitle}
                    </p>
                  )}
                  <h3
                    className="mt-4 truncate font-serif text-xl font-normal leading-[22px]"
                    style={{ color: variant.titleColor }}
                  >
                    {campaign.title}
                  </h3>
                  <Link
                    href={href}
                    className="mt-auto flex h-[31px] w-[108px] items-center justify-center gap-1 truncate rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: variant.buttonBg }}
                  >
                    <span className="truncate">{campaign.ctaText ?? "Explore Plans"}</span>
                    <span className="shrink-0 text-base leading-none">›</span>
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
