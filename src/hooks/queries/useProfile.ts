"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/src/services/userApi";
import type { UpdateProfileBody } from "@/src/types/auth";
import type { NotificationPreference } from "@/src/types/notification";
import { queryKeys } from "./queryKeys";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

/** The logged-in client's own profile. Disabled entirely for a logged-out
 *  visitor, matching useAddresses()/useNotifications(). */
export function useMe() {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: () => userApi.getMe(accessToken as string).then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return userApi.updateProfile(body, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}

export function useNotificationPreference() {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.notificationPreference(),
    queryFn: () =>
      userApi.getNotificationPreference(accessToken as string).then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 60 * 1000,
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<NotificationPreference>) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return userApi.updateNotificationPreference(body, accessToken);
    },
    // Optimistic: the toggle should feel instant, not wait on a round trip.
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notificationPreference() });
      const previous = queryClient.getQueryData<NotificationPreference>(
        queryKeys.notificationPreference(),
      );
      if (previous) {
        queryClient.setQueryData(queryKeys.notificationPreference(), {
          ...previous,
          ...body,
        });
      }
      return { previous };
    },
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notificationPreference(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationPreference() });
      // The profile dashboard reads preferences off /users/me too.
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}
