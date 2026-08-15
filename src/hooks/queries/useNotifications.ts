"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/src/services/notificationApi";
import { queryKeys } from "./queryKeys";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

/** Recent notifications for the logged-in user. Disabled entirely for a
 *  logged-out visitor, matching useAddresses(). */
export function useNotifications(take = 20) {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: () =>
      notificationApi.list(accessToken as string, { take }).then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 30 * 1000,
  });
}

/** Drives the bell's unread highlight. Polls on a slow interval so the badge
 *  eventually reflects a push received in another tab without the user
 *  having to do anything — the fast path is still the real-time foreground
 *  push handler updating the cache directly. */
export function useUnreadNotificationCount() {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.unreadNotificationCount(),
    queryFn: () => notificationApi.unreadCount(accessToken as string).then((r) => r.data.count),
    enabled: !!accessToken,
    staleTime: 20 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return notificationApi.markRead(id, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationCount() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return notificationApi.markAllRead(accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationCount() });
    },
  });
}
