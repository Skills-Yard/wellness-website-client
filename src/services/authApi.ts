import { authClient } from "../lib/api/authClient";
import {
  OtpRequestBody,
  OtpRequestResponse,
  OtpVerifyBody,
  OtpVerifyResponse,
  RefreshTokenBody,
  RefreshTokenResponse,
  LogoutResponse,
} from "../types/auth";

export const authApi = {
  requestOtp(body: OtpRequestBody) {
    return authClient.post<OtpRequestBody, OtpRequestResponse>(
      "/otp/request",
      body,
    );
  },

  verifyOtp(body: OtpVerifyBody) {
    return authClient.post<OtpVerifyBody, OtpVerifyResponse>(
      "/otp/verify",
      body,
    );
  },

  refresh(body: RefreshTokenBody) {
    return authClient.post<RefreshTokenBody, RefreshTokenResponse>(
      "/refresh",
      body,
    );
  },

  logout(accessToken: string) {
    return authClient.post<Record<string, never>, LogoutResponse>("/logout", {}, {
      accessToken,
    });
  },

  logoutAll(accessToken: string) {
    return authClient.post<Record<string, never>, LogoutResponse>(
      "/logout-all",
      {},
      { accessToken },
    );
  },
};
