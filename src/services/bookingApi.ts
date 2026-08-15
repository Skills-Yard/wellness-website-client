import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";
import type {
  Booking,
  BookingReview,
  CancelBookingBody,
  RaiseDisputeBody,
  RescheduleBookingBody,
  SubmitReviewBody,
  UpdateReviewBody,
} from "@/src/types/booking";

export type BookingListResponse = ApiSuccess<Booking[]>;
export type BookingResponse = ApiSuccess<Booking>;
export type ReviewResponse = ApiSuccess<BookingReview>;

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
    // zoneId must travel as the `x-zone-id` header, not a query param — the
    // backend's slot-discovery endpoint resolves the zone exclusively via
    // that header (see GetZoneId decorator), same convention as
    // serviceItemApi/homeApi/paymentApi/campaignApi. Sending it as a query
    // param instead used to mean it was silently ignored, so discovery ran
    // against whatever zone the backend fell back to on its own — which
    // could differ from the zone slot reservation later checks capacity
    // against, producing "available" slots that failed to book.
    const { zoneId, ...params } = query;
    return apiClient.get<AvailableSlotsResponse>("/bookings/slots/available", {
      accessToken,
      params,
      headers: { "x-zone-id": zoneId },
    });
  },

  findAll(accessToken: string) {
    return apiClient.get<BookingListResponse>("/bookings", { accessToken });
  },

  findOne(id: string, accessToken: string) {
    return apiClient.get<BookingResponse>(`/bookings/${id}`, { accessToken });
  },

  cancel(id: string, body: CancelBookingBody, accessToken: string) {
    return apiClient.post<CancelBookingBody, BookingResponse>(
      `/bookings/${id}/cancel`,
      body,
      { accessToken },
    );
  },

  dispute(id: string, body: RaiseDisputeBody, accessToken: string) {
    return apiClient.post<RaiseDisputeBody, BookingResponse>(
      `/bookings/${id}/dispute`,
      body,
      { accessToken },
    );
  },

  reschedule(id: string, body: RescheduleBookingBody, accessToken: string) {
    return apiClient.post<RescheduleBookingBody, BookingResponse>(
      `/bookings/${id}/reschedule`,
      body,
      { accessToken },
    );
  },

  submitReview(id: string, body: SubmitReviewBody, accessToken: string) {
    return apiClient.post<SubmitReviewBody, ReviewResponse>(
      `/bookings/${id}/review`,
      body,
      { accessToken },
    );
  },

  updateReview(id: string, body: UpdateReviewBody, accessToken: string) {
    return apiClient.patch<UpdateReviewBody, ReviewResponse>(
      `/bookings/${id}/review`,
      body,
      { accessToken },
    );
  },
};
