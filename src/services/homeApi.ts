import { apiClient } from "../lib/api/apiClient";
import { Zone } from "../types/serviceTypes";

export const getHomeDetails = (zoneId: Zone): Promise<Zone[]> => {
  try {
    const response = apiClient.get<Zone[]>("/catalog/catalog/home", {
      headers: {
        "x-zone-id": zoneId,
      },
    });

    return response;
    
  } catch (error) {
    throw error;
  }
};
