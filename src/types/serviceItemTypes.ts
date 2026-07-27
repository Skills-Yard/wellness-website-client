export type ServiceItemsQuery = {
  isActive: boolean;
  subCategoryId: string;
  zoneId: string;
};

/** Raw service item returned by the catalog API. */
export type ServiceItem = {
  id: string;
  subCategoryId: string;
  name?: string;
  title?: string;
  price?: string | number;
  originalPrice?: string | number | null;
  duration?: string;
  durationId?: string;
  serviceDurationId?: string;
  thumbnailKey?: string | null;
  media?: string | null;
  rating?: string | number;
  reviews?: string | number;
  tag?: string;
  isSpotlight?: boolean;
  features?: string[];
};
