import type {
  ImageCardItem,
  ReviewItem,
  ServiceAddOn,
  ServiceDuration,
  ServicePackage,
} from "@/src/types/serviceDetailTypes";
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
  // The service's own durations/packages/add-ons, embedded as-is from the
  // raw ServiceItem (see GET /catalog/service-items) — kept on the card
  // itself, not just re-derived in the popup, since add-ons in particular
  // come back with no serviceItemId/serviceId of their own to re-match
  // against (unlike durations/packages), so re-deriving them by filtering
  // a flattened cross-service list (see spa-booking/index.tsx's old
  // belongsToService-based selectedServiceDetails) silently drops every
  // add-on. Reading them straight off the service avoids that entirely,
  // and lets outer preview cards render AddonIcons the same way the inner
  // popup's Add-ons section does.
  durations?: ServiceDuration[];
  packages?: ServicePackage[];
  addOns?: ServiceAddOn[];
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
