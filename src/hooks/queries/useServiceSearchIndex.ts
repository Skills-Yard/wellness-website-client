import { useMemo } from "react";
import { useHomeDetails } from "./useHomeDetails";
import { HomeCategory } from "@/src/types/serviceTypes";

/** One globally searchable service. `/catalog/home` already returns every
 *  active service item for the zone *with its `categoryId`* (see
 *  HomeServiceItem), so the search index is a pure reshape of that one
 *  response — no per-service or per-category fetches. */
export type SearchableService = {
  id: string;
  name: string;
  slug: string;
  thumbnailKey?: string | null;
  subCategoryId: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
};

/**
 * Builds the flattened, searchable service list for one zone from the
 * `/catalog/home` response.
 *
 * Stays disabled (via `options.enabled`) until the caller actually needs it
 * — e.g. the navbar only turns this on once the search field is first
 * focused. It's keyed the same way as the home page's own fetch
 * (queryKeys.homeDetails), so if the home page has already rendered this
 * resolves instantly from cache instead of refetching.
 */
export function useServiceSearchIndex(
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled ?? true) && !!zoneId;

  const { data: homeDetails, isLoading: isHomeLoading } = useHomeDetails(zoneId, {
    enabled,
  });

  const categoryById = useMemo(() => {
    const map = new Map<string, HomeCategory>();
    (homeDetails?.categories ?? []).forEach((category) => {
      map.set(category.id, category);
    });
    return map;
  }, [homeDetails]);

  const items = useMemo<SearchableService[]>(() => {
    const services = homeDetails?.serviceItems ?? [];
    return services.flatMap((service) => {
      const category = categoryById.get(service.categoryId);
      // A service whose category didn't come back (genuinely orphaned) has
      // nowhere to link to — leave it out rather than showing a dead result.
      if (!category) return [];
      return [
        {
          id: service.id,
          name: service.name,
          slug: service.slug,
          thumbnailKey: service.thumbnailKey,
          subCategoryId: service.subCategoryId,
          categoryId: category.id,
          categorySlug: category.slug,
          categoryName: category.name,
        },
      ];
    });
  }, [homeDetails, categoryById]);

  return {
    items,
    isLoading: enabled && isHomeLoading,
  };
}
