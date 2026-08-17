import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import { ServiceItem, ServiceItemsQuery } from "@/src/types/serviceItemTypes";

/** Fetches active services for one sub-category in the selected zone,
 *  optionally narrowed to one gender and/or suite (see the category-select
 *  flow — CategorySelectModal). */
export const getServiceItems = ({
  isActive,
  subCategoryId,
  zoneId,
  genderId,
  suiteId,
}: ServiceItemsQuery): Promise<ApiResponse<ServiceItem[]>> =>
  apiClient.get<ApiResponse<ServiceItem[]>>("/catalog/service-items", {
    params: { isActive, subCategoryId, genderId, suiteId },
    headers: { "x-zone-id": zoneId },
  });
