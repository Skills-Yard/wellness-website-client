// Shared service types for the application
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

export type HomeServiceItem = {
  id: string;
  subCategoryId: string;
  name: string;
  slug: string;
  thumbnailKey?: string | null;
};

export type HomeDetails = {
  promotionalCampaigns: HomeCampaign[];
  categories: HomeCategory[];
  serviceItems: HomeServiceItem[];
};
