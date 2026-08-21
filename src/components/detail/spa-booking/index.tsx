"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useCart } from "@/src/context/CartContext";
import { useCategories } from "@/src/context/CategoryContext";
import { useCategory } from "@/src/hooks/queries/useCategory";
import { useSubCategories } from "@/src/hooks/queries/useSubCategories";
import { useServiceItemsForSubCategories } from "@/src/hooks/queries/useServiceItems";
import { usePromotionalCampaigns } from "@/src/hooks/queries/usePromotionalCampaigns";
import { SubCategory } from "@/src/types/categoryTypes";
import { HomeCampaign } from "@/src/types/serviceTypes";
import {
  ServiceAddOn,
  ServiceDuration,
  ServicePackage,
} from "@/src/types/serviceDetailTypes";
import { Category, DynamicService } from "@/src/utils/types/spabooking";
import MobileStickyNavbar from "./Mobilestickynavbar";
import MobileHeroSection from "./Mobileherosection";
import MobileCategoriesGrid from "./Mobilecategoriesgrid";
import DesktopCategoriesSidebar from "./Desktopcategoriessidebar";
import DesktopHero from "./Desktophero";
import ServicesList from "./Serviceslist";
import EezitPPromiseBox from "./Eezitpromisebox";
import FloatingMenuButton from "./Floatingmenubutton";
import DetailSkeleton from "./DetailSkeleton";
import SubDetailPopUp from "../[slug]/LazySubDetailPopUp";

// Both only ever render after a click (floating menu button / a service
// card) — no reason to ship them in this page's initial bundle.
const CategoriesMenuModal = dynamic(() => import("./Categoriesmenumodal"), {
  ssr: false,
  loading: () => null,
});

const toCategoryId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const formatPrice = (price?: string | number | null) => {
  if (price === undefined || price === null || price === "")
    return "Price on request";
  return typeof price === "number" ? `₹${price}` : price;
};

const toNumericPrice = (price?: string | number): number | undefined => {
  if (typeof price === "number") return Number.isFinite(price) ? price : undefined;

  const value = Number(price?.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : undefined;
};

const getOptionLabel = (
  option?: ServiceDuration | ServicePackage | ServiceAddOn,
) => option?.label ?? option?.name ?? option?.title ?? option?.duration ?? "";

const belongsToService = (
  option: ServiceDuration | ServicePackage | ServiceAddOn,
  serviceId: string,
) => option.serviceItemId === serviceId || option.serviceId === serviceId;

// Module-level, not `subCategoriesData ?? []` inline — the latter builds a
// new array every render while data is still loading, which would
// destabilize every useMemo below keyed on `subCategories` for that whole
// window (see useServiceItemsForSubCategories' `combine` comment for why
// that class of bug is worth avoiding outright).
const EMPTY_SUB_CATEGORIES: SubCategory[] = [];

export default function SpaBookingLayout() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const { isCartOpen, addToCart, zoneId, zoneExists, isZoneLoading, zoneError } = useCart();
  const {
    isLoading: categoriesLoading,
    error: categoriesError,
    findCategoryBySlug,
  } = useCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [selectedService, setSelectedService] = useState<DynamicService | null>(
    null,
  );

  // A category ID in the URL is preferred. The slug lookup keeps existing links working.
  const categoryId =
    searchParams.get("categoryId") ?? findCategoryBySlug(slug)?.id;

  // Zone resolution (geolocation/manual location → getZones) is centralized
  // in CartContext and runs once, app-wide — this page just reads the
  // result instead of resolving it independently (see page.tsx's version
  // of the same read for the other half of the app).
  const zoneNotFoundError =
    !isZoneLoading && !zoneExists
      ? (zoneError ?? new Error("Services are not available in your location yet."))
      : null;

  const {
    data: categoryDetails,
    isLoading: isDetailsLoading,
    error: detailsErrorObj,
  } = useCategory(categoryId, zoneId, { enabled: !!categoryId });
  const detailsError = detailsErrorObj as Error | null;

  const {
    data: subCategoriesData,
    isLoading: isSubCategoriesLoading,
    error: subCategoriesErrorObj,
  } = useSubCategories(categoryId, zoneId, { enabled: !!categoryId });
  const subCategories: SubCategory[] = subCategoriesData ?? EMPTY_SUB_CATEGORIES;

  const { data: campaignsData } = usePromotionalCampaigns(
    { categoryId, zoneId },
    { enabled: !!categoryId && !!zoneId },
  );

  const { heroCampaign, carouselCampaigns } = useMemo<{
    heroCampaign: HomeCampaign | null;
    carouselCampaigns: HomeCampaign[];
  }>(() => {
    const categoryCampaigns = (campaignsData ?? []).filter(
      (campaign) =>
        campaign.targetType === "CATEGORY" && campaign.categoryId === categoryId,
    );

    const best = categoryCampaigns
      .filter(
        (campaign) =>
          campaign.type === "HIGHLIGHT_VIDEO" || campaign.type === "HIGHLIGHT_BANNER",
      )
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))[0];

    const carousel = categoryCampaigns
      .filter(
        (campaign) =>
          campaign.type === "CAROUSEL_VIDEO" || campaign.type === "CAROUSEL_BANNER",
      )
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    return { heroCampaign: best ?? null, carouselCampaigns: carousel };
  }, [campaignsData, categoryId]);

  // Set by the home page's category-select flow (CategorySelectModal) —
  // absent for links that skip straight here (e.g. "See all"), in which
  // case every gender/suite is shown, same as before that flow existed.
  const genderId = searchParams.get("genderId") ?? undefined;
  const suiteId = searchParams.get("suiteId") ?? undefined;

  // Fetches every sub-category's services as separate cached queries keyed
  // by [subCategoryId, zoneId, genderId, suiteId] (see
  // useServiceItemsForSubCategories) — this is what lets a "See all" click
  // from the home page's CategoryServices (same key, no gender/suite) reuse
  // the cache instead of refetching.
  const {
    services: serviceItems,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useServiceItemsForSubCategories(
    subCategories.map((subCategory) => subCategory.id),
    zoneId,
    { enabled: subCategories.length > 0, genderId, suiteId },
  );
  const servicesError = isServicesError
    ? new Error("Unable to load services.")
    : null;

  // The catalog API already embeds each service item's own durations/packages/addOns
  // (see GET /catalog/service-items) — no need for separate, catalog-wide fetches.
  const serviceDurations = useMemo(
    () => serviceItems.flatMap((item) => item.durations ?? []),
    [serviceItems],
  );
  const servicePackages = useMemo(
    () => serviceItems.flatMap((item) => item.packages ?? []),
    [serviceItems],
  );
  const serviceAddOns = useMemo(
    () => serviceItems.flatMap((item) => item.addOns ?? []),
    [serviceItems],
  );

  const { services, serviceCategories } = useMemo<{
    services: DynamicService[];
    serviceCategories: Category[];
  }>(() => {
    const subCategoryNames = new Map(
      subCategories.map((subCategory) => [subCategory.id, subCategory.name]),
    );
    const durationById = new Map(
      serviceDurations.map((duration) => [duration.id, duration]),
    );
    const services = serviceItems.map((service) => {
      const durationPrices = serviceDurations
        .filter((duration) => belongsToService(duration, service.id))
        .map((duration) => toNumericPrice(duration.price))
        .filter((price): price is number => price !== undefined);
      const lowestDurationPrice =
        durationPrices.length > 0 ? Math.min(...durationPrices) : undefined;

      return {
      ...service,
      id: service.id,
      title: service.cardTitle ?? service.title ?? service.name ?? "Wellness service",
      price: formatPrice(lowestDurationPrice ?? service.price),
      originalPrice:
        service.originalPrice === null || service.originalPrice === undefined
          ? null
          : formatPrice(service.originalPrice),
      duration:
        service.duration ??
        getOptionLabel(
          durationById.get(
            service.serviceDurationId ?? service.durationId ?? "",
          ),
        ),
      media:
        service.media ?? service.thumbnailKey ?? "/images/hero-fallback.jpg",
      rating: service.averageRating ?? service.rating ?? "—",
      reviews: service.totalReviews ?? service.reviews ?? 0,
      category: subCategoryNames.get(service.subCategoryId) ?? "Services",
      subCategoryId: service.subCategoryId,
      tag: service.tag,
      isSpotlight: service.isSpotlight,
      // Real content only — packages/add-ons already get their own dedicated
      // sections in SelectPack, they don't belong mixed into "features" too.
      features: service.features ?? [],
      };
    });
    // subCategories comes from the zone-derived (but suite/gender-agnostic)
    // sub-categories endpoint — a tab can still end up with zero services
    // once the category-select flow's suite/gender narrows things further
    // (see CategorySelectModal). Only drop empty tabs when that narrowing
    // is actually active: without it, the raw list is already correct, and
    // filtering unconditionally would hide a genuinely-empty-right-now tab
    // a merchant is mid-stocking, purely because of a client-side guess.
    const hasSuiteOrGenderFilter = Boolean(genderId || suiteId);
    const subCategoryIdsWithServices = new Set(
      services.map((service) => service.subCategoryId),
    );
    const dropEmptyTabs = (categories: Category[]) =>
      hasSuiteOrGenderFilter
        ? categories.filter((category) => subCategoryIdsWithServices.has(category.id))
        : categories;

    if (subCategories.length) {
      return { services, serviceCategories: dropEmptyTabs(subCategories) };
    }
    if (categoryDetails?.categories?.length) {
      return { services, serviceCategories: dropEmptyTabs(categoryDetails.categories) };
    }
    const serviceCategories: Category[] = [
      ...new Set(services.map((service) => service.category).filter(Boolean)),
    ].map((name) => ({ id: toCategoryId(name), name }));
    return { services, serviceCategories };
  }, [
    categoryDetails,
    genderId,
    serviceAddOns,
    serviceDurations,
    serviceItems,
    servicePackages,
    subCategories,
    suiteId,
  ]);

  // ServiceCategory has no rating/review fields of its own in the schema — this
  // rolls up a real category-level figure from its service items' actual
  // averageRating/totalReviews instead of showing a permanently-fake placeholder.
  const { categoryRating, categoryReviewCount } = useMemo(() => {
    const reviewed = serviceItems.filter((item) => (item.totalReviews ?? 0) > 0);
    const categoryReviewCount = reviewed.reduce(
      (sum, item) => sum + (item.totalReviews ?? 0),
      0,
    );
    if (categoryReviewCount === 0) return { categoryRating: null, categoryReviewCount: 0 };

    const weightedSum = reviewed.reduce(
      (sum, item) => sum + (item.averageRating ?? 0) * (item.totalReviews ?? 0),
      0,
    );
    return {
      categoryRating: weightedSum / categoryReviewCount,
      categoryReviewCount,
    };
  }, [serviceItems]);

  useEffect(() => {
    const updatePageState = () => {
      setIsScrolled(window.scrollY > 200);
      const current = serviceCategories.findLast((category) => {
        const section = document.getElementById(category.id);
        return section ? section.getBoundingClientRect().top <= 150 : false;
      });
      if (current) setActiveTab(current.id);
    };

    window.addEventListener("scroll", updatePageState, { passive: true });
    updatePageState();
    return () => window.removeEventListener("scroll", updatePageState);
  }, [serviceCategories]);

  const scrollToCategory = useCallback((id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 130,
      behavior: "smooth",
    });
  }, []);

  const handleAddToCart = useCallback(
    (service: DynamicService) => {
      addToCart({
        id: service.id,
        title: service.title,
        price: Number.parseInt(service.price.replace(/[^\d]/g, ""), 10) || 0,
        image: service.media,
        duration: service.duration,
      });
    },
    [addToCart],
  );

  const preselectedService = useMemo(() => {
    const serviceId = searchParams.get("id");
    return serviceId
      ? (services.find((service) => service.id === serviceId) ?? null)
      : null;
  }, [searchParams, services]);

  const activeModalService = selectedService ?? preselectedService;

  const selectedServiceDetails = useMemo(() => {
    if (!activeModalService) return null;

    return {
      durations: serviceDurations.filter((duration) =>
        belongsToService(duration, activeModalService.id),
      ),

      packages: servicePackages.filter((servicePackage) =>
        belongsToService(servicePackage, activeModalService.id),
      ),

      addOns: serviceAddOns.filter((addOn) =>
        belongsToService(addOn, activeModalService.id),
      ),
    };
  }, [activeModalService, serviceDurations, servicePackages, serviceAddOns]);

  if (
    categoriesLoading ||
    isZoneLoading ||
    isDetailsLoading ||
    isSubCategoriesLoading ||
    isServicesLoading
  )
    return <DetailSkeleton />;
  if (categoriesError || zoneNotFoundError || detailsError || subCategoriesErrorObj || servicesError)
    return (
      <MessageState
        title="Service details unavailable"
        message={
          (categoriesError as Error | null ??
            zoneNotFoundError ??
            detailsError ??
            (subCategoriesErrorObj as Error | null) ??
            servicesError)?.message ?? "Please try again shortly."
        }
      />
    );
  if (!categoryId || !categoryDetails)
    return (
      <MessageState
        title="Category not found"
        message="This category is not available."
      />
    );

  const title = categoryDetails.title ?? categoryDetails.name;
  const subtitle =
    categoryDetails.subtitle ??
    "Handpicked wellness experiences curated for you.";
  const media = categoryDetails.media ?? "/images/hero-fallback.jpg";
  const rating = categoryRating !== null ? categoryRating.toFixed(1) : "—";
  const reviews = categoryReviewCount;
  const heroMedia = heroCampaign?.cdnUrl ?? "/images/hero-fallback.jpg";
  const heroMediaType = heroCampaign?.cdnUrl ? heroCampaign.mediaType : "IMAGE";

  return (
    <div className="relative w-full bg-white pb-20">
      <MobileStickyNavbar
        title={title}
        isScrolled={isScrolled}
        activeTab={activeTab}
        activeCategories={serviceCategories}
        onCategoryClick={scrollToCategory}
      />
      <MobileHeroSection
        campaigns={carouselCampaigns}
        fallbackMediaSrc={heroMedia}
        fallbackMediaType={heroMediaType}
        title={title}
        subtitle={subtitle}
      />
      <MobileCategoriesGrid
        title={title}
        subtitle={subtitle}
        rating={rating}
        reviews={reviews}
        media={media}
        categories={serviceCategories}
        activeTab={activeTab}
        onCategoryClick={scrollToCategory}
      />
      <div className="mx-auto w-full max-w-7xl px-3 py-4 xs:px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex flex-col gap-6 xs:gap-8 lg:flex-row lg:items-start">
          <DesktopCategoriesSidebar
            categories={serviceCategories}
            media={media}
            activeTab={activeTab}
            onCategoryClick={scrollToCategory}
          />
          <div className="flex flex-1 flex-col">
            <DesktopHero
              title={title}
              subtitle={subtitle}
              rating={rating}
              reviews={reviews}
              media={heroMedia}
              mediaType={heroMediaType}
            />
            <div className="flex flex-col justify-between gap-4 xs:gap-6 md:flex-row">
              <ServicesList
                categories={serviceCategories}
                services={services}
                onDetailClick={setSelectedService}
                onAddToCart={handleAddToCart}
              />
              <EezitPPromiseBox />
            </div>
          </div>
        </div>
      </div>
      <FloatingMenuButton
        isCartOpen={isCartOpen}
        onClick={() => setIsMenuOpen(true)}
      />
      <CategoriesMenuModal
        isOpen={isMenuOpen}
        categories={serviceCategories}
        media={media}
        activeTab={activeTab}
        onClose={() => setIsMenuOpen(false)}
        onCategoryClick={scrollToCategory}
      />
      {activeModalService && selectedServiceDetails && (
        <SubDetailPopUp
          service={activeModalService}
          serviceDetails={selectedServiceDetails}
          categoryName={activeModalService.category}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

function MessageState({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-500">{message}</p>
      </div>
    </main>
  );
}
