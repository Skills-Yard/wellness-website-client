import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/src/services/categoryApi";
import { queryKeys } from "./queryKeys";

/** The nav-level category list, filtered to one zone — see categoryApi.ts
 *  for why this needs a zoneId despite once being treated as zone-
 *  independent. Fetched once and shared app-wide via CategoryContext, which
 *  supplies zoneId from CartContext. Disabled until a zone is resolved, same
 *  as useHomeDetails/useServiceItems. */
export function useCategories(zoneId: string | null) {
  return useQuery({
    queryKey: queryKeys.categories(zoneId ?? ""),
    queryFn: () => getCategories(zoneId as string).then((r) => r.data ?? []),
    enabled: !!zoneId,
  });
}
