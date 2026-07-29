"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/src/context/CartContext";

import ServiceFaq from "@/src/components/home/faq-accordion";
import Header from "@/src/components/home/header";
import Inspotlight from "@/src/components/home/in-spotlight";
import MassageServices from "@/src/components/home/massage";
import PhysioServices from "@/src/components/home/physiotherapy";
import WallPanel from "@/src/components/home/wall-panel";
import WallPanelTwo from "@/src/components/home/wall-panel-two";
import WellnessServices from "@/src/components/home/wellness";
import MobileHome from "@/src/components/home/mobile";
import LocationUnavailableModal from "@/src/components/home/location-unavailable";

import { getZones } from "@/src/services/zoneApi";
import { getHomeDetails } from "@/src/services/homeApi";
import { HomeDetails, ZoneDetails } from "@/src/types/serviceTypes";

export default function Home() {
  const { setLocation, setZoneId: setCartZoneId } = useCart();

  const [zoneDetails, setZoneDetails] = useState<ZoneDetails | null>(null);
  const [homeDetails, setHomeDetails] = useState<HomeDetails | null>(null);

  const [zoneId, setZoneId] = useState<string | null>(null);
  const [zoneExists, setZoneExists] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

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

        // If your CartContext needs location/zone
        setLocation(zoneResponse.zoneId);
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
      const response = await getHomeDetails(id);

      setHomeDetails(response.data);
    } catch (error) {
      console.error("Error fetching home details:", error);

      setHomeDetails(null);
    }
  };

  /*
   * Get user's current location
   */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported.");

      setShowLocationModal(true);
      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        await fetchZone(latitude, longitude);

        setLoading(false);
      },

      (error) => {
        console.error("Geolocation error:", error);

        setShowLocationModal(true);
        setLoading(false);
      },
    );
  }, []);

  /*
   * Once zoneId is available,
   * fetch home details.
   */
  useEffect(() => {
    if (!zoneId) return;

    fetchHomeDetails(zoneId);
  }, [zoneId]);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-medium">
          Checking services in your location...
        </p>
      </main>
    );
  }

  /*
   * No Zone Available
   */
  if (!zoneExists || !zoneId || !homeDetails) {
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

  return (
    <>
      <main className="w-full overflow-x-hidden flex-1 flex flex-col" id="top">
        {/* ───────── DESKTOP ───────── */}

        <div className="hidden md:block">
          <Header homeDetails={homeDetails} />

          <Inspotlight />

          <WellnessServices />

          <WallPanel />

          <MassageServices />

          <WallPanelTwo />

          <PhysioServices />

          <ServiceFaq />
        </div>

        {/* ───────── MOBILE ───────── */}

        <div className="block md:hidden">
          <MobileHome />
        </div>
      </main>

      <LocationUnavailableModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  );
}
