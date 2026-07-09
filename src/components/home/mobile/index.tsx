"use client";

import { useCart } from "@/src/context/CartContext";

import ServiceFaq from "@/src/components/home/faq-accordion";
import Inspotlight from "@/src/components/home/in-spotlight";
import MassageServices from "@/src/components/home/massage";
import WellnessServices from "@/src/components/home/wellness";
import PhysioServices from "@/src/components/home/physiotherapy";
import WallPanel from "../wall-panel";
import WallPanelTwo from "../wall-panel-two";
import { useMobileHome } from "./Usemobilehome";
import MobileHeader from "./Mobileheader";
import CategoryGrid from "./Categorygrid";
import BottomNav from "./Bottomnav";
import HeroSlider from "./HeroSlider";
import Image from "next/image";
import VelloraPromiseCard from "./vellora";

export default function MobileHome() {
  const { location, setLocation, cartCount, setIsCartOpen } = useCart();

  const {
    searchQuery,
    setSearchQuery,
    searchFocused,
    setSearchFocused,
    activeTab,
    isMounted,
    headerScrolled,
    scrollToSection,
    filteredSuggestions,
    handleSuggestionClick,
  } = useMobileHome();

  return (
    <div className="bg-stone-50/50 min-h-screen">
      <MobileHeader
        location={location}
        setLocation={setLocation}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        isMounted={isMounted}
        headerScrolled={headerScrolled}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        filteredSuggestions={filteredSuggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      <HeroSlider />

      <CategoryGrid onCategoryClick={scrollToSection} />

      <div className="space-y-2 mt-4">
        <Inspotlight />
        <WallPanel />
        <WellnessServices />
        <div className="relative my-8 w-[90%]  mx-auto overflow-hidden h-48 rounded-xl hidden max-sm:flex">
          <Image
            src={"/images/featured-massage.png"}
            alt="featured-massage"
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <MassageServices />
        <WallPanelTwo />
        <div className="relative my-8 w-[90%]  mx-auto overflow-hidden h-48 rounded-xl hidden max-sm:flex">
          <Image
            src={"/images/self-care.jpg"}
            alt="featured-massage"
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <PhysioServices />
        <ServiceFaq />
      </div>
      <VelloraPromiseCard />

      <BottomNav activeTab={activeTab} onTabClick={scrollToSection} />
    </div>
  );
}
