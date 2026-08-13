import type { ImageCardItem, ReviewItem } from "@/src/types/serviceDetailTypes";
import type { ServiceFaq } from "@/src/types/serviceItemTypes";

export interface DynamicService {
  id: string;
  title: string;
  price: string;
  originalPrice?: string | null;
  duration: string;
  media: string;
  rating: string | number;
  reviews: string | number;
  /** Real bookings count — distinct from reviews (the rating count). See
   *  ServiceItem.totalBookingsCount in serviceItemTypes.ts. */
  totalBookingsCount?: number;
  category: string;
  subCategoryId?: string;
  tag?: string;
  isSpotlight?: boolean;
  features?: string[];
  // Passed straight through from the raw ServiceItem API response (see
  // ServiceItem in serviceItemTypes.ts) — same shapes, same "no admin editor,
  // don't map" caveat.
  overview?: { text?: string; gallery?: ImageCardItem[] };
  procedureSteps?: ImageCardItem[];
  itemsUsed?: ImageCardItem[];
  skilledPros?: string[];
  prePostCare?: string[];
  disclaimer?: string[];
  whatsIncluded?: ImageCardItem[];
  faqs?: ServiceFaq[];
  trustedLoved?: string[];
  customReviews?: ReviewItem[];
}

export interface Category {
  id: string;
  name: string;
  iconKey?: string | null;
}

export interface DetailData {
  title: string;
  rating: string | number; 
  reviews: string | number;  
  media: string;
  video: string;
  categories: Category[];
  services: DynamicService[];
  steps?: unknown[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  duration: string;
}
