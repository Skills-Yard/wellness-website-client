export type ApiSuccess<TData> = {
  success: true;
  data: TData;
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
