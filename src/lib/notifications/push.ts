import { getExistingPushToken, requestPushPermissionAndToken } from "@/src/lib/firebase/messaging";
import { notificationApi } from "@/src/services/notificationApi";

const DEVICE_TOKEN_STORAGE_KEY = "fcmDeviceToken";

async function persistToken(token: string, accessToken: string) {
  try {
    await notificationApi.registerDeviceToken(
      { fcmToken: token, deviceType: "WEB", deviceName: navigator.userAgent },
      accessToken,
    );
    localStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error("Failed to register FCM device token:", error);
  }
}

/** Best-effort, silent: re-registers a token only if the browser already
 *  granted permission on an earlier visit (no prompt) and the token has
 *  actually changed since the last successful registration. Safe to call
 *  unconditionally on every page load while logged in. */
export async function syncPushTokenSilently(accessToken: string) {
  const token = await getExistingPushToken();
  if (token && token !== localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY)) {
    await persistToken(token, accessToken);
  }
}

/** Prompts for notification permission (if not already decided) and
 *  registers the resulting token. Fire from a user-initiated moment — right
 *  after login, or a "Notify me" control — never on cold page load, since
 *  browsers may auto-dismiss a prompt with no gesture behind it. Resolves
 *  true only once the token round-trips to the backend successfully. */
export async function requestPushNotifications(accessToken: string): Promise<boolean> {
  const token = await requestPushPermissionAndToken();
  if (!token) return false;

  await persistToken(token, accessToken);
  return localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY) === token;
}

/** Deactivates this device's token server-side and forgets it locally — call
 *  on logout so a signed-out browser stops receiving this user's pushes. */
export async function unregisterPushToken(accessToken: string) {
  const token = localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);
  if (!token) return;

  try {
    await notificationApi.unregisterDeviceToken(token, accessToken);
  } catch (error) {
    console.error("Failed to unregister FCM device token:", error);
  } finally {
    localStorage.removeItem(DEVICE_TOKEN_STORAGE_KEY);
  }
}
