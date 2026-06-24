"use client";

import Image from "next/image";
import { Star, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SectionHeroProps {
  service: any;
}

export default function SectionHero({ service }: SectionHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!service) return null;

  const rating = parseFloat(service.rating || "4.8");
  const reviewsText = service.reviews || "1K reviews";
  const startingPrice = service.price;
  const duration = service.duration || "60 mins";

  return (
    <section className="mx-auto w-full border-b border-slate-100 bg-white px-0 py-0">

      {/* Hero Image */}
      <div className="relative w-full overflow-hidden bg-slate-100 aspect-video">
        <Image
          src={service.media || "/images/hero-fallback.jpg"}
          alt={service.title}
          fill
          priority
          className="object-cover transition-transform duration-500"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <div className="bg-[#00000068] absolute inset-0 z-20 w-full h-full" />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
        )}

        {/* Overlay Badge */}
        {service.tag && (
          <div className="absolute top-4 z-40  left-4 sm:top-6 sm:left-6">
            <span className="inline-flex items-center rounded-full bg-green-500/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              {service.tag}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-4 z-40 right-4 sm:bottom-6 sm:right-6">
          <div className="flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-slate-900">{rating}</span>
            </div>
            <span className="text-xs text-slate-500">({reviewsText})</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 sm:px-8 mt-5 pb-6 sm:pb-8 space-y-6">
        {/* Title & Rating */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-slate-900">
            {service.title}
          </h1>

          {/* Quick Stats Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-sm font-semibold text-slate-900">{duration}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-500">Starting at</span>
              <span className="text-xl font-bold text-amber-600">
                {startingPrice}
              </span>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Trending */}
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                Popular Choice
              </span>
            </div>
          </div>
        </div>

        {/* Description/Call-to-action info */}
        {service.description && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-50/50 border border-slate-100">
            <p className="text-sm leading-relaxed text-slate-700">
              {service.description}
            </p>
          </div>
        )}

        {/* Features Preview (first 2) */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              What's included
            </p>
            <ul className="space-y-2">
              {service.features.slice(0, 2).map((feature: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-slate-600"
                >
                  <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 font-bold text-xs mt-0.5">
                    ✓
                  </span>
                  <span className="pt-0.5">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}