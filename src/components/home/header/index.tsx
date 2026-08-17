"use client";

import { useState } from "react";
import { CampaignMediaType, HomeCategory, HomeDetails } from "@/src/types/serviceTypes";
import Image from "next/image";
import CampaignVideo from "@/src/components/media/CampaignVideo";
import CategorySelectModal from "@/src/components/home/category-select/CategorySelectModal";

interface HeaderProps {
  homeDetails: HomeDetails | null;
  zoneId: string;
}

type BentoCardProps = {
  title: string;
  subtitle?: string;
  img?: string;
  mediaType?: CampaignMediaType;
  borderRounded?: string;
};

type ServiceCardProps = {
  label: string;
  image?: string;
  badge?: string;
  badgeColor: string;
  bg: string;
  onClick: () => void;
};

function BentoCard({ title, subtitle, img, mediaType, borderRounded }: BentoCardProps) {
  return (
    <div
      className={`relative ${
        borderRounded ?? ""
      } overflow-hidden border border-stone-100 group cursor-pointer h-full w-full shadow-xs hover:shadow-md transition-all duration-300`}
    >
      {img && mediaType === "VIDEO" ? (
        <CampaignVideo
          src={img}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : img ? (
        <Image
          src={img}
          alt={title || "Bento Image"}
          fill
          sizes="(max-width: 1280px) 50vw, 33vw"
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-103"
        />
      ) : null}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="text-white font-bold text-lg tracking-tight leading-none">
          {title}
        </p>

        {subtitle && (
          <p className="text-white/85 text-xs mt-1.5 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function ServiceCard({
  label,
  image,
  badge,
  badgeColor,
  bg,
  onClick,
}: ServiceCardProps) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      <div
        className={`relative flex flex-col items-center gap-3.5 p-4 rounded-2xl ${bg} hover:scale-[1.02] transition-all duration-300 group cursor-pointer w-full shadow-xs`}
      >
        {/* Badge */}
        {badge && (
          <span
            className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-extrabold text-white px-2.5 py-0.5 rounded-full ${badgeColor} shadow-sm z-10 leading-none`}
          >
            {badge}
          </span>
        )}

        {/* Image */}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {image && (
            <Image
              src={image}
              alt={label || "Service Image"}
              fill
              sizes="56px"
              className="object-cover"
            />
          )}
        </div>

        {/* Label */}
        <span className="text-[12px] font-bold text-gray-800 text-center leading-tight group-hover:text-amber-500 transition-colors">
          {label}
        </span>
      </div>
    </button>
  );
}

export default function Header({ homeDetails, zoneId }: HeaderProps) {
  /*
   * All data now comes from page.tsx.
   *
   * Header does NOT:
   * - fetch location
   * - call getZones()
   * - call getHomeDetails()
   * - resolve zoneId
   *
   * It only displays the data received through props (zoneId included,
   * needed to look up suites for the category-select flow below).
   */

  const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(null);
  const categories = homeDetails?.categories ?? [];

  const campaigns = [...(homeDetails?.promotionalCampaigns ?? [])]
    .filter(
      (campaign) =>
        (campaign.type === "CAROUSEL_VIDEO" || campaign.type === "CAROUSEL_BANNER") &&
        campaign.isActive !== false,
    )
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <header className="w-full bg-gradient-to-b from-white to-stone-50/30 flex items-center py-10 lg:py-16 border-b border-stone-100/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* ───────────────────────────── */}
          {/* LEFT COLUMN */}
          {/* ───────────────────────────── */}

          <div className="w-full lg:w-[48%] flex flex-col gap-8">
            {/* Headline */}

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 leading-none">
                🌟 Premium Home Wellness
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Luxury wellness and therapy at your{" "}
                <span className="text-amber-500 relative inline-block">
                  doorstep
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-amber-100/60 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl leading-relaxed">
                Experience clinical-grade physiotherapy and bespoke spa
                treatments in the comfort of your home. Certified specialists,
                on-time sessions, and guaranteed rejuvenation.
              </p>
            </div>

            {/* ───────────────────────────── */}
            {/* SERVICE CATEGORIES */}
            {/* ───────────────────────────── */}

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-4">
                Choose a Service Category
              </h3>

              {categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {categories.map((category, index) => (
                    <ServiceCard
                      key={category.id}
                      label={category.name}
                      image={category.iconKey ?? ""}
                      badge={index === 0 ? "Popular" : undefined}
                      badgeColor="bg-amber-500"
                      bg="bg-stone-50"
                      onClick={() => setSelectedCategory(category)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-stone-50 rounded-lg shadow-sm">
                  <p className="text-gray-600 font-medium">
                    No service categories available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ───────────────────────────── */}
          {/* RIGHT COLUMN */}
          {/* ───────────────────────────── */}

          <div className="w-full lg:w-[52%] self-stretch flex items-center">
            {campaigns.length > 0 ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* LEFT BENTO COLUMN */}

                <div className="flex flex-col gap-4">
                  {/* Campaign 1 */}

                  <div className="h-[240px] w-full">
                    {campaigns[0] && (
                      <BentoCard
                        title={campaigns[0].title}
                        subtitle={campaigns[0].subtitle ?? ""}
                        img={campaigns[0].cdnUrl ?? ""}
                        mediaType={campaigns[0].mediaType}
                      />
                    )}
                  </div>

                  {/* Campaign 3 */}

                  <div className="h-[240px] w-full">
                    {campaigns[2] && (
                      <BentoCard
                        title={campaigns[2].title}
                        subtitle={campaigns[2].subtitle ?? ""}
                        img={campaigns[2].cdnUrl ?? ""}
                        mediaType={campaigns[2].mediaType}
                      />
                    )}
                  </div>
                </div>

                {/* RIGHT BENTO COLUMN */}

                <div className="h-[496px] w-full">
                  {campaigns[1] && (
                    <BentoCard
                      title={campaigns[1].title}
                      subtitle={campaigns[1].subtitle ?? ""}
                      img={campaigns[1].cdnUrl ?? ""}
                      mediaType={campaigns[1].mediaType}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-[496px] flex items-center justify-center bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-gray-500 text-sm font-medium">
                  No promotional campaigns available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCategory && (
        <CategorySelectModal
          category={selectedCategory}
          zoneId={zoneId}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </header>
  );
}
