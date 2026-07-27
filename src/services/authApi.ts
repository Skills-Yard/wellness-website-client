import { apiClient } from "../lib/api/apiClient";
import {
  CreateUserBody,
  CreateUserResponse,
  OtpRequestBody,
  OtpRequestResponse,
  OtpVerifyBody,
  OtpVerifyResponse,
} from "../types/auth";

export const authApi = {
  requestOtp(body: OtpRequestBody) {
    return apiClient.post<OtpRequestBody, OtpRequestResponse>(
      "/auth/otp/request",
      body,
    );
  },

  verifyOtp(body: OtpVerifyBody) {
    return apiClient.post<OtpVerifyBody, OtpVerifyResponse>(
      "/auth/otp/verify",
      body,
    );
  },

  createUser(body: CreateUserBody, signupToken: string) {
    return apiClient.post<CreateUserBody, CreateUserResponse>("/users", body, {
      accessToken: signupToken,
    });
  },
};
