import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/src/services/categoryApi";
import { queryKeys } from "./queryKeys";

/** The nav-level category list — not zone-dependent, fetched once and
 *  shared app-wide via CategoryContext. */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => getCategories().then((r) => r.data ?? []),
  });
}
