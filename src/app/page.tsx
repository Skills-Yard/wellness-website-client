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

export default function Home() {
  const { isLocationSupported } = useCart();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
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
          <MassageServices />
          <WallPanel />
          <WellnessServices />
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