import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useHomeDetails } from "./useHomeDetails";
import { getSubCategoriesByCategoryId } from "@/src/services/categoryApi";
import { HomeCategory } from "@/src/types/serviceTypes";
import { queryKeys } from "./queryKeys";

/** One globally searchable service — `/catalog/home` already gives us every
 *  active service item's id/name/slug/subCategoryId for the zone (see
 *  HomeServiceItem), so building the search index costs no per-service
 *  fetches; the only extra requests are one per category to resolve each
 *  service's subCategoryId back to its parent category (needed to link to
 *  `/detail/{categorySlug}?id=...`, the same deep-link shape used by
 *  in-spotlight/wall-panel/category-services elsewhere in the app). */
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
 * Builds the flattened, searchable service list for one zone.
 *
 * Stays disabled (via `options.enabled`) until the caller actually needs it
 * — e.g. the navbar only turns this on once the search field is first
 * focused, so a visitor who never searches never triggers the extra
 * category → sub-category requests. Every request this hook makes is keyed
 * the same way as the equivalent home-page fetches (queryKeys.homeDetails /
 * queryKeys.subCategories), so if the catalog is already warm in the React
 * Query cache — e.g. the home page has rendered — this resolves instantly
 * from cache instead of refetching.
 */
export function useServiceSearchIndex(
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled ?? true) && !!zoneId;

  const { data: homeDetails, isLoading: isHomeLoading } = useHomeDetails(zoneId, {
    enabled,
  });

  const categories = useMemo<HomeCategory[]>(
    () => homeDetails?.categories ?? [],
    [homeDetails],
  );

  const subCategoryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: queryKeys.subCategories(category.id, zoneId ?? ""),
      queryFn: () =>
        getSubCategoriesByCategoryId(category.id, zoneId as string).then(
          (r) => r.data ?? [],
        ),
      enabled: enabled && categories.length > 0,
    })),
    combine: (results) => {
      const isLoading = results.some((result) => result.isLoading);
      // subCategoryId -> owning category, so each flattened service item
      // below can resolve its `/detail/{categorySlug}` link.
      const categoryBySubCategoryId = new Map<string, HomeCategory>();
      results.forEach((result, index) => {
        const category = categories[index];
        (result.data ?? []).forEach((subCategory) => {
          categoryBySubCategoryId.set(subCategory.id, category);
        });
      });
      return { categoryBySubCategoryId, isLoading };
    },
  });

  const items = useMemo<SearchableService[]>(() => {
    const services = homeDetails?.serviceItems ?? [];
    return services.flatMap((service) => {
      const category = subCategoryQueries.categoryBySubCategoryId.get(
        service.subCategoryId,
      );
      // A service whose sub-category hasn't resolved yet (still loading, or
      // genuinely orphaned) has nowhere to link to — leave it out rather
      // than showing a dead search result.
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
  }, [homeDetails, subCategoryQueries.categoryBySubCategoryId]);

  return {
    items,
    isLoading: enabled && (isHomeLoading || subCategoryQueries.isLoading),
  };
}
