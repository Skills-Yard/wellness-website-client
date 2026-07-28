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

export type RefreshTokenBody = {
  refreshToken: string;
};

export type RefreshTokenResponse = ApiSuccess<{
  accessToken: string;
  refreshToken?: string;
}>;

export type LogoutResponse = ApiSuccess<Record<string, never>>;
