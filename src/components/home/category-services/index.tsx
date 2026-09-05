"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { HomeCategory, HomeServiceItem } from "@/src/types/serviceTypes";
import { HomeFaq, ServiceItem } from "@/src/types/serviceItemTypes";
import { DynamicService } from "@/src/utils/types/spabooking";
import SubDetailPopUp from "@/src/components/detail/[slug]/LazySubDetailPopUp";

type CategoryServicesProps = {
  category: HomeCategory;
  // Already resolved from the single `/catalog/home` response (grouped by
  // useServicesByCategory) — this row no longer fetches anything itself.
  services: HomeServiceItem[];
  onFaqsChange?: (
    category: HomeCategory,
    faqs: HomeFaq[],
  ) => void;
};

const formatPrice = (price: ServiceItem["price"] | null) => {
  if (typeof price === "number") return `₹${price.toLocaleString("en-IN")}`;
  return price ?? "₹0";
};

// A cut/strike-through price only makes sense when it's a genuine positive
// value — 0, null, undefined, or a non-numeric string all mean "no discount
// set", not "the discount is free", so the strike-through shouldn't render.
const hasCutPrice = (originalPrice: ServiceItem["originalPrice"]) =>
  Number(originalPrice) > 0;

const formatRating = (rating: ServiceItem["averageRating"] | ServiceItem["rating"]) => {
  if (typeof rating === "number") return rating.toFixed(1);
  return rating ?? "0";
};

// Real bookings count (distinct from totalReviews, the rating count) —
// always shown, defaulting to 0 whether it's genuinely 0 or just missing.
// Compact past 1000 ("12k+ bookings") to match the card's reference design;
// below that the raw count reads fine on its own ("5 bookings").
const formatBookingsLabel = (bookings: ServiceItem["totalBookingsCount"]) => {
  const count = bookings ?? 0;
  return count >= 1000
    ? `${Math.floor(count / 1000)}k+ bookings`
    : `${count} bookings`;
};

const getLowestDurationPrice = (service: ServiceItem) => {
  const prices = (service.durations ?? [])
    .map((duration) => duration.price)
    .filter((price): price is string | number => price !== null && price !== undefined && price !== "")
    .map(Number)
    .filter((price) => Number.isFinite(price));

  return prices.length > 0 ? Math.min(...prices) : service.price;
};

// The catalog API already embeds each service item's own durations/packages/
// addOns (see getServiceItems) — no extra fetch needed to open the detail
// popup right here, just reshape the one ServiceItem SubDetailPopUp expects.
const toDynamicService = (service: ServiceItem, categoryName: string): DynamicService => ({
  id: service.id,
  title: service.cardTitle ?? service.title ?? service.name ?? "Wellness service",
  price: formatPrice(getLowestDurationPrice(service)),
  originalPrice:
    service.originalPrice === null || service.originalPrice === undefined
      ? null
      : formatPrice(service.originalPrice),
  duration: service.duration ?? "",
  media: service.media ?? service.thumbnailKey ?? "/images/hero-fallback.jpg",
  rating: service.averageRating ?? service.rating ?? "—",
  reviews: service.totalReviews ?? service.reviews ?? 0,
  totalBookingsCount: service.totalBookingsCount ?? 0,
  category: categoryName,
  subCategoryId: service.subCategoryId,
  tag: service.tag,
  isSpotlight: service.isSpotlight,
  features: service.features ?? [],
  overview: service.overview,
  procedureSteps: service.procedureSteps,
  itemsUsed: service.itemsUsed,
  skilledPros: service.skilledPros,
  prePostCare: service.prePostCare,
  disclaimer: service.disclaimer,
  whatsIncluded: service.whatsIncluded,
  faqs: service.faqs,
  trustedLoved: service.trustedLoved,
  customReviews: service.customReviews,
});

export default function CategoryServices({
  category,
  services,
  onFaqsChange,
}: CategoryServicesProps) {
  // Clicking a card opens the same detail popup the category page uses,
  // instead of navigating there — see the card's onClick below.
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );

  // Desktop-only prev/next arrows (see the buttons below) — touch devices
  // already scroll this row by dragging, so the arrows stay hidden below
  // md and only exist here to give a mouse/trackpad user the same "there's
  // more" affordance drag-scrolling gives a touch user. isBeginning/isEnd
  // hide whichever arrow has nothing left to reveal, instead of leaving a
  // dead click sitting there once you've scrolled all the way to an edge.
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const syncEdges = (swiper: SwiperInstance) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const categoryFaqs = useMemo(() => {
    const uniqueFaqs = new Map<string, HomeFaq>();

    services.forEach((service) => {
      service.faqs?.forEach((faq) => {
        const question = faq.q ?? faq.question;
        const answer = faq.a ?? faq.answer;
        if (!question || !answer) return;
        uniqueFaqs.set(
          `${question}-${answer}`,
          { id: faq.id, question, answer },
        );
      });
    });

    return [...uniqueFaqs.values()];
  }, [services]);

  useEffect(() => {
    onFaqsChange?.(category, categoryFaqs);
  }, [category, categoryFaqs, onFaqsChange]);

  return (
    <section
      id={category.slug}
      className="w-full max-w-7xl mx-auto overflow-hidden border-b border-stone-100 bg-white px-4 py-8 font-sans sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4 sm:mb-7">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wide text-green-700 sm:text-sm">
            {category.name}
          </span>
          <h2 className="mt-1 text-xl font-semibold leading-6 tracking-tight text-black sm:text-2xl md:text-3xl">
            {category.title ?? category.name}
          </h2>
        </div>
        <Link
          href={`/detail/${category.slug}?categoryId=${encodeURIComponent(category.id)}`}
          className="mt-1 shrink-0 text-xs font-normal leading-[129%] text-[#6B4B22] hover:underline sm:text-sm"
        >
          See all
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="py-4 text-sm font-medium text-stone-500">
          No services are available in this category yet.
        </p>
      ) : (
        <div className="group/row relative">
        <Swiper
          spaceBetween={8}
          // Fractional slidesPerView at every breakpoint, not just mobile —
          // always leaves a sliver of the next card peeking in as the only
          // signal (no scrollbar, no arrows) that there's more to scroll.
          slidesPerView={2.12}
          breakpoints={{
            640: { slidesPerView: 2.15, spaceBetween: 12 },
            768: { slidesPerView: 3.15, spaceBetween: 12 },
            1024: { slidesPerView: 4.15, spaceBetween: 14 },
            1280: { slidesPerView: 5.15, spaceBetween: 16 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            syncEdges(swiper);
          }}
          onSlideChange={syncEdges}
          onResize={syncEdges}
          className="w-full"
        >
          {services.map((service) => {
            const image = service.media ?? service.thumbnailKey;
            const lowestDurationPrice = getLowestDurationPrice(service);

            return (
              <SwiperSlide key={service.id} className="h-auto">
                {/* Opens the detail popup in place — same as the category
                    page's own service cards (see Serviceslist.tsx) — rather
                    than navigating there, so no href/Link here. */}
                <div
                  onClick={() => setSelectedService(service)}
                  className="group block h-full cursor-pointer"
                >
                  <div className="relative mb-[7px] aspect-[168/97] w-full overflow-hidden rounded-[7px] bg-stone-100">
                    {image ? (
                      <Image
                        src={image}
                        alt={service.cardTitle ?? service.title ?? service.name ?? category.name}
                        fill
                        sizes="(max-width: 639px) 45vw, (max-width: 767px) 45vw, (max-width: 1023px) 30vw, (max-width: 1279px) 23vw, 19vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-2xl font-bold text-amber-500">
                        {(service.cardTitle ?? service.title ?? service.name ?? category.name).charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* min-h reserves 2 lines so the rating row below lands
                      at the same height across every card in the row
                      regardless of title length — items-end bottom-aligns
                      the title inside that reserved box so a one-line
                      title sits right against the rating row instead of
                      leaving a gap under it (the empty half-line goes
                      above the title, against the image, instead). */}
                  <div className="flex min-h-[32px] items-end">
                    <h3 className="line-clamp-2 text-[14px] font-medium leading-[116%] text-black transition-colors group-hover:text-amber-600">
                      {service.cardTitle ?? service.title ?? service.name ?? "Wellness service"}
                    </h3>
                  </div>
                  {/* One row — star, rating, then bookings in parens — not
                      two stacked lines. totalBookingsCount is the real
                      bookings field, same one SectionHero.tsx reads once
                      this service's popup is open (distinct from
                      totalReviews, the rating count). Always rendered, no
                      >0 gate — 0 shows as "(0 bookings)" rather than the
                      line disappearing. */}
                  <div className="mt-[6px] flex items-center gap-1 text-[12px] leading-[116%] text-[#666]">
                    <Star className="h-3.5 w-3.5 shrink-0 fill-[#ffb318] text-[#ff9d00]" />
                    <span className="font-medium text-black">
                      {formatRating(service.averageRating ?? service.rating)}
                    </span>
                    <span>({formatBookingsLabel(service.totalBookingsCount)})</span>
                  </div>
                  <div className="mt-[6px] flex items-center gap-1 text-[14px] font-medium leading-[116%] text-black">
                    <span>Starts at {formatPrice(lowestDurationPrice)}</span>
                    {hasCutPrice(service.originalPrice) && (
                      <span className="text-[12px] text-[#666] line-through">
                        {formatPrice(service.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Desktop-only — hidden on touch breakpoints (md and below), where
            dragging the row already does this. Each button's hit area
            spans the row's full height (inset-y-0) with a gradient scrim
            behind it so it reads as part of the row rather than a chip
            floating over the cards; the circular button itself sits
            centered within that, fading in only on hover of the row so it
            doesn't visually compete with the cards at rest. */}
        {!isBeginning && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute inset-y-0 left-0 z-10 hidden w-14 cursor-pointer items-center justify-start bg-gradient-to-r from-white via-white/70 to-transparent pl-1 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 md:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-md transition-all duration-150 hover:scale-105 hover:border-amber-300 hover:text-amber-600 hover:shadow-lg active:scale-95">
              <ChevronLeft className="h-5 w-5" />
            </span>
          </button>
        )}
        {!isEnd && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute inset-y-0 right-0 z-10 hidden w-14 cursor-pointer items-center justify-end bg-gradient-to-l from-white via-white/70 to-transparent pr-1 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 md:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-md transition-all duration-150 hover:scale-105 hover:border-amber-300 hover:text-amber-600 hover:shadow-lg active:scale-95">
              <ChevronRight className="h-5 w-5" />
            </span>
          </button>
        )}
        </div>
      )}

      {selectedService && (
        <SubDetailPopUp
          service={toDynamicService(selectedService, category.title ?? category.name)}
          serviceDetails={{
            durations: selectedService.durations ?? [],
            packages: selectedService.packages ?? [],
            addOns: selectedService.addOns ?? [],
          }}
          categoryName={category.title ?? category.name}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}
