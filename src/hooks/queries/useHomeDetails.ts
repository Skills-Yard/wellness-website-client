import { useQuery } from "@tanstack/react-query";
import { getHomeDetails } from "@/src/services/homeApi";
import { queryKeys } from "./queryKeys";

export function useHomeDetails(
  zoneId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.homeDetails(zoneId ?? ""),
    queryFn: () => getHomeDetails(zoneId as string).then((r) => r.data),
    enabled: (options?.enabled ?? true) && !!zoneId,
  });
}
