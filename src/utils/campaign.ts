import type {
  CampaignType,
  HomeCampaign,
  HomeCategory,
} from "@/src/types/serviceTypes";

// Resolve a campaign to a usable in-app href. A campaign tied to a
// category deep-links into that category's detail page (optionally a
// sub-category / service item); otherwise fall back to its ctaDeeplink,
// then "/". Mirrors the logic in mobile/HeroSlider + home/in-spotlight.
export const campaignHref = (
  campaign: HomeCampaign,
  categories: HomeCategory[],
): string => {
  const category = categories.find((item) => item.id === campaign.categoryId);
  if (category) {
    const params = new URLSearchParams({ categoryId: category.id });
    if (campaign.subCategoryId)
      params.set("subCategoryId", campaign.subCategoryId);
    if (campaign.serviceItemId) params.set("id", campaign.serviceItemId);
    return `/detail/${category.slug}?${params.toString()}`;
  }
  return campaign.ctaDeeplink?.startsWith("/") ? campaign.ctaDeeplink : "/";
};

// Active campaigns of the given type(s) that actually have media, in
// displayOrder. Same filter shape the mobile hero / in-spotlight use.
export const activeCampaigns = (
  campaigns: HomeCampaign[],
  types: CampaignType[],
): HomeCampaign[] =>
  campaigns
    .filter(
      (campaign) =>
        types.includes(campaign.type) &&
        campaign.isActive !== false &&
        !!campaign.cdnUrl,
    )
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
