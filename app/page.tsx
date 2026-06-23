"use client";

import { useCart } from "@/context/CartContext";
import ServiceFaq from "@/components/home/faq-accordion";
import Header from "@/components/home/header";
import Inspotlight from "@/components/home/in-spotlight";
import LocationUnavailable from "@/components/home/location-unavailable";
import MassageServices from "@/components/home/massage";
import PhysioServices from "@/components/home/physiotherapy";
import WallPanel from "@/components/home/wall-panel";
import WallPanelTwo from "@/components/home/wall-panel-two";
import WellnessServices from "@/components/home/wellness";
import MobileHome from "@/components/home/mobile";

export default function Home() {
  const { isLocationSupported } = useCart();

  if (!isLocationSupported) {
    return <LocationUnavailable />;
  }

  return (
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
  );
}
