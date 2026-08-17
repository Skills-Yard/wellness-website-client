import { useQuery } from "@tanstack/react-query";
import { getSubCategoriesByCategoryId } from "@/src/services/categoryApi";
import { queryKeys } from "./queryKeys";

/** Sub-categories for one category — shared cache entry keyed by
 *  categoryId, so the home page's CategoryServices and the detail page's
 *  SpaBookingLayout hit the same cache for the same category instead of
 *  each fetching it independently. */
export function useSubCategories(
  categoryId: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.subCategories(categoryId ?? ""),
    queryFn: () => getSubCategoriesByCategoryId(categoryId as string).then((r) => r.data ?? []),
    enabled: (options?.enabled ?? true) && !!categoryId,
  });
}
