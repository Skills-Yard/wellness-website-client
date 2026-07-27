// Shared service types for the application
export type ZonesQuery = {
  lat: number;
  long: number;
};

export type ApiResponse<T> = {
  data: T;
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
  homeBannerKey?: string | null;
};

export type HomeCampaign = {
  id: string;
  title: string;
  subtitle?: string;
  bannerKey?: string | null;
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
