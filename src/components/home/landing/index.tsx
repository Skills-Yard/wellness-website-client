"use client";

import type { HomeCampaign, HomeDetails } from "@/src/types/serviceTypes";
import { useServicesByCategory } from "@/src/hooks/useServicesByCategory";
import Hero from "./hero";
import WhyChooseUs from "./why-choose-us";
import OurServices from "./our-services";
import FirstServiceOffer from "./first-service-offer";
import ExpertCare from "./expert-care";
import PopularServices from "./popular-services";
import HowItWorks from "./how-it-works";
import Testimonials from "./testimonials";

// Desktop-only marketing landing page (Figma "Home page"). Mounted from
// app/page.tsx inside `hidden md:block`; the mobile tree (MobileHome) is
// untouched. Everything is bound to `homeDetails`: the hero to the
// carousel campaigns, the offer band to the SPOTLIGHT campaigns, then one
// Expert Care panel + one "Most Popular" row per category (Expert Care
// fronted by that category's HIGHLIGHT campaign, à la mobile's WallPanel).
type DesktopLandingProps = {
  homeDetails: HomeDetails;
};

// The category's active HIGHLIGHT campaign, if any (same filter mobile's
// MobileHome uses for its per-category WallPanel).
const highlightForCategory = (
  campaigns: HomeCampaign[],
  categoryId: string,
): HomeCampaign | undefined =>
  campaigns
    .filter(
      (campaign) =>
        (campaign.type === "HIGHLIGHT_BANNER" ||
          campaign.type === "HIGHLIGHT_VIDEO") &&
        campaign.categoryId === categoryId &&
        campaign.isActive !== false,
    )
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))[0];

export default function DesktopLanding({ homeDetails }: DesktopLandingProps) {
  const { promotionalCampaigns, categories, serviceItems } = homeDetails;
  const servicesForCategory = useServicesByCategory(homeDetails);

  return (
    <>
      <Hero
        campaigns={promotionalCampaigns}
        categories={categories}
        services={serviceItems}
      />
      <WhyChooseUs services={serviceItems} />
      <OurServices categories={categories} />
      <FirstServiceOffer campaigns={promotionalCampaigns} categories={categories} />

      {categories.map((category, index) => (
        <div key={category.id}>
          <ExpertCare
            category={category}
            categories={categories}
            campaign={highlightForCategory(promotionalCampaigns, category.id)}
            reverse={index % 2 === 1}
            sectionId={index === 0 ? "expert-care" : undefined}
          />
          <PopularServices
            category={category}
            services={servicesForCategory(category.id)}
            sectionId={index === 0 ? "popular-services" : undefined}
          />
        </div>
      ))}

      <HowItWorks />
      <Testimonials services={serviceItems} />
    </>
  );
}
