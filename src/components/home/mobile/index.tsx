"use client";

import { useCallback, useState } from "react";
import { useCart } from "@/src/context/CartContext";

import ServiceFaq, { CategoryFaqGroup } from "@/src/components/home/faq-accordion";
import Inspotlight from "@/src/components/home/in-spotlight";
import PromoCarousel from "@/src/components/home/promo-carousel";
import CategoryServices from "@/src/components/home/category-services";
import WallPanel from "../wall-panel";
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
  const [categoryFaqs, setCategoryFaqs] = useState<CategoryFaqGroup[]>([]);

  const handleFaqsChange = useCallback(
    (category: CategoryFaqGroup["category"], faqs: CategoryFaqGroup["faqs"]) => {
      setCategoryFaqs((current) => {
        const withoutCategory = current.filter((group) => group.category.id !== category.id);
        return faqs.length > 0 ? [...withoutCategory, { category, faqs }] : withoutCategory;
      });
    },
    [],
  );

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
        <PromoCarousel
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
      <VelloraPromiseCard />

      <BottomNav activeTab={activeTab} onTabClick={scrollToSection} />
    </div>
  );
}
