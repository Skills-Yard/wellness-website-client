import { apiClient, fetchAllPaginated } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import { ServiceItem, ServiceItemsQuery } from "@/src/types/serviceItemTypes";

/** Fetches active services for one sub-category in the selected zone,
 *  optionally narrowed to one gender and/or suite (see the category-select
 *  flow — CategorySelectModal). The backend paginates this endpoint
 *  (20/page default), so this walks every page and returns the complete set
 *  — callers still expect "every matching service", not one page of them. */
export const getServiceItems = async ({
  isActive,
  subCategoryId,
  zoneId,
  genderId,
  suiteId,
}: ServiceItemsQuery): Promise<ApiResponse<ServiceItem[]>> => {
  const data = await fetchAllPaginated<ServiceItem>((page, limit) =>
    apiClient.get<ApiResponse<ServiceItem[]>>("/catalog/service-items", {
      params: { isActive, subCategoryId, genderId, suiteId, page, limit },
      headers: { "x-zone-id": zoneId },
    }),
  );
  return { data };
};
