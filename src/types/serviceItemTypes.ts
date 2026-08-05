export type ServiceItemsQuery = {
  isActive: boolean;
  subCategoryId: string;
  zoneId: string;
};

export type ServiceDuration = {
  id: string;
  serviceItemId: string;
  label?: string;
  durationMinutes?: number;
  price?: string | number | null;
  discountedPrice?: string | number | null;
  isDefault?: boolean;
  displayOrder?: number;
};

export type ServiceFaq = {
  id?: string | number;
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
};

export type HomeFaq = {
  id?: string | number;
  question: string;
  answer: string;
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
  durations?: ServiceDuration[];
  faqs?: ServiceFaq[];
};
