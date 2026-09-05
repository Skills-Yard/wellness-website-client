"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@/src/services/bookingApi";
import type {
  CancelBookingBody,
  RaiseDisputeBody,
  RescheduleBookingBody,
  SubmitReviewBody,
  UpdateReviewBody,
} from "@/src/types/booking";
import { queryKeys } from "./queryKeys";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

/** All bookings for the logged-in user. Disabled entirely for a logged-out
 *  visitor, matching useAddresses()/useNotifications(). */
export function useBookings() {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.bookings(),
    queryFn: () => bookingApi.findAll(accessToken as string).then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 30 * 1000,
  });
}

/** A single booking. No polling: booking:status-changed (see
 *  useClientRealtimeConnection) invalidates this query the instant the
 *  assigned partner accepts/en-routes/arrives/starts/completes it, or the
 *  dispatch search gives up — every transition that used to justify an 8s
 *  live-tracking poll here. */
export function useBooking(id: string | undefined) {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.booking(id ?? ""),
    queryFn: () => bookingApi.findOne(id as string, accessToken as string).then((r) => r.data),
    enabled: !!accessToken && !!id,
    staleTime: 15 * 1000,
  });
}

function useBookingMutation<TBody>(
  mutationFn: (id: string, body: TBody, accessToken: string) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: TBody }) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return mutationFn(id, body, accessToken);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
    },
  });
}

export function useCancelBooking() {
  return useBookingMutation<CancelBookingBody>((id, body, accessToken) =>
    bookingApi.cancel(id, body, accessToken),
  );
}

export function useRaiseDispute() {
  return useBookingMutation<RaiseDisputeBody>((id, body, accessToken) =>
    bookingApi.dispute(id, body, accessToken),
  );
}

export function useRescheduleBooking() {
  return useBookingMutation<RescheduleBookingBody>((id, body, accessToken) =>
    bookingApi.reschedule(id, body, accessToken),
  );
}

export function useSubmitReview() {
  return useBookingMutation<SubmitReviewBody>((id, body, accessToken) =>
    bookingApi.submitReview(id, body, accessToken),
  );
}

export function useUpdateReview() {
  return useBookingMutation<UpdateReviewBody>((id, body, accessToken) =>
    bookingApi.updateReview(id, body, accessToken),
  );
}
