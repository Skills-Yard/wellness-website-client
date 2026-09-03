"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, HeartHandshake } from "lucide-react";
import type { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import { campaignHref } from "@/src/utils/campaign";

// Figma "Frame 385" band (#FEF3E9): faint flowing-line texture, a copy
// column with a 3-point checklist + CTA, and an arched media frame with a
// rotating "Premium Beauty" seal. Rendered once per category — heading /
// body / media / CTA come from that category's HIGHLIGHT campaign
// (falling back to the category's section copy, then the standing copy).
// The trust points are brand copy (no data source). `reverse` flips the
// column order so consecutive blocks alternate.
type ExpertCareProps = {
  category: HomeCategory;
  categories: HomeCategory[];
  campaign?: HomeCampaign;
  reverse?: boolean;
  sectionId?: string;
};

const POINTS = [
  { icon: BadgeCheck, label: "Certified and trusted professionals" },
  { icon: ShieldCheck, label: "Hygienic and Safe Practices" },
  { icon: HeartHandshake, label: "Personalized Care for You" },
];

export default function ExpertCare({
  category,
  categories,
  campaign,
  reverse = false,
  sectionId,
}: ExpertCareProps) {
  const name = category.title ?? category.name;

  const heading =
    campaign?.title ??
    category.sectionHeading ??
    "Professional care, delivered with compassion";
  const body =
    campaign?.subtitle ??
    category.sectionSubheading ??
    category.subtitle ??
    "From relaxation to recovery, we bring expert care right to your doorstep, because your well-being is our priority.";
  const ctaLabel = campaign?.ctaText ?? `Explore ${name}`;
  const ctaHref = campaign
    ? campaignHref(campaign, categories)
    : `/detail/${category.slug}?categoryId=${encodeURIComponent(category.id)}`;

  const media =
    campaign?.cdnUrl ?? category.homeBannerKey ?? "/images/self-care.jpg";
  const mediaType = campaign?.cdnUrl
    ? campaign.mediaType
    : category.homeBannerKey
      ? category.homeBannerType
      : "IMAGE";
  const isVideo = mediaType === "VIDEO";

  return (
    <section
      id={sectionId}
      className="relative w-full scroll-mt-[80px] overflow-hidden bg-[#FEF3E9]"
    >
      {/* Faint flowing-line texture (Figma images 2–4). */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-[#D38516]/[0.14]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1366 520"
        fill="none"
      >
        {[0, 14, 28, 42, 56].map((offset) => (
          <path
            key={`t${offset}`}
            d={`M-80 ${60 + offset} C 200 ${offset} 380 ${180 + offset} 620 ${90 + offset} S 980 ${-20 + offset} 1280 ${80 + offset}`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
        {[0, 14, 28, 42, 56].map((offset) => (
          <path
            key={`b${offset}`}
            d={`M-80 ${370 + offset} C 220 ${300 + offset} 400 ${480 + offset} 660 ${390 + offset} S 1020 ${300 + offset} 1300 ${430 + offset}`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* COPY */}
        <div className={`flex flex-col ${reverse ? "lg:order-2" : ""}`}>
          <span className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#D38516]">
            Expert Care, Your Way
          </span>
          <h2 className="mt-3 max-w-[560px] font-serif text-[26px] uppercase leading-[1.31] text-brown sm:text-[34px]">
            {heading}
          </h2>
          <p className="mt-4 max-w-[557px] text-[14px] leading-[1.66] text-[#666]">
            {body}
          </p>

          <ul className="mt-7 flex max-w-[300px] flex-col gap-3">
            {POINTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 border-b border-black/[0.04] pb-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <Icon className="h-4 w-4 text-[#904720]" />
                </span>
                <span className="text-[14px] font-medium text-[#904720]">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={ctaHref}
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-espresso px-[18px] py-2.5 text-[14px] font-medium text-white shadow-[0px_2px_2px_rgba(0,0,0,0.25)] transition-colors hover:bg-espresso-hover"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ARCHED MEDIA + rotating seal */}
        <div
          className={`relative mx-auto w-full max-w-[400px] ${reverse ? "lg:order-1" : ""}`}
        >
          <div className="relative aspect-[446/500] w-full overflow-hidden rounded-t-[999px] rounded-b-[32px] bg-sand/30">
            {isVideo ? (
              <CampaignVideo
                src={media}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={media}
                alt={`${name} care at home`}
                fill
                sizes="(max-width: 1024px) 90vw, 400px"
                className="object-cover"
              />
            )}
          </div>

          {/* Rotating "Premium Beauty" seal — dark text on the cream band
              (no filled circle), with a small diamond at the centre. */}
          <div className="absolute -bottom-6 -right-2 h-[128px] w-[128px] sm:right-2">
            <span className="absolute inset-0 animate-[spin_20s_linear_infinite] motion-reduce:animate-none">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <path
                    id={`expertCareSeal-${category.id}`}
                    d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                  />
                </defs>
                <text className="fill-[#31190A] text-[9px] font-medium uppercase tracking-[0.26em]">
                  <textPath href={`#expertCareSeal-${category.id}`}>
                    Premium Beauty · Premium Beauty ·
                  </textPath>
                </text>
              </svg>
            </span>
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#31190A]" />
          </div>
        </div>
      </div>
    </section>
  );
}
