import { apiClient } from "../lib/api/apiClient";
import { ApiResponse, ZoneDetails, ZonesQuery } from "../types/serviceTypes";

export const getZones = ({
  lat,
  long,
}: ZonesQuery): Promise<ApiResponse<ZoneDetails>> => {
  return apiClient.get<ApiResponse<ZoneDetails>>("/zones", {
    params: {
      latitude: 28.6311026,
      longitude: 77.2183546,
    },
  });
};
