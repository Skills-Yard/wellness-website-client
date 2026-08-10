import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";

export type CheckoutBody = {
  gateway: "razorpay";
  idempotencyKey: string;
};

export type CheckoutResponse = ApiSuccess<{
  gatewayOrderId?: string;
  orderId?: string;
  keyId?: string;
  key?: string;
  amount?: number;
  currency?: string;
}>;

export type VerifyPaymentBody = {
  gateway: "razorpay";
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  outcome: "success" | "failure";
};

export type VerifyPaymentResponse = ApiSuccess<Record<string, unknown>>;

export const paymentApi = {
  checkout(body: CheckoutBody, accessToken: string, zoneId: string) {
    return apiClient.post<CheckoutBody, CheckoutResponse>("/payment/checkout", body, {
      accessToken,
      headers: { "x-zone-id": zoneId },
    });
  },
  verify(body: VerifyPaymentBody, accessToken: string) {
    return apiClient.post<VerifyPaymentBody, VerifyPaymentResponse>(
      "/payment/verify",
      body,
      { accessToken },
    );
  },
};
