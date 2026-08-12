import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";

export type AvailableSlot = {
  startTime: string;
  endTime: string;
  totalDbCapacity: number;
  heldSlots: number;
  netAvailable: number;
};

export type AvailableSlotsQuery = {
  serviceItemId: string;
  durationId: string;
  zoneId: string;
  /** YYYY-MM-DD */
  date: string;
};

export type AvailableSlotsResponse = ApiSuccess<AvailableSlot[]>;

export const bookingApi = {
  getAvailableSlots(query: AvailableSlotsQuery, accessToken: string) {
    return apiClient.get<AvailableSlotsResponse>("/bookings/slots/available", {
      accessToken,
      params: query,
    });
  },
};
