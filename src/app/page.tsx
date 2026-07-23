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
import { getZones } from "../services/zoneApi";

async function getZoneFromCoordinates(latitude: number, longitude: number) {
  try {
    const response = await getZones({
      lat: latitude,
      long: longitude,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.zone; // Assuming the API returns { zone: "ZoneName" }
  } catch (error) {
    console.error("Error fetching zone:", error);
    return null;
  }
}

export default function Home() {
  const { isLocationSupported, setLocation } = useCart();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    // Attempt to get geolocation and set the zone
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const zone = await getZoneFromCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
        if (zone) {
          setLocation(zone);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isHydrated && !isLocationSupported) {
      setShowLocationModal(true);
    }
  }, [isLocationSupported, isHydrated]);

  return (
    <>
      <main className="w-full overflow-x-hidden flex-1 flex flex-col" id="top">
        {/* ── DESKTOP VIEW ── */}
        <div className="hidden md:block">
          <Header />
          <Inspotlight />
          <WellnessServices />
          <WallPanel />
          <MassageServices />
          <WallPanelTwo />
          <PhysioServices />
          <ServiceFaq />
        </div>

        {/* ── MOBILE VIEW ── */}
        <div className="block md:hidden">
          <MobileHome />
        </div>
      </main>

      {/* Location Selector Modal - Shows when geolocation fails */}
      {isHydrated && (
        <LocationUnavailableModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </>
  );
}
