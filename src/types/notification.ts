import type { ApiSuccess } from "./auth";

export type NotificationItem = {
  id: string;
  recipientRole: "CLIENT" | "PARTNER" | "ADMIN";
  recipientId: string;
  title: string;
  body: string;
  type: string;
  channel: "PUSH" | "SMS" | "WHATSAPP" | "EMAIL" | "IN_APP";
  deeplink?: string | null;
  imageKey?: string | null;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  isSent: boolean;
  sentAt?: string | null;
  createdAt: string;
};

export type NotificationListResponse = ApiSuccess<NotificationItem[]>;
export type UnreadCountResponse = ApiSuccess<{ count: number }>;
export type MarkReadResponse = ApiSuccess<{ success: boolean }>;
export type MarkAllReadResponse = ApiSuccess<{ updated: number }>;

export type RegisterDeviceTokenBody = {
  fcmToken: string;
  deviceType: "WEB" | "ANDROID" | "IOS";
  deviceName?: string;
  deviceModel?: string;
};

export type RegisterDeviceTokenResponse = ApiSuccess<{ id: string }>;
export type UnregisterDeviceTokenResponse = ApiSuccess<{ success: boolean }>;

/** GET/PATCH /users/notification-preference. Email is intentionally not
 *  exposed in the Settings UI — the backend has no real email delivery
 *  channel configured, even though the field exists on this row. */
export type NotificationPreference = {
  id?: string;
  userId?: string;
  whatsappOptIn: boolean;
  emailOptIn: boolean;
  pushOptIn: boolean;
  promotionalOptIn: boolean;
};

export type NotificationPreferenceResponse = ApiSuccess<NotificationPreference>;
