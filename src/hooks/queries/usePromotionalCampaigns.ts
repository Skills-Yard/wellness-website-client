import { useQuery } from "@tanstack/react-query";
import { getPromotionalCampaigns } from "@/src/services/campaignApi";
import { queryKeys } from "./queryKeys";

export function usePromotionalCampaigns(
  { categoryId, zoneId }: { categoryId: string | undefined; zoneId: string | null | undefined },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.campaigns(categoryId ?? "", zoneId ?? ""),
    queryFn: () =>
      getPromotionalCampaigns({ categoryId, zoneId: zoneId ?? undefined }).then(
        (r) => r.data ?? [],
      ),
    enabled: (options?.enabled ?? true) && !!categoryId && !!zoneId,
  });
}
