"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { useCategories } from "@/src/context/CategoryContext";
import { getSubCategoriesByCategoryId } from "@/src/services/categoryApi";
import { getServiceItems } from "@/src/services/serviceItemApi";
import {
  getServiceAddOns,
  getServiceDurations,
  getServicePackages,
} from "@/src/services/serviceDetailApi";
import { getZones } from "@/src/services/zoneApi";
import { CategoryDetails, SubCategory } from "@/src/types/categoryTypes";
import { ServiceItem } from "@/src/types/serviceItemTypes";
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
import VelloraPPromiseBox from "./Vellorappromisebox";
import FloatingMenuButton from "./Floatingmenubutton";
import CategoriesMenuModal from "./Categoriesmenumodal";
import SubDetailPopUp from "../[slug]/mainfile";

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

export default function SpaBookingLayout() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const { isCartOpen, addToCart, setZoneId: setCartZoneId } = useCart();
  const {
    isLoading: categoriesLoading,
    error: categoriesError,
    findCategoryBySlug,
    loadCategory,
  } = useCategories();
  const [categoryDetails, setCategoryDetails] =
    useState<CategoryDetails | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceDurations, setServiceDurations] = useState<ServiceDuration[]>(
    [],
  );
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [serviceAddOns, setServiceAddOns] = useState<ServiceAddOn[]>([]);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<Error | null>(null);
  const [zoneError, setZoneError] = useState<Error | null>(null);
  const [servicesError, setServicesError] = useState<Error | null>(null);
  const [configurationError, setConfigurationError] = useState<Error | null>(
    null,
  );
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isZoneLoading, setIsZoneLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isConfigurationLoading, setIsConfigurationLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [selectedService, setSelectedService] = useState<DynamicService | null>(
    null,
  );

  // A category ID in the URL is preferred. The slug lookup keeps existing links working.
  const categoryId =
    searchParams.get("categoryId") ?? findCategoryBySlug(slug)?.id;

  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      queueMicrotask(() => {
        if (isMounted) {
          setZoneError(
            new Error("Geolocation is not supported by this browser."),
          );
          setIsZoneLoading(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await getZones({
            lat: coords.latitude,
            long: coords.longitude,
          });
          const zone = response.data;

          if (!zone.exists || !zone.zoneId) {
            throw new Error("Services are not available in your location yet.");
          }

          if (isMounted) {
            setZoneId(zone.zoneId);
            setCartZoneId(zone.zoneId);
          }
        } catch (error) {
          if (isMounted) {
            setZoneError(
              error instanceof Error
                ? error
                : new Error("Unable to determine your service zone."),
            );
          }
        } finally {
          if (isMounted) setIsZoneLoading(false);
        }
      },
      (error) => {
        if (isMounted) {
          setZoneError(
            new Error(error.message || "Location permission is required."),
          );
          setIsZoneLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchServiceConfiguration = async () => {
      try {
        setIsConfigurationLoading(true);
        setConfigurationError(null);
        const [durationResponse, packageResponse, addOnResponse] =
          await Promise.all([
            getServiceDurations(),
            getServicePackages(),
            getServiceAddOns(),
          ]);

        if (isMounted) {
          setServiceDurations(durationResponse.data ?? []);
          setServicePackages(packageResponse.data ?? []);
          setServiceAddOns(addOnResponse.data ?? []);
        }
      } catch (error) {
        if (isMounted) {
          setConfigurationError(
            error instanceof Error
              ? error
              : new Error("Unable to load service options."),
          );
        }
      } finally {
        if (isMounted) setIsConfigurationLoading(false);
      }
    };

    fetchServiceConfiguration();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!categoryId) {
      setCategoryDetails(null);
      setSubCategories([]);
      setServiceItems([]);
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsDetailsLoading(true);
        setDetailsError(null);
        // Do not keep services from the previously visited category while this
        // category's sub-categories are being resolved.
        setSubCategories([]);
        setServiceItems([]);
        const [details, subCategoryResponse] = await Promise.all([
          loadCategory(categoryId),
          getSubCategoriesByCategoryId(categoryId),
        ]);

        if (isMounted) {
          setCategoryDetails(details);
          setSubCategories(subCategoryResponse.data ?? []);
        }
      } catch (error) {
        if (isMounted) {
          setCategoryDetails(null);
          setSubCategories([]);
          setDetailsError(
            error instanceof Error
              ? error
              : new Error("Unable to load category details."),
          );
        }
      } finally {
        if (isMounted) setIsDetailsLoading(false);
      }
    };

    fetchCategory();
    return () => {
      isMounted = false;
    };
  }, [categoryId, loadCategory]);

  useEffect(() => {
    let isMounted = true;
    if (!zoneId || subCategories.length === 0) {
      setServiceItems([]);
      setIsServicesLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        setIsServicesLoading(true);
        setServicesError(null);
        const results = await Promise.allSettled(
          subCategories.map((subCategory) =>
            getServiceItems({
              isActive: true,
              subCategoryId: subCategory.id,
              zoneId,
            }),
          ),
        );

        if (isMounted) {
          const responses = results
            .filter(
              (result): result is PromiseFulfilledResult<
                Awaited<ReturnType<typeof getServiceItems>>
              > => result.status === "fulfilled",
            )
            .map((result) => result.value);

          // A service request may fail for one sub-category (for example, when
          // it has no services in the selected zone). Keep rendering the
          // successful sub-categories instead of hiding the whole page.
          setServiceItems(responses.flatMap((response) => response.data ?? []));

          if (responses.length === 0) {
            const failedResult = results.find(
              (result): result is PromiseRejectedResult =>
                result.status === "rejected",
            );
            setServicesError(
              failedResult?.reason instanceof Error
                ? failedResult.reason
                : new Error("Unable to load services."),
            );
          }
        }
      } catch (error) {
        if (isMounted) {
          setServiceItems([]);
          setServicesError(
            error instanceof Error
              ? error
              : new Error("Unable to load services."),
          );
        }
      } finally {
        if (isMounted) setIsServicesLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, [subCategories, zoneId]);

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
    console.log("services: ", serviceItems);
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
      title: service.title ?? service.name ?? "Wellness service",
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
      rating: service.rating ?? "—",
      reviews: service.reviews ?? 0,
      category: subCategoryNames.get(service.subCategoryId) ?? "Services",
      subCategoryId: service.subCategoryId,
      tag: service.tag,
      isSpotlight: service.isSpotlight,
      features: [
        ...(service.features ?? []),
        ...servicePackages
          .filter((servicePackage) =>
            belongsToService(servicePackage, service.id),
          )
          .map((servicePackage) => `Package: ${getOptionLabel(servicePackage)}`)
          .filter(Boolean),
        ...serviceAddOns
          .filter((addOn) => belongsToService(addOn, service.id))
          .map((addOn) => `Add-on: ${getOptionLabel(addOn)}`)
          .filter(Boolean),
      ],
      };
    });
    if (subCategories.length) {
      return { services, serviceCategories: subCategories };
    }
    if (categoryDetails?.categories?.length) {
      return { services, serviceCategories: categoryDetails.categories };
    }
    const serviceCategories: Category[] = [
      ...new Set(services.map((service) => service.category).filter(Boolean)),
    ].map((name) => ({ id: toCategoryId(name), name }));
    return { services, serviceCategories };
  }, [
    categoryDetails,
    serviceAddOns,
    serviceDurations,
    serviceItems,
    servicePackages,
    subCategories,
  ]);

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
    isServicesLoading ||
    isConfigurationLoading
  )
    return <LoadingState />;
  if (
    categoriesError ||
    zoneError ||
    detailsError ||
    servicesError ||
    configurationError
  )
    return (
      <MessageState
        title="Service details unavailable"
        message={
          (
            categoriesError ??
            zoneError ??
            detailsError ??
            servicesError ??
            configurationError
          )?.message ?? "Please try again shortly."
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
  const rating = categoryDetails.rating ?? "—";
  const reviews = categoryDetails.reviews ?? 0;

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
        videoSrc={categoryDetails.video}
        title={title}
        subtitle={subtitle}
      />
      <MobileCategoriesGrid
        title={title}
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
              media={media}
            />
            <div className="flex flex-col justify-between gap-4 xs:gap-6 md:flex-row">
              <ServicesList
                categories={serviceCategories}
                services={services}
                onDetailClick={setSelectedService}
                onAddToCart={handleAddToCart}
              />
              <VelloraPPromiseBox />
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
          steps={categoryDetails.steps ?? []}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <p className="font-medium text-gray-600">Loading wellness services...</p>
    </main>
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
