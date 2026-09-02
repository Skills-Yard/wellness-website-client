import type { PaginationMeta } from "./serviceTypes";

export type ApiSuccess<TData> = {
  success: true;
  data: TData;
  pagination?: PaginationMeta;
  /** Aggregate counts alongside a paginated list, independent of the
   *  current page/filter — e.g. `{ upcoming: 3, past: 12 }` for bookings,
   *  or `{ unread: 2, read: 40 }` for notifications — so tabs/badges don't
   *  need a second request. See the backend's `paginateWithCounts()`. */
  counts?: Record<string, number>;
};

export type OtpRequestBody = {
  countryCode: string;
  phone: string;
};

export type OtpRequestResponse = ApiSuccess<{
  requestId?: string;
  /** DEV-ONLY: the backend currently echoes the generated code back in this
   *  response while OTP delivery isn't wired up in non-prod environments.
   *  Remove this field (and its display in AuthModal) once real SMS delivery
   *  is live everywhere. */
  otp?: string;
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

/** An address as it comes back nested inside GET /users/me. Superset of
 *  the standalone `Address` (services/addressApi) — customer contact
 *  fields here are read-only (phone is stored encrypted, so only its
 *  presence, never the value, comes back). */
export type MeAddress = {
  id: string;
  userId: string;
  label?: string | null;
  customLabel?: string | null;
  customerName?: string | null;
  customerCountryCode?: string | null;
  line1?: string | null;
  line2?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  zoneId?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/** A registered device/session nested inside GET /users/me. */
export type MeDevice = {
  id: string;
  deviceType: "WEB" | "ANDROID" | "IOS" | null;
  deviceName: string | null;
  deviceModel: string | null;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
};

export type MePreferences = {
  whatsappOptIn: boolean;
  emailOptIn: boolean;
  pushOptIn: boolean;
  promotionalOptIn: boolean;
};

/** GET /users/me — the logged-in client's own profile, with everything
 *  the profile dashboard needs in one call (addresses, devices,
 *  preferences + account metadata). */
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
  referredBy?: string | null;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  isActive?: boolean;
  userRole?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  addresses?: MeAddress[];
  devices?: MeDevice[];
  preferences?: MePreferences | null;
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
