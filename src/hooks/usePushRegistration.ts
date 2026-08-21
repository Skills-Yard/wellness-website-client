"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onForegroundPushMessage } from "@/src/lib/firebase/messaging";
import { syncPushTokenSilently } from "@/src/lib/notifications/push";
import { queryKeys } from "./queries/queryKeys";

const TOAST_LIFETIME_MS = 6000;

export type ForegroundPushToast = {
  id: string;
  title: string;
  body: string;
  deeplink?: string;
};

/** Mounted once (see PushNotificationBootstrap) for the whole app:
 *  1. On load, silently re-registers the FCM token if permission was
 *     already granted on an earlier visit — no prompt, covers token
 *     rotation for a returning logged-in user.
 *  2. Wires a push that arrives while the tab is focused (the service
 *     worker never sees these) to refresh the bell's list/badge live, and
 *     queues it as a dismissible in-app toast. The OS notification raised
 *     alongside it (see messaging.ts) is at the mercy of things this app
 *     can't control — Do Not Disturb, Focus Assist, a browser muting
 *     toasts from its own focused tab — so the in-app toast is the one
 *     signal guaranteed visible while the tab is open. */
export function usePushRegistration() {
  const queryClient = useQueryClient();
  const [toasts, setToasts] = useState<ForegroundPushToast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) void syncPushTokenSilently(accessToken);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    onForegroundPushMessage((title, body, deeplink) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationCount() });

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((current) => [...current, { id, title, body, deeplink }]);
      timers.current.set(
        id,
        setTimeout(() => dismissToast(id), TOAST_LIFETIME_MS),
      );
    }).then((unsub) => {
      if (cancelled) unsub();
      else unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [queryClient, dismissToast]);

  // Belt-and-braces: clears any still-pending auto-dismiss timers on unmount
  // (e.g. route change that tears down the bootstrap) so they don't fire
  // setState against an unmounted component.
  useEffect(() => {
    const timersAtMount = timers.current;
    return () => {
      timersAtMount.forEach(clearTimeout);
      timersAtMount.clear();
    };
  }, []);

  return { toasts, dismissToast };
}
