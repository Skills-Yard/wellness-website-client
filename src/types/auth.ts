import type { PaginationMeta } from "./serviceTypes";

export type ApiSuccess<TData> = {
  success: true;
  data: TData;
  pagination?: PaginationMeta;
};

export type OtpRequestBody = {
  countryCode: string;
  phone: string;
};

export type OtpRequestResponse = ApiSuccess<{
  requestId?: string;
}>;

export type OtpVerifyBody = OtpRequestBody & {
  code: string;
  clientId: string;
  fcmToken: string;
  deviceType: "WEB";
  deviceName: string;
};

export type OtpVerifyResponse = ApiSuccess<{
  message?: string;
  /** Returned for a new phone number; use only to create the user profile. */
  signupToken?: string;
  /** Returned for an existing user and completes login immediately. */
  accessToken?: string;
  refreshToken?: string;
}>;

export type CreateUserBody = {
  countryCode: string;
  name: string;
  email: string;
  profilePhotoKey: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  referredBy?: string;
};

export type CreateUserResponse = ApiSuccess<{
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}>;

/** GET /users/me — the logged-in client's own profile. */
export type UserProfile = {
  id: string;
  countryCode: string;
  /** Decrypted server-side for this exact endpoint only (a client viewing
   *  their own record) — see UserService.applyFieldVisibility. */
  phone?: string;
  name?: string | null;
  email?: string | null;
  profilePhotoKey?: string | null;
  dateOfBirth?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  referralCode?: string;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
};

export type GetMeResponse = ApiSuccess<UserProfile>;

/** Body for PATCH /users/me — a client editing their own profile. */
export type UpdateProfileBody = {
  name?: string;
  email?: string;
  profilePhotoKey?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
};

export type UpdateProfileResponse = ApiSuccess<UserProfile>;

export type RefreshTokenBody = {
  refreshToken: string;
};

export type RefreshTokenResponse = ApiSuccess<{
  accessToken: string;
  refreshToken?: string;
}>;

export type LogoutResponse = ApiSuccess<Record<string, never>>;

/** GET /auth/devices — a merged view of live login sessions and registered
 *  push tokens ("devices"), see backend DeviceSessionService. A SESSION item
 *  is an actual logged-in session; a TOKEN item is a push registration with
 *  no (or no longer any) live session behind it. */
export type DeviceKind = "SESSION" | "TOKEN";

export type DeviceItem = {
  id: string;
  kind: DeviceKind;
  deviceType: "WEB" | "ANDROID" | "IOS" | null;
  deviceName: string | null;
  deviceModel: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  lastUsedAt: string;
  /** True only when this device's own current FCM token was sent along with
   *  the request and matches this entry — otherwise always false, e.g. no
   *  push permission ever granted on this browser. */
  isCurrent: boolean;
};

export type ListDevicesResponse = ApiSuccess<DeviceItem[]>;
export type RevokeDeviceResponse = ApiSuccess<{ success: boolean }>;
