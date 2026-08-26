import { apiClient } from "@/src/lib/api/apiClient";
import type {
  AcknowledgeDeliveryResponse,
  MarkAllReadResponse,
  MarkReadResponse,
  NotificationListResponse,
  RegisterDeviceTokenBody,
  RegisterDeviceTokenResponse,
  UnreadCountResponse,
  UnregisterDeviceTokenResponse,
} from "@/src/types/notification";

export const notificationApi = {
  list(accessToken: string, params?: { isRead?: boolean; take?: number; skip?: number }) {
    return apiClient.get<NotificationListResponse>("/notifications", {
      accessToken,
      params,
    });
  },

  unreadCount(accessToken: string) {
    return apiClient.get<UnreadCountResponse>("/notifications/unread-count", {
      accessToken,
    });
  },

  markRead(id: string, accessToken: string) {
    return apiClient.patch<Record<string, never>, MarkReadResponse>(
      `/notifications/${id}/read`,
      {},
      { accessToken },
    );
  },

  markAllRead(accessToken: string) {
    return apiClient.patch<Record<string, never>, MarkAllReadResponse>(
      "/notifications/read-all",
      {},
      { accessToken },
    );
  },

  /**
   * Confirms this device actually received the push — distinct from marking it
   * read, which is about the user's attention rather than delivery. The backend
   * treats silence as a missed push and escalates to another channel, so this
   * is what stands that ladder down. Prefer acknowledgeDelivery() in
   * lib/notifications/deliveryAck.ts, which dedupes and never throws.
   */
  acknowledgeDelivery(id: string, accessToken: string) {
    return apiClient.post<Record<string, never>, AcknowledgeDeliveryResponse>(
      `/notifications/${id}/delivered`,
      {},
      { accessToken },
    );
  },

  registerDeviceToken(body: RegisterDeviceTokenBody, accessToken: string) {
    return apiClient.post<RegisterDeviceTokenBody, RegisterDeviceTokenResponse>(
      "/notifications/device-token",
      body,
      { accessToken },
    );
  },

  unregisterDeviceToken(fcmToken: string, accessToken: string) {
    return apiClient.delete<UnregisterDeviceTokenResponse>("/notifications/device-token", {
      accessToken,
      data: { fcmToken },
    });
  },
};
