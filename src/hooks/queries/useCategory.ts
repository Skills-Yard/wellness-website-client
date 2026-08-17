import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "@/src/services/categoryApi";
import { queryKeys } from "./queryKeys";

/** One category's full details, reactively, filtered to one zone — shares
 *  its cache entry with CategoryContext.loadCategory's imperative
 *  queryClient.fetchQuery (same queryKey), so whichever resolves it first,
 *  the other reuses the result. */
export function useCategory(
  categoryId: string | undefined,
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.category(categoryId ?? "", zoneId ?? ""),
    queryFn: () =>
      getCategoryById(categoryId as string, zoneId as string).then((r) => r.data),
    enabled: (options?.enabled ?? true) && !!categoryId && !!zoneId,
  });
}
