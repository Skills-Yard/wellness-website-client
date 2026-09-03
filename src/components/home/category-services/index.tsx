"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { HomeCategory, HomeServiceItem } from "@/src/types/serviceTypes";
import { HomeFaq, ServiceItem } from "@/src/types/serviceItemTypes";
import ServiceCard from "@/src/components/home/service-card";
import { toDynamicService } from "@/src/utils/service/card";
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
          {services.map((service) => (
            <SwiperSlide key={service.id} className="h-auto">
              {/* Opens the detail popup in place — same as the category
                  page's own service cards (see Serviceslist.tsx) — rather
                  than navigating there. */}
              <ServiceCard
                service={service}
                categoryName={category.name}
                onSelect={setSelectedService}
              />
            </SwiperSlide>
          ))}
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
