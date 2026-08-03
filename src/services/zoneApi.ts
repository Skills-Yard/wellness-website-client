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

// Zone Id 1 : cms06zru80003b8tsuamdc69w
// Zone Id 2 : cmsd4slko0000u8tsz4g401mf
