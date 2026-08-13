"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getSubCategoriesByCategoryId } from "@/src/services/categoryApi";
import { getServiceItems } from "@/src/services/serviceItemApi";
import { HomeCategory } from "@/src/types/serviceTypes";
import { HomeFaq, ServiceItem } from "@/src/types/serviceItemTypes";
import { DynamicService } from "@/src/utils/types/spabooking";
import SubDetailPopUp from "@/src/components/detail/[slug]/mainfile";

type CategoryServicesProps = {
  category: HomeCategory;
  zoneId: string;
  onFaqsChange?: (
    category: HomeCategory,
    faqs: HomeFaq[],
  ) => void;
};

const formatPrice = (price: ServiceItem["price"] | null) => {
  if (typeof price === "number") return `₹${price.toLocaleString("en-IN")}`;
  return price ?? "₹0";
};

const formatRating = (rating: ServiceItem["averageRating"] | ServiceItem["rating"]) => {
  if (typeof rating === "number") return rating.toFixed(1);
  return rating ?? "0";
};

// Real bookings count (distinct from totalReviews, the rating count) —
// always shown, defaulting to 0 whether it's genuinely 0 or just missing.
const formatBookings = (bookings: ServiceItem["totalBookingsCount"]) => bookings ?? 0;

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
  zoneId,
  onFaqsChange,
}: CategoryServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const loadingRef = useRef(false);
  const mountedRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(false);
  // Clicking a card opens the same detail popup the category page uses,
  // instead of navigating there — see the card's onClick below.
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isActive) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isActive]);

  // Fetches every sub-category's services in parallel (same pattern as the
  // full category page — see spa-booking/index.tsx's fetchServices) rather
  // than one sub-category at a time, gated behind scrolling far enough to
  // trigger the next fetch. That incremental version meant "all services"
  // actually only meant "all services from whichever sub-category loaded
  // first" until the user scrolled further — this loads the lot up front.
  const loadAllServices = useCallback(async () => {
    if (!isActive || loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(false);

    try {
      const subCategoryResponse = await getSubCategoriesByCategoryId(category.id);
      const availableSubCategories = subCategoryResponse.data ?? [];
      if (!mountedRef.current) return;

      const results = await Promise.allSettled(
        availableSubCategories.map((subCategory) =>
          getServiceItems({ isActive: true, subCategoryId: subCategory.id, zoneId }),
        ),
      );

      if (!mountedRef.current) return;

      const responses = results
        .filter(
          (result): result is PromiseFulfilledResult<
            Awaited<ReturnType<typeof getServiceItems>>
          > => result.status === "fulfilled",
        )
        .map((result) => result.value);

      // A single sub-category failing to load (e.g. no services in this
      // zone) shouldn't hide every sub-category that did load successfully.
      setServices(responses.flatMap((response) => response.data ?? []));
      if (responses.length === 0 && availableSubCategories.length > 0) {
        setError(true);
      }
      setHasLoaded(true);
    } catch (requestError) {
      if (!mountedRef.current) return;
      console.error(`Unable to load ${category.name} services:`, requestError);
      setError(true);
      setHasLoaded(true);
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) setIsLoading(false);
    }
  }, [category.id, category.name, isActive, zoneId]);

  useEffect(() => {
    if (!isActive || hasLoaded) return;

    const loadTimer = window.setTimeout(() => void loadAllServices(), 0);
    return () => window.clearTimeout(loadTimer);
  }, [hasLoaded, isActive, loadAllServices]);

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
      ref={sectionRef}
      id={category.slug}
      className="w-full max-w-7xl mx-auto overflow-hidden border-b border-stone-100 bg-white px-4 py-8 font-sans sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4 sm:mb-7">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wide text-green-700 sm:text-sm">
            {category.name}
          </span>
          <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-black sm:text-3xl">
            {category.title ?? category.name}
          </h2>
        </div>
        <Link
          href={`/detail/${category.slug}?categoryId=${encodeURIComponent(category.id)}`}
          className="mt-1 shrink-0 text-sm font-medium text-[#76501c] hover:underline sm:text-base"
        >
          See all
        </Link>
      </div>

      {!isActive || (isLoading && services.length === 0) ? (
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-[168px] shrink-0 animate-pulse sm:w-[calc((100%-16px)/3)] lg:w-[calc((100%-32px)/5)]">
              <div className="aspect-[168/97] rounded-[7px] bg-stone-100" />
              <div className="mt-2 h-4 w-3/4 rounded bg-stone-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="py-4 text-sm font-medium text-stone-500">
          Services for this category are unavailable right now.
        </p>
      ) : services.length === 0 ? (
        <p className="py-4 text-sm font-medium text-stone-500">
          No services are available in this category yet.
        </p>
      ) : (
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
                  <h3 className="line-clamp-2 min-h-[32px] text-[14px] font-medium leading-[116%] text-black transition-colors group-hover:text-amber-600">
                    {service.cardTitle ?? service.title ?? service.name ?? "Wellness service"}
                  </h3>
                  <div className="mt-[6px] flex flex-col gap-[2px] text-[12px] leading-[116%] text-[#666]">
                    {/* totalBookingsCount — the real bookings field, same
                        one SectionHero.tsx reads once this service's popup
                        is open (distinct from totalReviews, the rating
                        count). Always rendered, no >0 gate — 0 shows as
                        "0 bookings" rather than the line disappearing. */}
                    <span>{formatBookings(service.totalBookingsCount)} bookings</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-[#ffb318] text-[#ff9d00]" />
                      {formatRating(service.averageRating ?? service.rating)}
                    </span>
                  </div>
                  <div className="mt-[6px] flex items-center gap-1 text-[14px] font-medium leading-[116%] text-black">
                    <span>Starts at {formatPrice(lowestDurationPrice)}</span>
                    <span className="text-[12px] text-[#666] line-through">
                      {formatPrice(service.originalPrice)}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
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
