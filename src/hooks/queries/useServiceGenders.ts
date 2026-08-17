import { useQuery } from "@tanstack/react-query";
import { getServiceGendersByCategoryId } from "@/src/services/serviceGenderApi";
import { queryKeys } from "./queryKeys";

/** Active genders offered under one category — not zone-scoped. First step
 *  of the category-select flow (see CategorySelectModal). */
export function useServiceGenders(
  categoryId: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.serviceGenders(categoryId ?? ""),
    queryFn: () =>
      getServiceGendersByCategoryId(categoryId as string).then(
        (r) => r.data ?? [],
      ),
    enabled: (options?.enabled ?? true) && !!categoryId,
  });
}
