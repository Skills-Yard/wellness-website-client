// Pure formatting/shape helpers for a service card, shared by the home
// page's category rows (components/home/category-services) and the desktop
// landing page's "Most Popular Services" row (components/home/landing/
// popular-services). Extracted verbatim from category-services so both
// rows render an identical card. No React here — types only.
import type { ServiceItem } from "@/src/types/serviceItemTypes";
import type { DynamicService } from "@/src/utils/types/spabooking";

export const formatPrice = (price: ServiceItem["price"] | null) => {
  if (typeof price === "number") return `₹${price.toLocaleString("en-IN")}`;
  return price ?? "₹0";
};

export const formatRating = (
  rating: ServiceItem["averageRating"] | ServiceItem["rating"],
) => {
  if (typeof rating === "number") return rating.toFixed(1);
  return rating ?? "0";
};

// Real bookings count (distinct from totalReviews, the rating count) —
// always shown, defaulting to 0 whether it's genuinely 0 or just missing.
// Compact past 1000 ("12k+ bookings") to match the card's reference design;
// below that the raw count reads fine on its own ("5 bookings").
export const formatBookingsLabel = (
  bookings: ServiceItem["totalBookingsCount"],
) => {
  const count = bookings ?? 0;
  return count >= 1000
    ? `${Math.floor(count / 1000)}k+ bookings`
    : `${count} bookings`;
};

export const getLowestDurationPrice = (service: ServiceItem) => {
  const prices = (service.durations ?? [])
    .map((duration) => duration.price)
    .filter(
      (price): price is string | number =>
        price !== null && price !== undefined && price !== "",
    )
    .map(Number)
    .filter((price) => Number.isFinite(price));

  return prices.length > 0 ? Math.min(...prices) : service.price;
};

// The catalog API already embeds each service item's own durations/packages/
// addOns (see getServiceItems) — no extra fetch needed to open the detail
// popup right here, just reshape the one ServiceItem SubDetailPopUp expects.
export const toDynamicService = (
  service: ServiceItem,
  categoryName: string,
): DynamicService => ({
  id: service.id,
  title: service.cardTitle ?? service.title ?? service.name ?? "Wellness service",
  price: formatPrice(getLowestDurationPrice(service)),
  originalPrice:
    service.originalPrice === null || service.originalPrice === undefined
      ? null
      : formatPrice(service.originalPrice),
  duration: service.duration ?? "",
  media: service.media ?? service.thumbnailKey ?? "/images/hero-fallback.jpg",
  rating: service.averageRating ?? service.rating ?? "—",
  reviews: service.totalReviews ?? service.reviews ?? 0,
  totalBookingsCount: service.totalBookingsCount ?? 0,
  category: categoryName,
  subCategoryId: service.subCategoryId,
  tag: service.tag,
  isSpotlight: service.isSpotlight,
  features: service.features ?? [],
  overview: service.overview,
  procedureSteps: service.procedureSteps,
  itemsUsed: service.itemsUsed,
  skilledPros: service.skilledPros,
  prePostCare: service.prePostCare,
  disclaimer: service.disclaimer,
  whatsIncluded: service.whatsIncluded,
  faqs: service.faqs,
  trustedLoved: service.trustedLoved,
  customReviews: service.customReviews,
});
