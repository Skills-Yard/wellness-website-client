"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onForegroundPushMessage } from "@/src/lib/firebase/messaging";
import { syncPushTokenSilently } from "@/src/lib/notifications/push";
import { queryKeys } from "./queries/queryKeys";

/** Mounted once (see PushNotificationBootstrap) for the whole app:
 *  1. On load, silently re-registers the FCM token if permission was
 *     already granted on an earlier visit — no prompt, covers token
 *     rotation for a returning logged-in user.
 *  2. Wires a push that arrives while the tab is focused (the service
 *     worker never sees these) to refresh the bell's list/badge live. */
export function usePushRegistration() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) void syncPushTokenSilently(accessToken);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    onForegroundPushMessage(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationCount() });
    }).then((unsub) => {
      if (cancelled) unsub();
      else unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [queryClient]);
}
