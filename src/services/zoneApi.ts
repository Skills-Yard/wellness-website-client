import { apiClient } from "../lib/api/apiClient";
import { ZonesQuery, Zone } from "../types/serviceTypes";

export const getZones = ({ lat, long }: ZonesQuery): Promise<Zone[]> => {
  return apiClient.get<Zone[]>("/zones", {
    params: {
      latitude: 28.6109538,
      longitude: 77.2059958,
    },
  });
};
