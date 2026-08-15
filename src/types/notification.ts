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
