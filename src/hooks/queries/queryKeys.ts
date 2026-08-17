/**
 * Centralized React Query key builders. Keeping these in one place is what
 * makes the same catalog request (e.g. sub-categories for a given category,
 * service items for a given sub-category + zone) resolve to the *same*
 * cache entry no matter which component asks for it — that's what lets a
 * "See all" click from the home page into its own detail page hit cache
 * instead of refetching identical data.
 *
 * Coordinates are rounded before being used in a key so that GPS jitter
 * between two reads of "the same spot" doesn't bust the cache.
 */
const roundCoord = (value: number) => Math.round(value * 1000) / 1000;

export const queryKeys = {
  zones: (lat: number, lon: number) =>
    ["zones", roundCoord(lat), roundCoord(lon)] as const,
  // Zone-scoped — see categoryApi.ts: /catalog/categories and friends are
  // @LocationRequired on the backend (FLEXIBLE mode, filtered by zone), not
  // the zone-independent lookups they were originally treated as. Keying by
  // zoneId means a stale/errored zoneless attempt (fired before CartContext
  // resolves one) never blocks the correctly-zoned refetch that follows.
  categories: (zoneId: string) => ["categories", zoneId] as const,
  category: (categoryId: string, zoneId: string) =>
    ["category", categoryId, zoneId] as const,
  subCategories: (categoryId: string, zoneId: string) =>
    ["subCategories", categoryId, zoneId] as const,
  serviceGenders: (categoryId: string) => ["serviceGenders", categoryId] as const,
  serviceSuites: (categoryId: string, zoneId: string) =>
    ["serviceSuites", categoryId, zoneId] as const,
  // genderId/suiteId default to "" so every existing caller (unfiltered
  // browse rows) keeps resolving to the same key shape/cache entry it
  // always has — only the category-select flow's filtered fetches
  // (spa-booking) actually pass them.
  serviceItems: (
    subCategoryId: string,
    zoneId: string,
    genderId = "",
    suiteId = "",
  ) => ["serviceItems", subCategoryId, zoneId, genderId, suiteId] as const,
  homeDetails: (zoneId: string) => ["homeDetails", zoneId] as const,
  campaigns: (categoryId: string, zoneId: string) =>
    ["campaigns", categoryId, zoneId] as const,
  addresses: () => ["addresses"] as const,
  notifications: () => ["notifications"] as const,
  unreadNotificationCount: () => ["notifications", "unread-count"] as const,
  bookings: () => ["bookings"] as const,
  booking: (id: string) => ["bookings", id] as const,
  me: () => ["me"] as const,
  notificationPreference: () => ["notification-preference"] as const,
  devices: () => ["devices"] as const,
};
