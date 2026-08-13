import type {
  ServiceDuration,
  ServicePackage,
  ServiceAddOn,
  ImageCardItem,
  ReviewItem,
} from "./serviceDetailTypes";

export type ServiceItemsQuery = {
  isActive: boolean;
  subCategoryId: string;
  zoneId: string;
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
  cardTitle?: string;
  cardSubtitle?: string;
  price?: string | number;
  originalPrice?: string | number | null;
  duration?: string;
  durationId?: string;
  serviceDurationId?: string;
  thumbnailKey?: string | null;
  media?: string | null;
  /** Real field names on the catalog API response. `rating`/`reviews` never
   *  actually come back from the backend — kept only as a fallback for any
   *  other caller that might still pass pre-mapped data through this type. */
  averageRating?: number;
  totalReviews?: number;
  rating?: string | number;
  reviews?: string | number;
  /** Real bookings count — distinct from totalReviews (the rating count). */
  totalBookingsCount?: number;
  tag?: string;
  isSpotlight?: boolean;
  features?: string[];
  durations?: ServiceDuration[];
  packages?: ServicePackage[];
  addOns?: ServiceAddOn[];
  faqs?: ServiceFaq[];
  // JSON content columns on ServiceItem (see wellness-backend's catalog.prisma)
  // that the admin panel actually edits. A few more columns exist on the model
  // (freeGifts, includedItems, ambienceItems, hygieneEssentials, careItems,
  // thingsToKnow, beforeYouBook) with no admin editor — intentionally left
  // unmapped rather than guessing a shape/UI for content nothing populates.
  overview?: { text?: string; gallery?: ImageCardItem[] };
  procedureSteps?: ImageCardItem[];
  itemsUsed?: ImageCardItem[];
  skilledPros?: string[];
  prePostCare?: string[];
  disclaimer?: string[];
  whatsIncluded?: ImageCardItem[];
  trustedLoved?: string[];
  customReviews?: ReviewItem[];
};
