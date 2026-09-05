"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStatus } from "./useAuthStatus";
import {
  connectClientSocket,
  disconnectClientSocket,
  onClientSocketEvent,
} from "@/src/lib/socket/clientSocket";
import { queryKeys } from "./queries/queryKeys";

/** Mounted once near the app root (see ClientRealtimeBootstrap). Connects
 *  while logged in — useAuthStatus is already the reactive "am I logged
 *  in" signal every logout call site updates (via notifyAuthChanged), so
 *  this connects and disconnects itself without needing its own hook into
 *  each of those call sites.
 *
 *  booking:status-changed invalidates both the single-booking query (what
 *  useBooking's old 8s poll existed to refresh) and the list, so a
 *  bookings screen left open also reflects the change without a manual
 *  reload. */
export function useClientRealtimeConnection() {
  const { isLoggedIn } = useAuthStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) return;

    connectClientSocket();

    const unsubscribe = onClientSocketEvent("booking:status-changed", (...args) => {
      const payload = args[0] as { bookingId?: string } | undefined;
      if (payload?.bookingId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.booking(payload.bookingId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
    });

    return () => {
      unsubscribe();
      disconnectClientSocket();
    };
  }, [isLoggedIn, queryClient]);
}
