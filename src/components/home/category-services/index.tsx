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
import { SubCategory } from "@/src/types/categoryTypes";
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

const cardsForViewport = () => {
  if (typeof window === "undefined") return 2;
  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 768) return 3;
  return 2;
};

const formatPrice = (price: ServiceItem["price"] | null) => {
  if (typeof price === "number") return `₹${price.toLocaleString("en-IN")}`;
  return price ?? "₹0";
};

const formatRating = (rating: ServiceItem["averageRating"] | ServiceItem["rating"]) => {
  if (typeof rating === "number") return rating.toFixed(1);
  return rating ?? "0";
};

const formatReviews = (reviews: ServiceItem["totalReviews"] | ServiceItem["reviews"]) => reviews ?? "0";

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
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [nextSubCategoryIndex, setNextSubCategoryIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
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

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(cardsForViewport());
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const loadNextServices = useCallback(async () => {
    if (!isActive || loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(false);

    try {
      let availableSubCategories = subCategories;
      if (availableSubCategories.length === 0) {
        const response = await getSubCategoriesByCategoryId(category.id);
        availableSubCategories = response.data ?? [];
        if (!mountedRef.current) return;
        setSubCategories(availableSubCategories);
      }

      const subCategory = availableSubCategories[nextSubCategoryIndex];
      if (!subCategory) return;

      const response = await getServiceItems({
        isActive: true,
        subCategoryId: subCategory.id,
        zoneId,
      });

      if (!mountedRef.current) return;
      setServices((current) => [...current, ...(response.data ?? [])]);
      setNextSubCategoryIndex((index) => index + 1);
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
  }, [category.id, category.name, isActive, nextSubCategoryIndex, subCategories, zoneId]);

  useEffect(() => {
    if (!isActive || hasLoaded) return;

    const loadTimer = window.setTimeout(() => void loadNextServices(), 0);
    return () => window.clearTimeout(loadTimer);
  }, [hasLoaded, isActive, loadNextServices]);

  const revealMore = useCallback(() => {
    if (visibleCount < services.length) {
      setVisibleCount((count) => count + cardsForViewport());
      return;
    }

    if (nextSubCategoryIndex < subCategories.length) void loadNextServices();
  }, [loadNextServices, nextSubCategoryIndex, services.length, subCategories.length, visibleCount]);

  const visibleServices = services.slice(0, visibleCount);
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
          {Array.from({ length: visibleCount }).map((_, index) => (
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
      ) : visibleServices.length === 0 ? (
        <p className="py-4 text-sm font-medium text-stone-500">
          No services are available in this category yet.
        </p>
      ) : (
        <Swiper
          spaceBetween={8}
          slidesPerView={2.12}
          breakpoints={{
            640: { slidesPerView: 2.15, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 14 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
          onReachEnd={revealMore}
          className="w-full"
        >
          {visibleServices.map((service) => {
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
                    {/* "bookings" — same label/count SectionHero.tsx uses for
                        this exact service once its popup is open, no
                        separate bookings field exists in the API response.
                        Always rendered, no reviews>0 gate — 0 shows as
                        "0 bookings" rather than the line disappearing. */}
                    <span>{formatReviews(service.totalReviews ?? service.reviews)} bookings</span>
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
