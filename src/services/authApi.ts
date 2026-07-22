import {
  authClient,
  CreateUserBody,
  CreateUserResponse,
  OtpRequestBody,
  OtpRequestResponse,
  OtpVerifyBody,
  OtpVerifyResponse,
} from "../lib/api/authClient";

export const authApi = {
  requestOtp(body: OtpRequestBody) {
    return authClient.post<OtpRequestBody, OtpRequestResponse>(
      "/auth/otp/request",
      body,
    );
  },

  verifyOtp(body: OtpVerifyBody) {
    return authClient.post<OtpVerifyBody, OtpVerifyResponse>(
      "/auth/otp/verify",
      body,
    );
  },

  createUser(body: CreateUserBody, signupToken: string) {
    return authClient.post<CreateUserBody, CreateUserResponse>("/users", body, {
      accessToken: signupToken,
    });
  },
};
