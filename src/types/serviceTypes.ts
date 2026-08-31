// Shared service types for the application
import type { ServiceItem } from "./serviceItemTypes";

export type ZonesQuery = {
  lat: number;
  long: number;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginationMeta;
};

export type ZoneDetails = {
  exists: boolean;
  zoneId?: string;
};

export type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  title?: string;
  subtitle?: string;
  iconKey?: string | null;
  homeBannerKey?: string | null;
  homeBannerType?: CampaignMediaType | null;
  /** Marketing copy for a full-bleed banner (e.g. the suite-selection
   *  screen's hero) — distinct from title/subtitle, which are the plain
   *  category name/tagline used elsewhere (home page grid, headings). */
  sectionHeading?: string | null;
  sectionSubheading?: string | null;
};

export type CampaignType =
  | "SPOTLIGHT"
  | "HIGHLIGHT_VIDEO"
  | "HIGHLIGHT_BANNER"
  | "CAROUSEL_VIDEO"
  | "CAROUSEL_BANNER";
export type CampaignTargetType = "GLOBAL" | "CATEGORY" | "SUBCATEGORY";
export type CampaignMediaType = "IMAGE" | "VIDEO";

export type HomeCampaign = {
  id: string;
  type: CampaignType;
  targetType: CampaignTargetType;
  categoryId?: string | null;
  subCategoryId?: string | null;
  serviceItemId?: string | null;
  title: string;
  subtitle?: string;
  mediaType: CampaignMediaType;
  s3Key?: string | null;
  cdnUrl?: string | null;
  ctaText?: string | null;
  ctaDeeplink?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
};

/**
 * A service item as embedded in the `/catalog/home` response. This is the
 * full catalog shape (durations, packages, add-ons, content columns —
 * everything `/catalog/service-items` returns), so the home page renders
 * its category rows and opens the service detail popup straight from this
 * one response. `categoryId` is denormalized on by the backend so the flat
 * list can be grouped under its category without any extra fetch.
 */
export type HomeServiceItem = ServiceItem & {
  categoryId: string;
  name: string;
  slug: string;
};

export type HomeDetails = {
  promotionalCampaigns: HomeCampaign[];
  categories: HomeCategory[];
  serviceItems: HomeServiceItem[];
};
