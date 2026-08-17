import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import { ServiceSuite } from "@/src/types/categoryTypes";

/**
 * Fetches the suites available for one category in one zone — the second
 * step of the category-select flow. An empty list means this category has
 * no suite step in this zone (see backend's ZoneSuiteConfig doc comment);
 * the caller should skip straight to the category's detail page instead.
 */
export const getServiceSuitesByCategoryId = (
  categoryId: string,
  zoneId: string,
): Promise<ApiResponse<ServiceSuite[]>> =>
  apiClient.get<ApiResponse<ServiceSuite[]>>("/catalog/service-suites", {
    params: { categoryId },
    headers: { "x-zone-id": zoneId },
  });
