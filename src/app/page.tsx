"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/src/context/CartContext";

import ServiceFaq, { CategoryFaqGroup } from "@/src/components/home/faq-accordion";
import Header from "@/src/components/home/header";
import Inspotlight from "@/src/components/home/in-spotlight";
import WallPanel from "@/src/components/home/wall-panel";
import CategoryServices from "@/src/components/home/category-services";
import MobileHome from "@/src/components/home/mobile";
import HomeSkeleton from "@/src/components/home/home-skeleton";

// Only ever rendered when the resolved zone isn't servable — never needed
// on the happy path, so it shouldn't be in the home page's initial bundle.
const LocationUnavailableModal = dynamic(
  () => import("@/src/components/home/location-unavailable"),
  { ssr: false, loading: () => null },
);

import { useHomeDetails } from "@/src/hooks/queries/useHomeDetails";

export default function Home() {
  const { zoneId, zoneExists, isZoneLoading } = useCart();

  const {
    data: homeDetails,
    isLoading: isHomeLoading,
    isError: homeError,
    refetch: refetchHomeDetails,
  } = useHomeDetails(zoneId, { enabled: !!zoneId });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [categoryFaqs, setCategoryFaqs] = useState<CategoryFaqGroup[]>([]);

  // Hides the browser's page scrollbar while on the home route only — added
  // here (not globals.css/layout.tsx) so other routes, like the detail
  // pages, keep their normal scrollbar. .hide-scrollbar (globals.css) only
  // hides the indicator; the page still scrolls via wheel/touch/keyboard.
  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    document.body.classList.add("hide-scrollbar");
    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);

  // Zone resolution (geolocation/manual location → getZones) now happens
  // once, app-wide, in CartContext — this just reacts to the result: once
  // it's settled, no servable zone means "prompt the user to pick one".
  useEffect(() => {
    if (isZoneLoading) return;
    setShowLocationModal(!zoneExists);
  }, [isZoneLoading, zoneExists]);

  const handleFaqsChange = useCallback(
    (category: CategoryFaqGroup["category"], faqs: CategoryFaqGroup["faqs"]) => {
      setCategoryFaqs((current) => {
        const withoutCategory = current.filter((group) => group.category.id !== category.id);
        return faqs.length > 0 ? [...withoutCategory, { category, faqs }] : withoutCategory;
      });
    },
    [],
  );

  /*
   * Loading state — covers both resolving the zone and, once that succeeds,
   * fetching home details for it. Kept as one combined check so there's no
   * gap between the two where a definitive-looking "unavailable" screen
   * could flash before we actually know the answer.
   */
  const isLoadingCatalog =
    isZoneLoading ||
    (zoneExists && (isHomeLoading || (!homeError && !homeDetails)));

  if (isLoadingCatalog) {
    return <HomeSkeleton />;
  }

  /*
   * No Zone Available
   */
  if (!zoneExists || !zoneId) {
    return (
      <>
        <main className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              No services available in your location
            </h2>

            <p className="text-gray-500 mt-2">
              We're currently not serving your area yet.
            </p>
          </div>
        </main>

        <LocationUnavailableModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        />
      </>
    );
  }

  /*
   * Zone resolved, but home details failed to load (network error, 500,
   * etc.) — distinct from "not available in your area" above, since here
   * the area is served and retrying is the right call, not picking a
   * different location.
   */
  if (homeError || !homeDetails) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Couldn&apos;t load services
          </h2>

          <p className="text-gray-500 mt-2">
            Something went wrong while loading services for your area.
          </p>

          <button
            type="button"
            onClick={() => void refetchHomeDetails()}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full overflow-x-hidden flex-1 flex flex-col" id="top">
        {/* ───────── DESKTOP ───────── */}

        <div className="hidden md:block">
          <Header homeDetails={homeDetails} />

          <Inspotlight
            campaigns={homeDetails.promotionalCampaigns}
            categories={homeDetails.categories}
          />

          {homeDetails.categories.map((category, index) => {
            const highlightBanner = homeDetails.promotionalCampaigns
              .filter(
                (campaign) =>
                  (campaign.type === "HIGHLIGHT_BANNER" || campaign.type === "HIGHLIGHT_VIDEO") &&
                  campaign.categoryId === category.id &&
                  campaign.isActive !== false,
              )
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))[0];

            return (
            <div key={category.id}>
              {highlightBanner && (
                <WallPanel campaign={highlightBanner} category={category} priority={index === 0} />
              )}
              <CategoryServices
                category={category}
                zoneId={zoneId}
                onFaqsChange={handleFaqsChange}
              />
            </div>
            );
          })}

          <ServiceFaq categoryFaqs={categoryFaqs} />
        </div>

        {/* ───────── MOBILE ───────── */}

        <div className="block md:hidden">
          <MobileHome homeDetails={homeDetails} zoneId={zoneId} />
        </div>
      </main>

      <LocationUnavailableModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  );
}
