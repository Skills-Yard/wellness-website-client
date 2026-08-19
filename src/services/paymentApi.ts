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
  // Optional on a failure report — there's no payment/signature to send when
  // the user never completed a charge attempt (e.g. they just closed the
  // Razorpay modal). Required by the backend only when outcome is "success"
  // (see PaymentService.verifyPayment).
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  // Must match VerifyPaymentDto's class-validator @IsIn(['success', 'failed'])
  // exactly — "failure" 400s.
  outcome: "success" | "failed";
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
