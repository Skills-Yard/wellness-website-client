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
  signupToken: string;
}>;

export type CreateUserBody = {
  countryCode: string;
  name: string;
  email: string;
  profilePhotoKey: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
};

export type CreateUserResponse = ApiSuccess<{
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}>;