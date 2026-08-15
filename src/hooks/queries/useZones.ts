import { useQuery } from "@tanstack/react-query";
import { getZones } from "@/src/services/zoneApi";
import { queryKeys } from "./queryKeys";

/** Resolves the service zone for a lat/lon. `enabled` gates it behind
 *  having coordinates at all (see CartContext, the only caller — zone
 *  resolution is centralized there so it runs once app-wide). */
export function useZones(
  lat: number | null,
  lon: number | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.zones(lat ?? 0, lon ?? 0),
    queryFn: () => getZones({ lat: lat as number, long: lon as number }).then((r) => r.data),
    enabled: (options?.enabled ?? true) && lat !== null && lon !== null,
  });
}
