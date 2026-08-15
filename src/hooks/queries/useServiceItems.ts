import { useQueries, useQuery } from "@tanstack/react-query";
import { getServiceItems } from "@/src/services/serviceItemApi";
import { ServiceItem } from "@/src/types/serviceItemTypes";
import { queryKeys } from "./queryKeys";

/** Active service items for one sub-category, in one zone. */
export function useServiceItems(
  subCategoryId: string | undefined,
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.serviceItems(subCategoryId ?? "", zoneId ?? ""),
    queryFn: () =>
      getServiceItems({
        isActive: true,
        subCategoryId: subCategoryId as string,
        zoneId: zoneId as string,
      }).then((r) => r.data ?? []),
    enabled: (options?.enabled ?? true) && !!subCategoryId && !!zoneId,
  });
}

/**
 * Fetches every given sub-category's service items in parallel, same as
 * the previous Promise.allSettled-based fetches in category-services and
 * spa-booking, but as N cached React Query entries keyed by
 * [subCategoryId, zoneId] — this is what lets the home page's category
 * row and its own "See all" detail page share a cache entry instead of
 * both re-fetching the same sub-category's services.
 *
 * Uses `combine` (not a plain .flatMap() over the raw results) so the
 * returned `services` array is structurally shared/referentially stable
 * across renders when nothing actually changed — building it with
 * .flatMap() outside of `combine` produces a brand new array every render,
 * which cascades into every memo/effect downstream that depends on
 * `services` (e.g. CategoryServices' categoryFaqs → its onFaqsChange
 * effect → the parent's setState) re-firing every render, an infinite
 * render loop in practice.
 */
export function useServiceItemsForSubCategories(
  subCategoryIds: string[],
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled ?? true) && !!zoneId;

  return useQueries({
    queries: subCategoryIds.map((subCategoryId) => ({
      queryKey: queryKeys.serviceItems(subCategoryId, zoneId ?? ""),
      queryFn: () =>
        getServiceItems({
          isActive: true,
          subCategoryId,
          zoneId: zoneId as string,
        }).then((r) => r.data ?? []),
      enabled,
    })),
    combine: (results) => {
      const isLoading = enabled && results.some((result) => result.isLoading);
      const successfulResults = results.filter((result) => result.isSuccess);
      const services: ServiceItem[] = successfulResults.flatMap(
        (result) => result.data ?? [],
      );
      // A single sub-category failing to load (e.g. no services in this
      // zone) shouldn't hide every sub-category that did load
      // successfully — only treat it as an error when every query failed.
      const isError =
        subCategoryIds.length > 0 &&
        results.length > 0 &&
        successfulResults.length === 0 &&
        results.every((result) => !result.isLoading);

      return { services, isLoading, isError };
    },
  });
}
