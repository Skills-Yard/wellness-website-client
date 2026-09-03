"use client";

import { Star, Users, ThumbsUp, MessageSquareQuote } from "lucide-react";
import type { HomeServiceItem } from "@/src/types/serviceTypes";

// Figma "Why choose us" band (#FFF7EE): three stat blocks. Every value is
// computed live from the catalog — ratings, bookings and reviews across
// all services — never hard-coded. Fields can come back as numbers or
// numeric strings, so coerce defensively.
type WhyChooseUsProps = {
  services: HomeServiceItem[];
};

const toNum = (value: unknown): number | null => {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseFloat(value)
        : NaN;
  return Number.isFinite(n) ? n : null;
};

const compact = (n: number) => {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k+`;
  return `${n}`;
};

export default function WhyChooseUs({ services }: WhyChooseUsProps) {
  if (services.length === 0) return null;

  const ratings = services
    .map((service) => toNum(service.averageRating) ?? toNum(service.rating))
    .filter((rating): rating is number => rating !== null && rating > 0);

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  const satisfaction =
    ratings.length > 0
      ? Math.round(
          (ratings.filter((rating) => rating >= 4).length / ratings.length) *
            1000,
        ) / 10
      : 0;

  const totalBookings = services.reduce(
    (sum, service) => sum + (toNum(service.totalBookingsCount) ?? 0),
    0,
  );

  const totalReviews = services.reduce(
    (sum, service) =>
      sum + (toNum(service.totalReviews) ?? toNum(service.reviews) ?? 0),
    0,
  );

  // Prefer the three the design calls for; fall back to other live
  // figures so the band always reflects real data. Show up to three.
  const stats = [
    ratings.length > 0 && {
      icon: Star,
      value: `${avgRating.toFixed(1)}/5`,
      label: "Average Rating",
    },
    totalBookings > 0 && {
      icon: Users,
      value: compact(totalBookings),
      label: "Bookings Delivered",
    },
    ratings.length > 0 && {
      icon: ThumbsUp,
      value: `${satisfaction % 1 === 0 ? satisfaction : satisfaction.toFixed(1)}%`,
      label: "Rated 4★ & Above",
    },
    totalReviews > 0 && {
      icon: MessageSquareQuote,
      value: compact(totalReviews),
      label: "Client Reviews",
    },
    {
      icon: Star,
      value: `${services.length}`,
      label: "Services Available",
    },
  ]
    .filter(
      (
        stat,
      ): stat is { icon: typeof Star; value: string; label: string } =>
        Boolean(stat),
    )
    .slice(0, 3);

  if (stats.length === 0) return null;

  return (
    <section id="why-choose-us" className="w-full scroll-mt-[80px] bg-[#FFF7EE]">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 px-4 py-14 sm:flex-row sm:gap-14 sm:py-16 lg:gap-20">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-sand">
              <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
            </span>
            <span className="flex flex-col gap-2">
              <span className="font-serif text-[32px] leading-none text-espresso">
                {value}
              </span>
              <span className="text-[14px] font-medium text-espresso">
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
