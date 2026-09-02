import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";
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

  /** Presigned upload URL for the client's own profile photo — same
   *  contract as the partner app's `POST /partner/kyc/upload-url`
   *  ({ fileName, contentType } → { uploadUrl, r2Key }). */
  getProfilePhotoUploadUrl(fileName: string, contentType: string, accessToken: string) {
    return apiClient.post<
      { fileName: string; contentType: string },
      ApiSuccess<{ uploadUrl: string; r2Key: string }>
    >("/users/me/profile-photo/upload-url", { fileName, contentType }, { accessToken });
  },

  /**
   * Upload a file via the presign → PUT flow, exactly as the partner app
   * does it (see partner `src/lib/api/upload.ts` `uploadViaPresign`):
   *   1. POST .../upload-url → { uploadUrl, r2Key }
   *   2. PUT the raw bytes straight to `uploadUrl` (no backend bandwidth)
   * Returns the raw `r2Key`; the caller builds `${CDN_DOMAIN}/${r2Key}`.
   */
  async uploadProfilePhoto(file: File, accessToken: string): Promise<string> {
    const contentType = file.type || "application/octet-stream";
    const { data } = await this.getProfilePhotoUploadUrl(file.name, contentType, accessToken);

    const putRes = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!putRes.ok) {
      throw new Error("File upload to storage failed. Please try again.");
    }
    return data.r2Key;
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
