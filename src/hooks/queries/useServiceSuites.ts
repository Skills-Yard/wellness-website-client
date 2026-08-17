import { useQuery } from "@tanstack/react-query";
import { getServiceSuitesByCategoryId } from "@/src/services/serviceSuiteApi";
import { queryKeys } from "./queryKeys";

/** Suites available for one category in one zone — second step of the
 *  category-select flow. An empty array means this category has no suite
 *  step in this zone (see ZoneSuiteConfig); the caller should skip
 *  straight to the category's detail page instead. */
export function useServiceSuites(
  categoryId: string | undefined,
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.serviceSuites(categoryId ?? "", zoneId ?? ""),
    queryFn: () =>
      getServiceSuitesByCategoryId(categoryId as string, zoneId as string).then(
        (r) => r.data ?? [],
      ),
    enabled: (options?.enabled ?? true) && !!categoryId && !!zoneId,
  });
}
