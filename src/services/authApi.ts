import { authClient } from "../lib/api/authClient";
import { OtpRequestBody, OtpRequestResponse, OtpVerifyBody, OtpVerifyResponse, CreateUserBody, CreateUserResponse } from "../types/auth";

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
