"use client";

import { useCart } from "@/context/CartContext";

import ServiceFaq from "@/components/home/faq-accordion";
import Inspotlight from "@/components/home/in-spotlight";
import MassageServices from "@/components/home/massage";
import WellnessServices from "@/components/home/wellness";
import PhysioServices from "@/components/home/physiotherapy";
import WallPanel from "../wall-panel";
import WallPanelTwo from "../wall-panel-two";
import { useMobileHome } from "./Usemobilehome";
import MobileHeader from "./Mobileheader";
import CategoryGrid from "./Categorygrid";
import BottomNav from "./Bottomnav";
import HeroSlider from "./HeroSlider";

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
    <div className="bg-stone-50/50 min-h-screen pb-24 relative">
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
        <MassageServices />
        <WallPanel />
        <WellnessServices />
        <WallPanelTwo />
        <PhysioServices />
        <ServiceFaq />
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabClick={scrollToSection}
      />
    </div>
  );
}