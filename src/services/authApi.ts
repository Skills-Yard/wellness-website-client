import { authClient } from "../lib/api/authClient";
import {
  OtpRequestBody,
  OtpRequestResponse,
  OtpVerifyBody,
  OtpVerifyResponse,
  RefreshTokenBody,
  RefreshTokenResponse,
  LogoutResponse,
  DeviceKind,
  ListDevicesResponse,
  RevokeDeviceResponse,
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

  listDevices(accessToken: string, currentFcmToken?: string) {
    return authClient.get<ListDevicesResponse>("/devices", {
      accessToken,
      params: currentFcmToken ? { fcmToken: currentFcmToken } : undefined,
    });
  },

  revokeDevice(kind: DeviceKind, id: string, accessToken: string) {
    return authClient.delete<RevokeDeviceResponse>(`/devices/${kind}/${id}`, {
      accessToken,
    });
  },
};
