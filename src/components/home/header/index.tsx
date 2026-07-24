"use client";

import { getHomeDetails } from "@/src/services/homeApi";
import { getZones } from "@/src/services/zoneApi";
import { BentoCardItem, CategoryServiceItem } from "@/src/utils/types";
// import { HEADER_BENTO_CARDS, HEADER_CATEGORIES } from "@/src/utils/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function BentoCard({ title, subtitle, img, borderRounded }: BentoCardItem) {
  return (
    <div
      className={`relative ${borderRounded} overflow-hidden border border-stone-100 group cursor-pointer h-full w-full shadow-xs hover:shadow-md transition-all duration-300`}
    >
      {img && (
        <Image
          src={img}
          alt={title || "Bento Image"}
          fill
          sizes="(max-w-7xl) 50vw, 33vw"
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-103"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="text-white font-bold text-lg tracking-tight leading-none">
          {title}
        </p>
        <p className="text-white/85 text-xs mt-1.5 font-medium">{subtitle}</p>
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
  path,
}: CategoryServiceItem) {
  return (
    <Link href={path || "#"}>
      <button
        className={`relative flex flex-col items-center gap-3.5 p-4 rounded-2xl ${bg} hover:scale-[1.02] transition-all duration-300 group cursor-pointer w-full shadow-xs`}
      >
        {badge && (
          <span
            className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-extrabold text-white px-2.5 py-0.5 rounded-full ${badgeColor} shadow-sm z-10 leading-none`}
          >
            {badge}
          </span>
        )}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {image && (
            <Image
              src={image}
              alt={label || "Service Image"}
              fill
              className="object-cover"
            />
          )}
        </div>
        <span className="text-[12px] font-bold text-gray-800 text-center leading-tight group-hover:text-amber-500 transition-colors">
          {label}
        </span>
      </button>
    </Link>
  );
}

export default function Header() {
  const [homeDetails, setHomeDetails] = useState<any>(null);
  const [zoneDetail, setZoneDetail] = useState<any>(null);
  const [zoneId, setZoneId] = useState<any>(null);

  const fetchZoneId = async (lat: number, lng: number) => {
    try {
      const response = await getZones({ lat, long: lng });
      setZoneDetail(response);
      setZoneId(response.data.zoneId); // Fixed typo from 'responsea'
      console.log("Zone ID from response:", response.data.zoneId);
      //   setZoneId(response.data.zoneId);
      console.log("Zone detail:", response);
    } catch (error) {
      console.error("Error fetching Zone:", error);
    }
  };

  // Accept optional lat and lng parameters
  const fetchHomeDetails = async () => {
    if (!zoneId) return;

    try {
      const response = await getHomeDetails(zoneId);
      setHomeDetails(response.data); // <-- only store data
    } catch (error) {
      console.error("Error fetching home details:", error);
    }
  };

  useEffect(() => {
    // 1. Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: Pass coordinates to fetchZoneId
          const { latitude, longitude } = position.coords;
          fetchZoneId(latitude, longitude);
        },
        (error) => {
          // Error/Denied: Fallback to fetching without coordinates
          console.warn(
            "Geolocation permission denied or error:",
            error.message,
          );
          fetchZoneId(0, 0); // Pass default or IP-based coordinates if geolocation fails
        },
      );
    } else {
      // Not supported: Fallback to fetching without coordinates
      console.warn("Geolocation is not supported by this browser.");
      fetchZoneId(0, 0); // Pass default or IP-based coordinates if geolocation is not supported
    }
  }, []);
  useEffect(() => {
    // 2. Fetch home details
    fetchHomeDetails();
  }, [zoneId]);

  const campaigns = homeDetails?.promotionalCampaigns ?? [];

  return (
    <header className="w-full bg-gradient-to-b from-white to-stone-50/30 flex items-center py-10 lg:py-16 border-b border-stone-100/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* ── LEFT COLUMN ── */}
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
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-amber-100/60 -z-10 rounded-full"></span>
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl leading-relaxed">
                Experience clinical-grade physiotherapy and bespoke spa
                treatments in the comfort of your home. Certified specialists,
                on-time sessions, and guaranteed rejuvenation.
              </p>
            </div>

            {/* Service Grid Card */}
            <div className="">
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-4">
                Choose a Service Category
              </h3>
              {/* Services 3 column grid */}
              <div className="grid grid-cols-3 gap-3.5">
                {homeDetails?.categories?.map(
                  (category: any, index: number) => (
                    <ServiceCard
                      key={category.id}
                      label={category.name}
                      image={category.homeBannerKey}
                      badge={index === 0 ? "Popular" : undefined}
                      badgeColor="bg-amber-500"
                      bg="bg-stone-50"
                      path={`/category/${category.slug}`}
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="w-full lg:w-[52%] self-stretch flex items-center">
            {/* Clean grid with proper proportions */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column containing stacked cards */}
              <div className="flex flex-col gap-4">
                <div className="h-[240px] w-full">
                  {campaigns[0] && (
                    <BentoCard
                      title={campaigns[0].title}
                      subtitle={campaigns[0].subtitle}
                      img={campaigns[0].bannerKey}
                    />
                  )}
                </div>

                <div className="h-[240px] w-full">
                  {campaigns[2] && (
                    <BentoCard
                      title={campaigns[2].title}
                      subtitle={campaigns[2].subtitle}
                      img={campaigns[2].bannerKey}
                    />
                  )}
                </div>
              </div>

              {/* Right Column containing tall card */}
              <div className="h-[496px] w-full">
                {campaigns[1] && (
                  <BentoCard
                    title={campaigns[1].title}
                    subtitle={campaigns[1].subtitle}
                    img={campaigns[1].bannerKey}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
