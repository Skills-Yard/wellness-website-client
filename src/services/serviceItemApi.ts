import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import { ServiceItem, ServiceItemsQuery } from "@/src/types/serviceItemTypes";

/** Fetches active services for one sub-category in the selected zone. */
export const getServiceItems = ({
  isActive,
  subCategoryId,
  zoneId,
}: ServiceItemsQuery): Promise<ApiResponse<ServiceItem[]>> =>
  apiClient.get<ApiResponse<ServiceItem[]>>("/catalog/service-items", {
    params: { isActive, subCategoryId },
    headers: { "x-zone-id": zoneId },
  });
