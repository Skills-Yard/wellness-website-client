"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/src/context/CartContext";

import ServiceFaq, { CategoryFaqGroup } from "@/src/components/home/faq-accordion";
import Header from "@/src/components/home/header";
import Inspotlight from "@/src/components/home/in-spotlight";
import WallPanel from "@/src/components/home/wall-panel";
import CategoryServices from "@/src/components/home/category-services";
import MobileHome from "@/src/components/home/mobile";
import LocationUnavailableModal from "@/src/components/home/location-unavailable";
import HomeSkeleton from "@/src/components/home/home-skeleton";

import { getZones } from "@/src/services/zoneApi";
import { getHomeDetails } from "@/src/services/homeApi";
import { HomeDetails, ZoneDetails } from "@/src/types/serviceTypes";

export default function Home() {
  const {
    setZoneId: setCartZoneId,
    locationCoords,
    isLocationManuallySelected,
    isHydrated: isLocationHydrated,
  } = useCart();

  const [zoneDetails, setZoneDetails] = useState<ZoneDetails | null>(null);
  const [homeDetails, setHomeDetails] = useState<HomeDetails | null>(null);

  const [zoneId, setZoneId] = useState<string | null>(null);
  const [zoneExists, setZoneExists] = useState(false);

  // Kept separate from isHomeLoading below — otherwise the moment zone
  // resolution finished but home details hadn't started fetching yet, the
  // "no services" screen would flash on screen before the home-details
  // fetch (fired by a *different* effect, once zoneId lands) had a chance
  // to even start.
  const [isZoneLoading, setIsZoneLoading] = useState(true);
  const [isHomeLoading, setIsHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState(false);
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
   * API 1
   * Get zone from user's coordinates
   */
  const fetchZone = async (latitude: number, longitude: number) => {
    try {
      const response = await getZones({
        lat: latitude,
        long: longitude,
      });

      const zoneResponse = response.data;

      setZoneDetails(zoneResponse);

      if (zoneResponse?.exists && zoneResponse?.zoneId) {
        setZoneId(zoneResponse.zoneId);
        setCartZoneId(zoneResponse.zoneId);
        setZoneExists(true);
      } else {
        setZoneId(null);
        setCartZoneId(null);
        setZoneExists(false);
        setHomeDetails(null);
      }
    } catch (error) {
      console.error("Error fetching zone:", error);

      setZoneId(null);
      setCartZoneId(null);
      setZoneExists(false);
      setHomeDetails(null);
    }
  };

  /*
   * API 2
   * Get home details using zoneId
   */
  const fetchHomeDetails = async (id: string) => {
    try {
      setIsHomeLoading(true);
      setHomeError(false);

      const response = await getHomeDetails(id);

      setHomeDetails(response.data);
    } catch (error) {
      console.error("Error fetching home details:", error);

      setHomeDetails(null);
      setHomeError(true);
    } finally {
      setIsHomeLoading(false);
    }
  };

  /*
   * Resolve which zone to load services for. Checks CartContext's persisted
   * location first (localStorage, read on mount — see CartContext) and, if
   * one was already saved there, uses its hardcoded coordinates directly.
   * Only when nothing was saved does this ask the browser for geolocation,
   * and only when that also fails does it show the "pick your location"
   * modal — so a returning visitor with a saved location never sees a
   * geolocation prompt or the picker at all.
   *
   * Waiting on isLocationHydrated matters: CartContext's own localStorage
   * read happens in an effect too, one tick after this component mounts.
   * Acting before it resolves would mean reading isLocationManuallySelected/
   * locationCoords while they're still at their pre-hydration defaults —
   * i.e. always falling through to geolocation (and flashing the modal on
   * denial) even when a location was already known.
   */
  useEffect(() => {
    if (!isLocationHydrated) return;

    if (isLocationManuallySelected && locationCoords) {
      setShowLocationModal(false);
      setIsZoneLoading(true);
      void fetchZone(locationCoords.lat, locationCoords.lon).finally(() => {
        setIsZoneLoading(false);
      });
      return;
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported.");

      setShowLocationModal(true);
      setIsZoneLoading(false);

      return;
    }

    setIsZoneLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        await fetchZone(latitude, longitude);

        setIsZoneLoading(false);
      },

      (error) => {
        console.error("Geolocation error:", error);

        setShowLocationModal(true);
        setIsZoneLoading(false);
      },
    );
  }, [isLocationHydrated, isLocationManuallySelected, locationCoords]);

  /*
   * Once zoneId is available,
   * fetch home details.
   */
  useEffect(() => {
    if (!zoneId) return;

    fetchHomeDetails(zoneId);
  }, [zoneId]);

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
            onClick={() => void fetchHomeDetails(zoneId)}
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

          {homeDetails.categories.map((category) => {
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
              {highlightBanner && <WallPanel campaign={highlightBanner} category={category} />}
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
