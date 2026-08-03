"use client";

import { useCart } from "@/src/context/CartContext";

import ServiceFaq from "@/src/components/home/faq-accordion";
import Inspotlight from "@/src/components/home/in-spotlight";
import CategoryServices from "@/src/components/home/category-services";
import WallPanel from "../wall-panel";
import WallPanelTwo from "../wall-panel-two";
import { useMobileHome } from "./Usemobilehome";
import MobileHeader from "./Mobileheader";
import CategoryGrid from "./Categorygrid";
import BottomNav from "./Bottomnav";
import HeroSlider from "./HeroSlider";
import VelloraPromiseCard from "./vellora";
import { HomeDetails } from "@/src/types/serviceTypes";

interface MobileHomeProps {
  homeDetails: HomeDetails;
  zoneId: string;
}

export default function MobileHome({ homeDetails, zoneId }: MobileHomeProps) {
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
  } = useMobileHome(homeDetails.serviceItems);

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

      <HeroSlider
        campaigns={homeDetails.promotionalCampaigns}
        categories={homeDetails.categories}
      />

      <CategoryGrid categories={homeDetails.categories} />

      <div className="space-y-2 mt-4">
        <Inspotlight
          campaigns={homeDetails.promotionalCampaigns}
          categories={homeDetails.categories}
        />
        {homeDetails.categories.map((category, index) => (
          <div key={category.id}>
            {index === 1 && <WallPanel />}
            {index === 2 && <WallPanelTwo />}
            <CategoryServices category={category} zoneId={zoneId} />
          </div>
        ))}
        <ServiceFaq />
      </div>
      <VelloraPromiseCard />

      <BottomNav activeTab={activeTab} onTabClick={scrollToSection} />
    </div>
  );
}
