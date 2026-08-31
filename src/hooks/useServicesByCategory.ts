import { useMemo } from "react";
import { HomeDetails, HomeServiceItem } from "@/src/types/serviceTypes";

// Shared, referentially-stable empty result — a category with no items
// still hands its row a stable prop, so nothing downstream (memos, the
// onFaqsChange effect) re-fires just because the array identity changed.
const EMPTY: HomeServiceItem[] = [];

/**
 * Groups a `/catalog/home` response's flat `serviceItems` list by
 * `categoryId`. The home page fetches everything it needs in that one call
 * now — this is just the client-side reshape from "flat list" to "items per
 * category row", replacing the per-category sub-category + service-items
 * fetches CategoryServices used to make.
 */
export function useServicesByCategory(
  homeDetails: HomeDetails | null | undefined,
) {
  return useMemo(() => {
    const byCategoryId = new Map<string, HomeServiceItem[]>();
    for (const item of homeDetails?.serviceItems ?? []) {
      const list = byCategoryId.get(item.categoryId);
      if (list) list.push(item);
      else byCategoryId.set(item.categoryId, [item]);
    }
    return (categoryId: string): HomeServiceItem[] =>
      byCategoryId.get(categoryId) ?? EMPTY;
  }, [homeDetails]);
}
