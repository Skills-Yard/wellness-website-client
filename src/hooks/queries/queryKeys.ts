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
  categories: () => ["categories"] as const,
  category: (categoryId: string) => ["category", categoryId] as const,
  subCategories: (categoryId: string) => ["subCategories", categoryId] as const,
  serviceItems: (subCategoryId: string, zoneId: string) =>
    ["serviceItems", subCategoryId, zoneId] as const,
  homeDetails: (zoneId: string) => ["homeDetails", zoneId] as const,
  campaigns: (categoryId: string, zoneId: string) =>
    ["campaigns", categoryId, zoneId] as const,
  addresses: () => ["addresses"] as const,
};
