import { useQuery } from "@tanstack/react-query";
import { getSubCategoriesByCategoryId } from "@/src/services/categoryApi";
import { queryKeys } from "./queryKeys";

/** Sub-categories for one category, in one zone — shared cache entry keyed
 *  by [categoryId, zoneId], so the home page's CategoryServices and the
 *  detail page's SpaBookingLayout hit the same cache for the same
 *  category+zone instead of each fetching it independently. */
export function useSubCategories(
  categoryId: string | undefined,
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.subCategories(categoryId ?? "", zoneId ?? ""),
    queryFn: () =>
      getSubCategoriesByCategoryId(categoryId as string, zoneId as string).then(
        (r) => r.data ?? [],
      ),
    enabled: (options?.enabled ?? true) && !!categoryId && !!zoneId,
  });
}
