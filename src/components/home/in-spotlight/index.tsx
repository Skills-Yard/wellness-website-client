"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";

import "swiper/css";

interface InspotlightProps {
  campaigns: HomeCampaign[];
  categories: HomeCategory[];
}

const campaignHref = (campaign: HomeCampaign, categories: HomeCategory[]) => {
  const category = categories.find((item) => item.id === campaign.categoryId);
  if (category) {
    const params = new URLSearchParams({ categoryId: category.id });
    if (campaign.subCategoryId)
      params.set("subCategoryId", campaign.subCategoryId);
    if (campaign.targetType === "SERVICE_ITEM" && campaign.serviceItemId) {
      params.set("id", campaign.serviceItemId);
    }
    return `/detail/${category.slug}?${params.toString()}`;
  }

  return campaign.ctaDeeplink?.startsWith("/") ? campaign.ctaDeeplink : null;
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
        loop={spotlightCampaigns.length > 1}
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

          return (
            <SwiperSlide key={campaign.id} className="h-auto">
              <article className="relative flex h-[202px] overflow-hidden rounded-[12px] bg-stone-900 shadow-none sm:h-55">
                {campaign.cdnUrl && campaign.mediaType === "VIDEO" ? (
                  <video
                    src={campaign.cdnUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : campaign.cdnUrl ? (
                  <Image
                    src={campaign.cdnUrl}
                    alt={campaign.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-r from-stone-950/90 via-stone-950/55 to-transparent" />
                <div className="relative z-10 flex w-full flex-col justify-center p-7 text-white sm:p-6">
                  {campaign.subtitle && (
                    <p className="mb-1 line-clamp-2 text-[15px] font-medium leading-snug text-white sm:text-xs">
                      {campaign.subtitle}
                    </p>
                  )}
                  <h3 className="line-clamp-2 font-serif text-[25px] font-medium leading-tight tracking-wide text-amber-300 sm:text-[17px]">
                    {campaign.title}
                  </h3>
                  {href && campaign.ctaText && (
                    <Link
                      href={href}
                      className="mt-3 w-fit rounded-xl bg-[#241914] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#35241c] sm:text-[11px]"
                    >
                      {campaign.ctaText}
                    </Link>
                  )}
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
