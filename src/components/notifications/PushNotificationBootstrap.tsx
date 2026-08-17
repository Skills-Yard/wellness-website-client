"use client";

import { usePushRegistration } from "@/src/hooks/usePushRegistration";

/** No UI — mounted once near the app root purely to run usePushRegistration's
 *  effects (silent token resync + live foreground-push handling). */
export default function PushNotificationBootstrap() {
  usePushRegistration();
  return null;
}
