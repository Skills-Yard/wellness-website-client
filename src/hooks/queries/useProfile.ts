"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/src/services/userApi";
import type { UpdateProfileBody, UserProfile } from "@/src/types/auth";
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
    // The profile dashboard's switches read preferences off /users/me, not
    // the standalone notification-preference query, so both caches need the
    // same optimistic patch (and the same rollback if the request fails).
    onMutate: async (body) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.notificationPreference() }),
        queryClient.cancelQueries({ queryKey: queryKeys.me() }),
      ]);

      const previousPreference = queryClient.getQueryData<NotificationPreference>(
        queryKeys.notificationPreference(),
      );
      if (previousPreference) {
        queryClient.setQueryData(queryKeys.notificationPreference(), {
          ...previousPreference,
          ...body,
        });
      }

      const previousMe = queryClient.getQueryData<UserProfile>(queryKeys.me());
      if (previousMe?.preferences) {
        queryClient.setQueryData(queryKeys.me(), {
          ...previousMe,
          preferences: { ...previousMe.preferences, ...body },
        });
      }

      return { previousPreference, previousMe };
    },
    onError: (_err, _body, context) => {
      if (context?.previousPreference) {
        queryClient.setQueryData(queryKeys.notificationPreference(), context.previousPreference);
      }
      if (context?.previousMe) {
        queryClient.setQueryData(queryKeys.me(), context.previousMe);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationPreference() });
      // The profile dashboard reads preferences off /users/me too.
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}
