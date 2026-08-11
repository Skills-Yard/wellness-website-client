"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import { HomeCampaign } from "@/src/types/serviceTypes";

interface MobileCampaignCarouselProps {
  campaigns: HomeCampaign[];
}

/**
 * CAROUSEL-type campaigns scoped to one category, shown only on the mobile
 * category page (/detail/[slug]) — desktop has no equivalent for now. Same
 * slide treatment (image/video + gradient + CTA) as the Home "In The
 * Spotlight" carousel, for a consistent look across both.
 */
export default function MobileCampaignCarousel({ campaigns }: MobileCampaignCarouselProps) {
  if (campaigns.length === 0) return null;

  return (
    <section className="block w-full lg:hidden px-4 py-5">
      <Swiper
        loop={campaigns.length > 1}
        slidesPerView={1.08}
        spaceBetween={12}
        className="w-full"
      >
        {campaigns.map((campaign) => (
          <SwiperSlide key={campaign.id} className="h-auto">
            <article className="relative flex h-45 overflow-hidden rounded-xl bg-stone-900">
              {campaign.cdnUrl && campaign.mediaType === "VIDEO" ? (
                <CampaignVideo
                  src={campaign.cdnUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : campaign.cdnUrl ? (
                <Image
                  src={campaign.cdnUrl}
                  alt={campaign.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/45 to-transparent" />
              <div className="relative z-10 flex w-full flex-col justify-end p-4 text-white">
                {campaign.subtitle && (
                  <p className="mb-1 line-clamp-2 text-xs font-medium leading-snug">
                    {campaign.subtitle}
                  </p>
                )}
                <h3 className="line-clamp-2 font-serif text-lg font-medium leading-tight tracking-wide text-amber-300">
                  {campaign.title}
                </h3>
                {campaign.ctaText && campaign.ctaDeeplink?.startsWith("/") && (
                  <Link
                    href={campaign.ctaDeeplink}
                    className="mt-2 w-fit rounded-lg bg-[#241914] px-3 py-1.5 text-[11px] font-medium text-white"
                  >
                    {campaign.ctaText}
                  </Link>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
