import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "@/src/services/categoryApi";
import { queryKeys } from "./queryKeys";

/** One category's full details, reactively — shares its cache entry with
 *  CategoryContext.loadCategory's imperative queryClient.fetchQuery (same
 *  queryKey), so whichever resolves it first, the other reuses the result. */
export function useCategory(
  categoryId: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.category(categoryId ?? ""),
    queryFn: () => getCategoryById(categoryId as string).then((r) => r.data),
    enabled: (options?.enabled ?? true) && !!categoryId,
  });
}
