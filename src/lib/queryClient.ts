import { QueryClient } from "@tanstack/react-query";

/**
 * Shared defaults for every query in the app. The catalog (categories,
 * sub-categories, service items, zones) doesn't change often, so a
 * multi-minute staleTime is what actually eliminates the duplicate
 * "See all" → detail page refetches, and setting a manual/geolocation
 * address zone (CartContext.setZoneId) invalidates it naturally since
 * zoneId is part of every catalog query's key.
 *
 * A factory, not a module-level singleton — instantiated once per app
 * inside Providers via useState so client state isn't shared across
 * requests/renders.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
