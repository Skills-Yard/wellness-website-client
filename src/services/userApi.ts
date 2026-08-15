import { apiClient } from "@/src/lib/api/apiClient";
import type {
  CreateUserBody,
  CreateUserResponse,
  GetMeResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@/src/types/auth";
import type {
  NotificationPreference,
  NotificationPreferenceResponse,
} from "@/src/types/notification";

export const userApi = {
  create(body: CreateUserBody, signupToken: string) {
    return apiClient.post<CreateUserBody, CreateUserResponse>("/users", body, {
      accessToken: signupToken,
    });
  },

  getMe(accessToken: string) {
    return apiClient.get<GetMeResponse>("/users/me", { accessToken });
  },

  updateProfile(body: UpdateProfileBody, accessToken: string) {
    return apiClient.patch<UpdateProfileBody, UpdateProfileResponse>(
      "/users/me",
      body,
      { accessToken },
    );
  },

  getNotificationPreference(accessToken: string) {
    return apiClient.get<NotificationPreferenceResponse>(
      "/users/notification-preference",
      { accessToken },
    );
  },

  updateNotificationPreference(
    body: Partial<NotificationPreference>,
    accessToken: string,
  ) {
    return apiClient.patch<
      Partial<NotificationPreference>,
      NotificationPreferenceResponse
    >("/users/notification-preference", body, { accessToken });
  },
};
