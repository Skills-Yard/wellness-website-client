"use client";

import ServiceFaq from "@/components/home/faq-accordion";
import Header from "@/components/home/header";
import Inspotlight from "@/components/home/in-spotlight";
import LocationUnavailable from "@/components/home/location-unavailable";
import MassageServices from "@/components/home/massage";
import PhysioServices from "@/components/home/physiotherapy";
import WallPanel from "@/components/home/wall-panel";
import WallPanelTwo from "@/components/home/wall-panel-two";
import WellnessServices from "@/components/home/wellness";
import { useCart } from "@/context/CartContext";



export default function Home() {
  const { isLocationSupported } = useCart();

  return (
    <main className="w-full overflow-x-hidden flex-1 flex flex-col">
      {!isLocationSupported ? (
        <LocationUnavailable />
      ) : (
        <>
          <Header />
          <Inspotlight />
          <MassageServices />
          <WallPanel />
          <WellnessServices />
          <WallPanelTwo />
          <PhysioServices />
          <ServiceFaq />
        </>
      )}
     
    </main>
  );
}
