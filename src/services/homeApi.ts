import { apiClient } from "../lib/api/apiClient";
import { ApiResponse, HomeDetails } from "../types/serviceTypes";

export const getHomeDetails = (
  zoneId: string,
): Promise<ApiResponse<HomeDetails>> => {
  return apiClient.get<ApiResponse<HomeDetails>>("/catalog/home", {
    headers: { "x-zone-id": zoneId },
  });
};
