"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/src/services/authApi";
import { DEVICE_TOKEN_STORAGE_KEY } from "@/src/lib/notifications/push";
import type { DeviceKind } from "@/src/types/auth";
import { queryKeys } from "./queryKeys";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const getCurrentFcmToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY)
    : null;

/** Every device currently logged in as this user, plus any standalone push
 *  registration — a merged "what's logged in as me" view, see backend
 *  DeviceSessionService. Disabled entirely for a logged-out visitor,
 *  matching useAddresses()/useNotifications(). */
export function useDevices() {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.devices(),
    queryFn: () =>
      authApi
        .listDevices(accessToken as string, getCurrentFcmToken() ?? undefined)
        .then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 30 * 1000,
  });
}

/** Ends one device's access — same effect as logging out that one device.
 *  Revoking the entry flagged `isCurrent` ends this session too; callers
 *  should treat that case like a local logout (see Profile's handleLogout). */
export function useRevokeDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kind, id }: { kind: DeviceKind; id: string }) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return authApi.revokeDevice(kind, id, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices() });
    },
  });
}
