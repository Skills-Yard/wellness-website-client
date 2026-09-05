"use client";

import { useClientRealtimeConnection } from "@/src/hooks/useClientRealtimeConnection";

/** Mounted once near the app root, alongside PushNotificationBootstrap —
 *  renders nothing, just keeps the realtime socket connection alive. See
 *  useClientRealtimeConnection. */
export default function ClientRealtimeBootstrap() {
  useClientRealtimeConnection();
  return null;
}
